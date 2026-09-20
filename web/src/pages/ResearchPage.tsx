import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Section, Quote } from '@/components/common/Section'
import { ProcessSteps } from '@/components/common/ProcessSteps'
import { FeatureCardGrid } from '@/components/common/FeatureCardGrid'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import { CtaBanner } from '@/components/common/CtaBanner'
import {
  RESEARCH_APPLICATIONS,
  RESEARCH_CTA,
  RESEARCH_HERO,
  RESEARCH_INTRO,
  RESEARCH_QUOTE,
  RESEARCH_TIMELINE,
} from '@/content/research'

export function ResearchPage() {
  return (
    <>
      <PageHero {...RESEARCH_HERO} />

      <Section id="platform">
        <SectionHeading
          title={
            <>
              태반 유래 재생의료 <span>핵심 플랫폼</span>
            </>
          }
          subtitle="임상 진입을 목표로 단계별 개발 전략을 수행하는 통합 R&BD 플랫폼입니다."
        />
        {/* 홈 4섹션과 같은 카드 + 호버 하이라이트 (HoverEffect). 한 장이므로 columns={1} */}
        <HoverEffect
          columns={1}
          align="center"
          items={[
            {
              title: RESEARCH_INTRO.title,
              subtitle: RESEARCH_INTRO.titleEn,
              description: RESEARCH_INTRO.desc,
            },
          ]}
        />
      </Section>

      <Section alt id="application">
        <SectionHeading
          title={
            <>
              3가지 <span>적용 분야</span>
            </>
          }
          subtitle="하나의 플랫폼으로 다양한 산업으로 확장합니다."
        />
        <FeatureCardGrid items={RESEARCH_APPLICATIONS} />
      </Section>

      <Section id="timeline" beforeCta>
        <SectionHeading
          title={
            <>
              단계별 <span>개발 흐름</span>
            </>
          }
          subtitle="임상 진입을 목표로 단계별 개발 전략을 수행합니다."
        />
        <ProcessSteps steps={RESEARCH_TIMELINE} />
        <Quote text={RESEARCH_QUOTE.text} sub={RESEARCH_QUOTE.sub} />
      </Section>

      <CtaBanner
        {...RESEARCH_CTA}
        primaryHref="/support#contact"
        primaryLabel="문의하기 →"
      />
    </>
  )
}
