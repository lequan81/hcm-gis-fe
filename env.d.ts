/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_URL: string;
  readonly VITE_GITHUB_URL: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_TWITTER_URL: string;
  readonly VITE_FACEBOOK_URL: string;
  readonly VITE_FILE_RETENTION_HOURS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
