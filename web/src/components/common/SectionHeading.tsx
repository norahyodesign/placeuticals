import type { ReactNode } from 'react'
import { Reveal } from '@/components/common/Reveal'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  label?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({ label, title, subtitle, align = 'center' }: SectionHeadingProps) {
  return (
    // mb-14(56px) — 부제와 본문이 붙어 보여 40px에서 올렸다. 홈 3섹션의 자체 제목 블록(mt-14)도 같은 값.
    <Reveal className={cn('mb-14', align === 'center' && 'text-center')}>
      {/* 대문자 라벨 자간은 사이트 전체 tracking-wide로 통일 */}
      {label && <div className="mb-3 text-xs font-bold tracking-wide text-primary uppercase">{label}</div>}
      <h2 className="text-3xl font-bold text-foreground md:text-4xl [&_span]:text-primary">{title}</h2>
      {subtitle && <p className="mt-4 leading-[1.625rem] text-muted-foreground">{subtitle}</p>}
    </Reveal>
  )
}
