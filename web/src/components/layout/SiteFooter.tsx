import { Link } from 'react-router-dom'
import { COMPANY, NAV_ITEMS, NAV_MENU } from '@/content/site'
import { asset } from '@/lib/asset'

/*
 * 푸터 — 왼쪽 로고 + 저작권, 오른쪽 4컬럼 링크, 맨 아래 거대한 회색 워드마크가 잘려 나가는 구성.
 * 컬럼은 상단 메뉴(NAV_MENU)의 페이지·하위 섹션 + 회사 정보로 채운다. 데모의 Socials/Register 같은
 * 자리엔 실제로 없는 링크를 넣지 않는다.
 * 불투명 배경(bg-muted) — 홈의 고정 백드롭(점 파동)이 뒤로 비치지 않게.
 */

const COLUMNS = [
  {
    title: '페이지',
    // 상단 메뉴와 같은 항목·같은 순서. NAV_ITEMS는 SiteHeader가 쓰는 바로 그 목록이라 한쪽만 바뀔 일이 없다.
    links: NAV_ITEMS.map((item) => ({ label: item.label, to: item.to })),
  },
  {
    title: '컨설팅',
    links: NAV_MENU.find((g) => g.to === '/consulting')?.children?.map((c) => ({ label: c.label, to: c.to })) ?? [],
  },
  {
    title: '회사',
    links: NAV_MENU.find((g) => g.to === '/about')?.children?.map((c) => ({ label: c.label, to: c.to })) ?? [],
  },
  {
    title: '문의',
    links: [
      { label: '상담 신청', to: '/support#contact' },
      { label: '개인정보처리방침', to: '/privacy' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted">
      <div className="mx-auto grid max-w-(--plt-container-wide) gap-12 px-6 pt-20 pb-10 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
        {/* 왼쪽 — 로고, 저작권, 연락처 */}
        <div>
          <Link to="/" className="inline-flex items-center">
            <img src={asset('/img/logo3.png')} alt="Placeuticals" className="h-9 w-auto" />
          </Link>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            © 2026 {COMPANY.legalName}. All rights reserved.
          </p>
          <div className="mt-6 space-y-1 text-xs leading-5 text-muted-foreground">
            <p>대표 {COMPANY.ceo}</p>
            <p>
              전화 {COMPANY.phone} · 팩스 {COMPANY.fax}
            </p>
            <p>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-foreground">
                {COMPANY.email}
              </a>
            </p>
            <p>{COMPANY.address}</p>
          </div>
        </div>

        {/* 오른쪽 — 4컬럼 링크 */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-foreground">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 거대한 워드마크 — 화면 가운데 정렬, 아래로 잘려 나간다 (footer의 overflow-hidden이 자른다).
          장식이라 스크린리더에선 숨김 */}
      <div aria-hidden="true" className="pointer-events-none -mb-[0.34em] pt-10 text-center select-none">
        <p className="text-[clamp(6rem,15vw,14rem)] leading-none font-black tracking-tight whitespace-nowrap text-foreground/[0.06]">
          Placeuticals
        </p>
      </div>
    </footer>
  )
}
