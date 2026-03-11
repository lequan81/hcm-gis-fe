<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import ToastContainer from "./components/ToastContainer.vue";
import { useI18n, type Locale } from "./i18n";

const githubUrl =
  import.meta.env.VITE_GITHUB_URL || "https://github.com/chungbd/hcm-gis-3d";

const i18n = useI18n();

const langOpen = ref(false);
function pickLang(l: Locale) {
  i18n.setLocale(l);
  langOpen.value = false;
}

const routeLoading = ref(false);
const mobileMenuOpen = ref(false);

const isDark = ref(true);
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || (!saved && !window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    isDark.value = false;
    document.documentElement.classList.add("light");
  }
}

function toggleTheme() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.add("light");
    localStorage.setItem("theme", "light");
  }
}

const router = useRouter();
router.beforeEach(() => {
  routeLoading.value = true;
  mobileMenuOpen.value = false;
});
router.afterEach(() => {
  routeLoading.value = false;
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav
      class="sticky top-0 z-50 bg-bg-deep/80 backdrop-blur border-b border-border-default"
    >
      <div
        class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12"
      >
        <!-- Hamburger button (mobile) -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="sm:hidden p-1 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
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

        <!-- Desktop nav links -->
        <div class="hidden sm:flex items-center gap-6 pt-0.5">
          <RouterLink
            to="/"
            active-class="text-accent-teal after:scale-x-100 after:opacity-100"
            class="relative text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-1 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-accent-teal after:origin-center after:scale-x-0 after:opacity-0 after:transition-all after:duration-300 after:ease-out"
          >
            {{ i18n.t.nav_home }}
          </RouterLink>
          <RouterLink
            to="/about"
            active-class="text-accent-teal after:scale-x-100 after:opacity-100"
            class="relative text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-1 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-accent-teal after:origin-center after:scale-x-0 after:opacity-0 after:transition-all after:duration-300 after:ease-out"
          >
            {{ i18n.t.nav_about }}
          </RouterLink>
          <RouterLink
            to="/faq"
            active-class="text-accent-teal after:scale-x-100 after:opacity-100"
            class="relative text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-1 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-accent-teal after:origin-center after:scale-x-0 after:opacity-0 after:transition-all after:duration-300 after:ease-out"
          >
            {{ i18n.t.nav_faq }}
          </RouterLink>
          <RouterLink
            to="/policy"
            active-class="text-accent-teal after:scale-x-100 after:opacity-100"
            class="relative text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-1 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-accent-teal after:origin-center after:scale-x-0 after:opacity-0 after:transition-all after:duration-300 after:ease-out"
          >
            {{ i18n.t.nav_policy }}
          </RouterLink>
        </div>

        <div class="flex items-center gap-1 sm:gap-2">
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-1.5 text-text-secondary hover:text-accent-teal hover:bg-bg-surface rounded-full transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            <!-- Sun icon for dark mode (click to switch to light) -->
            <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-2.25l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <!-- Moon icon for light mode (click to switch to dark) -->
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </button>

          <!-- Language selector -->
          <div class="relative">
            <button
              @click="langOpen = !langOpen"
              class="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer px-2 py-1 hover:bg-bg-surface"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a14.25 14.25 0 014 9 14.25 14.25 0 01-4 9 14.25 14.25 0 01-4-9 14.25 14.25 0 014-9z"
                />
              </svg>
              {{ i18n.locales[i18n.locale] }}
              <svg
                class="w-3 h-3"
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
            </button>
            <div
              v-if="langOpen"
              class="absolute right-0 top-full mt-1 bg-bg-surface border border-border-default shadow-xl py-1 min-w-30 z-50"
            >
              <button
                v-for="(label, code) in i18n.locales"
                :key="code"
                @click="pickLang(code as Locale)"
                class="w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer"
                :class="
                  i18n.locale === code
                    ? 'text-accent-teal bg-bg-elevated'
                    : 'text-text-secondary hover:bg-bg-elevated'
                "
              >
                {{ label }}
              </button>
            </div>
          </div>

          <!-- GitHub -->
          <a
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-secondary hover:text-text-primary transition-colors"
            title="GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
          </a>
        </div>
      </div>
    </nav>

    <!-- Mobile menu dropdown (overlay placed outside nav to avoid pushing content) -->
    <div v-if="mobileMenuOpen">
      <div
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        @click="mobileMenuOpen = false"
      />
      <div
        class="fixed inset-0 z-50 flex items-start justify-center pt-8 pointer-events-none"
      >
        <div
          class="pointer-events-auto max-w-md w-full mx-4 bg-bg-deep/95 backdrop-blur-lg border border-border-default rounded-lg shadow-xl overflow-hidden"
        >
          <div class="px-4 py-4 space-y-1">
            <RouterLink
              to="/"
              @click="mobileMenuOpen = false"
              active-class="text-accent-teal bg-accent-teal/10 !border-accent-teal"
              class="block px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors rounded border-l-[3px] border-transparent"
            >
              {{ i18n.t.nav_home }}
            </RouterLink>
            <RouterLink
              to="/about"
              @click="mobileMenuOpen = false"
              active-class="text-accent-teal bg-accent-teal/10 !border-accent-teal"
              class="block px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors rounded border-l-[3px] border-transparent"
            >
              {{ i18n.t.nav_about }}
            </RouterLink>
            <RouterLink
              to="/faq"
              @click="mobileMenuOpen = false"
              active-class="text-accent-teal bg-accent-teal/10 !border-accent-teal"
              class="block px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors rounded border-l-[3px] border-transparent"
            >
              {{ i18n.t.nav_faq }}
            </RouterLink>
            <RouterLink
              to="/policy"
              @click="mobileMenuOpen = false"
              active-class="text-accent-teal bg-accent-teal/10 !border-accent-teal"
              class="block px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors rounded border-l-[3px] border-transparent"
            >
              {{ i18n.t.nav_policy }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Route loading bar -->
    <div
      v-if="routeLoading"
      class="fixed top-12 left-0 right-0 z-40 h-0.5 bg-bg-surface overflow-hidden"
    >
      <div class="h-full bg-accent-sky animate-pulse" style="width: 60%"></div>
    </div>

    <RouterView />

    <footer
      class="mt-auto text-center text-xs text-text-dim py-4 border-t border-border-default"
    >
      {{ i18n.t.footer_text }}
    </footer>
  </div>

  <ToastContainer />
</template>
