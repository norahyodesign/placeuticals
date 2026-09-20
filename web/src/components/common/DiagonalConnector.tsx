import { useEffect, useRef, useState } from 'react'

type DiagonalConnectorProps = {
  /** 대각선 시작점 요소의 id — 왼쪽 아래 모서리를 기준으로 잡는다 */
  fromId: string
  /** 대각선 도착점 요소의 id — 왼쪽 위 모서리를 기준으로 잡는다 */
  toId: string
}

type Line = { x1: number; y1: number; x2: number; y2: number }

/** 두 섹션 사이를 잇는 장식용 대각선 — 부모 래퍼 기준 좌표를 측정해 SVG로 그린다 */
export function DiagonalConnector({ fromId, toId }: DiagonalConnectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [line, setLine] = useState<Line | null>(null)

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current
      const from = document.getElementById(fromId)
      const to = document.getElementById(toId)
      if (!container || !from || !to) return
      const containerRect = container.getBoundingClientRect()
      const fromRect = from.getBoundingClientRect()
      const toRect = to.getBoundingClientRect()

      // 시작 요소가 둥근 모서리(border-radius)를 가지면 대각선이 실제 보이는 곡선 위에서
      // 시작하도록, 45도 방향으로 반경만큼 안쪽으로 당겨준다 (그렇지 않으면 잘려나간 모서리
      // 바깥 여백에서 선이 시작해 카드와 떨어져 보인다).
      const radius = parseFloat(getComputedStyle(from).borderBottomLeftRadius) || 0
      const inset = radius * (1 - Math.SQRT1_2)

      const x1 = fromRect.left - containerRect.left + inset
      const y1 = fromRect.bottom - containerRect.top - inset
      const rawX2 = toRect.left - containerRect.left
      const rawY2 = toRect.top - containerRect.top

      // 도착점 앞 20px 여백을 두고 선을 멈춘다 (텍스트에 바로 닿지 않도록)
      const endMargin = 20
      const dx = rawX2 - x1
      const dy = rawY2 - y1
      const dist = Math.hypot(dx, dy)
      const ratio = dist > endMargin ? (dist - endMargin) / dist : 0

      setLine({
        x1,
        y1,
        x2: x1 + dx * ratio,
        y2: y1 + dy * ratio,
      })
    }

    measure()
    const raf = requestAnimationFrame(measure) // 폰트/이미지 로드 후 레이아웃 확정 시점 재측정
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [fromId, toId])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[-1]">
      {line && (
        <svg className="size-full overflow-visible">
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--border)"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  )
}
