import { cn } from "@alkok/core";

export interface NavIconProps {
  active?: boolean;
  className?: string;
}

/**
 * 홈: 건축적 아치 프레임 + 중심 핀포인트("콕.") 코어
 */
export const HomeNavIcon = ({ active = false, className }: NavIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    {active ? (
      <path
        d="M3.5 9.2L10 3.75L16.5 9.2V15.5C16.5 16.3284 15.8284 17 15 17H5C4.17157 17 3.5 16.3284 3.5 15.5V9.2Z"
        fill="currentColor"
        fillOpacity={0.16}
      />
    ) : null}
    <path
      d="M3.5 9.2L10 3.75L16.5 9.2V15.5C16.5 16.3284 15.8284 17 15 17H5C4.17157 17 3.5 16.3284 3.5 15.5V9.2Z"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {active ? (
      <circle cx="10" cy="12" r="1.75" fill="currentColor" />
    ) : (
      <path
        d="M8.5 17V12.5C8.5 11.6716 9.17157 11 10 11C10.8284 11 11.5 11.6716 11.5 12.5V17"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

/**
 * 업무 가이드: 플레이북 카드 + 좌측 스파인 노치 + 2단 스텝 라인
 */
export const GuideNavIcon = ({ active = false, className }: NavIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    {active ? (
      <rect
        x="3.5"
        y="3"
        width="13"
        height="14"
        rx="2.5"
        fill="currentColor"
        fillOpacity={0.16}
      />
    ) : null}
    <rect
      x="3.5"
      y="3"
      width="13"
      height="14"
      rx="2.5"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 3V17"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinecap="round"
    />
    <path
      d="M9.75 7.5H13.5M9.75 11.5H12.5"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * AI 도구·모델: 2x2 모듈형 그리드 (우상단 다이아몬드 액센트 노드)
 */
export const ToolsNavIcon = ({ active = false, className }: NavIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    {active ? (
      <>
        <rect x="3.25" y="3.25" width="5.5" height="5.5" rx="1.4" fill="currentColor" fillOpacity={0.18} />
        <rect x="3.25" y="11.25" width="5.5" height="5.5" rx="1.4" fill="currentColor" fillOpacity={0.18} />
        <rect x="11.25" y="11.25" width="5.5" height="5.5" rx="1.4" fill="currentColor" fillOpacity={0.18} />
        <rect
          x="14"
          y="2.4"
          width="4.5"
          height="4.5"
          rx="1"
          transform="rotate(45 14 2.4)"
          fill="currentColor"
          fillOpacity={0.28}
        />
      </>
    ) : null}
    <rect
      x="3.25"
      y="3.25"
      width="5.5"
      height="5.5"
      rx="1.4"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinejoin="round"
    />
    <rect
      x="3.25"
      y="11.25"
      width="5.5"
      height="5.5"
      rx="1.4"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinejoin="round"
    />
    <rect
      x="11.25"
      y="11.25"
      width="5.5"
      height="5.5"
      rx="1.4"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinejoin="round"
    />
    <rect
      x="14"
      y="2.4"
      width="4.5"
      height="4.5"
      rx="1"
      transform="rotate(45 14 2.4)"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 도구 비교: 좌우 균형 비교 컬럼 + 정렬 눈금
 */
export const CompareNavIcon = ({ active = false, className }: NavIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    {active ? (
      <>
        <rect x="3" y="3.5" width="5.5" height="13" rx="1.5" fill="currentColor" fillOpacity={0.16} />
        <rect x="11.5" y="3.5" width="5.5" height="13" rx="1.5" fill="currentColor" fillOpacity={0.16} />
      </>
    ) : null}
    <rect
      x="3"
      y="3.5"
      width="5.5"
      height="13"
      rx="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinejoin="round"
    />
    <rect
      x="11.5"
      y="3.5"
      width="5.5"
      height="13"
      rx="1.5"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinejoin="round"
    />
    <path
      d="M5 7.5H6.5M5 11.5H6.5M13.5 7.5H15M13.5 11.5H15"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 스킬·플러그인: 코어 모듈 + 우상단 결합 확장 블록
 */
export const SkillsNavIcon = ({ active = false, className }: NavIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    {active ? (
      <>
        <rect x="3.25" y="7" width="9.75" height="9.75" rx="2.2" fill="currentColor" fillOpacity={0.16} />
        <rect x="10.25" y="3.25" width="6.5" height="6.5" rx="1.6" fill="currentColor" fillOpacity={0.26} />
      </>
    ) : null}
    <path
      d="M10.25 7H5.45C4.23497 7 3.25 7.98497 3.25 9.2V14.55C3.25 15.765 4.23497 16.75 5.45 16.75H10.8C12.015 16.75 13 15.765 13 14.55V9.75"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="10.25"
      y="3.25"
      width="6.5"
      height="6.5"
      rx="1.6"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * AI 소식: 에디토리얼 브리핑 카드 + 코너 시그널 도트
 */
export const NewsNavIcon = ({ active = false, className }: NavIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    {active ? (
      <rect
        x="3"
        y="3.5"
        width="14"
        height="13"
        rx="2.5"
        fill="currentColor"
        fillOpacity={0.16}
      />
    ) : null}
    <rect
      x="3"
      y="3.5"
      width="14"
      height="13"
      rx="2.5"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinejoin="round"
    />
    <path
      d="M6.25 8H11M6.25 11.75H13.75"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinecap="round"
    />
    <circle cx="13.5" cy="7.5" r="1.25" fill="currentColor" />
  </svg>
);

/**
 * 내 보관함: 정제된 아카이브 리본 + 활성 시 내부 핀포인트 도트
 */
export const VaultNavIcon = ({ active = false, className }: NavIconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    {active ? (
      <path
        d="M5 4.5C5 3.67157 5.67157 3 6.5 3H13.5C14.3284 3 15 3.67157 15 4.5V16.75L10 13.75L5 16.75V4.5Z"
        fill="currentColor"
        fillOpacity={0.16}
      />
    ) : null}
    <path
      d="M5 4.5C5 3.67157 5.67157 3 6.5 3H13.5C14.3284 3 15 3.67157 15 4.5V16.75L10 13.75L5 16.75V4.5Z"
      stroke="currentColor"
      strokeWidth={active ? 1.75 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {active ? <circle cx="10" cy="8.25" r="1.35" fill="currentColor" /> : null}
  </svg>
);
