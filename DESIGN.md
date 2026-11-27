# Alkok (알콕) Design Direction (`DESIGN.md`)

> Design data specification for `alkok-fe`.
> Treat this document as design tokens, visual hierarchy, and layout data.

---

## 1. Core Direction & Identity

- **Brand Name**: 알콕 (`Alkok`) / Repository & CSS Prefix: `alkok` (never `Alcock`)
- **Slogan**: `AI 정보, 알맹이만 콕.`
- **Audience**: 한국 실무 직장인·지식근로자 (Korean-only MVP, light-first editorial reading with full dark/system parity)
- **Dial**: `ENERGY 2 / RHYTHM 2 / MOTION 1`
- **Brand Personality**:
  1. **명쾌함 (Clear)**: 과장된 수식어를 빼고 조건·비용·한계를 투명하게 전달한다.
  2. **검증된 신뢰 (Verified)**: 출처 유형, 최종 확인일, 3단계 유효성 배지를 UI 전면에 고정한다.
  3. **실용성 (Actionable)**: 프롬프트 복사, 공식 서비스 이동, 보관함 저장 등 즉시 실행 가능한 액션을 우선한다.
  4. **가벼운 정돈 (Neat)**: 장문 정보와 비교 데이터를 다루되 시각적 잡음 없이 정돈된 작업실 인상을 유지한다.

### Reference Synthesis (Role-Separated, Non-Cloning)
- **`toss.tech` / TDS**: 한국어 에디토리얼 타이포그래피와 여백 리듬, `(public)`·`(vault)` 목록 및 요약 블록의 보더리스/표면 톤(surface tint) 위계, 모바일(`390×844`) 하단 탭 및 `Sheet` 터치 조작성, 친절하고 직관적인 한국어 마이크로카피.
- **`Notion`**: `/vault` 개인 지식 보관함의 1단계 폴더·태그 레일 및 인라인 메모 미리보기, 장문 업무 가이드 본문(`max-w-3xl`)의 방해 없는 집중 읽기 경험.
- **`Stripe Docs`**: 가이드 상단 구조화 "알맹이 요약" 카드, `PromptCopyBlock`, 우측 sticky 목차(TOC), `/tools/compare` AI 도구 비교표 및 `/admin` 2단 분할 검수(`AdminReviewSplitView`)의 고밀도 `Compact` 정밀성.

---

## 2. Liveliness & Identity Motif

- **One Focal Point Per Screen**:
  - `/` (홈): 컴팩트 헤더 + 실시간 카탈로그 검색(`/`) + 단일 탭 디렉터리(`업무 가이드` · `AI 도구` · `AI 소식`)
  - `/guides/[slug]`: 상단 알맹이 요약 카드 + 현재 실행 단계
  - `/tools/compare`: AI 도구 비교표 + `차이점만 보기` 토글
  - `/vault`: 저장된 자료 리스트 + `+ 외부 URL 저장` 액션
  - `/admin/inbox`: 50:50 원문·초안 분할 검수 뷰
- **One Deliberate Accent**:
  - Electric Blue (`--primary`, OKLCH `#2563EB` 계열)는 **주요 CTA 버튼, 활성 내비게이션/탭 표시, 포커스 링(`--ring`), 인터랙티브 링크**에만 사용한다.
  - 카드 배경, 장식 아이콘, 배지, 구분선 전체에 파란색을 남발하지 않는다.
- **Identity Motif ("콕" Precision System)**:
  1. **Pinpoint Dot**: 워드마크(`alkok.`) 및 활성 상태에 쓰이는 작은 핀 포인트 도트로 "알맹이만 콕" 정체성을 표현한다. (장식용 무한 펄스·글로우 금지)
  2. **Verification Stamp Bar**: 모든 가이드·도구·소식 상단에 고정되는 `VerificationBadge` 스트립(`유효` / `확인 필요` / `만료` + `verifiedAt` + 출처 유형).
  3. **알맹이 요약 Tinted Block**: 가이드·소식 본문 상단에 배경 톤(`--surface-sunken`)으로 분리된 핵심 결론 블록.
