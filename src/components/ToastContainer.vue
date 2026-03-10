<script setup lang="ts">
const colors: Record<string, string> = {
  success: "border-green-500/50 bg-green-500/10 text-green-300",
  error: "border-red-500/50 bg-red-500/10 text-red-300",
  info: "border-accent-sky/50 bg-accent-sky/10 text-sky-300",
  warning: "border-accent-amber/50 bg-accent-amber/10 text-amber-300",
  loading: "border-accent-sky/50 bg-accent-sky/10 text-sky-300",
};

import { useToastStore } from "../stores/toast";
const store = useToastStore();
</script>

<template>
  <div
    class="fixed top-14 right-4 z-50 flex flex-col gap-2 pointer-events-none"
  >
    <div
      v-for="t in store.toasts"
      :key="t.id"
      class="pointer-events-auto flex items-center gap-3 px-4 py-3 border text-sm font-medium shadow-xl"
      :class="[
        colors[t.type] || colors.info,
        t.exiting ? 'toast-exit' : 'toast-enter',
      ]"
    >
      <!-- Heroicon toast icons -->
      <svg
        v-if="t.type === 'loading'"
        class="w-5 h-5 shrink-0 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <svg
        v-else-if="t.type === 'success'"
        class="w-5 h-5 shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <svg
        v-else-if="t.type === 'error'"
        class="w-5 h-5 shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <svg
        v-else-if="t.type === 'warning'"
        class="w-5 h-5 shrink-0"
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
      <svg
        v-else
        class="w-5 h-5 shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
      <span class="flex-1">{{ t.message }}</span>
      <button
        @click="store.dismiss(t.id)"
        class="ml-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
        aria-label="Dismiss"
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
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
