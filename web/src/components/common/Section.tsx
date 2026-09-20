import type { ReactNode } from 'react'
import { Reveal } from '@/components/common/Reveal'
import { cn } from '@/lib/utils'

export function Section({
  id,
  alt,
  className,
  scrollCenter,
  beforeCta,
  tight,
  children,
}: {
  id?: string
  alt?: boolean
  className?: string
  /** 해시로 이동할 때 상단이 아니라 화면 세로 가운데에 오도록 한다 (ScrollToTop이 이 표시를 읽는다) */
  scrollCenter?: boolean
  /**
   * 바로 뒤에 CTA 배너(네이비 띠)가 오는 마지막 섹션. 아래 여백을 더 준다.
   * 섹션끼리는 위아래 패딩이 더해져 그만큼 밝은 여백이 생기지만, 배너 앞에서는 이 섹션의
   * 아래 패딩만 밝고 나머지는 배너 색이라 눈에는 훨씬 좁아 보인다(측정으로 확인).
   */
  beforeCta?: boolean
  /**
   * 홈 전용 — 좁은 쪽 여백(96px). 서브 페이지는 내용이 촘촘해 기본값(128px)을 쓰지만,
   * 홈은 히어로·스크롤 스토리로 이미 여백이 넉넉해 넓히면 늘어져 보인다.
   */
  tight?: boolean
  children: ReactNode
}) {
  return (
    <section
      id={id}
      data-scroll-center={scrollCenter ? '' : undefined}
      className={cn(
        'scroll-mt-40 px-6',
        tight ? 'py-20 md:py-24' : 'py-24 md:py-32',
        beforeCta && (tight ? 'pb-32 md:pb-40' : 'pb-40 md:pb-48'),
        alt && 'bg-muted/40',
        className,
      )}
    >
      {/* 폭은 index.css의 --plt-container — 큰 모니터에서만 넓어진다 */}
      <div className="mx-auto max-w-(--plt-container)">{children}</div>
    </section>
  )
}

export function Quote({ text, sub }: { text: ReactNode; sub: string }) {
  return (
    <Reveal
      className="relative mt-14 overflow-hidden rounded-2xl bg-brand-navy px-8 py-12 text-center text-white"
      style={{
        backgroundImage:
          'radial-gradient(500px circle at 90% 10%, #857bf838, transparent 60%), radial-gradient(420px circle at 5% 100%, #6a5ef02e, transparent 60%)',
      }}
    >
      <div className="relative text-2xl leading-9 font-bold [&_em]:text-brand-accent2 [&_em]:not-italic">
        {text}
      </div>
      <p className="relative mt-3 text-sm leading-6 text-white/60">{sub}</p>
    </Reveal>
  )
}
