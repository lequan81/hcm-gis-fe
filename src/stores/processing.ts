import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore, playNotification } from "./toast";

const API = import.meta.env.VITE_API_BASE_URL || "/hcm-gis";

export interface DistrictInfo {
  key: string;
  name: string;
  tiles: number;
  bbox: number[];
}

export interface CompletedFile {
  id: string;
  district: string;
  tileCount: number;
  sizeMB: string;
  elapsed: string;
}

export const useProcessingStore = defineStore("processing", () => {
  const districts = ref<DistrictInfo[]>([]);
  const urbanKeys = ref<string[]>([]);
  const allKeys = ref<string[]>([]);
  const selected = ref<Set<string>>(new Set());
  const downloading = ref(false);
  const progressLabel = ref("");
  const progressText = ref("");
  const progressPct = ref(0);
  const progressOk = ref(0);
  const progressFail = ref(0);
  const completedFiles = ref<CompletedFile[]>([]);
  const connectionError = ref(false);
  const loading = ref(false);
  const currentSource = ref<EventSource | null>(null);
  const currentToken = ref<string | null>(null);
  const lastGeojson = ref(false);
  const processingToastId = ref<number | null>(null);

  async function fetchDistricts() {
    loading.value = true;
    connectionError.value = false;
    const minDelay = new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`${API}/api/districts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      districts.value = data.districts;
      urbanKeys.value = data.urbanKeys;
      allKeys.value = data.allKeys;
    } catch {
      connectionError.value = true;
      const toast = useToastStore();
      toast.show("Cannot connect to backend server", "error");
    } finally {
      await minDelay;
      loading.value = false;
    }
  }

  function toggle(key: string) {
    if (selected.value.has(key)) selected.value.delete(key);
    else selected.value.add(key);
  }

  function selectAll(on: boolean) {
    if (on) allKeys.value.forEach((k) => selected.value.add(k));
    else selected.value.clear();
  }

  function selectUrban() {
    selected.value.clear();
    urbanKeys.value.forEach((k) => selected.value.add(k));
  }

  function removeFile(id: string) {
    completedFiles.value = completedFiles.value.filter(f => f.id !== id);
    if (completedFiles.value.length === 0) {
      downloading.value = false;
      progressPct.value = 0;
      progressLabel.value = "";
      progressText.value = "";
      lastGeojson.value = false;
    }
  }

  function startDownload(geojson: boolean) {
    const keys = [...selected.value];
    if (keys.length === 0) return;

    const toast = useToastStore();
    lastGeojson.value = geojson;
    downloading.value = true;
    progressPct.value = 0;
    progressOk.value = 0;
    progressFail.value = 0;
    progressLabel.value = "Starting...";
    progressText.value = "";
    completedFiles.value = [];
    // Track per-district progress to compute aggregate %
    const districtProgress = new Map<string, { done: number; total: number; ok: number; fail: number }>();
    processingToastId.value = toast.show(`Processing ${keys.length} district(s)...`, "loading", true);

    const token = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    currentToken.value = token;
    if (currentSource.value) {
      try { currentSource.value.close(); } catch { }
      currentSource.value = null;
    }

    const evtSource = new EventSource(
      `${API}/api/download?keys=${keys.join(",")}&geojson=${geojson}&token=${token}`
    );
    currentSource.value = evtSource;
    evtSource.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.phase === "done") {
        try { evtSource.close(); } catch { }
        currentSource.value = null;
        currentToken.value = null;
        downloading.value = false;
        progressPct.value = 100;
        progressLabel.value = "Complete!";
        // Show aggregate stats from completed files
        const totalTiles = completedFiles.value.reduce((s, f) => s + f.tileCount, 0);
        const totalSize = completedFiles.value.reduce((s, f) => s + parseFloat(f.sizeMB), 0).toFixed(1);
        progressText.value = `${completedFiles.value.length} district(s) · ${totalTiles} tiles · ${totalSize} MB`;
        if (processingToastId.value !== null) {
          toast.update(processingToastId.value, "All files ready to download", "success");
          processingToastId.value = null;
        }
        playNotification();
        return;
      }
      if (d.phase === "done_district") {
        completedFiles.value.push({
          id: d.id, district: d.district,
          tileCount: d.tileCount, sizeMB: d.sizeMB, elapsed: d.elapsed,
        });
        return;
      }
      if (d.phase === "error") {
        try { evtSource.close(); } catch { }
        currentSource.value = null;
        currentToken.value = null;
        downloading.value = false;
        progressLabel.value = "Error";
        progressText.value = d.message;
        if (processingToastId.value !== null) {
          toast.update(processingToastId.value, d.message, "error");
          processingToastId.value = null;
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
      if (pct >= progressPct.value) progressPct.value = pct;
      const phase =
        d.phase === "downloading"
          ? "Processing"
          : d.phase === "writing_mbtiles"
            ? "Writing MBTiles"
            : d.phase === "extracting_geojson"
              ? "Extracting GeoJSON"
              : d.phase;
      progressLabel.value = phase;
      progressText.value = `${totalDone}/${totalAll} tiles`;
      progressOk.value = totalOk;
      progressFail.value = totalFail;
    };
    evtSource.onerror = () => {
      try { evtSource.close(); } catch { }
      currentSource.value = null;
      currentToken.value = null;
      downloading.value = false;
      progressLabel.value = "Connection lost";
      toast.show("Connection lost", "error");
    };
  }

  function startDownloadAll(geojson: boolean) {
    const toast = useToastStore();
    lastGeojson.value = geojson;
    downloading.value = true;
    progressPct.value = 0;
    progressOk.value = 0;
    progressFail.value = 0;
    progressLabel.value = "Starting full HCM processing...";
    progressText.value = "";
    completedFiles.value = [];
    processingToastId.value = toast.show("Processing all HCM tiles...", "loading", true);

    const token = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    currentToken.value = token;
    if (currentSource.value) {
      try { currentSource.value.close(); } catch { }
      currentSource.value = null;
    }
    const evtSource = new EventSource(
      `${API}/api/download-all?geojson=${geojson}&token=${token}`
    );
    currentSource.value = evtSource;
    evtSource.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.phase === "done") {
        try { evtSource.close(); } catch { }
        currentSource.value = null;
        currentToken.value = null;
        downloading.value = false;
        progressPct.value = 100;
        progressLabel.value = "Complete!";
        const totalTiles = completedFiles.value.reduce((s, f) => s + f.tileCount, 0);
        const totalSize = completedFiles.value.reduce((s, f) => s + parseFloat(f.sizeMB), 0).toFixed(1);
        progressText.value = `All HCM · ${totalTiles} tiles · ${totalSize} MB`;
        if (processingToastId.value !== null) {
          toast.update(processingToastId.value, "All HCM tiles ready to download", "success");
          processingToastId.value = null;
        }
        playNotification();
        return;
      }
      if (d.phase === "done_district") {
        completedFiles.value.push({
          id: d.id, district: d.district,
          tileCount: d.tileCount, sizeMB: d.sizeMB, elapsed: d.elapsed,
        });
        return;
      }
      if (d.phase === "error") {
        try { evtSource.close(); } catch { }
        currentSource.value = null;
        currentToken.value = null;
        downloading.value = false;
        progressLabel.value = "Error";
        progressText.value = d.message;
        if (processingToastId.value !== null) {
          toast.update(processingToastId.value, d.message, "error");
          processingToastId.value = null;
        }
        playNotification();
        return;
      }
      const pct = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0;
      progressPct.value = pct;
      const phase =
        d.phase === "downloading"
          ? "Downloading"
          : d.phase === "writing_mbtiles"
            ? "Writing MBTiles"
            : d.phase === "extracting_geojson"
              ? "Extracting GeoJSON"
              : d.phase;
      progressLabel.value = `${phase} (All HCM)`;
      progressText.value = `${d.done}/${d.total} · ok:${d.ok} fail:${d.fail}`;
      progressOk.value = d.ok;
      progressFail.value = d.fail;
    };
    evtSource.onerror = () => {
      try { evtSource.close(); } catch { }
      currentSource.value = null;
      currentToken.value = null;
      downloading.value = false;
      progressLabel.value = "Connection lost";
      toast.show("Connection lost", "error");
    };
  }

  function cancelProcessing() {
    if (currentSource.value) {
      try { currentSource.value.close(); } catch { }
      currentSource.value = null;
    }
    downloading.value = false;
    progressLabel.value = "Canceled";
    progressText.value = "";
    progressPct.value = 0;
    progressOk.value = 0;
    progressFail.value = 0;
    // keep completedFiles as-is (user can keep artifacts), but if none, reset geojson flag
    if (completedFiles.value.length === 0) lastGeojson.value = false;
    // notify backend to stop any worker threads for this token
    if (currentToken.value) {
      try {
        fetch(`${API}/api/cancel`, { method: "POST", body: currentToken.value });
      } catch { }
      currentToken.value = null;
    }
    const toast = useToastStore();
    // dismiss or update the persistent processing toast if present
    if (processingToastId.value !== null) {
      try { toast.dismiss(processingToastId.value); } catch { }
      processingToastId.value = null;
    }
    toast.show("Processing canceled", "warning");
  }

  return {
    districts, urbanKeys, allKeys, selected, downloading,
    progressLabel, progressText, progressPct, progressOk, progressFail, completedFiles,
    connectionError, loading, lastGeojson,
    fetchDistricts, toggle, selectAll, selectUrban, startDownload, startDownloadAll, removeFile, cancelProcessing,
  };
});
