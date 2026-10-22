# may — 모바일 청첩장 (mayletter.site)

Vite + TypeScript 정적 사이트. 클라이언트(신랑·신부)마다 `clients/<id>/config.ts` + 사진으로 청첩장 한 개.
main 브랜치에 푸시하면 Netlify가 자동 빌드·배포합니다.

## ⚠️ 작업 규칙 (반드시 지킬 것)

- **사용자가 "푸시해"라고 말하기 전에는 절대 `git push` / `npm run ship` 금지.** 푸시 = Netlify 배포 = 비용 발생.
  - 커밋은 요청 시 진행. 한 번 받은 푸시 허락은 그 한 번만 유효.
- **푸시 전 순서**: `npm run build` 성공 확인 → 마지막 줄 `root meta = sample01` 확인 → 푸시.
  (root meta 가 실제 고객이면 사이트 첫 주소 미리보기에 고객 정보가 노출됨)
- 커밋 분리: 공통 코드(themes/packages) 변경과 클라이언트 config 변경은 따로 커밋.
- 커밋하지 않는 것: `public/fonts/JejuMyeongjo-OFL.txt`(줄바꿈만 다름), `.claude/`, `*.swp`, `.env`
- 사용자가 에디터(VS Code)로 config 를 동시에 고치는 경우가 많음 → 파일 수정 전 어떤 파일을 고치는지 알리고,
  저장 충돌(Overwrite) 후에는 내 변경이 사라졌는지 다시 확인.
- git 작성자: `hanheeryu <mayryulee@gmail.com>` (저장소 로컬 설정). GitHub 계정은 mayryulee.

## 실행

```bash
npm install
npm run dev          # http://localhost:5173/<slug>  (사진·아이콘 교체 후엔 서버 재시작 필요)
npm run dev -- --host  # 같은 와이파이의 핸드폰에서 http://<Mac IP>:5173/<slug> 로 확인
npm run build        # 배포 전 확인용
```

- `--host` 로 핸드폰 확인 시 https 가 아니라 자동 복사가 안 될 수 있고, 카카오 지도·공유는 등록 도메인이 아니라 동작 안 함
  → 이 기능들은 배포 후 실제 사이트에서 확인.

- `.env` 는 git 에 없음 (카카오 키, Resend 키). 다른 PC 에서는 직접 복사해 와야 함.
- 주소 `/grace` `/tender` `/veil` = 테마 미리보기(sample01/sample02). `/` → `/grace` 로 이동.

## 구조

| 경로 | 내용 |
|---|---|
| `clients/<id>/config.ts`, `images/` | 클라이언트 데이터. `_template` 이 빈 양식 |
| `themes/theme01~03/` | 테마 (Grace / Tender / Veil) 섹션별 렌더링 |
| `packages/shared/` | 공통 로직, 설정 타입(`types.ts`) |
| `scripts/` | 빌드 전처리(레지스트리 생성·사진 복사), 프리렌더(OG 메타), 사진 축소 |
| `netlify/functions/` | 방명록·RSVP 저장, RSVP 메일 알림 |
| `docs/client-venue-checklist.md` | 예식장(주소) 변경 체크리스트 |

## 새 클라이언트 추가

1. `clients/sample01`(또는 `_template`)을 `clients/<id>` 로 복사. 폴더명 예: `client01_261015`
2. `config.ts` 의 `id`(=폴더명), `slug`(URL `/` 뒤, 겹치면 빌드 실패), `theme` 수정
3. 사진은 `images/` 에 정해진 파일명으로: `cover.png`(카톡 썸네일), `main01.png`, `sub01.png`, `calendar.png`,
   `gallery01~06.png`(처음 보이는 6장), `galleryp01~.png`(theme01 '더보기'로 4장씩). theme03 메인은 `main02.png`
4. 빈 `images/` 는 빌드 실패 → `.gitkeep` 유지
5. sample 을 복사했다면 예전 값이 남기 쉬움: 날짜 5종(`weddingAt` `year` `monthDay` `shortDate` `fullDateKo`),
   예식장(`venue` 전체, `venueShort`), 계좌, `meta.*`, `share.*`, RSVP 알림 이메일 → 전부 확인
6. 예식장 바뀌면 `docs/client-venue-checklist.md` 그대로 진행 (특히 `naverPlaceId`)

### 사진 줄이기

고객 원본은 장당 10~25MB → 반드시 웹용으로 축소.

```bash
npm run resize:images -- <clientId>            # gallery*/galleryp*/main*/sub* 전부
npm run resize:images -- <clientId> main01.png # 특정 파일만
```

긴 변 1600px JPEG(확장자는 .png 유지), 원본은 `~/Desktop/may_originals/<clientId>/` 에 자동 백업.
`cover.png`(580×800 세로 / 800×496 가로), `calendar.png` 는 제외.

## config 작성 문법

- **초대글 문단 간격**: `invitation.lines` 에 빈 문자열 `""` 을 넣은 자리에 24px 간격 (theme01).
  `""` 이 없으면 기존처럼 4번째 줄 앞 간격.
