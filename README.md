# Weather App

OpenWeatherMap API를 활용한 날씨 앱입니다. 현재 위치 기반 날씨 조회, 대한민국 행정구역 검색, 즐겨찾기 관리 기능을 제공합니다.

## 프로젝트 실행 방법

### 사전 요구사항

- Node.js 18+

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 VITE_OPENWEATHERMAP_API_KEY=<발급받은 API 키> 입력

# 개발 서버 실행
npm run dev
```

### 테스트

```bash
# 유닛 테스트
npm test

# E2E 테스트
npx playwright install  # 최초 1회
npm run test:e2e
```

## 구현한 기능

### 현재 위치 날씨

- 앱 첫 진입 시 브라우저 Geolocation API로 현재 위치를 감지하여 해당 지역의 날씨를 표시합니다.
- 위치 권한 거부 시 서울(37.5665, 126.978)을 기본 위치로 사용합니다.
- 현재 기온, 체감 온도, 최저/최고 기온, 습도, 바람 속도를 표시합니다.
- Reverse Geocoding API를 활용하여 한글 도시명을 표시합니다.
- 시간대별 날씨 예보를 가로 스크롤 카드로 16개(48시간) 표시합니다.
  - OpenWeatherMap 무료 티어는 3시간 간격 예보만 제공하므로, 16개 × 3시간 = 48시간을 커버합니다.

### 장소 검색

- 시/도, 구/군, 동 단위로 대한민국 행정구역을 검색할 수 있습니다.
- `korea_districts.json` 데이터를 클라이언트 사이드에서 필터링하여 즉시 매칭 결과를 표시합니다.
- 300ms debounce를 적용하여 불필요한 연산을 줄입니다.
- 선택한 장소는 OpenWeatherMap Geocoding API로 좌표 변환 후 날씨를 조회합니다. 지역명은 한글로 표시됩니다.
- 키보드로 검색 결과를 탐색하고 선택할 수 있습니다.
- Geocoding 결과가 없는 경우 "해당 장소의 정보가 제공되지 않습니다." 메시지를 표시합니다.

### 즐겨찾기

- 검색한 장소를 즐겨찾기에 추가/삭제할 수 있습니다 (최대 6개).
- 각 즐겨찾기 카드에 현재 날씨, 최저/최고 기온을 표시합니다.
- 별칭(이름)을 인라인 편집으로 수정할 수 있습니다.
- 카드 클릭 시 상세 페이지로 이동하여 전체 날씨 정보를 확인할 수 있습니다. 상세 페이지에서도 설정한 별칭이 표시됩니다.
- localStorage에 저장하여 새로고침 후에도 유지됩니다.

### 반응형 디자인

- 375px 기준으로 설계 후 태블릿(768px), 데스크톱(1024px+)으로 확장합니다.
- 즐겨찾기 그리드: 1열(모바일) → 2열(sm) → 3열(lg)
- 시간대별 예보: 가로 스크롤(모바일) → 전체 표시(데스크톱)

### 로딩 상태

- Skeleton UI로 날씨 정보, 시간대별 예보, 즐겨찾기 카드의 로딩 상태를 처리합니다.
- React Suspense + ErrorBoundary 조합으로 선언적 비동기 처리를 구현합니다.

## 기술적 의사결정

### TanStack Query + Suspense (useSuspenseQuery)

`isLoading` 상태를 컴포넌트 내부에서 처리하는 대신, `useSuspenseQuery`로 데이터 페칭을 Suspense boundary에 위임합니다. 컴포넌트는 "데이터가 있는 상태"만 다루면 되어 코드가 단순해지고, Skeleton UI를 Suspense fallback으로 자연스럽게 연결할 수 있습니다.

### useSyncExternalStore (즐겨찾기 상태)

즐겨찾기 데이터는 localStorage에 저장되는 외부 상태입니다. `useSyncExternalStore`를 사용하여 localStorage 변경을 React 상태와 동기화합니다. 별도의 전역 상태 라이브러리 없이 React 내장 API만으로 외부 저장소 연동을 구현했습니다.

### Geolocation fallback 전략

위치 권한 거부, API 미지원, 타임아웃 등 모든 실패 케이스에서 에러 대신 서울 좌표로 fallback합니다. 사용자가 앱에 진입했을 때 항상 날씨 정보를 볼 수 있도록 하여 첫 인상을 개선했습니다.

### korea_districts.json 클라이언트 필터링

장소 검색은 서버 요청 없이 JSON 데이터를 클라이언트에서 직접 필터링합니다. debounce와 결과 개수 제한(최대 20개)으로 성능을 확보했습니다. Geocoding API는 선택된 장소를 좌표로 변환할 때만 호출합니다.

### Playwright E2E 테스트

API 모킹(`page.route`)과 Geolocation 모킹으로 외부 의존성 없이 안정적인 테스트를 구현했습니다. 모바일/데스크톱 두 뷰포트에서 동일한 테스트를 실행하여 반응형 동작을 검증합니다.

## 사용한 기술 스택

| 분류             | 기술                                |
| ---------------- | ----------------------------------- |
| **Core**         | React 19, TypeScript 5.9, Vite 6    |
| **Routing**      | React Router 7                      |
| **서버 상태**    | TanStack Query 5 (useSuspenseQuery) |
| **Styling**      | Tailwind CSS 4                      |
| **Unit Test**    | Vitest, Testing Library             |
| **E2E Test**     | Playwright                          |
| **Code Quality** | ESLint, Prettier                    |

## 프로젝트 구조

```
src/
├── app/              # 앱 진입점, 프로바이더, 라우터
├── pages/            # 페이지 컴포넌트 (홈, 상세)
├── widgets/          # 조합 UI (날씨 표시, 검색바, 즐겨찾기 목록)
├── features/         # 비즈니스 기능 (검색, 즐겨찾기 관리)
├── entities/         # 도메인 엔티티 (날씨, 위치)
└── shared/           # 공용 유틸, API 클라이언트, UI 컴포넌트
```
