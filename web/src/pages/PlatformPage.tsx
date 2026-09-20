import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Section, Quote } from '@/components/common/Section'
import { ProcessSteps } from '@/components/common/ProcessSteps'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import { CtaBanner } from '@/components/common/CtaBanner'
import { PLATFORM_CTA, PLATFORM_HERO, PLATFORM_INTRO, PLATFORM_OVERVIEW, PLATFORM_QUOTE, PLATFORM_TIMELINE } from '@/content/platform'

export function PlatformPage() {
  return (
    <>
      <PageHero {...PLATFORM_HERO} />

      <Section id="overview">
        <SectionHeading title={PLATFORM_OVERVIEW.title} subtitle={PLATFORM_OVERVIEW.subtitle} />
        {/* 홈 4섹션과 같은 카드 + 호버 하이라이트 (HoverEffect). 한 장이므로 columns={1} */}
        <HoverEffect
          columns={1}
          align="center"
          items={[
            {
              title: PLATFORM_INTRO.title,
              subtitle: PLATFORM_INTRO.titleEn,
              description: PLATFORM_INTRO.desc,
            },
          ]}
        />
      </Section>

      <Section alt id="structure" beforeCta>
        <SectionHeading
          title={
            <>
              개발 <span>전주기 구조</span>
            </>
          }
          subtitle="공정개발부터 임상까지, 하나의 플랫폼에서 이어집니다."
        />
        <ProcessSteps steps={PLATFORM_TIMELINE} />
        <Quote text={PLATFORM_QUOTE.text} sub={PLATFORM_QUOTE.sub} />
      </Section>

      <CtaBanner
        {...PLATFORM_CTA}
        primaryHref="/support#contact"
        primaryLabel="문의하기 →"
      />
    </>
  )
}
