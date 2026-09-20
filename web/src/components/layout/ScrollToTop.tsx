import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollElementToCenter } from '@/lib/scroll'

/**
 * 라우트 이동 시 스크롤 처리 (React Router는 기본으로 안 해줌).
 *  - 해시가 있으면(#services 등) 그 섹션으로. 각 Section의 scroll-mt(헤더 높이만큼)를 존중하도록 scrollIntoView 사용
 *  - 해시가 없으면 맨 위로
 * 같은 페이지 안에서 해시만 바뀌는 경우도 처리해야 해서 pathname뿐 아니라 hash도 의존성에 넣는다.
 * 페이지 전환 직후엔 대상 섹션이 아직 그려지기 전일 수 있어 두 프레임 기다렸다가 찾는다.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    let frame = 0
    let tries = 0
    const scroll = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        // data-scroll-center가 붙은 섹션은 화면 세로 가운데에 놓는다 (해상도와 무관하게 같은 인상)
        if (el.hasAttribute('data-scroll-center')) scrollElementToCenter(el)
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      // 아직 렌더 전이면 몇 프레임 더 기다린다 (최대 ~20프레임)
      if (tries++ < 20) frame = requestAnimationFrame(scroll)
    }
    frame = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