- **Whitespace as Structure**:
  - 공개 페이지 섹션 간 `32px ~ 56px`의 충분한 수직 여백을 두어, 모든 그룹을 박스로 감싸지 않아도 자연스럽게 구획이 나뉘도록 한다.

---

## 3. Surface, Elevation & Radius Strategy (Dual-Surface Rule)

### 3.1 Public `(public)` & Vault `(vault)` : Toss-Style Surface Tint + Catalog Outline (`Comfortable` 밀도)
- **Tonal Layering & Catalog Cards**: 기본 목록·요약 블록은 `--background`, `--card`, `--surface-sunken`의 명도 차이와 `1px` 헤어라인(`--separator`)으로 계층을 나누며, `/` 카탈로그와 디렉터리 그리드 카드(`ContentCard`, `ToolSpecCard`)는 `variant="outline"`(`1px solid var(--border)`)로 카드 경계를 명료하게 유지해 스캔 속도를 높인다.
- **Tinted Callouts**: 알맹이 요약, 빈 상태 안내, 핵심 강점/실무 영향 블록은 그림자 없이 `--surface-sunken` 또는 `--card` 위에 배치하며, 호버 시 배경 톤 또는 보더 톤만 부드럽게 전환한다.
- **Dark Mode Parity**: 다크 모드(`.dark`)에서는 `--background` (`--alkok-slate-950`), `--card` (`--alkok-slate-900`), `--surface-sunken`의 명도 대비와 함께, 면 구분이 약해지는 카드·패널에만 반투명 `1px` 보더(`--border`: `oklch(1 0 0 / 12%)`)를 보조 적용한다.

### 3.2 Precision & High-Density Surfaces : Stripe/shadcn `1px` Border (`Compact` 밀도)
- `/tools/compare` AI 도구 비교표, `PromptCopyBlock`, `/admin/**` 관리 테이블 및 50:50 `AdminReviewSplitView`, 폼 입력 컨트롤은 선명한 `1px` 보더(`--border`, `--prompt-border`, `--input`)와 `Compact` 행 높이(`36~40px`)를 유지한다.

### 3.3 Floating Overlays & Radius Scale
- **Elevation**: `--shadow-elevated`는 플로팅 요소(`Popover`, `DropdownMenu`, `Dialog`, `Sheet`, `Toast`, 하단 플로팅 비교 트레이)에만 사용한다. 일반 카드·사이드바·테이블에는 그림자를 쓰지 않는다.
- **Radius Scale**:
  - `xs`: `4px` (체크박스, 소형 태그)
  - `sm`: `6px` (배지, 필터 칩)
  - `md`: `8px` (기본 버튼, 인풋, 셀렉트)
  - `lg`: `12px` (콘텐츠 카드, 프롬프트 블록)
  - `xl`: `16px` (히어로 검색 컨테이너, 요약 콜아웃, 모바일 시트/모달)
  - `full`: 상태 필(`VerificationBadge`) 및 아바타 전용 (카드·인풋·일반 버튼 전체를 알약형으로 만들지 않는다)

---

## 4. Color System (Mapped to `packages/ui/src/styles/tokens.css`)

- **Core Palette Cap**: 중립 쿨 슬레이트(`--alkok-slate-*`) + 단일 Primary Accent 일렉트릭 블루(`--alkok-blue-600` 라이트 / `--alkok-blue-500` 다크).
- **Zero-Collision Status Palette**: 3단계 유효성 배지와 파괴적 액션은 Emerald(`--status-valid-*`), Amber(`--status-review-*`), Rose(`--status-expired-*`, `--destructive`)로 분리하여 Primary Blue와 색상 충돌을 `0%`로 차단한다.
- **Token-Only Rule**: 컴포넌트 코드에 하드코딩 Hex(`#...`), `bg-white`, `text-black`, 임의 Tailwind 색상(`bg-blue-500` 등)을 작성하지 않는다.
- **Layer 2 Semantic Tokens**:
  - Canvas & Surfaces: `--background`, `--foreground`, `--card`, `--card-foreground`, `--surface-raised`, `--surface-sunken`, `--separator`, `--overlay-scrim`
  - Overlays & Sidebar: `--popover`, `--popover-foreground`, `--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`
  - Interactive & Borders: `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`
