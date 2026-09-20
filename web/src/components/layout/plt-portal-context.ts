import * as React from 'react'

/**
 * PoC/실전 공통: Radix 포털(Dialog/Sheet/Tooltip 등)을 호스트 페이지의 body가 아니라
 * PltRoot 컨테이너 하위에 렌더링하기 위한 컨텍스트. (마이그레이션 플랜 ADR-4)
 */
export const PltPortalContext = React.createContext<HTMLElement | null>(null)

export function usePltPortalContainer() {
  return React.useContext(PltPortalContext)
}
