import { Outlet } from 'react-router-dom'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollToTop } from '@/components/layout/ScrollToTop'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <SiteHeader />
      {/* 상단 여백 없음 — 모든 페이지에서 첫 섹션이 헤더 뒤로 깔린다(겹치기).
          헤더를 피하는 여백은 각 첫 섹션이 직접 갖는다 (PageHero·TabPageHeader의 pt-40, 홈 히어로의 pt-56) */}
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
