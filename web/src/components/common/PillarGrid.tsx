import { PILLARS } from '@/content/home'
import { useReveal } from '@/hooks/use-reveal'
import { asset } from '@/lib/asset'

/**
 * gero.ai "Foundational Science" 3카드 패턴 — 상단 컬러가 하단 캔버스 톤으로
 * 페이드되는 그라디언트 카드(24px radius, 테두리/그림자 없음). doc/gero-ai-analysis.md 참고.
 */
export function PillarGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PILLARS.map((pillar, i) => (
        <PillarCard key={pillar.title} pillar={pillar} isFirst={i === 0} delay={i * 100} />
      ))}
    </div>
  )
}

function PillarCard({
  pillar,
  isFirst,
  delay,
}: {
  pillar: (typeof PILLARS)[number]
  isFirst: boolean
  delay: number
}) {
  const ref = useReveal<HTMLElement>()

  return (
    <article
      ref={ref}
      id={isFirst ? 'pillar-first' : undefined}
      className="reveal rounded-[1.5rem] p-8"
      style={{ backgroundImage: `linear-gradient(180deg, ${pillar.tint}4d, #e0ddd93d)`, transitionDelay: `${delay}ms` }}
    >
      <img src={asset(pillar.img)} alt="" className="mb-5 size-12" />
      <h3 className="text-lg font-bold text-foreground">{pillar.title}</h3>
      <div className="mb-3 text-xs font-semibold text-foreground/60 uppercase">{pillar.en}</div>
      <p className="text-sm leading-6 text-muted-foreground">{pillar.desc}</p>
    </article>
  )
}
