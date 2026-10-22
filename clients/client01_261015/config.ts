import type { ClientConfig } from "../../packages/shared/types";

const config: ClientConfig = {
  id: "client01_261015",
  slug: "ywsj",
  theme: "theme01",
  expiresAt: "2027-02-28",

  meta: {
    title: "우혁♥지현 결혼합니다.",
    description:
      "2026년 11월 29일, Woohyeok & Jeehyeon의 모바일 청첩장에 소중한 분들을 초대합니다.",
    ogSiteName: "Woohyeok & Jeehyeon",
    ogTitle: "우혁♥지현 결혼합니다.",
    ogDescription: "11월 29일 일요일 오후 2시 더베일리하우스 삼성점 2층",
    // 카카오 썸네일 + OG 미리보기 공용 커버 (세로/가로 무관, 파일명 cover.png로 통일)
    ogImage: "cover.png",
    ogImageAlt: "우혁과 지현의 결혼식 초대",
    twitterTitle: "우혁♥지현 결혼합니다.",
    twitterDescription: "2026년 11월 29일, 소중한 분들을 초대합니다.",
  },

  couple: {
    groomEn: "Woohyeok",
    brideEn: "Jeehyeon",
    groomKo: "양우혁",
    brideKo: "송지현",
    groomGivenName: "우혁",
    brideGivenName: "지현",
    ddayLabel: "우혁 ♥ 지현",
  },

  weddingAt: "2026-11-29T14:00:00+09:00",

  header: {
    titleImageAlt: "Starting our life Together",
    year: "2026",
    monthDay: "11.29",
  },

  hero: {
    image: "main01.png",
    alt: "Woohyeok과 Jeehyeon 웨딩 사진",
  },

  calendar: {
    image: "calendar.png",
    alt: "예식 일정",
  },

  invitation: {
    lines: [
      "다정한 안부를 나누던 날들이 모여",
      "평생을 함께하기로 했습니다.",
      "서로의 매일을 응원하는 든든한 사랑이 되겠습니다.",
      "", // 문단 간격
      "부디 귀한 시간 내주시어 저희의 첫걸음을",
      "축복 해주시면 감사하겠습니다."
    ],
    groomParents: {
      parents: "양성규·김선정",
      relation: "아들",
      name: "양우혁",
    },
    brideParents: {
      parents: "송일재·신정규",
      relation: "딸",
      name: "송지현",
    },
    subImage: "sub01.png",
    subImageAlt: "웨딩 사진",
  },

  dateDisplay: {
    shortDate: "26.11.29",
    time: "pm 2:00",
    fullDateKo: "2026년 11월 29일 일요일 오후 2시",
    venueShort: "더베일리하우스 삼성점 2층",
  },

  venue: {
    name: "더베일리하우스 삼성점",
    address: "서울 강남구 영동대로 506",
    addressFull: "서울 강남구 영동대로 506(삼성동168-3)",
    tel: "02-539-2956",
    lat: 37.509788,
    lng: 127.06318,
    naverPlaceId: "520612610",
    // 전세버스 — 오시는 길에 '전세버스 탑승 안내' 버튼, 누르면 안내 팝업
    shuttle: {
      introLines: ["먼 길 오시는 하객분들의 편안한 이동을 위해", "전세버스를 준비하였습니다."],
      groups: [
        {
          title: "신랑측 | 김해",
          stops: [
            { place: "김해성당 앞", address: "경남 김해시 호계로 482", time: "출발 오전 7:10" },
          ],
        },
        {
          title: "신부측 | 대구",
          note: "아래 두 장소를 순차적으로 경유하여 운행합니다.",
          stops: [
            { label: "1차 탑승 | 오전 8:00", place: "대구지방법원 앞", address: "대구 동대구로 364" },
            { label: "2차 탑승 | 오전 8:30", place: "홈플러스 성서점 앞", address: "대구 달구벌대로 1467" },
          ],
        },
      ],
      noticeLines: ["원활한 운행을 위해 출발시간 10분 전까지", "탑승 장소에 도착해 주시기 바랍니다."],
    },
    location: {
      theme01: {
        transport: [
          {
            label: "주차(자가용) 이용 시",
            lines: [
              "내비게이션 '더베일리하우스 삼성점' 검색",
              "", // 문단 간격
              "더베일리하우스 앞에서 직원의 안내를 받으시면",
              "보다 편리하게 이용하실 수 있습니다.",
            ],
          },
          {
            label: "버스 이용 시",
            lines: [
              "삼성역 7번출구에서 하차",
              "간선 : 143. 146. 301. 342, 362, 401. N61 (심야)",
              "지선 : 2413, 2415, 3217. 3412, 3414. 3417, 4318, 4419",
              "광역 : 9407. 9507. 9607",
            ],
          },
          {
            label: "지하철 이용 시",
            lines: [
              "지하철 2호선 삼성역 8번출구 (도보 3분)",
              "지하철 9호선 봉은사역 6번출구 (도보 9분)",
            ],
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
            lines: [
              "건물 내 지하주차장 이용 안내"],
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
  // 썸네일 자르는 기준점 — 가로 사진에서 신랑·신부가 다 보이도록
  galleryThumbPosition: {
    "galleryp05.png": "right",
  },

  accounts: {
    messageLines: ["참석이 어려우신 분들을 위해",
      "부득이하게 계좌번호를 안내드립니다.",
      "너그럽게 양해부탁드립니다.",
    ],
    groom: [
      { relation: "신랑", name: "양우혁", bank: "카카오뱅크", number: "3333-14-0538904", phone: "010-4236-4274" },
      { relation: "신랑 아버지", name: "양성규", bank: "하나은행", number: "535-910309-64507", phone: "010-9330-7510" },
      { relation: "신랑 어머니", name: "김선정", bank: "하나은행", number: "259-910671-54807", phone: "010-2285-4274" },
    ],
    bride: [
      { relation: "신부", name: "송지현", bank: "하나은행", number: "899-910068-87707", phone: "010-8816-6282" },
      { relation: "신부 아버지", name: "송일재", bank: "카카오뱅크", number: "3333-25-4766517", phone: "010-5478-6282" },
      { relation: "신부 어머니", name: "신정규", bank: "im뱅크", number: "077-08-195229", phone: "010-3520-6282" },
    ],
  },

  share: {
    title: "우혁♥지현 결혼합니다.",
    // \n 위치에서 카카오 공유 메시지 설명이 줄바꿈됩니다
    description: "11월 29일 일요일 오후 2시\n더베일리하우스 삼성점 2층",
    kakaoTemplate: "vertical",
  },

  // 안내 사항(information)·명언(quote) 미사용 — 블록을 추가하면 다시 표시됩니다

  rsvp: {
    enabled: false,
    showOnLoad: true,
    title: "참석 의사 전달",
    subtitleLines: [
      "축하의 마음으로 참석해주시는",
      "모든 분들을 귀하게 모실 수 있도록",
      "참석 의사를 전달 부탁드립니다.",
    ],
    notify: {
      emails: ["maybrand@naver.com"],
    },
  },

  // 배경음악 (assets/audio/)
  bgm: {
    src: "bright.mp3",
  },
};

export default config;
