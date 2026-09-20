import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Section } from '@/components/common/Section'
import { ProcessSteps } from '@/components/common/ProcessSteps'
import { Timeline } from '@/components/common/Timeline'
import { CtaBanner } from '@/components/common/CtaBanner'
import {
  CONSULTING_CTA,
  CONSULTING_HERO,
  CONSULTING_PHOTO,
  CONSULTING_PROCESS,
  CONSULTING_SERVICES,
} from '@/content/consulting'

export function ConsultingPage() {
  return (
    <>
      <PageHero {...CONSULTING_HERO} />

      <Section id="services">
        <SectionHeading
          title={
            <>
              5가지 <span>전략 컨설팅</span>
            </>
          }
          subtitle="임상 진입 목표에서 거꾸로 설계하는 Backward Design 방법론을 기반으로, 각 단계에 최적화된 전략을 제공합니다."
        />
        {/* 가로 밴드 — 섹션 부제 바로 아래에서 장면을 먼저 보여주고, 그 뒤 1~5번이 이어진다 */}
        <img
          src={CONSULTING_PHOTO}
          alt=""
          loading="lazy"
          className="aspect-[21/9] w-full rounded-2xl object-cover"
        />
        <Timeline items={CONSULTING_SERVICES} />
      </Section>

      <Section alt id="process" beforeCta>
        <SectionHeading
          title={
            <>
              컨설팅 <span>프로세스</span>
            </>
          }
          subtitle="초기 진단부터 임상 진입까지 단계별 맞춤 전략을 제공합니다."
        />
        <ProcessSteps steps={CONSULTING_PROCESS} />
      </Section>

      <CtaBanner
        {...CONSULTING_CTA}
        primaryHref="/support#contact"
        primaryLabel="문의하기 →"
      />
    </>
  )
}