- **교통편 줄 간격**: `venue.location.theme01.transport[].lines` 의 `""` → 다음 줄 위 8px 간격.
- **강조**: 교통편 lines 에서 `"**신랑**"` → 살짝 두껍게 (제주명조는 굵기 1개라 0.4px 외곽선).
- **버스 종류 접두어**(`간선 :` `지선 :` `광역 :` `직행 :` 등)로 시작하면 12px 작은 글씨.
- **안내(information)·명언(quote)** 블록을 빼면 해당 섹션 숨김. theme01 은 안내가 없으면 방명록 상단 여백 자동 제거.
- **계좌 연락처** (theme01): `accounts.groom/bride[]` 항목에 `phone: "010-0000-0000"` 을 넣으면
  이름 옆 전화 아이콘(`themes/theme01/icons/phone.svg`, 14px) → 클릭 시 연락처 팝업 + 번호 자동 복사 + '전화 걸기'(tel:).
  `phone` 없는 사람은 아이콘 없음. 팝업은 방명록 삭제 팝업과 같은 스타일 재사용.
- **계좌 안내 문구** (theme01): `accounts.messageLines: ["소중한 마음 감사히 잘 받겠습니다."]` — 줄 단위 배열.
  생략 시 기본 문구("참석이 어려우신 분들을 위해 기재했습니다." / "너그러운 마음으로 양해 부탁드립니다.").
- **갤러리 썸네일 기준점** (theme01): 썸네일은 3:4 세로로 가운데 기준 잘림 → 가로 사진에서 인물이 잘리면
  `galleryThumbPosition: { "galleryp05.png": "right" }` 처럼 파일명별 CSS object-position 지정
  (`"left"` `"right"` `"70% center"` 등, 숫자 클수록 오른쪽). 크게 보기(팝업)는 항상 원본 전체.
- **전세버스 탑승 안내** (theme01): `venue.shuttle` 이 있으면 오시는 길 맨 아래에 '전세버스 탑승 안내' 흰 버튼
  → 누르면 안내 팝업(연락처 팝업과 같은 스타일, 길면 팝업 안 스크롤). 없으면 버튼도 없음.
  ```ts
  shuttle: {
    // title?: "전세버스 탑승 안내"  (버튼·팝업 제목, 기본값)
    introLines: ["먼 길 오시는 하객분들의 편안한 이동을 위해", "전세버스를 준비하였습니다."],
    groups: [
      { title: "신랑측 | 김해", stops: [{ place: "김해성당 앞", address: "경남 김해시 호계로 482", time: "출발 오전 7:10" }] },
      { title: "신부측 | 대구", note: "아래 두 장소를 순차적으로 경유하여 운행합니다.",
        stops: [
          { label: "1차 탑승 | 오전 8:00", place: "대구지방법원 앞", address: "대구 동대구로 364" },
          { label: "2차 탑승 | 오전 8:30", place: "홈플러스 성서점 앞", address: "대구 달구벌대로 1467" },
        ] },
    ],
    noticeLines: ["원활한 운행을 위해 출발시간 10분 전까지", "탑승 장소에 도착해 주시기 바랍니다."],
  },
  ```
  그룹마다 흰 카드. `stops` 가 2곳 이상이면 사이에 `↓`(장소 텍스트 너비 기준 가운데).
  장소명 옆에 주소가 나란히 나오고 좁으면 주소만 줄바꿈. `label` 은 장소 위, `time` 은 장소 아래.
  예전처럼 교통편(`transport`)에 버스 대절 줄글을 넣지 말 것.
- **참석 의사 팝업**: `rsvp.enabled: false` 면 팝업·메일 없음.
- **배경음악**: `bgm: { src: "bright.mp3" }` (음원은 `assets/audio/`). 블록 없으면 음악 없음.
- **지도 검색어**: `venue.name` 에 층·홀(예: `2F`)을 붙이면 카카오 검색 실패 → `mapSearchName` 에 검색용 이름 지정.
- **카톡 공유 설명 줄바꿈**: `share.description` 에 `\n`.
- 카톡 썸네일 방향: `share.kakaoTemplate: "vertical" | "horizontal"` (cover.png 비율과 맞출 것).

## 카카오

- 공유 버튼 → 커스텀 메시지 템플릿: 세로 `135014`, 가로 `135029` (ID 는 `netlify.toml`).
  코드가 넘기는 인자: `THU`(썸네일) `TITLE` `DESC` `SLUG`.
- 템플릿 링크(Kakao Developers → 카카오톡 메시지 → 템플릿):
  공통 링크와 **출처 링크(하단 "may >") 모두** 도메인 `https://mayletter.site` + Path `/${SLUG}`.
  출처 링크가 기본 도메인이면 `/` → `/grace`(sample01)로 열리는 문제가 생김 (2026-10 수정 완료).
- 링크 주소를 카톡에 직접 붙여넣으면 카카오가 OG 이미지로 미리보기를 만들어 **항상 가로로 잘림** — 코드로 제어 불가.
  그래서 '링크 복사' 버튼은 제거했고, 공유 버튼으로만 보내도록 함.
- 카톡 미리보기가 예전 내용이면 카카오 공유 디버거에서 캐시 초기화.

## 알려진 미지원 (주문서에는 있음)

상단 텍스트 컬러(theme01 제목은 이미지), 인사말 제목(고정 문구), 디데이 on/off, 갤러리 리스트/슬라이드 선택,
방명록 on/off, 명언 배경색 — 필요 시 config 옵션으로 추가 구현해야 함.
