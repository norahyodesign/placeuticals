import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/*
 * Aceternity "Cover" 패턴 — 제목 속 한 구절을 박스로 감싼다.
 * 기본: 옅은 패널색 박스 + 네 귀퉁이 '+'. 호버: 박스가 네이비로, 글자는 흰색, 빛줄기가 가로로 지나가고
 * 반짝임이 뜨며 글자가 미세하게 떨린다. motion/Sparkles 라이브러리 없이 CSS 키프레임 (cover.css).
 */

const BEAMS = [
  { top: '18%', delay: '0s', duration: '1.6s', color: 'var(--color-gero-purple-deep)' },
  { top: '38%', delay: '0.5s', duration: '2.1s', color: 'var(--color-gero-purple)' },
  { top: '58%', delay: '0.2s', duration: '1.8s', color: 'var(--color-gero-purple-deep)' },
  { top: '78%', delay: '0.9s', duration: '2.4s', color: 'var(--color-gero-purple)' },
]

const SPARKS = [
  { left: '12%', top: '30%', delay: '0s' },
  { left: '28%', top: '70%', delay: '0.4s' },
  { left: '47%', top: '22%', delay: '0.8s' },
  { left: '63%', top: '64%', delay: '0.2s' },
  { left: '81%', top: '38%', delay: '0.6s' },
  { left: '90%', top: '76%', delay: '1s' },
]

export function Cover({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'plt-cover group/cover relative inline-block rounded-sm bg-brand-panel px-3 py-1 transition-colors duration-200 hover:bg-brand-navy',
        className,
      )}
    >
      {/* 빛줄기 + 반짝임 — 호버 때만 보인다 */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
        {BEAMS.map((b, i) => (
          <span
            key={i}
            className="plt-cover__beam"
            style={{
              top: b.top,
              animationDelay: b.delay,
              animationDuration: b.duration,
              backgroundImage: `linear-gradient(90deg, transparent, ${b.color}, transparent)`,
            }}
          />
        ))}
        {SPARKS.map((s, i) => (
          <span key={i} className="plt-cover__spark" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
        ))}
      </span>

      {/* 글자 — 부모 h1이 bg-clip-text라 색을 직접 지정 */}
      <span className="plt-cover__text relative z-10 inline-block text-foreground transition-colors duration-200 group-hover/cover:text-white">
        {children}
      </span>

      {/* 네 귀퉁이 '+' */}
      <CornerIcon className="-top-1.5 -left-1.5" />
      <CornerIcon className="-top-1.5 -right-1.5" />
      <CornerIcon className="-bottom-1.5 -left-1.5" />
      <CornerIcon className="-bottom-1.5 -right-1.5" />
    </span>
  )
}

function CornerIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn('absolute size-3 text-muted-foreground transition-colors group-hover/cover:text-white/70', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
