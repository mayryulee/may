import type { ClientConfig } from "../../packages/shared/types";

const config: ClientConfig = {
  id: "sample01",
  theme: "theme01",
  expiresAt: "2027-07-25",

  meta: {
    title: "정호♥채현 결혼합니다.",
    description:
      "2027년 4월 25일, Jeongho & Chaehyun의 모바일 청첩장에 소중한 분들을 초대합니다.",
    ogSiteName: "Jeongho & Chaehyun",
    ogTitle: "정호♥채현 결혼합니다.",
    ogDescription: "4월 25일 토요일 낮 11시 노블발렌티 대치점",
    ogImageAlt: "정호와 채현의 결혼식 초대",
    twitterTitle: "정호♥채현 결혼합니다.",
    twitterDescription: "2027년 4월 25일, 소중한 분들을 초대합니다.",
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

  weddingAt: "2027-04-25T11:00:00+09:00",

  header: {
    titleImageAlt: "Starting our life Together",
    year: "2027",
    monthDay: "04.25",
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
    lines: [
      "봄 햇살이 함께 했던 지난날,",
      "여러 해의 봄날 처럼",
      "앞으로도 햇살같은 봄날을 함께 하려 합니다.",
      "부디 귀한 시간 내주시어 저희의 봄날에 함께",
      "축복 해주시면 감사하겠습니다.",
    ],
    groomParents: {
      parents: "김종욱·최은희",
      relation: "아들",
      name: "김정호",
    },
    brideParents: {
      parents: "박중호·김혜진",
      relation: "딸",
      name: "박채현",
    },
    subImage: "sub01.png",
    subImageAlt: "웨딩 사진",
  },

  dateDisplay: {
    shortDate: "27.04.25",
    time: "am 11:00",
    fullDateKo: "2027년 4월 25일 일요일 오전 11시",
    venueShort: "노블발렌티 대치점",
  },

  venue: {
    name: "노블발렌티 대치점",
    address: "서울 강남구 영동대로 325",
    addressFull: "서울 강남구 영동대로 325 (대치동 983-1)",
    tel: "02-539-0400",
    lat: 37.505686,
    lng: 127.060155,
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
    { title: "sample2", lines: [] },
    { title: "sample3", lines: [] },
  ],

  quote: {
    stanzas: [
      ["사랑은 짧은 세월에 변하지 않고", "운명이 다할 때까지 견디는것"],
      ["만일 이것이 틀렸다면, 그렇게 밝혀졌다면"],
      ["나는 글을 쓰지 않았고,", "그 누구도 사랑을 안했다네"],
    ],
    attribution: "셰익스피어 소네트 116",
  },

  share: {
    title: "정호♥채현 결혼합니다.",
    description: "4월 25일 토요일 낮 11시 노블발렌티 대치점",
    imageWidth: 600,
    imageHeight: 800,
  },
};

export default config;
