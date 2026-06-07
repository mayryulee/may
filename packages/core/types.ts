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
    titleImage: string;
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
  calendarImage: string;
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
    imagePath: string;
    imageWidth: number;
    imageHeight: number;
  };
};

export function imageUrl(filename: string): string {
  return `/images/${filename}`;
}
