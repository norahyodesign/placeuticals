import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/common/Reveal'

type CtaBannerProps = {
  label?: string
  title: ReactNode
  subtitle: string
  primaryHref: string
  primaryLabel: string
}

export function CtaBanner({
  label,
  title,
  subtitle,
  primaryHref,
  primaryLabel,
}: CtaBannerProps) {
  return (
    <section
      className="relative overflow-hidden bg-brand-navy px-6 py-20 text-white md:py-24"
      style={{
        backgroundImage:
          'radial-gradient(600px circle at 85% 100%, #857bf838, transparent 60%), radial-gradient(500px circle at 0% 0%, #6a5ef02e, transparent 60%)',
      }}
    >
      <Reveal className="relative mx-auto max-w-2xl text-center">
        {label && (
          <div className="mb-3 text-xs font-bold tracking-wide text-brand-accent2 uppercase">{label}</div>
        )}
        {/* 제목·부제 크기는 SectionHeading(다른 섹션)과 동일하게: h2 36px, 부제 16px/28px */}
        <h2 className="text-3xl font-bold [&_span]:text-brand-accent2 md:text-4xl">{title}</h2>
        <p className="mt-4 leading-[1.625rem] text-white/70">{subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a href={primaryHref}>{primaryLabel}</a>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
