import { useEffect, useRef } from 'react'
import { HeroCopy } from '@/components/hero/HeroCopy'

/**
 * 후보 B — 격자 + 커서 스포트라이트
 * 마우스를 따라 퍼플 글로우가 움직인다.
 * 터치 기기에는 호버가 없으므로 리스너를 아예 붙이지 않고, CSS 기본값(중앙 상단 고정)으로 둔다.
 */
export function HeroSpotlight() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    // 마우스가 있는 기기에서만 추적 — 모바일에서 불필요한 리스너/리페인트 방지
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (frame) return // rAF 1프레임당 1회로 제한
      frame = requestAnimationFrame(() => {
        frame = 0
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
        el.style.setProperty('--my', `${e.clientY - rect.top}px`)
      })
    }

    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section ref={rootRef} className="plt-hero plt-spotlight px-6 pt-56 pb-24 md:pt-64 md:pb-32">
      <div className="plt-hero__bg" aria-hidden="true">
        <div className="plt-spotlight__grid" />
        <div className="plt-spotlight__glow" />
      </div>
      <HeroCopy />
    </section>
  )
}
