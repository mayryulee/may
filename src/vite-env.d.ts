/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_KAKAO_MAP_APP_KEY?: string;
  readonly VITE_KAKAO_JAVASCRIPT_KEY?: string;
  readonly VITE_KAKAO_SHARE_TEMPLATE_ID?: string;
  readonly VITE_KAKAO_SHARE_METHOD?: string;
  readonly VITE_SITE_APP_NAME?: string;
  readonly VITE_THEME_OVERRIDE?: string;
  readonly VITE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
