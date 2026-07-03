/// <reference types="vite/client" />

interface Window {
  __MAY_CLIENT__?: {
    clientId: string;
    themeOverride?: string;
  };
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_KAKAO_MAP_APP_KEY?: string;
  readonly VITE_SITE_APP_NAME?: string;
  readonly VITE_THEME_OVERRIDE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
