import { HeroCopy } from '@/components/hero/HeroCopy'

/**
 * 후보 D — 절제형
 * 배경은 정적 그라디언트로 조용히 두고, 움직이는 건 헤드라인 글자를 훑고 지나가는 빛 한 줄뿐.
 * 제약·바이오처럼 신뢰가 먼저인 업종에서 가장 안전한 선택이고, 성능 비용도 사실상 0이다.
 */
export function HeroCalm() {
  return (
    <section className="plt-hero plt-calm px-6 pt-56 pb-24 md:pt-64 md:pb-32">
      <HeroCopy headlineClassName="plt-calm__headline" />
    </section>
  )
}