- **Layer 3 Domain Tokens**:
  - `--status-valid-bg`, `--status-valid-fg`, `--status-valid-border`
  - `--status-review-bg`, `--status-review-fg`, `--status-review-border`
  - `--status-expired-bg`, `--status-expired-fg`, `--status-expired-border`
  - `--badge-official-bg`, `--badge-official-fg`, `--badge-affiliate-bg`, `--badge-affiliate-fg`
  - `--prompt-surface`, `--prompt-border`, `--image-outline`
- **Theme & Contrast**: 라이트 + 다크 + 시스템(`next-themes`)을 모두 지원한다. 라이트 모드를 기본 읽기 기준선으로 삼고, 양 모드 모두 WCAG AA(본문 `≥ 4.5:1`, 큰 텍스트/UI 경계 `≥ 3:1`) 및 `@media (prefers-contrast: more)`를 준수한다.

---

## 5. Typography (`Pretendard Variable` + `JetBrains Mono`)

- **Font Stack**: 자체 호스팅 `next/font/local` (`--font-pretendard`, `--font-jetbrains-mono`), 외부 CDN 의존 없음.
- **Korean-First Scale**:
  - **Display / H1**: `28px ~ 32px` / 행간 `1.28` / `700` / 자간 `-0.025em`
  - **H2**: `22px ~ 24px` / 행간 `1.35` / `700` / 자간 `-0.02em`
  - **H3**: `18px` / 행간 `1.4` / `600` / 자간 `-0.015em`
  - **H4**: `16px` / 행간 `1.45` / `600`
  - **Body (UI)**: `15px` / 행간 `1.55` / `400`
  - **Body (Reading)**: `16px` / 행간 `1.72` / `400` (`max-w-[68ch]` / `max-w-3xl`)
  - **Small / Meta**: `13px` / 행간 `1.45` / `400 ~ 500`
  - **Caption / Badge**: `12px` / 행간 `1.3` / `500`
  - **Mono**: `13px ~ 14px` / 행간 `1.6` / `400`
- **Tabular Numbers**: 도구·모델 비교표의 가격, 무료 한도, 컨텍스트 길이, 수치 카운트, 날짜(`YYYY-MM-DD`)에는 `tabular-nums`를 필수 적용한다.
- **Mono Purpose-Gate**: `JetBrains Mono`는 `PromptCopyBlock` 복사 블록, 모델 버전/슬러그, 비교 수치 정렬에만 사용한다. 장식용 페이지 헤딩이나 자간이 넓은 대문자 라벨(`HOW IT WORKS`)에는 사용하지 않는다.

---

## 6. Layout Rhythm, Navigation Shell & Responsive Rules

