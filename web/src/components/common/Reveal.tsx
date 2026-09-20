import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '@/hooks/use-reveal'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  /** 여러 요소를 순차적으로 등장시킬 때 ms 단위 지연 */
  delay?: number
  style?: CSSProperties
}

/** 스크롤로 뷰포트에 들어오면 페이드인 + 위로 슬라이드하는 래퍼 */
export function Reveal({ children, className, delay, style }: RevealProps) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className={cn('reveal', className)} style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}>
      {children}
    </div>
  )
}
