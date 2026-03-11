<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProcessingStore } from "../stores/processing";
import { useToastStore } from "../stores/toast";
import { useI18n } from "../i18n";
import DistrictGrid from "../components/DistrictGrid.vue";
import ProcessingProgress from "../components/ProcessingProgress.vue";

const store = useProcessingStore();
const toast = useToastStore();
const i18n = useI18n();
const geojson = ref(false);

onMounted(() => store.fetchDistricts());

function startDownload() {
  if (store.selected.size === 0) {
    toast.show(i18n.t.toast_select_warning, "warning");
    return;
  }
  store.startDownload(geojson.value);
}

const viewState = computed(() => {
  if (store.loading) return "skeleton";
  if (store.connectionError) return "error";
  return "ready";
});
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <!-- Header -->
    <header class="mb-10 text-center animate-fade-up">
      <h1 class="text-3xl sm:text-4xl font-bold text-accent-coral mb-3">
        {{ i18n.t.home_title }}
      </h1>
      <p class="text-text-secondary text-sm max-w-xl mx-auto">
        {{ i18n.t.home_subtitle }}
      </p>
    </header>

    <!-- Connection error -->
    <Transition name="view-fade" mode="out-in">
      <div
        v-if="viewState === 'error'"
        key="error"
        class="border border-red-500/30 bg-red-500/5 p-6 mb-8 text-center"
      >
        <div class="flex items-center justify-center gap-2 mb-2">
          <svg
            class="w-5 h-5 text-red-400"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <span class="text-red-400 font-semibold text-sm">{{
            i18n.t.connection_error_title
          }}</span>
        </div>
        <p class="text-text-dim text-xs mb-4">
          {{ i18n.t.connection_error_text }}
        </p>
        <button
          @click="store.fetchDistricts()"
          class="inline-flex items-center gap-1.5 border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:border-red-400 hover:text-red-300 cursor-pointer"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M21.015 4.356v4.992"
            />
          </svg>
          {{ i18n.t.btn_retry }}
        </button>
      </div>

      <!-- Skeleton loading -->
      <div
        v-else-if="viewState === 'skeleton'"
        key="skeleton"
        class="animate-pulse"
      >
        <div class="flex gap-2 mb-4">
          <div
            class="h-8 w-20 bg-bg-elevated border border-border-default"
          ></div>
          <div
            class="h-8 w-28 bg-bg-elevated border border-border-default"
          ></div>
          <div
            class="h-8 w-20 bg-bg-elevated border border-border-default"
          ></div>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-8"
        >
          <div
            v-for="i in 12"
            :key="i"
            class="border border-border-default bg-bg-surface px-4 py-3"
          >
            <div class="flex items-center justify-between">
              <div class="h-4 w-24 bg-bg-elevated"></div>
              <div class="h-4 w-4 rounded-full bg-bg-elevated"></div>
            </div>
            <div class="h-3 w-16 bg-bg-elevated mt-2"></div>
          </div>
        </div>
        <div class="border border-border-default bg-bg-surface p-6">
          <div class="flex flex-wrap gap-4">
            <div
              class="h-9 w-36 bg-bg-elevated border border-border-default"
            ></div>
            <div
              class="h-9 w-44 bg-bg-elevated border border-border-default"
            ></div>
            <div
              class="h-9 w-44 bg-bg-elevated border border-border-default"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div v-else key="ready">
        <!-- Quick selection -->
        <section class="mb-8">
          <div
            class="flex flex-wrap items-center gap-2 mb-4 justify-center sm:justify-start"
          >
            <button
              @click="store.selectUrban()"
              class="inline-flex items-center gap-1.5 border border-border-default bg-bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-accent-amber hover:text-text-primary transition cursor-pointer"
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
                  d="M2.25 21h19.5M3.75 21V8.484c0-.464.346-.86.806-.94l9-1.59a.997.997 0 0 1 1.194.98V21m-1.5 0h-9m9 0h1.5M12 17.25h.008v.008H12v-.008Zm0-3h.008v.008H12v-.008Zm0-3h.008v.008H12v-.008Z"
                />
              </svg>
              {{ i18n.t.btn_select_urban }}
            </button>
            <button
              @click="store.startDownloadAll(geojson)"
              :disabled="store.downloading || store.completedFiles.length > 0"
              class="inline-flex items-center gap-1.5 border border-accent-coral/30 bg-accent-coral/10 px-3 py-1.5 text-xs font-medium text-accent-coral hover:bg-accent-coral/20 transition cursor-pointer disabled:border-border-default disabled:bg-bg-elevated disabled:text-text-dim disabled:cursor-not-allowed"
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
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              {{ i18n.t.btn_download_all }} ({{ store.districts.length }})
            </button>
            <button
              v-if="store.selected.size > 0"
              @click="store.selectAll(false)"
              class="sm:ml-auto ml-0 inline-flex items-center gap-1.5 border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 hover:border-red-400 hover:bg-red-500/10 transition cursor-pointer"
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
              {{ i18n.t.btn_clear_all }}
            </button>
          </div>

          <DistrictGrid />
        </section>

        <!-- Controls -->
        <section class="border border-border-default bg-bg-surface p-6 mb-8">
          <div class="flex flex-col gap-4">
            <!-- Top Controls Row -->
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <!-- GeoJSON toggle -->
              <button
                @click="geojson = !geojson"
                class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer select-none border"
                :class="
                  geojson
                    ? 'bg-accent-amber/10 border-accent-amber/50 text-accent-amber'
                    : 'bg-bg-elevated border-border-default text-text-dim hover:border-text-dim'
                "
              >
                <span
                  class="relative inline-flex h-4 w-7 shrink-0 rounded-full transition-colors duration-200"
                  :class="geojson ? 'bg-accent-amber' : 'bg-bg-deep'"
                >
                  <span
                    class="inline-block h-3 w-3 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5"
                    :class="
                      geojson ? 'translate-x-3.5 ml-0' : 'translate-x-0.5'
                    "
                  />
                </span>
                {{ i18n.t.btn_include_geojson }}
              </button>

              <!-- Download buttons -->
              <div
                class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
              >
                <button
                  @click="startDownload"
                  :disabled="store.downloading || store.selected.size === 0 || store.completedFiles.length > 0"
                  class="inline-flex items-center gap-1.5 border border-accent-teal/30 bg-accent-teal/10 px-5 py-2.5 font-semibold text-sm text-accent-teal hover:bg-accent-teal/20 active:scale-95 transition-all duration-150 disabled:border-border-default disabled:bg-bg-elevated disabled:text-text-dim disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                >
                  <svg
                    class="w-4 h-4"
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
                  {{ i18n.t.btn_download_selected }} ({{ store.selected.size }})
                </button>
              </div>
            </div>

            <!-- GeoJSON warning -->
            <div
              v-if="geojson"
              class="w-full mt-2 p-3 text-xs bg-accent-amber/10 border border-accent-amber/20 text-accent-amber flex gap-2 rounded-sm items-center"
            >
              <svg
                class="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2.25m0 3h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
                />
              </svg>
              <span>
                {{ i18n.t.geojson_warning }}
              </span>
            </div>
          </div>
        </section>

        <ProcessingProgress />
      </div>
    </Transition>
  </div>
</template>
