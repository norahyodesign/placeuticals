import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/*
 * 스크롤 스토리 — 박스 없이 페이지 스크롤로 항목이 하나씩 드러난다.
 * 왼쪽: 글 항목이 세로로 길게 이어짐 (각 항목이 화면 높이의 ~60%를 차지해 스크롤이 곧 진행이 된다)
 * 오른쪽: 이미지가 화면에 고정(sticky)된 채, 지금 사진 옆에 있는 글의 사진으로 크로스페이드.
 * 배경은 페이지 배경(HomeBackdrop) 그대로 — 별도 컨테이너·내부 스크롤 없음.
 *
 * 활성 판정: "글의 윗선이 사진의 세로 중심선을 지나는 순간" 그 글로 바뀐다.
 *   = 텍스트 윗선이 사진 중심선을 지난 항목 중 마지막 것.
 *   1번은 처음부터 윗선이 사진 윗선과 같아(중심선보다 위) 0에서 시작한다.
 *   - 두 글의 중간에서 바꾸면: 글이 사진 옆에 오기 전에 바뀐다 (너무 이름)
 *   - 글 윗선이 사진 윗선에 닿을 때 바꾸면: 글이 이미 사진 옆에 와 있는데 이전 사진 (너무 늦음 — 측정으로 확인)
 *   사진 상반부에 글이 들어오는 시점이 그 사이의 자연스러운 지점이다.
 * lg(1024) 미만(태블릿 세로·모바일)은 sticky 컬럼을 숨기고 각 항목 위에 사진을 인라인으로 넣는다.
 */

export type StickyItem = {
  category: string
  title: string
  desc: string
  points: string[]
  photo: string
  tint: string
}

/**
 * 교체 기준선 = 사진 윗선 + 사진 높이 × 이 비율. 작을수록 늦게, 클수록 일찍 바뀐다.
 * 1.0 = 사진 아랫선: 다음 글의 윗선이 사진 아래 끝에 닿는 순간 바뀐다. 사진이 화면 세로 가운데 고정이라
 * 글이 사진 옆 구간(위·아래로 사진 높이만큼)을 지나는 동안 내내 그 글의 사진이 보인다.
 * (0.5~0.75는 글이 이미 사진 옆에 와 있는데 한 박자 늦게 바뀌었다 — 스크린샷으로 확인)
 */
const SWITCH_AT = 1.0

