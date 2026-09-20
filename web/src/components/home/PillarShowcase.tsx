import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { PILLARS } from '@/content/home'
import { cn } from '@/lib/utils'

/*
 * 3기둥(연구 / 개발 전략 컨설팅 / 플랫폼) 쇼케이스 — Aceternity "Animated Testimonials" 패턴.
 * 왼쪽: 카드가 겹쳐 쌓여 있다가 활성 카드만 정면으로 서고 나머지는 살짝 기울어 뒤로 물러난다.
 * 오른쪽: 기둥명 · 영문명 · 설명이 단어(어절) 단위로 흐릿하게 나타난다.
 *
 * motion 라이브러리 없이 CSS 전환 + 키프레임으로 구현 (pillar-showcase.css). 의존성 0, 라이선스 무관.
 * 카드 시각은 사진 대신 기존 PillarCard와 같은 브랜드 틴트 + 심볼 PNG(자체 자산)를 쓴다 —
 * public/img/main*.jpg는 Shutterstock 워터마크 미리보기라 쓸 수 없다.
 */

/**
 * 비활성 카드의 기울기·밀림 — 원본은 기울기만 랜덤(±10°)인데 그러면 활성 카드에 거의 가려진다.
 * 좌우·아래로 밀어 귀퉁이가 확실히 드러나게 하고, 리렌더마다 흔들리지 않도록 고정값으로 둔다.
 */
const STACK = [
  { tilt: -9, dx: -7, dy: 5 },
  { tilt: 8, dx: 7, dy: 4 },
  { tilt: -5, dx: -3, dy: 8 },
]
const AUTOPLAY_MS = 6000

export function PillarShowcase({ autoplay = true }: { autoplay?: boolean }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = PILLARS.length

  const next = () => setActive((i) => (i + 1) % count)
  const prev = () => setActive((i) => (i - 1 + count) % count)

  useEffect(() => {
    if (!autoplay || paused) return
    const t = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- next는 count에만 의존하는 안정 함수
  }, [autoplay, paused, count])

  const current = PILLARS[active]

  return (
    <div
      className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* 카드 스택 — id="pillar-first"는 DiagonalConnector의 시작점 (기존 PillarGrid 첫 카드와 동일 역할) */}
      <div id="pillar-first" className="plt-showcase__stack relative aspect-[4/3] w-full rounded-[1.5rem]">
        {PILLARS.map((pillar, i) => {
          const isActive = i === active
          return (
            <div
              key={pillar.title}
              aria-hidden={!isActive}
              className={cn('plt-showcase__card', isActive && 'is-active')}
              style={{
                zIndex: isActive ? 40 : count - i,
                // 비활성 카드만 기울이고 민다. 활성은 항상 제자리 0°
                ['--tilt' as string]: isActive ? '0deg' : `${STACK[i % STACK.length].tilt}deg`,
                ['--dx' as string]: isActive ? '0%' : `${STACK[i % STACK.length].dx}%`,
                ['--dy' as string]: isActive ? '0%' : `${STACK[i % STACK.length].dy}%`,
              }}
            >
              {/* 활성 전환 때만 remount → 튀어오르는 키프레임이 매번 다시 재생된다 */}
              <div
                key={isActive ? `pop-${active}` : 'idle'}
                className={cn('plt-showcase__face overflow-hidden rounded-[1.5rem]', isActive && 'plt-showcase__pop')}
              >
                <img
                  src={pillar.photo}
                  alt=""
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover object-center select-none"
                />
                {/* 하단에 기둥 틴트를 옅게 — 사진 3장이 톤이 달라도 브랜드 색으로 묶인다 */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ backgroundImage: `linear-gradient(180deg, transparent 55%, ${pillar.tint}59 100%)` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* 텍스트 — key={active}로 통째로 remount해서 단어 등장 애니메이션이 매번 재생된다 */}
      {/* data-quiet: 텍스트 블록 뒤 보호막 + 커서 링 추적 중지 (home-bg.css) */}
      <div className="py-2" data-quiet>
        {/* 제목 줄 — 왼쪽 제목·영문명, 오른쪽 이전/다음 + 카운터 (버튼은 remount 밖에 둬서 깜빡이지 않게) */}
        <div className="flex items-start justify-between gap-6">
          <div key={active}>
            {/* 3번째 섹션(StickyScrollReveal)과 같은 구조: [번호 + 영문 라벨] 줄, 그 아래 국문 제목 */}
            <div className="plt-showcase__rise flex items-baseline gap-3">
              <span className="text-3xl font-black tabular-nums text-black/50">
                {String(active + 1).padStart(2, '0')}
              </span>
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">{current.en}</p>
            </div>
            <h3 className="plt-showcase__rise mt-3 text-2xl font-bold text-foreground [animation-delay:60ms] md:text-3xl">
              {current.title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-2 pt-1">
            <ShowcaseButton onClick={prev} label="이전">
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover/button:-rotate-12" />
            </ShowcaseButton>
            <ShowcaseButton onClick={next} label="다음">
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:rotate-12" />
            </ShowcaseButton>
          </div>
        </div>

        <div key={`body-${active}`}>
          <p className="mt-6 text-base leading-7 font-medium text-foreground md:text-lg">
            {current.desc.split(' ').map((word, i) => (
              <span key={i} className="plt-showcase__word" style={{ animationDelay: `${i * 30}ms` }}>
                {word}&nbsp;
              </span>
            ))}
          </p>
          {/* 상세 — 각 페이지 콘텐츠에서 뽑은 문단. 어절 등장은 desc 뒤이어 계속 */}
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {current.detail.split(' ').map((word, i) => (
              <span key={i} className="plt-showcase__word" style={{ animationDelay: `${(i + 12) * 20}ms` }}>
                {word}&nbsp;
              </span>
            ))}
          </p>
          {/* 링크와 카운터를 한 줄에 — 카운터는 오른쪽 끝 */}
          <div className="plt-showcase__rise mt-6 flex items-center justify-between gap-4 [animation-delay:500ms]">
            <Link
              to={current.link.to}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {current.link.label}
              <ArrowUpRight className="size-4" />
            </Link>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {active + 1} / {count}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShowcaseButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group/button flex size-9 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-brand-accent2"
    >
      {children}
    </button>
  )
}
