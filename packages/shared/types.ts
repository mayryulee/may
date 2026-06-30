export type ThemeId = "theme01" | "theme02" | "theme03";
export type ThemeSlug = "grace" | "tender" | "theme03";

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
  theme03: { slug: "theme03", label: "Theme 03" },
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
    imageWidth: number;
    imageHeight: number;
  };
  rsvp?: ClientRsvpConfig;
};

/** 클라이언트 전용 사진 (갤러리, 커버, 메인 등) */
export function clientImageUrl(clientId: string, filename: string): string {
  return `/images/${clientId}/${filename}`;
}

export function clientOgImageUrl(clientId: string): string {
  return `${clientImageUrl(clientId, "og-kakao.png")}?v=3`;
}

/** 테마 전용 이미지 (title.png 등) */
export function themeImageUrl(themeId: ThemeId, filename: string): string {
  return `/theme-assets/${themeId}/images/${filename}`;
}

/** 테마 전용 아이콘 */
export function themeIconUrl(themeId: ThemeId, filename: string): string {
  return `/theme-assets/${themeId}/icons/${filename}`;
}
