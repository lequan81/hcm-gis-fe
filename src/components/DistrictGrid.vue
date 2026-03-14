<script setup lang="ts">
import { useProcessingStore } from "../stores/processing";

const store = useProcessingStore();

function staggerDelay(index: number): string {
  return `animation-delay: ${index * 30}ms`;
}
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6 justify-items-center"
  >
    <div
      v-for="(d, idx) in store.data.districts"
      :key="d.key"
      class="stagger-item group relative border px-4 py-3 cursor-pointer transition-all duration-150 select-none hover:bg-bg-elevated w-11/12 sm:w-full min-w-52"
      :class="
        store.data.selected.has(d.key)
          ? 'border-accent-teal bg-accent-teal/5'
          : 'border-border-default bg-bg-surface'
      "
      :style="staggerDelay(idx)"
      @click="store.toggle(d.key)"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-text-primary">{{ d.name }}</h3>
        <div
          class="w-4 h-4 rounded-full border-2 transition-all duration-150 flex items-center justify-center"
          :class="
            store.data.selected.has(d.key)
              ? 'bg-accent-teal border-accent-teal'
              : 'border-border-default'
          "
        >
          <svg
            v-if="store.data.selected.has(d.key)"
            class="w-2.5 h-2.5 text-bg-deep"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
      </div>
      <p class="text-xs text-text-dim mt-1 font-mono">{{ d.tiles }} tiles</p>
    </div>
  </div>
</template>
