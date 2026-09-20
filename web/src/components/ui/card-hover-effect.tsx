import { useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

/*
 * Aceternity "Card Hover Effect" 패턴 — 카드 격자 위로 마우스를 옮기면 하이라이트 배경이
 * 카드 사이를 미끄러져 따라다닌다. 원본은 motion layoutId; 여기선 호버한 카드의 위치·크기를 재서
 * absolute div를 transition으로 옮긴다 (SiteHeader의 메뉴 하이라이트와 같은 방식).
 * 원본의 검정 카드 대신 사이트 톤(흰 반투명 카드 + 퍼플 소프트 하이라이트).
 */

export type HoverItem = {
  num?: string
  title: string
  /** 제목 아래 작은 보조 줄 (영문 표기 등) */
  subtitle?: string
  description: string
  /** 없으면 링크가 아닌 정적 카드로 렌더된다 (리서치·플랫폼 1섹션의 소개 박스) */
  link?: string
}

/*
 * 카드 배경 후보 (임시 비교용 — 하나 고르면 나머지는 지운다)
 *  panel: 브랜드 패널색(#f2ede4, 푸터·섹션 alt와 같은 웜 베이지) + 흰 테두리 → 크림 배경 위에 은은하게 뜬다
 *  white: 불투명 흰색 + 부드러운 그림자 → 가장 또렷하게 분리, 점 파동이 안 비침
 *  tint:  퍼플 소프트(#f1efff, 뱃지·아이콘 칩 색) → 브랜드 색이 들어가 통일감, 호버 하이라이트는 조금 더 진한 퍼플
 */
export type CardVariant = 'panel' | 'white' | 'tint'

const CARD_STYLE: Record<CardVariant, { card: string; highlight: string }> = {
  panel: {
    card: 'border-white bg-brand-panel group-hover:border-primary/40',
    highlight: 'bg-brand-accent-soft',
  },
  white: {
    card: 'border-border/60 bg-white shadow-[0_8px_30px_-12px_rgba(34,29,26,0.12)] group-hover:border-primary/40',
    highlight: 'bg-brand-accent-soft',
  },
  tint: {
    card: 'border-primary/10 bg-brand-accent-soft group-hover:border-primary/40',
    highlight: 'bg-primary/15',
  },
}

export function HoverEffect({
  items,
  className,
  variant = 'panel',
  columns = 3,
  align = 'left',
}: {
  items: HoverItem[]
  className?: string
  variant?: CardVariant
  /** lg에서의 열 수. 1이면 한 장이 폭을 다 쓴다 */
  columns?: 1 | 2 | 3
  /** 'center'면 가운데 정렬 + 본문 폭 제한 (리서치·플랫폼 1섹션 소개 박스의 기존 구성) */
  align?: 'left' | 'center'
}) {
  /*
   * grid + auto-rows-fr — 모든 행의 높이가 같아진다.
   * flex-wrap은 '줄 단위'로만 늘어나서, 항목이 열 수로 나눠떨어지지 않으면
   * 1행(3장)과 2행(2장)의 높이가 달라졌다 (1024에서 250 vs 194 — 측정으로 확인).
   */
  const colsClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  const style = CARD_STYLE[variant]
  const gridRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null)

  const onEnter = (e: MouseEvent<HTMLElement>) => {
    const grid = gridRef.current
    if (!grid) return
    const r = e.currentTarget.getBoundingClientRect()
    const g = grid.getBoundingClientRect()
    setBox({ left: r.left - g.left, top: r.top - g.top, width: r.width, height: r.height })
  }

  return (
    <div
      ref={gridRef}
      onMouseLeave={() => setBox(null)}
      className={cn('relative grid auto-rows-fr gap-4', colsClass, className)}
    >
      {/* 미끄러지는 하이라이트 — 카드 뒤(z-0) */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute z-0 rounded-3xl',
          style.highlight,
          'transition-[left,top,width,height,opacity] duration-200 ease-out',
          box ? 'opacity-100' : 'opacity-0',
        )}
        style={box ?? { left: 0, top: 0, width: 0, height: 0 }}
      />

      {items.map((item) => {
        const centered = align === 'center'
        const inner = (
          <div
            className={cn(
              'flex h-full w-full flex-col overflow-hidden rounded-2xl border p-6 transition-colors',
              style.card,
              centered && 'items-center p-8 text-center md:p-10',
            )}
          >
            {item.num && <span className="text-3xl font-black tabular-nums text-black/50">{item.num}</span>}
            <h4 className={cn('text-lg leading-7 font-bold text-foreground', item.num && 'mt-3', centered && 'mt-2')}>
              {item.title}
            </h4>
            {item.subtitle && (
              <div className={cn('text-sm leading-6 text-muted-foreground', !centered && 'mt-1')}>{item.subtitle}</div>
            )}
            {/* 가운데 정렬 카드(리서치·플랫폼 소개)는 섹션의 리드 문단이라 16px.
                왼쪽 정렬 카드(홈 4섹션)는 보조 설명이라 14px 그대로 둔다. */}
            <p
              className={cn(
                'mt-3 text-muted-foreground',
                centered ? 'mt-4 max-w-2xl text-base leading-[1.625rem]' : 'text-sm leading-6',
              )}
            >
              {item.description}
            </p>
          </div>
        )
        // 격자 칸(stretch)을 그대로 채우고, 안쪽 카드가 h-full로 그 높이를 쓴다
        const shell = 'group relative z-10 flex rounded-3xl p-2'
        // 링크가 있으면 <Link>, 없으면 정적 <div> — 어느 쪽이든 호버 하이라이트는 동일하게 붙는다
        return item.link ? (
          <Link key={item.title} to={item.link} onMouseEnter={onEnter} className={shell} data-quiet>
            {inner}
          </Link>
        ) : (
          <div key={item.title} onMouseEnter={onEnter} className={shell} data-quiet>
            {inner}
          </div>
        )
      })}
    </div>
  )
}
