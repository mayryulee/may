# 카카오톡 세로형 미리보기 설정

카카오톡 **URL 붙여넣기**(링크 복사)는 카카오 서버가 이미지를 **가로 2:1(800×400)** 으로 잘라서 보여줍니다.  
**세로형 카드(1번 예시)** 는 **「카카오톡으로 청첩장 전하기」버튼 + 커스텀 템플릿**으로만 가능합니다.

## 1. 카카오 Developers 사전 설정 (4002 오류 시 필수 확인)

1. [Kakao Developers](https://developers.kakao.com) → 내 앱
2. **앱 > 제품 링크 관리 > 웹 도메인**에 등록:
   - `https://formayletter.netlify.app`
3. **앱 > 플랫폼 키 > JavaScript 키 > JavaScript SDK 도메인**에 등록:
   - `https://formayletter.netlify.app`
   - `http://localhost:5173` (로컬 테스트)
4. **카카오톡 공유** 제품 상태가 **ON** 인지 확인

## 2. 메시지 템플릿 (ID: 133867)

템플릿 유형에 따라 코드 호출 방식이 다릅니다.

### A) 사용자 인자 방식 (기본, `sendCustom`)

템플릿에서 아래 **사용자 인자** 키를 사용:

| 인자 키 | 값 |
|---------|-----|
| `title` | 정호♥채현 결혼합니다. |
| `description` | 4월 25일 토요일 낮 11시 노블발렌티 대치점 |
| `image` | OG 이미지 URL |

- **사용 목적**: `카카오톡 공유`
- **이미지 사이즈**: 600 × 800, Center Crop
- **버튼**: 모바일 청첩장 보기 → `https://formayletter.netlify.app/`

### B) 스크랩 변수 방식 (`sendScrap`)

템플릿에서 `${SCRAP_IMAGE}`, `${SCRAP_TITLE}` 등을 쓴 경우:

`.env`에 추가:
```
VITE_KAKAO_SHARE_METHOD=scrap
```

## 3. 환경 변수

`.env` (로컬) 및 Netlify 환경 변수:

```
VITE_KAKAO_SHARE_TEMPLATE_ID=133867
VITE_KAKAO_MAP_APP_KEY=발급받은_JavaScript_키
# 스크랩 템플릿(${SCRAP_*})일 때만:
# VITE_KAKAO_SHARE_METHOD=scrap
```

재배포 후 **카카오 공유 디버거**에서 캐시 초기화:
https://developers.kakao.com/tool/debugger/sharing

## 4. 테스트 방법

| 방법 | 미리보기 |
|------|----------|
| **노란 「카카오톡으로 청첩장 전하기」 버튼** | 세로형 카드 (600×800) |
| **링크 복사 후 붙여넣기** | 가로형(2:1) — 카카오 제한 |

세로형을 보려면 반드시 **공유 버튼**을 사용하세요.

## 5. 4002 오류 해결 체크리스트

1. Template ID가 **앱 ID가 아닌** 메시지 템플릿 ID(133867)인지 확인
2. **제품 링크 관리 > 웹 도메인**에 `https://formayletter.netlify.app` 등록
3. 템플릿 **사용 목적**이 `카카오톡 공유`인지 확인
4. 사용자 인자를 쓴 템플릿이면 `sendCustom` + `templateArgs` 필요 (코드 기본값)
5. `${SCRAP_*}` 템플릿이면 `VITE_KAKAO_SHARE_METHOD=scrap` 설정
