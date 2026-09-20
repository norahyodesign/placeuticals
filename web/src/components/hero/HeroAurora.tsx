import { HeroCopy } from '@/components/hero/HeroCopy'

/**
 * 후보 A — 오로라 글로우
 * 브랜드 3색 blob이 아주 느리게 떠다닌다. CSS 애니메이션만 쓰고 JS는 0줄.
 * gero.ai CDN 배경 이미지를 대체할 수 있는 유일한 후보이기도 하다(외부 자산 의존 없음).
 */
export function HeroAurora() {
  return (
    <section className="plt-hero plt-aurora px-6 pt-56 pb-24 md:pt-64 md:pb-32">
      <div className="plt-hero__bg" aria-hidden="true">
        <div className="plt-aurora__blob plt-aurora__blob--purple" />
        <div className="plt-aurora__blob plt-aurora__blob--teal" />
        <div className="plt-aurora__blob plt-aurora__blob--lime" />
      </div>
      <HeroCopy />
    </section>
  )
}
