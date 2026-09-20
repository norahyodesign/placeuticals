import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { HeroCopy } from '@/components/hero/HeroCopy'
import { DOT_SIZE, DOT_TINTS, MOTION_QUERY } from '@/components/hero/cursor-ring-tuning'
import { cn } from '@/lib/utils'

/*
 * 후보 E — Originkit "Cursor Ring Field"
 * 커서를 따라 링 모양 파동이 점 필드를 훑고 지나간다. 커서가 없으면 스스로 떠돈다.
 *
 * 넷 중 가장 무겁다(WebGL + 프레임마다 시뮬레이션 패스 1회). 그래서 세 겹으로 막았다:
 *  1) 코드 스플리팅 — lazy import라 이 히어로를 안 쓰면 번들에 들어가지도 않는다
 *  2) 데스크톱 + reduced-motion 아님일 때만 마운트, 아니면 정적 그라디언트로 폴백
 *  3) 화면 밖으로 나가면 언마운트 → WebGL 컨텍스트와 rAF 루프가 통째로 정리된다
 */
const CursorRingField = lazy(() => import('@/components/hero/CursorRingField'))

type Props = {
  className?: string
  /** 'transparent'면 링 필드가 부모 배경(브랜드 글로우) 위에 얹힌다. 기본은 프리셋의 캔버스색. */
  background?: string
}

export function HeroCursorRing({ className, background }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [allowed, setAllowed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(MOTION_QUERY)
    const sync = () => setAllowed(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const mount = allowed && visible

  return (
    <section
      ref={sectionRef}
      className={cn('plt-hero px-6 pt-56 pb-24 md:pt-64 md:pb-32', !background && 'plt-particles', className)}
    >
      <div className="plt-hero__bg" aria-hidden="true">
        {mount ? (
          <Suspense fallback={<div className="plt-particles__fallback" />}>
            <CursorRingField background={background} colors={DOT_TINTS} dotSize={DOT_SIZE} />
          </Suspense>
        ) : (
          <div className="plt-particles__fallback" />
        )}
        {/* 글자 뒤만 캔버스색으로 살짝 덮는 보호막. 점 색을 아무리 연하게 해도
            제목 획 사이로 점이 지나가면 흔들려 보여서, 이 한 겹이 가독성의 절반이다. */}
        <div className="plt-hero__scrim" />
      </div>
      <HeroCopy />
    </section>
  )
}
