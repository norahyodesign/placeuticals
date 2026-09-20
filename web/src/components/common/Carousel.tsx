import { useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CarouselProps = {
  slides: ReactNode[]
}

/** 의존성 없는 경량 캐러셀 — 슬라이드 1장씩 이동 + 화살표/점 인디케이터 */
export function Carousel({ slides }: CarouselProps) {
  const [index, setIndex] = useState(0)
  const count = slides.length
  const go = (next: number) => setIndex((next + count) % count)

  return (
    <div>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="w-full shrink-0">
              {slide}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="이전 항목"
          className="absolute top-1/2 left-0 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="다음 항목"
          className="absolute top-1/2 right-0 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${i + 1}번째 항목으로 이동`}
            className={cn('size-2 rounded-full transition-colors', i === index ? 'bg-primary' : 'bg-border')}
          />
        ))}
      </div>
    </div>
  )
}
