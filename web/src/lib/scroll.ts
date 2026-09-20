/**
 * 요소를 화면 세로 가운데에 오도록 스크롤한다.
 *
 * scrollIntoView({ block: 'center' })를 쓰지 않는 이유: 섹션에 걸린 scroll-margin-top(160px,
 * 고정 헤더를 피하려고 둔 값)이 가운데 정렬 계산에도 그대로 반영되어 항상 절반인 80px만큼
 * 아래로 밀린다 (측정으로 확인). 목표 위치를 직접 계산하면 scroll-margin과 무관하게 정확하다.
 *
 * 요소가 화면보다 크면 가운데 정렬이 의미가 없으므로 위쪽을 헤더 아래에 맞춘다.
 */
const HEADER_OFFSET = 100

function targetTop(el: Element) {
  const rect = el.getBoundingClientRect()
  const top =
    rect.height >= window.innerHeight
      ? rect.top + window.scrollY - HEADER_OFFSET
      : rect.top + window.scrollY - (window.innerHeight - rect.height) / 2
  return Math.max(0, top)
}

export function scrollElementToCenter(el: Element) {
  window.scrollTo({ top: targetTop(el), behavior: 'smooth' })

  /*
   * 보정 패스 — 스크롤이 도는 동안 지연 로딩 이미지가 들어오면 레이아웃이 밀려 목표가 달라진다
   * (1024에서 18px 어긋나는 것을 측정으로 확인). 스크롤이 멎은 뒤 한 번 다시 재서 2px 넘게
   * 벌어져 있으면 조용히 맞춘다. 사용자가 직접 스크롤을 잡으면 즉시 포기한다.
   */
  let settled = 0
  let last = -1
  let cancelled = false
  const giveUp = () => {
    cancelled = true
  }
  window.addEventListener('wheel', giveUp, { once: true, passive: true })
  window.addEventListener('touchstart', giveUp, { once: true, passive: true })

  /*
   * 스크롤이 멎은 뒤에도 잠깐 더 지켜본다. 폰트·이미지가 뒤늦게 들어오면 목표 위치가 그때
   * 달라지는데(1024에서 18px 어긋나는 것을 측정으로 확인), 한 번만 보정하면 그 뒤의 변화를
   * 놓친다. 창이 닫힐 때까지 어긋남이 보일 때마다 조용히 맞춘다.
   */
  const tick = () => {
    if (cancelled) return cleanup()
    const y = Math.round(window.scrollY)
    settled = y === last ? settled + 1 : 0
    last = y
    if (settled >= 3) {
      const diff = targetTop(el) - y
      if (Math.abs(diff) > 2) {
        window.scrollTo({ top: targetTop(el) })
        settled = 0
      }
    }
    frame = requestAnimationFrame(tick)
  }
  const cleanup = () => {
    cancelAnimationFrame(frame)
    clearTimeout(timer)
    window.removeEventListener('wheel', giveUp)
    window.removeEventListener('touchstart', giveUp)
  }
  let frame = requestAnimationFrame(tick)
  const timer = setTimeout(cleanup, 2500) // 안전장치: 2.5초 넘게 붙들지 않는다
}
