import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { DENSITY, DOT_TINTS, MOTION_QUERY, cameraDistanceFor, dotSizeFor } from '@/components/hero/cursor-ring-tuning'

const CursorRingField = lazy(() => import('@/components/hero/CursorRingField'))

/*
 * 홈 페이지 전체 배경 — 뷰포트에 고정된 한 장.
 * 브랜드 글로우 → Cursor Ring Field → 옅은 스크림 순으로 쌓인다 (home-bg.css 참고).
 *
 * HeroCursorRing과 달리 IntersectionObserver 가드가 없다. 항상 뷰포트를 채우고 있으니
 * "화면 밖"이 없기 때문. 탭이 백그라운드로 가면 브라우저가 rAF를 알아서 멈춘다.
 *
 * 모바일·reduced-motion에선 캔버스를 아예 안 띄운다 — 글로우 + 스크림만 남아
 * 정적 브랜드 배경이 된다. 이 폴백만으로도 gero.ai CDN 이미지 대체로는 충분하다.
 */
export function HomeBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [allowed, setAllowed] = useState(false)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia(MOTION_QUERY)
    const sync = () => setAllowed(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  /*
   * 스크롤 중 커서 잠금 해제.
   * 휠 스크롤은 커서를 안 움직이니 pointermove가 안 나고, 링은 화면의 그 자리에 박힌 채
   * 페이지만 밑으로 흐른다 — 유리판에 붙은 것처럼 어색하다.
   * 스크롤이 시작되면 캔버스에 pointerleave를 흘려 넣어 컴포넌트를 '떠돌기' 모드로 보내고
   * (내부 follow 값이 HANDOVER_LERP로 부드럽게 0으로), 멈추고 180ms 뒤 마지막 커서 위치로
   * pointermove를 다시 넣어 '따라가기'로 복귀시킨다. 컴포넌트 내부는 건드리지 않는다.
   */
  useEffect(() => {
    if (!allowed) return
    const root = rootRef.current
    if (!root) return

    const last = { x: 0, y: 0, known: false }
    let released = false
    let timer = 0

    /*
     * 텍스트 위에서는 링이 커서를 놓는다.
     * 글을 읽으려고 마우스를 본문에 올리면 링이 정확히 그 자리로 와서 가장 촘촘한 점 무리가
     * 글자 밑에 깔린다 — 불투명도만 낮춰선 해결이 안 된다. 커서가 [data-quiet] 영역(텍스트 블록) 안이면
     * pointerleave를 흘려 넣어 링이 빈 공간을 떠돌게 하고, 벗어나면 다시 따라온다.
     */
    let inQuiet = false
    let moveFrame = 0
    let pending: { x: number; y: number; quiet: boolean } | null = null

    // rAF 스로틀 — pointermove는 초당 120회까지 오므로 프레임당 1회만 처리한다
    const applyMove = () => {
      moveFrame = 0
      if (!pending) return
      last.x = pending.x
      last.y = pending.y
      last.known = true
      if (pending.quiet !== inQuiet) {
        inQuiet = pending.quiet
        if (pending.quiet) root.querySelector('canvas')?.dispatchEvent(new PointerEvent('pointerleave'))
      }
      if (pending.quiet) return // 텍스트 위: 컴포넌트가 커서를 다시 잡지 못하도록 released 상태 유지
      released = false // 실제로 마우스를 움직이면 컴포넌트가 알아서 다시 잡는다
    }

    const onMove = (e: PointerEvent) => {
      if (!e.isTrusted) return // 아래에서 우리가 만든 합성 이벤트는 무시
      pending = { x: e.clientX, y: e.clientY, quiet: !!(e.target as Element | null)?.closest?.('[data-quiet]') }
      if (!moveFrame) moveFrame = requestAnimationFrame(applyMove)
    }

    const onScroll = () => {
      const canvas = root.querySelector('canvas')
      if (!canvas) return // lazy 로드 전
      if (!released) {
        released = true
        canvas.dispatchEvent(new PointerEvent('pointerleave'))
      }
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        released = false
        // 스크롤이 멈춘 자리가 텍스트 위면 다시 잡지 않는다
        if (last.known && !inQuiet)
          window.dispatchEvent(new PointerEvent('pointermove', { clientX: last.x, clientY: last.y }))
      }, 180)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
      if (moveFrame) cancelAnimationFrame(moveFrame)
    }
  }, [allowed])

  // 백드롭은 fixed inset-0 이라 크기 = 뷰포트 크기. 창 크기가 바뀌면 카메라 거리도 따라간다.
  // 폭도 같이 재는 이유: 큰 모니터에서는 링 띠를 키운다 (cameraDistanceFor 주석 참고).
  // 컴포넌트가 매 프레임 props에서 값을 읽으므로 리마운트 없이 부드럽게 반영된다.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
      setWidth(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="plt-home-backdrop" aria-hidden="true">
      <div className="plt-home-backdrop__glow" />
      {allowed && (
        <Suspense fallback={null}>
          <CursorRingField
            background="transparent"
            colors={DOT_TINTS}
            dotSize={dotSizeFor(width)}
            density={DENSITY}
            cameraDistance={cameraDistanceFor(height, width)}
          />
        </Suspense>
      )}
      <div className="plt-home-backdrop__scrim" />
    </div>
  )
}
