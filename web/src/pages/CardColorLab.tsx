import { HoverEffect } from '@/components/ui/card-hover-effect'
import { HomeBackdrop } from '@/components/hero/HomeBackdrop'
import { HIGHLIGHT_ITEMS } from '@/content/home'

/** 임시 — 4섹션 카드 배경색 후보 비교. 고르고 나면 이 파일과 routes의 줄을 지운다 */
export function CardColorLab() {
  const items = HIGHLIGHT_ITEMS.slice(0, 3)
  return (
    <>
      <HomeBackdrop />
      <div className="plt-home-bg space-y-16 pt-40 pb-24">
        {(['panel', 'white', 'tint'] as const).map((v) => (
          <section key={v} className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm font-bold text-foreground">{v.toUpperCase()}</p>
            <HoverEffect items={items} variant={v} />
          </section>
        ))}
      </div>
    </>
  )
}
