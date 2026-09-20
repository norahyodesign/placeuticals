import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Reveal } from '@/components/common/Reveal'

type FeatureItem = {
  icon: ReactNode
  photo?: string
  title: string
  desc: string
  tags: string[]
}

export function FeatureCardGrid({ items }: { items: FeatureItem[] }) {
  /*
   * 카드 높이를 서로 맞춘다 — 설명 줄 수가 달라도(2줄 vs 3줄) 같은 높이로 보이도록.
   * 격자 칸은 기본적으로 늘어나지만(stretch) 그 안의 Reveal·Card가 내용 높이에 맞춰
   * 줄어들기 때문에, h-full을 Reveal → Card → CardContent까지 이어줘야 한다.
   * 키워드 칩은 mt-auto로 카드 바닥에 붙여 줄 수가 달라도 아래선이 맞는다.
   */
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 100} className="h-full">
          <Card className="plt-card-hover h-full overflow-hidden pt-0">
            {item.photo && (
              <img src={item.photo} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
            )}
            <CardContent className="flex h-full flex-col space-y-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-brand-accent-soft text-primary">
                {item.icon}
              </div>
              <h3 className="text-lg leading-7 font-bold text-foreground">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.desc}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs leading-4 text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      ))}
    </div>
  )
}