export function StickyScrollReveal({ items }: { items: StickyItem[] }) {
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const stickyRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [stickyH, setStickyH] = useState(0)

  /*
   * 고정 사진 높이를 재서 sticky 오프셋을 계산한다 (아래 style의 top).
   * 사진은 aspect-[4/3]이라 화면 폭에 따라 높이가 달라지므로 CSS 상수로는 맞출 수 없다.
   * translate로 올리는 방법도 썼었지만, 그러면 제자리(스크롤 전) 위치까지 위로 끌려 올라가
   * 제목 영역을 침범한다 — 측정 결과 1512에서 67px 침범.
   */
  useEffect(() => {
    const el = stickyRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setStickyH(e.contentRect.height))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let frame = 0
    const pick = () => {
      frame = 0
      // 기준선: 고정 사진의 세로 중심. 사진이 없으면(모바일) 뷰포트 상단 40% 지점
      const s = stickyRef.current?.getBoundingClientRect()
      const refY = s && s.height > 0 ? s.top + s.height * SWITCH_AT : window.innerHeight * 0.4
      let best = 0
      textRefs.current.forEach((node, i) => {
        if (node && node.getBoundingClientRect().top <= refY) best = i
      })
      setActive(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick)
    }
    pick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items.length])

  const current = items[active]

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* 왼쪽 — 글. 활성만 또렷 */}
      <div>
        {items.map((item, i) => (
          <div
            key={item.title}
            className={cn(
              // 항목 간격 — 원래 48vh였는데 화면 높이를 따라가서 QHD(1440 높이)에서는 항목당 220px씩
              // 더 벌어졌다(측정). 기준 노트북(화면 982, 브라우저 UI 빼면 뷰포트 ~870)에서 실제로 보이던
              // 48vh ≈ 418px을 26rem으로 고정해 어느 모니터에서나 같은 간격이 되게 한다.
              // ⚠️ 이 간격은 사진 높이(최대 360px, 아래 max-h)보다 커야 한다 — 교체 기준선이 사진 아랫선이라
              // 사진이 더 크면 다음 글의 윗선이 처음부터 기준선 아래에 있어 1번이 활성인 순간이 없다.
              // 세 항목 모두 글을 박스 위에 붙인다(justify-start pt-0): 1번 영문 라벨 윗선이 사진 윗선과
              // 맞으면서, 항목 사이 간격도 모두 같아진다.
              // (1번만 start, 나머지 center로 두면 1→2 191px · 2→3 127px로 어긋난다 — 측정으로 확인)
              'flex flex-col justify-start py-8 pt-0 transition-opacity duration-500',
              // 마지막 항목엔 간격을 안 준다 — 다음 글이 없어 교체를 밀어낼 필요가 없는데 min-height만큼
              // 빈 공간(119px)이 남아 4번째 섹션과의 간격이 다른 섹션 사이보다 훨씬 넓었다(측정 339 대 192).
              i < items.length - 1 && 'lg:min-h-[26rem]',
              active === i ? 'opacity-100' : 'opacity-30',
            )}
          >
            {/* 모바일 전용 인라인 사진 */}
            <img
              src={item.photo}
              alt=""
              loading="lazy"
              className="mb-6 aspect-[16/10] w-full rounded-2xl object-cover lg:hidden"
            />
            {/* 텍스트 묶음 — 활성 판정은 이 요소의 윗선으로 한다. data-quiet: 보호막 + 커서 링 추적 중지 */}
            <div
              data-quiet
              ref={(node) => {
                textRefs.current[i] = node
              }}
            >
              <div className="flex items-baseline gap-3">
                {/* 번호 — 2번째 섹션(PillarShowcase)과 동일 스타일: text-3xl font-black, 검정 50% */}
                <span className="text-3xl font-black tabular-nums text-black/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">{item.category}</p>
              </div>
              <h3 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">{item.title}</h3>
              <p className="mt-4 max-w-sm text-base leading-7 text-muted-foreground md:text-lg">{item.desc}</p>

              {/* 핵심 포인트 — 컨설팅 페이지 문구에서 뽑은 것 */}
              <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-6 text-foreground">
                    <span
                      className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${item.tint}33` }}
                    >
                      <Check className="size-2.5 text-foreground" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 — 고정 사진. 사진 3장을 겹쳐 두고 활성만 보이게 → 크로스페이드.
          제자리(스크롤 전)에는 왼쪽 첫 글 블록("01" 줄)과 윗선이 맞고,
          스크롤해서 고정되면 화면 세로 가운데에 선다 (top = 50vh − 사진 높이의 절반).
          높이를 JS로 재서 넣으므로 어떤 화면 폭에서도 정확히 가운데다. */}
      <div className="hidden lg:block">
        <div
          ref={stickyRef}
          // max-h 22.5rem(360px) = 기준 노트북에서의 4:3 높이. 큰 모니터에서 컬럼이 넓어져도(2560: 608px)
          // 세로는 여기서 멈춰 글 항목 간격(26rem)보다 항상 작다 → 1→2→3 순서대로 활성이 넘어간다.
          // 1512 이하에서는 4:3이 먼저 걸려(≤360) 이전과 똑같다.
          className="sticky aspect-[4/3] max-h-[22.5rem] w-full overflow-hidden rounded-3xl shadow-2xl"
          style={{ top: `calc(50vh - ${stickyH / 2}px)` }}
        >
          {items.map((item, i) => (
            <img
              key={item.title}
              src={item.photo}
              alt=""
              draggable={false}
              loading={i === 0 ? 'eager' : 'lazy'}
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out select-none',
                active === i ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
          {/* 하단에 항목 틴트를 옅게 — 브랜드 색으로 묶기 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-colors duration-500"
            style={{ backgroundImage: `linear-gradient(180deg, transparent 60%, ${current.tint}59 100%)` }}
          />
        </div>
      </div>
    </div>
  )
}
