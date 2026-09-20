import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/common/Reveal'

type TimelineItem = {
  num: string
  titleEn: string
  title: string
  desc: string
  tags: string[]
}

/*
 * Aceternity "Timeline" 패턴 — 왼쪽에 번호·영문 라벨, 오른쪽에 제목·본문이 놓이고,
 * 가운데 세로선이 스크롤에 따라 브랜드 색으로 차오른다.
 *
 * motion 없이 구현: 스크롤할 때마다 rAF 한 번으로 "선이 얼마나 차야 하는지"만 계산해
 * CSS 변수(--fill)에 넣는다. 선 자체는 CSS 그라디언트라 리페인트가 가볍다.
 * 진행 기준은 화면 세로 가운데 — 지금 읽고 있는 항목까지 선이 차 있다.
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [fill, setFill] = useState(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let frame = 0
    const measure = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      // 화면 세로 가운데가 트랙의 어디를 지나고 있는지 (0~1)
      const p = (window.innerHeight / 2 - r.top) / Math.max(r.height, 1)
      setFill(Math.min(1, Math.max(0, p)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items.length])

  /* mt — 위 섹션 부제와 01 사이 간격.
   * SectionHeading의 mb-10(40px)과 인접 형제라 마진이 상쇄되어 "둘 중 큰 값" 하나만 적용된다.
   * 그래서 더해지길 기대하지 말고 원하는 최종 간격을 여기에 직접 적는다. */
  return (
    <div ref={trackRef} className="relative mt-16 lg:mt-20">
      {/* 세로선 — 회색 바탕 위로 브랜드 퍼플이 차오른다. lg부터만 보인다(왼쪽 고정 칼럼이 있을 때) */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-[7px] hidden w-px bg-border lg:block"
        style={{ height: '100%' }}
      >
        <div
          className="w-px bg-gradient-to-b from-primary to-primary/20"
          style={{ height: `${fill * 100}%` }}
        />
      </div>

      {/* 항목 사이 간격 — 각 항목이 짧아 80px는 과했다 */}
      <div className="space-y-10 lg:space-y-12">
        {/* 항목마다 스크롤 진입 애니메이션 — 사이트 공통 Reveal(페이드 + 위로 슬라이드)에
            순번만큼 지연을 줘서 위에서 아래로 차례로 나타난다 */}
        {items.map((item, i) => (
          <Reveal
            key={item.num}
            delay={i * 90}
            className="grid gap-3 lg:grid-cols-[16rem_1fr] lg:gap-12"
          >
            {/* 왼쪽 — 번호, 그 아래 영문 라벨.
                sticky는 쓰지 않는다: 항목 내용이 짧아 행이 낮으면 왼쪽만 행 안에서 미끄러져
                오른쪽 제목과의 윗선 정렬이 스크롤 중에 깨진다 (측정으로 확인). */}
            <div className="lg:pl-8">
              {/* 숫자 — relative로 두어 점이 이 줄을 기준으로 세로 가운데에 놓이게 한다 */}
              <div className="relative text-3xl font-black tabular-nums text-black/50">
                {/* 점 — 세로선(left-[7px]) 위에, 숫자 줄의 세로 한가운데. lg에서만 보인다.
                    -left-8 = 왼쪽 칼럼의 pl-8(2rem)을 되돌려 트랙 왼쪽 끝으로 나간다 */}
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -left-8 hidden size-[0.9375rem] -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white lg:flex"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                </span>
                {item.num}
              </div>
              <p className="mt-1 text-xs font-semibold tracking-wide text-primary uppercase">{item.titleEn}</p>
            </div>

            {/*
             * 오른쪽 — 제목·본문·키워드.
             * pt-9(36px): 왼쪽 번호 줄 높이(36px)만큼 내려 영문 라벨과 같은 줄에서 시작한다.
             * 제목은 24px/32px이라 글자 위 여백이 (32−24)/2 = 4px, 영문 라벨은 (16−12)/2 = 2px →
             * 남는 차이는 mt-0.5로 보정한다 — 실측(글자 윗선 기준)으로 맞춘 값이다.
             */}
            <div data-quiet className="lg:pt-9">
              <h3 className="mt-0.5 text-2xl leading-8 font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 text-base leading-[1.625rem] text-muted-foreground">{item.desc}</p>
              {item.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs leading-4 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
