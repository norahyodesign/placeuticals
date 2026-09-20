import { SectionHeading } from '@/components/common/SectionHeading'
import { Section } from '@/components/common/Section'
import { CtaBanner } from '@/components/common/CtaBanner'
import { PillarShowcase } from '@/components/home/PillarShowcase'
import { StickyScrollReveal } from '@/components/home/StickyScrollReveal'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import { HeroCopy } from '@/components/hero/HeroCopy'
import { HomeBackdrop } from '@/components/hero/HomeBackdrop'
import { HIGHLIGHT_ITEMS, MESSAGE } from '@/content/home'

/**
 * 홈. 배경은 뷰포트 고정 백드롭(HomeBackdrop) 한 장이 페이지 전체를 덮는다:
 * 브랜드 글로우 + Originkit Cursor Ring Field + 옅은 스크림 (home-bg.css 참고).
 * 섹션들은 배경 없이 그 위로 스크롤되고, CTA 배너(네이비)·푸터는 그 자리에서 가린다.
 */
export function HomePage() {
  return (
    <>
      <HomeBackdrop />

      <div className="plt-home-bg">
        {/* id="hero" — SiteHeader가 이 섹션이 보이는 동안만 헤더를 띄운다.
            배경은 백드롭이 담당하므로 여기엔 글자 뒤 보호막(왼쪽 진하게)만 한 겹.
            -mx-25로 .plt-home-bg의 100px 패딩을 뚫고 풀블리드 — 안 그러면 스크림이 x=100px에서
            시작해 그 왼쪽엔 원본 글로우가 그대로 보여 세로 이음새가 생긴다. */}
        <section id="hero" className="plt-hero -mx-25 max-[991px]:-mx-10 px-6 pt-56 pb-24 md:pt-64 md:pb-32">
          <div className="plt-hero__bg" aria-hidden="true">
            {/* 우상단 오로라(브랜드 색 줄무늬, 천천히 흐름) → 그 위에 글자 보호막 */}
            <div className="plt-hero-aurora" />
            <div className="plt-hero__scrim" />
          </div>
          <HeroCopy />
        </section>

        {/* 2·3번째 섹션은 제목이 한 문장으로 이어진다:
            "재생의료 연구부터 임상 진입까지," → "Backward Design으로 설계합니다."
            그래서 둘 다 왼쪽 정렬, 3번째는 위 구절을 작은 글씨로 받아 시작하고 사이 여백을 줄였다. */}
        <Section id="what" scrollCenter tight>
          <SectionHeading
            align="left"
            title="재생의료 연구부터 임상 진입까지,"
            subtitle="개발 전략 컨설팅, 연구, 플랫폼의 세 축으로 연구부터 임상까지 연결합니다."
          />
          {/* 3기둥 카드 스택 쇼케이스 (이전 3카드 그리드 PillarGrid를 대체) */}
          <PillarShowcase />
        </Section>

        {/* 3번째 섹션 — 스크롤 스토리. 2번째 섹션과 같은 상하 여백(py-20 md:py-24)으로 섹션 구분 */}
        <section id="message" className="scroll-mt-40 py-20 md:py-24">
          <div className="mx-auto max-w-(--plt-container)">
            {/* 제목 크기는 2번째 섹션(SectionHeading h2: text-3xl md:text-4xl)과 동일. 제목·영문 부제 오른쪽 정렬.
                제목이 오른쪽에 붙어 있으므로 구분선은 왼쪽 남는 폭을 채운다 */}
            <div className="flex items-center gap-6">
              <span aria-hidden="true" className="h-0.5 flex-1 bg-border" />
              <h2 className="text-right text-3xl font-bold text-foreground [&_em]:text-primary [&_em]:not-italic md:text-4xl">
                {MESSAGE.title}
              </h2>
            </div>
            {/* 부제 크기·행간은 다른 섹션(SectionHeading의 subtitle: 16px/28px)과 동일하게 */}
            <p className="mt-4 text-right leading-[1.625rem] font-medium text-primary italic">{MESSAGE.subtitleEn}</p>
            {/* mt-14 — SectionHeading의 mb-14와 같은 값 (섹션 제목 아래 여백 통일) */}
            <div className="mt-14">
              <StickyScrollReveal items={MESSAGE.items} />
            </div>
          </div>
        </section>

        <Section id="highlight" beforeCta tight>
          <SectionHeading
            title="임상 진입을 위한 핵심 컨설팅 영역"
            subtitle="플라슈티컬즈는 다음 다섯 축을 중심으로 개발 전략을 지원합니다."
          />
          {/* 카드 격자 — 마우스를 옮기면 하이라이트가 카드 사이를 미끄러진다 (Aceternity Card Hover Effect) */}
          <HoverEffect items={HIGHLIGHT_ITEMS} />
        </Section>
      </div>

      <CtaBanner
        title="연구를 임상으로 연결할 준비가 되셨습니까?"
        subtitle="임상 진입 전략이 필요한 모든 단계에서 문의 가능합니다."
        primaryHref="/support#contact"
        primaryLabel="문의하기 →"
      />
    </>
  )
}
