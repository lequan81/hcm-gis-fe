<script setup lang="ts">
import { useI18n } from "../i18n";
const { t } = useI18n();
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="text-2xl sm:text-3xl font-bold text-accent-coral mb-8">
      {{ t.policy_title }}
    </h1>

    <div class="space-y-2">
      <section class="border border-border-default bg-bg-surface p-6">
        <p class="text-text-secondary text-sm leading-relaxed">
          {{ t.policy_intro }}
        </p>
      </section>

      <section class="border border-border-default bg-bg-surface p-6">
        <h2 class="text-base font-semibold text-text-primary mb-2">
          {{ t.policy_data_title }}
        </h2>
        <p class="text-text-secondary text-sm leading-relaxed">
          {{ t.policy_data_text }}
        </p>
      </section>

      <section class="border border-border-default bg-bg-surface p-6">
        <h2 class="text-base font-semibold text-text-primary mb-2">
          {{ t.policy_cookies_title }}
        </h2>
        <p class="text-text-secondary text-sm leading-relaxed">
          {{ t.policy_cookies_text }}
        </p>
      </section>

      <section class="border border-border-default bg-bg-surface p-6">
        <h2 class="text-base font-semibold text-text-primary mb-2">
          {{ t.policy_third_title }}
        </h2>
        <p class="text-text-secondary text-sm leading-relaxed">
          {{ t.policy_third_text }}
        </p>
      </section>

      <section class="border border-border-default bg-bg-surface p-6">
        <h2 class="text-base font-semibold text-text-primary mb-2">
          {{ t.policy_changes_title }}
        </h2>
        <p class="text-text-secondary text-sm leading-relaxed">
          {{ t.policy_changes_text }}
        </p>
      </section>
    </div>
  </div>
</template>
