import { defineStore } from "pinia";
import { reactive } from "vue";
import { useToastStore, playNotification } from "./toast";

const API = import.meta.env.VITE_API_BASE_URL || "/hcm-gis";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: JsonValue): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStringArray(value: JsonValue): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isBbox(value: JsonValue): value is [number, number, number, number] {
  return Array.isArray(value) && value.length === 4 && value.every((v) => typeof v === "number");
}

export interface DistrictInfo {
  key: string;
  name: string;
  tiles: number;
  bbox: [number, number, number, number];
}

interface DistrictsResponse {
  districts: DistrictInfo[];
  urbanKeys: string[];
  allKeys: string[];
}

function isDistrictInfo(value: JsonValue): value is DistrictInfo & JsonObject {
  return (
    isJsonObject(value) &&
    typeof value.key === "string" &&
    typeof value.name === "string" &&
    isNumber(value.tiles) &&
    isBbox(value.bbox)
  );
}

function isDistrictsResponse(value: JsonValue): value is DistrictsResponse & JsonObject {
  return (
    isJsonObject(value) &&
    Array.isArray(value.districts) &&
    value.districts.every(isDistrictInfo) &&
    isStringArray(value.urbanKeys) &&
    isStringArray(value.allKeys)
  );
}

type ProgressMessage = {
  phase: "downloading" | "writing_mbtiles" | "extracting_geojson";
  district: string;
  done: number;
  total: number;
  ok: number;
  fail: number;
};

type DoneDistrictMessage = {
  phase: "done_district";
  district: string;
  id: string;
  tileCount: number;
  sizeMB: string;
  elapsed: string;
};

type DoneMessage = {
  phase: "done";
  message: string;
};

type ErrorMessage = {
  phase: "error";
  message: string;
};

type SseMessage = ProgressMessage | DoneDistrictMessage | DoneMessage | ErrorMessage;

function isSseMessage(value: JsonValue): value is SseMessage {
  if (!isJsonObject(value) || typeof value.phase !== "string") return false;
  if (value.phase === "done") return typeof value.message === "string";
  if (value.phase === "error") return typeof value.message === "string";
  if (value.phase === "done_district") {
    return (
      typeof value.id === "string" &&
      typeof value.district === "string" &&
      isNumber(value.tileCount) &&
      typeof value.sizeMB === "string" &&
      typeof value.elapsed === "string"
    );
  }
  return (
    typeof value.district === "string" &&
    isNumber(value.done) &&
    isNumber(value.total) &&
    isNumber(value.ok) &&
    isNumber(value.fail)
  );
}

export interface CompletedFile {
  id: string;
  district: string;
  tileCount: number;
  sizeMB: string;
  elapsed: string;
}

