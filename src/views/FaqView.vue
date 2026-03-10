<script setup lang="ts">
import { useI18n } from "../i18n";
const { t } = useI18n();
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="text-2xl sm:text-3xl font-bold text-accent-coral mb-8">
      {{ t.faq_title }}
    </h1>

    <div class="space-y-2">
      <details
        v-for="n in 6"
        :key="n"
        class="group border border-border-default bg-bg-surface overflow-hidden"
      >
        <summary
          class="flex items-center justify-between px-5 py-3.5 cursor-pointer text-sm font-medium text-text-primary hover:bg-bg-elevated transition-colors select-none"
        >
          {{ t[`faq_q${n}` as keyof typeof t] }}
          <svg
            class="w-4 h-4 text-text-dim transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <div class="border-t border-border-default">
          <p class="px-5 py-4 text-sm text-text-secondary leading-relaxed">
            {{ t[`faq_a${n}` as keyof typeof t] }}
          </p>
        </div>
      </details>
    </div>
  </div>
</template>
