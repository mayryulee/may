import type { ClientConfig } from "../../packages/shared/types";

const config: ClientConfig = {
  id: "CLIENT_ID",
  theme: "theme01",
  expiresAt: "YYYY-MM-DD",

  meta: {
    title: "신랑♥신부 결혼합니다.",
    description: "모바일 청첩장에 소중한 분들을 초대합니다.",
    ogSiteName: "신랑 & 신부",
    ogTitle: "신랑♥신부 결혼합니다.",
    ogDescription: "예식 일시·장소",
    ogImageAlt: "결혼식 초대",
    twitterTitle: "신랑♥신부 결혼합니다.",
    twitterDescription: "소중한 분들을 초대합니다.",
  },

  couple: {
    groomEn: "Groom",
    brideEn: "Bride",
    groomKo: "신랑",
    brideKo: "신부",
    groomGivenName: "신랑",
    brideGivenName: "신부",
    ddayLabel: "신랑 ♥ 신부",
  },

  weddingAt: "2026-01-01T12:00:00+09:00",

  header: {
    titleImageAlt: "Wedding title",
    year: "2026",
    monthDay: "01.01",
  },

  hero: {
    image: "main01.png",
    alt: "웨딩 사진",
  },

  calendar: {
    image: "calendar.png",
    alt: "예식 일정",
  },

  invitation: {
    lines: ["초대 인사말을 입력해 주세요."],
    groomParents: { parents: "아버지 · 어머니의", relation: "아들", name: "신랑" },
    brideParents: { parents: "아버지 · 어머니의", relation: "딸", name: "신부" },
    subImage: "sub01.png",
    subImageAlt: "웨딩 사진",
  },

  dateDisplay: {
    shortDate: "26.01.01",
    time: "pm 12:00",
    fullDateKo: "2026년 1월 1일",
    venueShort: "예식장명",
  },

  venue: {
    name: "예식장명",
    address: "주소",
    addressFull: "상세 주소",
    tel: "02-000-0000",
    lat: 37.5,
    lng: 127.0,
    naverPlaceId: "",
    location: {
      theme01: {
        transport: [{ label: "오시는 길", lines: ["안내 문구를 입력해 주세요."] }],
      },
      theme02: {
        transport: [{ label: "오시는 길", lines: ["안내 문구를 입력해 주세요."] }],
      },
      theme03: {
        transport: [{ label: "오시는 길", lines: ["안내 문구를 입력해 주세요."] }],
      },
    },
  },

  gallery: [{ src: "gallery01.png", alt: "갤러리 사진 1" }],

  accounts: {
    groom: [{ relation: "신랑", name: "신랑", bank: "은행", number: "000-00-00000" }],
    bride: [{ relation: "신부", name: "신부", bank: "은행", number: "000-00-00000" }],
  },

  information: [{ title: "안내 사항", lines: ["내용을 입력해 주세요."] }],

  quote: {
    stanzas: [["명언 또는 인용문"]],
    attribution: "출처",
  },

  share: {
    title: "신랑♥신부 결혼합니다.",
    description: "예식 일시·장소",
    imageWidth: 600,
    imageHeight: 800,
  },
};

export default config;
