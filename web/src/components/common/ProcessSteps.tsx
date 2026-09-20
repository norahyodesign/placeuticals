import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Step = { num?: string; title: string; desc?: string; highlight?: boolean }

/*
 * 가로 진행 바 — 하나의 트랙 위에 단계 노드를 얹어 "초기 진단 → 임상 진입" 방향을 보여준다.
 * 1번째 섹션(세로 타임라인)과 축을 반대로 두어 같은 페이지에서 두 섹션이 구분된다.
 *
 * 화면에 들어오면 트랙이 왼쪽에서 오른쪽으로 차오른다 (IntersectionObserver + CSS transition).
 * lg 미만에서는 세로로 떨어지고 트랙은 숨긴다.
 */
export function ProcessSteps({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '-15% 0px -15% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* mt — 위 섹션 부제와 첫 단계 사이 간격.
   * SectionHeading의 mb-10(40px)과 인접 형제라 마진이 상쇄된다 → 원하는 최종값을 직접 적는다. */
  return (
    <div ref={ref} className="relative mt-14 lg:mt-16">
      {/* 트랙 — 노드의 점 중심(위에서 0.5rem)에 맞춰 놓인다. 양끝은 첫·마지막 칸의 중앙까지만 */}
      <div
        aria-hidden="true"
        className="absolute top-2 hidden h-0.5 -translate-y-1/2 rounded-full bg-border lg:block"
        style={{ left: `${100 / steps.length / 2}%`, right: `${100 / steps.length / 2}%` }}
      >
        <div
          className="h-0.5 rounded-full bg-gradient-to-r from-primary/40 to-primary transition-[width] duration-[1600ms] ease-out"
          style={{ width: shown ? '100%' : '0%' }}
        />
      </div>

      <ol className="grid gap-10 lg:grid-cols-5 lg:gap-4">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="relative text-center transition-[opacity,transform] duration-500 ease-out lg:px-2"
            style={{
              transitionDelay: `${i * 120}ms`,
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(0.75rem)',
            }}
          >
            {/* 노드 — 마지막(도착점)만 채운 원 + 링 */}
            <span
              aria-hidden="true"
              className={cn(
                'mx-auto flex size-4 items-center justify-center rounded-full border-2 bg-white',
                step.highlight ? 'border-primary ring-4 ring-primary/20' : 'border-border',
              )}
            >
              {step.highlight && <span className="size-1.5 rounded-full bg-primary" />}
            </span>

            {/* 번호는 표지일 뿐이므로 작게(14px), 의미를 담은 제목을 크게(18px) — 위계를 뒤집지 않는다.
                1번째 섹션 타임라인의 항목 제목(24px)보다는 작게 두어 섹션 간 서열도 유지한다. */}
            {step.num && (
              <div className="mt-4 text-sm leading-5 font-black tabular-nums text-black/40">{step.num}</div>
            )}
            <div
              className={cn(
                'mt-1.5 text-lg leading-7 font-bold',
                step.highlight ? 'text-primary' : 'text-foreground',
              )}
            >
              {step.title}
            </div>
            {step.desc && <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.desc}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}
