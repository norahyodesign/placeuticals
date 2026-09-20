import { Link } from 'react-router-dom'
import { COMPANY, NAV_MENU } from '@/content/site'
import { asset } from '@/lib/asset'

/*
 * 푸터 — 왼쪽 로고 + 저작권, 오른쪽 링크 컬럼, 맨 아래 거대한 회색 워드마크가 잘려 나가는 구성.
 * 컬럼 제목은 상단 메뉴의 상위 항목(HOME 제외: ABOUT~CONTACT)이고, 그 아래에 각 페이지의 하위 섹션을
 * 세로로 쌓는다. 데모의 Socials/Register 같은 자리엔 실제로 없는 링크를 넣지 않는다.
 * 불투명 배경(bg-muted) — 홈의 고정 백드롭(점 파동)이 뒤로 비치지 않게.
 */

// HOME은 왼쪽 로고가 이미 홈 링크라 컬럼으로 두지 않는다.
const COLUMNS = NAV_MENU.filter((group) => group.to !== '/')

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
          {/* 개인정보처리방침 — 어느 상위 메뉴에도 속하지 않아 저작권 쪽에 둔다 (일반적인 자리) */}
          <Link
            to="/privacy"
            className="mt-6 inline-block text-xs leading-5 text-muted-foreground transition-colors hover:text-foreground"
          >
            개인정보처리방침
          </Link>
        </div>

        {/* 오른쪽 — 상위 메뉴 하나가 컬럼 하나. 제목도 그 페이지로 가는 링크다 */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.to}>
              <Link to={col.to} className="text-sm font-bold text-foreground transition-colors hover:text-primary">
                {col.label}
              </Link>
              <ul className="mt-4 space-y-3">
                {col.children?.map((child) => (
                  <li key={child.to}>
                    <Link to={child.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {child.label}
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
