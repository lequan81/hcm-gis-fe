import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type Locale, messages, localeLabels } from "./messages";

const STORAGE_KEY = "hcm-tiles-locale";

function savedLocale(): Locale {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && v in messages) return v as Locale;
  } catch { }
  return "en";
}

export const useI18n = defineStore("i18n", () => {
  const locale = ref<Locale>(savedLocale());

  const t = computed(() => messages[locale.value]);

  function setLocale(l: Locale) {
    locale.value = l;
    try { localStorage.setItem(STORAGE_KEY, l); } catch { }
    document.documentElement.lang = l;
  }

  /** Simple interpolation: t("key", { name: "X" }) replaces {name} */
  function tt(key: keyof typeof messages["en"], vars?: Record<string, string>): string {
    let text = t.value[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, v);
      }
    }
    return text;
  }

  return { locale, t, tt, setLocale, locales: localeLabels };
});

export type { Locale };
export { localeLabels };
