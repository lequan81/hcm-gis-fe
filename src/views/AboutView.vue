<script setup lang="ts">
import { useI18n } from "../i18n";
const { t, tt } = useI18n();
const appName = import.meta.env.VITE_APP_TITLE || "HCMC 3D Building Tiles";
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="text-2xl sm:text-3xl font-bold text-accent-coral mb-8">
      {{ t.about_title }}
    </h1>

    <div class="space-y-6">
      <section class="border border-border-default bg-bg-surface p-6">
        <p class="text-text-secondary text-sm leading-relaxed">
          <strong class="text-text-primary">{{ appName }}</strong>
          {{ tt("about_intro", { name: "" }).trim() }}
        </p>
      </section>

      <section class="border border-border-default bg-bg-surface p-6">
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          {{ t.about_how_title }}
        </h2>
        <ol
          class="list-decimal list-inside space-y-2 text-text-secondary text-sm"
        >
          <li>{{ t.about_step1 }}</li>
          <li>{{ t.about_step2 }}</li>
          <li>{{ t.about_step3 }}</li>
          <li>{{ t.about_step4 }}</li>
          <li>{{ t.about_step5 }}</li>
        </ol>
      </section>

      <section class="border border-border-default bg-bg-surface p-6">
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          {{ t.about_tech_title }}
        </h2>
        <ul class="list-disc list-inside space-y-2 text-text-secondary text-sm">
          <li>
            <strong class="text-text-primary">Backend:</strong>
            {{ t.about_tech_backend }}
          </li>
          <li>
            <strong class="text-text-primary">Frontend:</strong>
            {{ t.about_tech_frontend }}
          </li>
          <li>
            <strong class="text-text-primary">PWA:</strong>
            {{ t.about_tech_pwa }}
          </li>
        </ul>
      </section>

      <section class="border border-border-default bg-bg-surface p-6">
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          {{ t.about_data_title }}
        </h2>
        <p class="text-text-secondary text-sm leading-relaxed">
          {{ t.about_data_text }}
        </p>
      </section>
    </div>
  </div>
</template>