### 6.1 Home (`/`) Service Intro + Tabbed Catalog (`RHYTHM 2`)
홈 첫 화면은 `sphereai.work`의 명확한 서비스 소개·활용법과 `getskillbook.com`의 즉시 탐색 가능한 카탈로그를 결합해 구성한다. (도구 비교는 `/tools/compare` 전용으로 분리)
1. **서비스 소개 히어로 (기본 `/` 진입 시)**: 서비스 한 줄 정체성(`흩어진 AI 정보, 실무에 바로 쓰는 알맹이만 콕.`), 2줄 설명, 비교표·보관함 바로가기, 실시간 4축 통계(`업무 가이드`, `AI 도구·모델`, `최신 AI 소식`, `최근 검증일`). (업무 도메인 필터 활성 시 컴팩트 도메인 헤더로 자동 축약)
2. **3단계 활용법 밴드**: `01 막힌 업무 찾기` · `02 프롬프트·도구 바로 적용` · `03 보관함에 콕 저장` (서비스 소개 바로 아래, 카탈로그 상단 배치)
3. **풀폭 실시간 검색바**: `/` 단축키 지원, 입력 즉시 현재 탭 목록 필터링 + URL `?q=` 동기화
4. **1줄 탭·필터 컨트롤 바**: `업무 가이드` (기본) · `AI 도구` · `AI 소식` 탭 + `업무 분야` / `세부 조건` 드롭다운 + `저장한 항목` 토글 (`?tab`, `?domain`, `?use`, `?saved=1` 동기화)
5. **3열 카탈로그 그리드**: 1px `outline` 카드(`ContentCard` / `ToolSpecCard`). `ContentCard`는 상단 도메인 아이콘·라벨 + 아이콘 북마크(`iconOnly`), `break-keep` 제목·요약, 보더리스 보조 태그, 하단 `VerificationBadge` + `가이드 열기 →` 풋터로 구성해 1초 스캔 가독성을 확보 + 하단 플로팅 `CompareTray`

### 6.2 Container Widths
- 가이드 상세 본문: `max-w-3xl` (`768px`)
- 디렉터리·비교표·보관함: `max-w-6xl` (`1152px`)
- `/admin` CMS: `max-w-7xl` 또는 전체 폭

### 6.3 Navigation Shells & `390×844` Mobile-First
- **Desktop `(public)` / `(vault)`**: 좌측 고정 사이드바(`w-60`, `w-16` 접기 지원), 로고 + `⌘K` 빠른 검색 트리거 + `탐색`(`홈 · 업무 가이드 · AI 도구·모델 · 도구 비교 · AI 소식` + 건수 배지) + `업무별 탐색`(6개 도메인 `/?domain=<slug>` + 건수 배지) + `워크스페이스`(`내 보관함` 건수 배지) + 테마 토글 + 로그인/계정 메뉴.
- **Mobile (`390×844`)**:
  - 상단 간결 헤더(`h-14`): 로고 + 검색 아이콘(풀스크린 검색 시트) + 메뉴 `Sheet`
  - 하단 고정 4탭 바(`홈 · 가이드 · 도구 · 보관함`): 데스크톱 사이드바와 완전 격리 (`fixed inset-x-0 bottom-0 top-auto h-16 pb-[env(safe-area-inset-bottom)]`), `top: 0` 상속 금지.
  - 모든 `(public)` / `(vault)` 본문 컨테이너 하단에 `pb-20 md:pb-8` 안전 여백 적용.
- **`(admin)` Shell**: 데스크톱 좌측 고정 사이드바(`w-60`, `compact` 밀도) + 브레드크럼 바; 모바일은 상단 바 + `Sheet` 드로어.
- **Touch & Overflow**: 모바일 인터랙티브 터치 타깃 최소 `44×44px`, `390×844` 기준 가로 스크롤 오버플로 `0건`.

---

## 7. Core Domain Components (6 Signatures)

