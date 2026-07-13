import type { ClientConfig } from "../../packages/shared/types";

const config: ClientConfig = {
  id: "sample02",
  slug: "sample02",
  theme: "theme02",
  expiresAt: "2027-08-25",

  meta: {
    title: "정호♥채현 결혼합니다.",
    description:
      "2026년 5월 25일, Jeongho & Chaehyun의 모바일 청첩장에 소중한 분들을 초대합니다.",
    ogSiteName: "Jeongho & Chaehyun",
    ogTitle: "정호♥채현 결혼합니다.",
    ogDescription: "5월 25일 일요일 오전 11시 노블발렌티 대치점",
    // 카카오 썸네일 + OG 미리보기 공용 커버 (세로/가로 무관, 파일명 cover.png로 통일)
    ogImage: "cover.png",
    ogImageAlt: "정호와 채현의 결혼식 초대",
    twitterTitle: "정호♥채현 결혼합니다.",
    twitterDescription: "2026년 5월 25일, 소중한 분들을 초대합니다.",
  },

  couple: {
    groomEn: "Jeongho",
    brideEn: "Chaehyun",
    groomKo: "김정호",
    brideKo: "박채현",
    groomGivenName: "정호",
    brideGivenName: "채현",
    ddayLabel: "정호 ♥ 채현",
  },

  weddingAt: "2026-05-25T11:00:00+09:00",

  header: {
    titleImageAlt: "Some things just go together.",
    heroTitleLines: ["Some Things", "Just Go Together."],
    heroSubtitleLines: [
      "Saturday, May 25th 11:00 AM",
      "At Noblevalenti Daechi",
    ],
    year: "2026",
    monthDay: "05.25",
  },

  hero: {
    image: "main01.png",
    alt: "Jeongho와 Chaehyun 웨딩 사진",
  },

  calendar: {
    image: "calendar.png",
    alt: "예식 일정",
  },

  invitation: {
    introLines: [
      "정호와 채현의 결혼식에 초대합니다.",
      "사랑과 믿음으로 새 출발을 하고자 합니다.",
      "바쁘신 중에도 발걸음 해 주시어",
      "자리를 빛내 주시면 감사하겠습니다.",
    ],
    lines: [
      "봄 햇살이 함께 했던 지난날,",
      "여러 해의 봄날 처럼",
      "앞으로도 햇살같은 봄날을 함께 하려 합니다.",
      "부디 귀한 시간 내주시어 저희의 봄날에 함께",
      "축복 해주시면 감사하겠습니다.",
    ],
    groomParents: {
      parents: "김종욱 · 최은희의",
      relation: "아들",
      name: "김정호",
    },
    brideParents: {
      parents: "박중호 · 김혜진의",
      relation: "딸",
      name: "박채현",
    },
    subImage: "",
    subImageAlt: "",
  },

  dateDisplay: {
    shortDate: "26.05.25",
    time: "am 11:00",
    fullDateKo: "2026년 5월 25일 일요일 오전 11시",
    venueShort: "노블발렌티 대치점 B1F",
  },

  venue: {
    name: "노블발렌티 대치점",
    address: "서울시 강남구 영동대로 325",
    addressFull: "서울 강남구 영동대로 325 (대치동 983-1)",
    tel: "02-539-0400",
    lat: 37.507037,
    lng: 127.061892,
    naverPlaceId: "1634613412",
    location: {
      theme01: {
        transport: [
          {
            label: "자가용 이용 시",
            lines: [
              "내비게이션 '노블발렌티 대치점' 검색",
              "서울 강남구 영동대로 325 (대치동 983-1)",
            ],
          },
          {
            label: "버스 이용 시",
            lines: [
              "휘문고교사거리 하차 후 학여울역 방향 100m 직전",
              "간선 : 343, 401",
              "지선 : 4319",
              "일반 : 11-3, 917",
              "직행 : 500-2, 9407, 9507, 9607",
              "마을 : 강남01, 강남06",
            ],
          },
          {
            label: "지하철 이용 시",
            lines: [
              "2호선 삼성역 3번 출구 30m 전방에서 셔틀버스 운행",
              "(수시운행, 도보 이용시 7분 소요)",
            ],
          },
          {
            label: "주차장 안내",
            lines: ["건물 내 지하주차장 이용 안내"],
          },
        ],
      },
      theme02: {
        transport: [
          {
            label: "자가용",
            lines: [
              "내비게이션 '노블발렌티 대치점' 검색",
              "서울 강남구 영동대로 325 (대치동 983-1)",
            ],
          },
          {
            label: "버스",
            lines: [
              "휘문고교사거리 하차 후 학여울역 방향 100M 직전",
              "간선 : 343, 401 / 지선 : 4319 / 일반 : 11-3, 917",
              "직행 : 500-2, 9407, 9507, 9607 / 마을 : 강남01, 강남06",
            ],
          },
          {
            label: "지하철",
            lines: [
              "2호선 삼성역 3번 출구 30M 전방에서",
              "셔틀버스 운행 (수시운행, 도보 이용시 7분 소요)",
            ],
          },
          {
            label: "주차장",
            lines: ["건물 내 지하주차장 이용 안내"],
          },
        ],
      },
      theme03: {
        transport: [
          {
            label: "자가용",
            lines: [
              "내비게이션 '노블발렌티 대치점' 검색",
              "서울 강남구 영동대로 325 (대치동 983-1)",
            ],
          },
          {
            label: "버스",
            lines: [
              "휘문고교사거리 하차 후 학여울역 방향 100M 직전",
              "간선 : 343, 401 / 지선 : 4319 / 일반 : 11-3, 917",
              "직행 : 500-2, 9407, 9507, 9607 / 마을 : 강남01, 강남06",
            ],
          },
          {
            label: "지하철",
            lines: [
              "2호선 삼성역 3번 출구 30M 전방에서",
              "셔틀버스 운행 (수시운행, 도보 이용시 7분 소요)",
            ],
          },
          {
            label: "주차장",
            lines: ["건물 내 지하주차장 이용 안내"],
          },
        ],
      },
    },
  },

  gallery: [
    { src: "gallery01.png", alt: "갤러리 사진 1" },
    { src: "gallery02.png", alt: "갤러리 사진 2" },
    { src: "gallery03.png", alt: "갤러리 사진 3" },
    { src: "gallery04.png", alt: "갤러리 사진 4" },
    { src: "gallery05.png", alt: "갤러리 사진 5" },
    { src: "gallery06.png", alt: "갤러리 사진 6" },
  ],

  accounts: {
    groom: [
      { relation: "신랑", name: "김정호", bank: "신한은행", number: "123-45-67890" },
      { relation: "신랑 아버지", name: "김종욱", bank: "신한은행", number: "123-45-67891" },
      { relation: "신랑 어머니", name: "최은희", bank: "신한은행", number: "123-45-67892" },
    ],
    bride: [
      { relation: "신부", name: "박채현", bank: "신한은행", number: "123-45-67893" },
      { relation: "신부 아버지", name: "박중호", bank: "신한은행", number: "123-45-67894" },
      { relation: "신부 어머니", name: "김혜진", bank: "신한은행", number: "123-45-67895" },
    ],
  },

  information: [
    {
      title: "화환 반입 금지 안내",
      lines: [
        "축하해 주시는 마음만으로도 큰 기쁨입니다.",
        "식장 사정으로 3단 꽃화환은 정중히 사양하오니",
        "너른 양해 부탁드립니다.",
        "(부득이 화환을 보내실 경우 1단 쌀화환 또는",
        "호접란 화분만 가능합니다.)",
      ],
    },
    {
      title: "전세버스 안내",
      lines: [
        "하객분들의 편의를 위해",
        "전세버스를 운행합니다.",
        "",
        "출발 시간 및 장소를 확인하시어",
        "이용에 참고해 주시기 바랍니다.",
      ],
    },
  ],

  quote: {
    stanzas: [
      ["생애 끝날", "당신 손을 잡고 웃음 짓기를."],
      ["그 바람 이내 참을수 없어", "청혼합니다."],
      ["어여쁜 당신,", "나와 결혼합시다."],
    ],
    attribution: "- <법대로 사랑하라>, 노승아 -",
  },

  share: {
    title: "정호♥채현 결혼합니다.",
    description: "5월 25일 일요일 오전 11시 노블발렌티 대치점",
    kakaoTemplate: "horizontal",
  },

  rsvp: {
    enabled: true,
    showOnLoad: true,
    title: "참석 의사 전달",
    subtitleLines: [
      "축하의 마음으로 참석해주시는",
      "모든 분들을 귀하게 모실 수 있도록",
      "참석 의사를 전달 부탁드립니다.",
    ],
    notify: {
      emails: ["mayryulee@gmail.com"],
    },
  },
};

export default config;
