export type ThemeId = "theme01" | "theme02";

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

export type VenueTransport = {
  title: string;
  lines: string[];
};

export type Venue = {
  name: string;
  address: string;
  addressFull: string;
  tel: string;
  lat: number;
  lng: number;
  naverPlaceId: string;
  transport: VenueTransport[];
};

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
    ddayLabel: string;
  };
  weddingAt: string;
  header: {
    titleImageAlt: string;
    year: string;
    monthDay: string;
  };
  hero: {
    image: string;
    alt: string;
  };
  invitation: {
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
};

/** 클라이언트 전용 사진 (갤러리, 커버, 메인 등) */
export function clientImageUrl(clientId: string, filename: string): string {
  return `/images/${clientId}/${filename}`;
}

export function clientOgImageUrl(clientId: string): string {
  return `${clientImageUrl(clientId, "og-kakao.png")}?v=3`;
}

/** 테마 전용 이미지 (title.png, calendar.png 등) */
export function themeImageUrl(themeId: ThemeId, filename: string): string {
  return `/theme-assets/${themeId}/images/${filename}`;
}

/** 테마 전용 아이콘 */
export function themeIconUrl(themeId: ThemeId, filename: string): string {
  return `/theme-assets/${themeId}/icons/${filename}`;
}
