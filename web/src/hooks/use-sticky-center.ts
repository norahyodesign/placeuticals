import { useEffect, useRef, useState } from 'react'

/**
 * position:sticky 요소를 화면 세로 가운데에 고정한다.
 *
 * top에 고정값(예: top-32)을 주면 요소가 화면 위쪽에 붙어 중심이 위로 쏠린다.
 * 퍼센트는 쓸 수 없다 — top의 %는 부모 높이 기준이라 "자기 높이의 절반"을 뺄 수 없다.
 * transform: translateY(-50%)도 안 된다 — 스크롤 전 제자리 위치까지 같이 끌려 올라가
 * 위 내용을 침범한다 (홈 3섹션에서 측정으로 확인).
 *
 * 그래서 높이를 실제로 재서 top = 50vh − 높이/2 를 직접 넣는다.
 * aspect-[4/3]처럼 폭에 따라 높이가 달라지는 요소도 해상도마다 알아서 맞는다.
 * ResizeObserver라 창 크기가 바뀌면 리마운트 없이 따라온다.
 */
export function useStickyCenter<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, style: { top: `calc(50vh - ${height / 2}px)` } }
}
