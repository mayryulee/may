export type ThemeId = "theme01" | "theme02" | "theme03";
export type ThemeSlug = "grace" | "tender" | "veil";

export type ThemeMeta = {
  slug: ThemeSlug;
  label: string;
};

/**
 * 내부 테마 ID(theme01/theme02/theme03)와 외부 표기명(Grace/Tender 등) 매핑
 */
export const THEME_META: Record<ThemeId, ThemeMeta> = {
  theme01: { slug: "grace", label: "Grace" },
  theme02: { slug: "tender", label: "Tender" },
  theme03: { slug: "veil", label: "Veil" },
} as const;

export function themeSlugOf(themeId: ThemeId): ThemeSlug {
  return THEME_META[themeId].slug;
}

export function themeLabelOf(themeId: ThemeId): string {
  return THEME_META[themeId].label;
}

export function themeIdFromSlug(slug: ThemeSlug): ThemeId {
  if (slug === "grace") return "theme01";
  if (slug === "tender") return "theme02";
  return "theme03";
}

export function isThemeSlug(slug: string): slug is ThemeSlug {
  return slug === "grace" || slug === "tender" || slug === "veil";
}

export function pathForTheme(themeId: ThemeId): string {
  return `/${themeSlugOf(themeId)}`;
}

export type GalleryImage = {
  src: string;
  alt: string;
};

export type GiftAccount = {
  relation: string;
  name: string;
  bank: string;
  number: string;
};

export type GiftAccounts = {
  groom: GiftAccount[];
  bride: GiftAccount[];
};

export type InformationSlide = {
  title: string;
  lines: string[];
};

/** 테마 디자인에 맞춰 1행씩 나눈 교통편 안내 */
export type LocationTransportSection = {
  /** 테마1: "버스 이용 시" / 테마2: "버스" 등 디자인용 라벨 */
  label: string;
  /** 화면에 표시할 텍스트 — 각 항목이 한 줄(<p>) */
  lines: string[];
};

export type ThemeLocationContent = {
  transport: LocationTransportSection[];
};

export type Venue = {
  name: string;
  address: string;
  addressFull: string;
  tel: string;
  lat: number;
  lng: number;
  naverPlaceId: string;
  /** 테마별 오시는 길·교통편 (디자인에 맞게 행 단위로 저장) */
  location: Record<ThemeId, ThemeLocationContent>;
};

export function venueLocationForTheme(
  venue: Venue,
  themeId: ThemeId,
): ThemeLocationContent {
  const content = venue.location[themeId];
  if (!content) {
    throw new Error(`venue.location.${themeId} is not defined`);
  }
  return content;
}

export type ClientMeta = {
  title: string;
  description: string;
  ogSiteName: string;
  ogTitle: string;
  ogDescription: string;
  /**
   * 링크 복사·OG 미리보기 + 카카오 공유 썸네일 (clients/{id}/images/).
   * 세로/가로 무관하게 클라이언트별 커버 파일을 지정 (기본 파일명 cover.png).
   * 미지정 시 cover.png로 폴백.
   */
  ogImage?: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
};

export type ClientRsvpConfig = {
  enabled: boolean;
  /** 접속 시 자동 팝업 (이미 제출했거나 '오늘 하루 보지 않기'면 스킵) */
  showOnLoad?: boolean;
  title?: string;
  /** @deprecated subtitleLines 사용 권장 */
  subtitle?: string;
  /** intro 팝업 안내 문구 (줄 단위, 중앙 정렬) */
  subtitleLines?: string[];
  /** 제출 시 알림 수신 이메일 (Netlify Function에서 사용) */
  notify?: {
    emails?: string[];
  };
};

export type ClientConfig = {
  id: string;
  /** URL 경로 (`/eunju-hani`) — 미지정 시 빌드 스크립트가 폴더명을 사용 */
  slug: string;
  theme: ThemeId;
  expiresAt?: string;
  meta: ClientMeta;
  couple: {
    groomEn: string;
    brideEn: string;
    groomKo: string;
    brideKo: string;
    /** 성 제외 이름 (예: 김정호 → 정호) */
    groomGivenName: string;
    brideGivenName: string;
    ddayLabel: string;
  };
  weddingAt: string;
  header: {
    titleImageAlt: string;
    /** theme02: 메인 히어로 타이틀 (줄 단위) */
    heroTitleLines?: string[];
    /** theme02: 메인 히어로 부제 (줄 단위) */
    heroSubtitleLines?: string[];
    year: string;
    monthDay: string;
  };
  hero: {
    image: string;
    alt: string;
  };
  calendar: {
    image: string;
    alt: string;
  };
  invitation: {
    /** theme02: SAVE THE DATE 카드 인사말 */
    introLines?: string[];
    lines: string[];
    groomParents: { parents: string; relation: string; name: string };
    brideParents: { parents: string; relation: string; name: string };
    subImage: string;
    subImageAlt: string;
  };
  dateDisplay: {
    shortDate: string;
    time: string;
    fullDateKo: string;
    venueShort: string;
  };
  venue: Venue;
  gallery: GalleryImage[];
  accounts: GiftAccounts;
  information: InformationSlide[];
  quote: {
    stanzas: string[][];
    attribution: string;
  };
  share: {
    title: string;
    description: string;
    /**
     * 카카오 공유 템플릿 방향 (클라이언트별). 미지정 시 "vertical".
     * 썸네일 이미지는 meta.ogImage를 사용하고, 이 값은 세로용/가로용
     * 카카오 템플릿 ID(env) 선택에만 사용됩니다.
     */
    kakaoTemplate?: "vertical" | "horizontal";
  };
  rsvp?: ClientRsvpConfig;
};

/** 클라이언트 전용 사진 (갤러리, 커버, 메인 등) */
export function clientImageUrl(clientId: string, filename: string): string {
  return `/images/${clientId}/${filename}`;
}

/** 테마 전용 이미지 (title.png 등) */
export function themeImageUrl(themeId: ThemeId, filename: string): string {
  return `/theme-assets/${themeId}/images/${filename}`;
}

/** 테마 전용 아이콘 */
export function themeIconUrl(themeId: ThemeId, filename: string): string {
  return `/theme-assets/${themeId}/icons/${filename}`;
}
