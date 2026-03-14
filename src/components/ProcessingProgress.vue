<script setup lang="ts">
import { computed } from "vue";
import { useProcessingStore } from "../stores/processing";
import { useI18n } from "../i18n";
const store = useProcessingStore();
const i18n = useI18n();
const apiBase = import.meta.env.VITE_API_BASE_URL || "/hcm-gis";
const downloadsReady = computed(() => store.downloadsReady);

function onCancel() {
  try {
    store.cancelProcessing();
  } catch (err) {
    console.error("cancel failed", err);
  }
}

const showZip = computed(
  () =>
    !store.downloading &&
    store.progressPct === 100 &&
    store.completedFiles.length > 0 &&
    (store.completedFiles.length > 1 || store.lastGeojson),
);

const zipUrl = computed(() => {
  const ids = store.completedFiles.map((f) => f.id).join(",");
  return `${apiBase}/api/bundle?ids=${ids}`;
});
</script>

<template>
  <div v-if="store.downloading || store.progressPct === 100" class="mb-8">
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
        <span v-if="store.preparingDownloads" class="ml-2 text-accent-amber">Preparing downloads...</span>
      </p>

      <!-- Completed file download links -->
      <div v-if="store.completedFiles.length > 0" class="mt-6 space-y-2">
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
              >{{ f.tileCount }} tiles · {{ f.sizeMB }} MB (.mbtiles) ·
              {{ f.elapsed }}s</span
            >
          </div>
          <div class="flex items-center gap-1.5">
            <template v-if="downloadsReady">
              <!-- MBTiles download -->
              <a
                :href="`${apiBase}/api/files/${f.id}`"
                class="inline-flex items-center gap-1 border border-accent-teal/30 bg-accent-teal/10 px-2.5 py-1 text-accent-teal text-xs font-medium hover:bg-accent-teal/20 transition-colors"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                .mbtiles
              </a>
              <!-- GeoJSON download -->
              <a
                v-if="store.lastGeojson"
                :href="`${apiBase}/api/files/${f.id}/geojson`"
                class="inline-flex items-center gap-1 border border-accent-amber/30 bg-accent-amber/10 px-2.5 py-1 text-accent-amber text-xs font-medium hover:bg-accent-amber/20 transition-colors"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                .geojson
              </a>
            </template>
            <span v-else class="text-xs text-text-dim">Preparing downloads...</span>
            <!-- Remove -->
            <button
              @click="store.removeFile(f.id)"
              class="p-1 text-text-dim hover:text-red-400 transition-colors cursor-pointer"
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
      <div v-if="showZip && downloadsReady" class="mt-4 pt-4 border-t border-border-default">
        <a
          :href="zipUrl"
          class="inline-flex items-center gap-1.5 border border-accent-sky/30 bg-accent-sky/10 px-3 py-1.5 text-xs font-medium text-accent-sky hover:bg-accent-sky/20 transition-colors"
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
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          {{ i18n.t.btn_download_zip || "Download All as ZIP" }}
        </a>
      </div>
    </div>
  </div>
</template>
