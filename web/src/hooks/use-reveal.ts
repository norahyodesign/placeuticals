import { useEffect, useRef } from 'react'

/** 요소가 뷰포트에 16% 이상 들어오면 `is-in` 클래스를 붙여 스크롤 진입 애니메이션을 트리거한다 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.unobserve(el)
        }
      },
      { threshold: 0.16 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}
