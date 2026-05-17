<script setup lang="ts">
import { computed, watch } from "vue";
import { useProcessingStore } from "../stores/processing";
import { useI18n } from "../i18n";
const store = useProcessingStore();
const i18n = useI18n();
const apiBase = import.meta.env.VITE_API_BASE_URL || "/hcm-gis";
const downloadsReady = computed(() => store.downloadsReady);
const hasCompletedFiles = computed(() => store.completedFiles.length > 0);
const showProgressCard = computed(
  () => store.downloading || store.progressPct === 100 || hasCompletedFiles.value,
);

// Watch for changes to debug reactivity
watch(() => store.completedFiles.length, (newLen) => {
  console.log(`[ProcessingProgress] completedFiles.length updated: ${newLen}`);
});

watch(() => store.progressPct, (newPct) => {
  console.log(`[ProcessingProgress] progressPct updated: ${newPct}`);
});

watch(() => store.downloadsReady, (newReady) => {
  console.log(`[ProcessingProgress] downloadsReady updated: ${newReady}`);
});

function onCancel() {
  try {
    store.cancelProcessing();
  } catch (err) {
    console.error("cancel failed", err);
  }
}

// ZIP button shows when:
// 1. SSE completed (progressPct === 100 && !downloading)
// 2. OR bundle was prepared (downloadsReady === true)
// 3. AND there are 2+ files to bundle
const showZip = computed(() => {
  const hasMultipleFiles = store.completedFiles.length > 1;
  const sseComplete = !store.downloading && store.progressPct === 100;
  const bundleReady = store.downloadsReady;
  const show = hasMultipleFiles && (sseComplete || bundleReady);
  console.debug(`[showZip] files=${store.completedFiles.length}, sseComplete=${sseComplete}, bundleReady=${bundleReady}, show=${show}`);
  return show;
});

const zipUrl = computed(() => {
  const ids = store.completedFiles.map((f) => f.id).join(",");
  return `${apiBase}/api/bundle?ids=${ids}`;
});
</script>

<template>
  <div v-if="showProgressCard" class="mb-8">
    <div class="border border-border-default bg-bg-surface p-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3"
      >
        <span class="text-sm font-medium text-text-primary">{{
          store.progressLabel
        }}</span>
        <div class="flex items-center gap-3">
          <span class="text-sm text-accent-teal tabular-nums font-semibold"
            >{{ store.progressPct }}%</span
          >
          <button
            v-if="store.downloading"
            @click="onCancel"
            class="text-xs text-text-secondary hover:text-red-400 border border-border-default px-2 py-1 rounded transition-colors"
          >
            {{
              store.selected.size > 1 || store.progressLabel.includes("All")
                ? i18n.t.btn_cancel_all
                : i18n.t.btn_cancel
            }}
          </button>
        </div>
      </div>
      <div class="w-full bg-bg-elevated h-2 overflow-hidden">
        <div
          class="h-full bg-accent-sky transition-all duration-300 ease-out"
          :style="{ width: store.progressPct + '%' }"
        />
      </div>
      <p class="text-xs text-text-dim mt-2 font-mono">
        <template v-if="store.downloading">
          {{ store.progressText || i18n.t.progress_waiting }}
          <span v-if="store.progressText">
            · <span class="text-accent-teal">ok:{{ store.progressOk }}</span>
            <span
              :class="
                store.progressFail > 0
                  ? 'text-red-400 font-bold ml-1'
                  : 'text-text-dim ml-1'
              "
              >fail:{{ store.progressFail }}</span
            >
          </span>
        </template>
        <template v-else>
          {{ store.progressText || i18n.t.progress_waiting }}
        </template>
        <span v-if="store.preparingDownloads" class="ml-2 text-accent-amber"
          >Preparing downloads...</span
        >
      </p>

      <!-- Completed file download links -->
      <div v-if="hasCompletedFiles" class="mt-6 space-y-2">
        <p class="text-xs font-medium text-text-dim uppercase tracking-widest">
          {{ i18n.t.progress_completed_files }}
        </p>
        <div
          v-for="f in store.completedFiles"
          :key="f.id"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-border-default bg-bg-elevated px-4 py-3 gap-3"
        >
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-text-primary font-medium">{{
              f.district
            }}</span>
            <span class="text-xs text-text-dim font-mono"
              >{{ f.tileCount }} tiles · {{ f.sizeMB }} MB ·
              {{ f.elapsed }}s</span
            >
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <!-- MBTiles download button -->
            <a
              :href="`${apiBase}/api/files/${f.id}`"
              class="inline-flex items-center gap-1.5 border border-accent-teal/40 bg-accent-teal/15 hover:bg-accent-teal/25 px-3 py-1.5 text-accent-teal text-xs font-medium rounded transition-colors active:scale-95"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {{ i18n.t.btn_download }} (.mbtiles)
            </a>
            <!-- GeoJSON download button -->
            <a
              v-if="store.lastGeojson"
              :href="`${apiBase}/api/files/${f.id}/geojson`"
              class="inline-flex items-center gap-1.5 border border-accent-amber/40 bg-accent-amber/15 hover:bg-accent-amber/25 px-3 py-1.5 text-accent-amber text-xs font-medium rounded transition-colors active:scale-95"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {{ i18n.t.btn_download }} (.geojson)
            </a>
            <!-- Remove -->
            <button
              @click="store.removeFile(f.id)"
              class="p-1 text-text-dim hover:text-red-400 transition-colors cursor-pointer ml-auto sm:ml-0"
              aria-label="Remove"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Download ZIP bundle -->
      <div v-if="showZip" class="mt-6 pt-4 border-t border-border-default">
        <p
          class="text-xs font-medium text-text-dim uppercase tracking-widest mb-3"
        >
          Bundle Download
        </p>
        <a
          v-if="downloadsReady"
          :href="zipUrl"
          class="inline-flex items-center gap-2 border border-accent-sky/50 bg-accent-sky/20 hover:bg-accent-sky/30 px-4 py-2 text-sm font-semibold text-accent-sky rounded transition-colors active:scale-95"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          {{ i18n.t.btn_download_zip || "Download All as ZIP" }}
        </a>
        <p v-else class="text-xs text-text-dim italic">Preparing ZIP bundle...</p>
        <p class="text-xs text-text-dim mt-2">
          {{ store.completedFiles.length }} file{{
            store.completedFiles.length !== 1 ? "s" : ""
          }}
          · Compressed bundle
        </p>
      </div>
    </div>
  </div>
</template>