1. **`VerificationBadge`** (`entities/content/ui`): 3단계(`유효` / `확인 필요` / `만료`) 배지 + `verifiedAt` + 출처 유형(`공식` / `전문 미디어` / `커뮤니티`). 호버/탭 시 Tooltip(모바일은 Popover)으로 출처 근거 표시.
2. **`PromptCopyBlock`** (`entities/guide/ui`): `JetBrains Mono` + `--prompt-surface` + `1px solid var(--prompt-border)`, `[입력 변수]` 하이라이트, 우측 상단 원클릭 복사 버튼 및 2초 체크 피드백.
3. **`ToolCompareTable`** (`widgets/tool-compare/ui`): AI 도구 비교표, `1px` 보더(`Compact` 밀도), `tabular-nums`, `차이점만 보기` 토글. 데스크톱 좌측 도구명 `sticky`, 모바일(`390px`)은 카드 스택 기본 + 2~3개 선택 시 좌측 속성 컬럼 `sticky` 횡비교 전환.
4. **`ContentCard`** (`entities/content/ui`): `(public)`/`(vault)`에서 보더리스 또는 옅은 `--surface-sunken` 톤 기반으로 구성하며 호버 시 배경 톤 전환(그림자 없음). 유형 배지, 제목, 2줄 요약, 이중 분류 태그, `VerificationBadge`, `도움됨` 수, 북마크 슬롯 포함. Skeleton 로딩 상태 필수.
5. **`BookmarkAction`** (`features/vault-save/ui`): `보관함에 콕 담기` / `저장됨` 토글. 저장 후 데스크톱 `Popover`, 모바일 `Sheet`로 1단계 폴더·태그·메모 퀵 편집.
6. **`AdminReviewSplitView`** (`widgets/admin-review/ui`): `Compact` 밀도 + `1px` 보더. 데스크톱 `50:50` 분할(좌: 원문 URL·출처 근거 / 우: AI 한국어 초안 에디터·승인/반려), 모바일 `원문` / `초안 편집` 탭 전환.

---

## 8. Icons, Motion, Copywriting & Anti-Slop Guardrails

- **Icons**: 하이브리드 아이콘 시스템을 적용한다. 핵심 내비게이션 7종(`홈 · 업무 가이드 · AI 도구·모델 · 도구 비교 · 스킬·플러그인 · AI 소식 · 내 보관함`)은 알콕 전용 커스텀 SVG(비활성 `1.6px` 라인 ↔ 활성 듀오톤 채움)를 사용하고, 셸·검색 유틸리티 아이콘은 `@phosphor-icons/react`(`regular`/`duotone`)를 우선 적용하며 나머지 페이지는 점진 전환한다. AI 클리셰 아이콘(`Sparkles`, `Wand`, `Bot`, `Brain`, `Zap`의 장식 사용), 3D/토스페이스풍 글로시 일러스트, UI 텍스트·헤딩 내 이모지는 전면 금지한다.
- **Button Arrows**: `↗` 화살표는 외부 공식 AI 서비스로 이동하는 핸드오프 CTA(`공식 사이트에서 바로 쓰기 ↗`)에만 사용하여 이탈 방향을 알린다. 내부 이동 버튼에는 붙이지 않는다.
- **Motion (`MOTION 1`)**: 호버, 프레스, `Sheet`/모달 전환에만 절제된 트랜지션(`150~200ms ease-out`)을 사용한다. 패럴랙스, 바운스, 플로팅, 무한 펄스 도트, 스크롤 리빌 연출은 금지한다. `prefers-reduced-motion: reduce`를 준수한다.
- **Copywriting**:
  - 안내·빈 상태는 부드러운 해요체(`아직 담아둔 자료가 없어요. 유용한 AI 가이드나 외부 URL을 콕 저장해 보세요.`), 버튼·탭은 간결한 명사/동사형(`보관함에 콕 담기`, `비교하기`)을 사용한다.
  - Em dash(`U+2014`) 사용 금지. 쉼표(`,`), 가운뎃점(`·`), 콜론(`:`), 괄호(`()`)로 대체한다.
  - AI 과장 버즈워드(`혁신적인`, `AI 기반`, `최고의`, `차세대`), 맥락 없는 CTA(`시작하기`, `더 알아보기`), 가짜 통계·가상 후기·더미 인물(`John Doe` 등) 금지.
  - 모든 Empty / Loading / Error 상태는 원인과 다음 행동을 구체적으로 명시한다.
- **Accessibility & Interactive Discipline**:
  - 클릭 가능한 `div`/`span` 금지, 네이티브 `<button>`과 `<a href>` 사용.
  - 활성 컨트롤은 `cursor: pointer`, 비활성 컨트롤은 `cursor: not-allowed`, 아이콘 전용 버튼에는 한국어 `aria-label` 필수.
  - 모든 포커스 가능 요소에 `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` 유지, `Tab`/`Enter`/`Escape` 키보드 조작 보장.
