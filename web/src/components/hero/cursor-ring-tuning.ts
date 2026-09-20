/*
 * Cursor Ring Field 튜닝값 — 히어로 단독(HeroCursorRing)과 페이지 전체(HomeBackdrop)가 공유.
 * 한 곳에서 바꾸면 두 시안 모두 따라온다.
 */

/*
 * 점 색 — 퍼플 3단계를 캔버스(#faf9f6) 쪽으로 50% 섞은 틴트.
 * WebGL 유니폼이라 CSS 변수를 못 쓰고 hex로 박는다. theme.css 값이 바뀌면 여기도 맞출 것.
 *   퍼플 키 → #c0baf7, 딥 → #b3abfa, 라이트 → #d6d1fb (모두 퍼플 계열 밝은 틴트)
 * 원색을 그대로 쓰면 제목 뒤를 지나갈 때 글자와 채도가 붙어 읽기 힘들어진다.
 */
export const DOT_TINTS = ['#c0baf7', '#b3abfa', '#d6d1fb']

/**
 * 점 하나의 크기. 프리셋 120 → 100 → 68. (기준 해상도 1512에서의 값)
 * 점이 작아지면 글자 획과 덜 겹치고 배경이 한결 잔잔해진다.
 */
export const DOT_SIZE = 68

/** 이 값으로 DOT_SIZE를 정했다. 여기보다 넓은 화면에서 점이 커지지 않도록 하는 기준. */
const DOT_REF_WIDTH = 1512

/*
 * 점 하나의 크기를 화면 폭과 무관하게 고정한다.
 *
 * 셰이더가 점 크기를 `(cssW / 2000) * dotSize`로 잡아 캔버스 "폭"에 그대로 비례시킨다.
 * 그래서 2560 모니터에서는 점 하나가 1512 대비 1.69배로 커져 배경이 굵어 보였다.
 * 링 띠는 이미 픽셀 기준으로 맞춰 놨는데 점만 커지니 더 도드라졌다.
 * 기준 폭을 넘는 만큼 dotSize를 되돌려 어느 모니터에서나 같은 픽셀 크기로 보이게 한다.
 * 1512 이하는 건드리지 않는다 — 좁은 화면에서 점이 더 커지는 건 원한 적 없다.
 */
export function dotSizeFor(canvasWidth: number) {
  if (!canvasWidth || canvasWidth <= DOT_REF_WIDTH) return DOT_SIZE
  return DOT_SIZE * (DOT_REF_WIDTH / canvasWidth)
}

/**
 * 점 밀도. 프리셋 300은 점 6만 개(상한) — 뷰포트 전체를 매 프레임 그리기엔 무겁다.
 * 220은 너무 성겨 보여서 265로. 밀도 인상은 거의 유지하면서 점 수는 프리셋의 2/3 수준.
 */
export const DENSITY = 265

/** 데스크톱 + 움직임 축소 설정 아님 — 이 조건에서만 WebGL을 띄운다. */
export const MOTION_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

/*
 * 링 크기 보정.
 * 이 컴포넌트는 링 반지름·두께·점 간격·파동 세기를 전부 캔버스 "높이" 비율로 그린다
 * (gl_Position의 y가 클립 공간으로 정규화되기 때문). 그래서 히어로(높이 ~620px)에서
 * 딱 맞던 링이 뷰포트 전체(~1000px) 캔버스로 가면 그 비율만큼 커진다.
 * 카메라 거리를 높이 비율로 당기면 픽셀 기준으로 히어로 때와 같은 크기가 된다.
 * 링 반지름만 줄이면 점 간격·파동은 여전히 커진 채라 안 맞는다.
 */
export const CAMERA_DISTANCE = 160 // Originkit 프리셋 값
// 히어로 섹션 높이(~620)에서 프리셋이 맞았지만, 전체 페이지에선 링 띠가 가운데 정렬 제목을
// 관통해 어수선했다 (스크린샷 확인). 520으로 낮춰 링을 ~15% 줄임. 값이 작을수록 링이 작아진다.
export const RING_REF_HEIGHT = 520

/*
 * 큰 모니터에서 링 띠 확대.
 *
 * 위 보정은 링을 "픽셀 기준으로 항상 같은 크기"로 맞춘다. 그래서 2560 모니터에서도 노트북과
 * 똑같은 픽셀 크기라 화면에 비해 띠가 작게 뭉쳐 보인다.
 * 카메라 거리를 이 배수만큼 당기면(나누면) 링 반지름·두께·점 간격·파동이 한꺼번에 커진다.
 * 점 하나의 크기(gl_PointSize)는 원근 분할을 타지 않아 그대로다 — 형태만 커지고 점은 안 커진다.
 */
const BIG_SCREEN_MIN_WIDTH = 2200
const BIG_SCREEN_RING_SCALE = 1.35

export function cameraDistanceFor(canvasHeight: number, canvasWidth = 0) {
  if (!canvasHeight) return CAMERA_DISTANCE
  const scale = canvasWidth >= BIG_SCREEN_MIN_WIDTH ? BIG_SCREEN_RING_SCALE : 1
  return (CAMERA_DISTANCE * (canvasHeight / RING_REF_HEIGHT)) / scale
}