export const useProcessingStore = defineStore("processing", () => {
  const data = reactive({
    districts: [] as DistrictInfo[],
    urbanKeys: [] as string[],
    allKeys: [] as string[],
    selected: new Set<string>(),
    completedFiles: [] as CompletedFile[],
  });

  const ui = reactive({
    downloading: false,
    preparingDownloads: false,
    downloadsReady: false,
    connectionError: false,
    loading: false,
    lastGeojson: false,
  });

  const progress = reactive({
    label: "",
    text: "",
    pct: 0,
    ok: 0,
    fail: 0,
  });

  const runtime = reactive({
    currentSource: null as EventSource | null,
    currentToken: null as string | null,
    processingToastId: null as number | null,
  });

  type PrepareResponse = { status: "ready" | "building"; cacheKey?: string; size?: number; filename?: string };

  function isPrepareResponse(value: JsonValue): value is PrepareResponse {
    return isJsonObject(value) && (value.status === "ready" || value.status === "building");
  }

  async function prepareBundle(ids: string[]) {
    if (ids.length === 0) {
      ui.downloadsReady = true;
      ui.preparingDownloads = false;
      return;
    }
    ui.preparingDownloads = true;
    ui.downloadsReady = false;
    const toast = useToastStore();
    try {
      for (let attempt = 0; attempt < 20; attempt++) {
        const res = await fetch(`${API}/api/bundle/prepare?ids=${ids.join(",")}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const resp = (await res.json()) as JsonValue;
        if (!isPrepareResponse(resp)) throw new Error("Invalid prepare response");
        if (resp.status === "ready") {
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      throw new Error("Prepare timeout");
    } catch {
      toast.show("Failed to prepare downloads. You can still download directly.", "warning");
    } finally {
      ui.preparingDownloads = false;
      ui.downloadsReady = true;
    }
  }

  async function fetchDistricts() {
    ui.loading = true;
    ui.connectionError = false;
    const minDelay = new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`${API}/api/districts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const resp = (await res.json()) as JsonValue;
      if (!isDistrictsResponse(resp)) throw new Error("Invalid districts response");
      data.districts = resp.districts;
      data.urbanKeys = resp.urbanKeys;
      data.allKeys = resp.allKeys;
    } catch {
      ui.connectionError = true;
      const toast = useToastStore();
      toast.show("Cannot connect to backend server", "error");
    } finally {
      await minDelay;
      ui.loading = false;
    }
  }

  function toggle(key: string) {
    if (data.selected.has(key)) data.selected.delete(key);
    else data.selected.add(key);
  }

  function selectAll(on: boolean) {
    if (on) data.allKeys.forEach((k) => data.selected.add(k));
    else data.selected.clear();
  }

  function selectUrban() {
    data.selected.clear();
    data.urbanKeys.forEach((k) => data.selected.add(k));
  }

  function removeFile(id: string) {
    data.completedFiles = data.completedFiles.filter(f => f.id !== id);
    if (data.completedFiles.length === 0) {
      ui.downloading = false;
      progress.pct = 0;
      progress.label = "";
      progress.text = "";
      ui.lastGeojson = false;
      ui.preparingDownloads = false;
      ui.downloadsReady = false;
    }
  }

  function startDownload(geojson: boolean) {
    const keys = [...data.selected];
    if (keys.length === 0) return;

    const toast = useToastStore();
    ui.lastGeojson = geojson;
    ui.downloading = true;
    ui.preparingDownloads = false;
    ui.downloadsReady = false;
    progress.pct = 0;
    progress.ok = 0;
    progress.fail = 0;
    progress.label = "Starting...";
    progress.text = "";
    data.completedFiles = [];
    // Track per-district progress to compute aggregate %
    const districtProgress = new Map<string, { done: number; total: number; ok: number; fail: number }>();
    runtime.processingToastId = toast.show(`Processing ${keys.length} district(s)...`, "loading", true);

    const token = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    runtime.currentToken = token;
    if (runtime.currentSource) {
      try { runtime.currentSource.close(); } catch { }
      runtime.currentSource = null;
    }

    const evtSource = new EventSource(
      `${API}/api/download?keys=${keys.join(",")}&geojson=${geojson}&token=${token}`
    );
    runtime.currentSource = evtSource;
    evtSource.onmessage = async (e) => {
      let d: SseMessage;
      try {
        const parsed = JSON.parse(e.data) as JsonValue;
        if (!isSseMessage(parsed)) throw new Error("Invalid SSE payload");
        d = parsed;
      } catch {
        try { evtSource.close(); } catch { }
        runtime.currentSource = null;
        runtime.currentToken = null;
        ui.downloading = false;
        progress.label = "Error";
        progress.text = "Invalid server response";
        const toast = useToastStore();
        toast.show("Invalid server response", "error");
        return;
      }
      if (d.phase === "done") {
        try { evtSource.close(); } catch { }
        runtime.currentSource = null;
        runtime.currentToken = null;
        ui.downloading = false;
        progress.pct = 100;
        // Show aggregate stats from completed files
        const totalTiles = data.completedFiles.reduce((s, f) => s + f.tileCount, 0);
        const totalSize = data.completedFiles.reduce((s, f) => s + parseFloat(f.sizeMB), 0).toFixed(1);
        const doneText = `${data.completedFiles.length} district(s) · ${totalTiles} tiles · ${totalSize} MB`;
        progress.label = "Preparing downloads...";
        progress.text = "Building ZIP cache...";
        await prepareBundle(data.completedFiles.map((f) => f.id));
        progress.label = "Complete!";
        progress.text = doneText;
        if (runtime.processingToastId !== null) {
          toast.update(runtime.processingToastId, "All files ready to download", "success");
          runtime.processingToastId = null;
        }
        playNotification();
        return;
      }
      if (d.phase === "done_district") {
        data.completedFiles.push({
          id: d.id, district: d.district,
          tileCount: d.tileCount, sizeMB: d.sizeMB, elapsed: d.elapsed,
        });
        return;
      }
      if (d.phase === "error") {
        try { evtSource.close(); } catch { }
        runtime.currentSource = null;
        runtime.currentToken = null;
        ui.downloading = false;
        progress.label = "Error";
        progress.text = d.message;
        if (runtime.processingToastId !== null) {
          toast.update(runtime.processingToastId, d.message, "error");
          runtime.processingToastId = null;
        }
        playNotification();
        return;
      }
      // Update per-district tracker and compute aggregate
      districtProgress.set(d.district, { done: d.done, total: d.total, ok: d.ok, fail: d.fail });
      let totalDone = 0, totalAll = 0, totalOk = 0, totalFail = 0;
      for (const v of districtProgress.values()) {
        totalDone += v.done;
        totalAll += v.total;
        totalOk += v.ok;
        totalFail += v.fail;
      }
      const pct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;
      // Only allow progress to go forward (never decrease)
      if (pct >= progress.pct) progress.pct = pct;
      const phase =
        d.phase === "downloading"
          ? "Processing"
          : d.phase === "writing_mbtiles"
            ? "Writing MBTiles"
            : d.phase === "extracting_geojson"
              ? "Extracting GeoJSON"
              : d.phase;
      progress.label = phase;
      progress.text = `${totalDone}/${totalAll} tiles`;
      progress.ok = totalOk;
      progress.fail = totalFail;
    };
    evtSource.onerror = () => {
      try { evtSource.close(); } catch { }
      runtime.currentSource = null;
      runtime.currentToken = null;
      ui.downloading = false;
      progress.label = "Connection lost";
      toast.show("Connection lost", "error");
    };
  }

  function startDownloadAll(geojson: boolean) {
    const toast = useToastStore();
    ui.lastGeojson = geojson;
    ui.downloading = true;
    progress.pct = 0;
    progress.ok = 0;
    progress.fail = 0;
    progress.label = "Starting full HCM processing...";
    progress.text = "";
    data.completedFiles = [];
    runtime.processingToastId = toast.show("Processing all HCM tiles...", "loading", true);

    const token = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    runtime.currentToken = token;
    if (runtime.currentSource) {
      try { runtime.currentSource.close(); } catch { }
      runtime.currentSource = null;
    }
    const evtSource = new EventSource(
      `${API}/api/download-all?geojson=${geojson}&token=${token}`
    );
    runtime.currentSource = evtSource;
    evtSource.onmessage = async (e) => {
      let d: SseMessage;
      try {
        const parsed = JSON.parse(e.data) as JsonValue;
        if (!isSseMessage(parsed)) throw new Error("Invalid SSE payload");
        d = parsed;
      } catch {
        try { evtSource.close(); } catch { }
        runtime.currentSource = null;
        runtime.currentToken = null;
        ui.downloading = false;
        progress.label = "Error";
        progress.text = "Invalid server response";
        const toast = useToastStore();
        toast.show("Invalid server response", "error");
        return;
      }
      if (d.phase === "done") {
        try { evtSource.close(); } catch { }
        runtime.currentSource = null;
        runtime.currentToken = null;
        ui.downloading = false;
        progress.pct = 100;
        const totalTiles = data.completedFiles.reduce((s, f) => s + f.tileCount, 0);
        const totalSize = data.completedFiles.reduce((s, f) => s + parseFloat(f.sizeMB), 0).toFixed(1);
        const doneText = `All HCM · ${totalTiles} tiles · ${totalSize} MB`;
        progress.label = "Preparing downloads...";
        progress.text = "Building ZIP cache...";
        await prepareBundle(data.completedFiles.map((f) => f.id));
        progress.label = "Complete!";
        progress.text = doneText;
        if (runtime.processingToastId !== null) {
          toast.update(runtime.processingToastId, "All HCM tiles ready to download", "success");
          runtime.processingToastId = null;
        }
        playNotification();
        return;
      }
      if (d.phase === "done_district") {
        data.completedFiles.push({
          id: d.id, district: d.district,
          tileCount: d.tileCount, sizeMB: d.sizeMB, elapsed: d.elapsed,
        });
        return;
      }
      if (d.phase === "error") {
        try { evtSource.close(); } catch { }
        runtime.currentSource = null;
        runtime.currentToken = null;
        ui.downloading = false;
        progress.label = "Error";
        progress.text = d.message;
        if (runtime.processingToastId !== null) {
          toast.update(runtime.processingToastId, d.message, "error");
          runtime.processingToastId = null;
        }
        playNotification();
        return;
      }
      const pct = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0;
      progress.pct = pct;
      const phase =
        d.phase === "downloading"
          ? "Downloading"
          : d.phase === "writing_mbtiles"
            ? "Writing MBTiles"
            : d.phase === "extracting_geojson"
              ? "Extracting GeoJSON"
              : d.phase;
      progress.label = `${phase} (All HCM)`;
      progress.text = `${d.done}/${d.total} · ok:${d.ok} fail:${d.fail}`;
      progress.ok = d.ok;
      progress.fail = d.fail;
    };
    evtSource.onerror = () => {
      try { evtSource.close(); } catch { }
      runtime.currentSource = null;
      runtime.currentToken = null;
      ui.downloading = false;
      progress.label = "Connection lost";
      toast.show("Connection lost", "error");
    };
  }

  function cancelProcessing() {
    if (runtime.currentSource) {
      try { runtime.currentSource.close(); } catch { }
      runtime.currentSource = null;
    }
    ui.downloading = false;
    progress.label = "Canceled";
    progress.text = "";
    progress.pct = 0;
    progress.ok = 0;
    progress.fail = 0;
    ui.preparingDownloads = false;
    ui.downloadsReady = false;
    // keep completedFiles as-is (user can keep artifacts), but if none, reset geojson flag
    if (data.completedFiles.length === 0) ui.lastGeojson = false;
    // notify backend to stop any worker threads for this token
    if (runtime.currentToken) {
      try {
        fetch(`${API}/api/cancel`, { method: "POST", body: runtime.currentToken });
      } catch { }
      runtime.currentToken = null;
    }
    const toast = useToastStore();
    // dismiss or update the persistent processing toast if present
    if (runtime.processingToastId !== null) {
      try { toast.dismiss(runtime.processingToastId); } catch { }
      runtime.processingToastId = null;
    }
    toast.show("Processing canceled", "warning");
  }

  return {
    data,
    ui,
    progress,
    loading: ui.loading,
    connectionError: ui.connectionError,
    downloading: ui.downloading,
    downloadsReady: ui.downloadsReady,
    preparingDownloads: ui.preparingDownloads,
    selected: data.selected,
    districts: data.districts,
    completedFiles: data.completedFiles,
    progressPct: progress.pct,
    progressLabel: progress.label,
    progressText: progress.text,
    progressOk: progress.ok,
    progressFail: progress.fail,
    lastGeojson: ui.lastGeojson,
    fetchDistricts,
    toggle,
    selectAll,
    selectUrban,
    startDownload,
    startDownloadAll,
    removeFile,
    cancelProcessing,
  };
});
