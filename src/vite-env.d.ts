/// <reference types="vite/client" />

type KakaoSdk = {
  isInitialized(): boolean;
  init(key: string): void;
  Share?: {
    sendCustom(args: {
      templateId: number;
      templateArgs: Record<string, string>;
    }): void;
  };
};

interface Window {
  __MAY_CLIENT__?: {
    clientId: string;
    themeOverride?: string;
  };
  Kakao?: KakaoSdk;
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_DEV_SITE_URL?: string;
  readonly VITE_KAKAO_JAVASCRIPT_KEY?: string;
  readonly VITE_KAKAO_MAP_APP_KEY?: string;
  readonly VITE_KAKAO_SHARE_TEMPLATE_ID?: string;
  readonly VITE_KAKAO_SHARE_TEMPLATE_ID_VERTICAL?: string;
  readonly VITE_KAKAO_SHARE_TEMPLATE_ID_HORIZONTAL?: string;
  readonly VITE_KAKAO_SHARE_TEMPLATE_VARIANT?: "vertical" | "horizontal";
  readonly VITE_KAKAO_SHARE_METHOD?: string;
  readonly VITE_SITE_APP_NAME?: string;
  readonly VITE_OG_IMAGE_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
