import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type MouseEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useScrolled } from '@/hooks/use-scrolled'
import { NAV_ITEMS } from '@/content/site'
import { asset } from '@/lib/asset'
import { cn } from '@/lib/utils'

/** 이 만큼 스크롤하면 전체 폭 바 → 떠 있는 알약으로 줄어든다 (Aceternity 원본 100px) */
const SHRINK_AT = 100

/* 맨 위: 배경·그림자 없이 투명한 전체 폭 바. 스크롤하면: 흰 반투명 + 블러 + 그림자의 떠 있는 알약 */
const GLASS_WIDE = 'bg-transparent shadow-none'
const GLASS_PILL =
  'bg-white/88 backdrop-blur-xl shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.4)_inset]'

/** 로고와 첫 메뉴 항목 사이 최소 여백(px 기준값 — rem 스케일에 맞춰 환산해 쓴다) */
const LOGO_GAP_REM = 3

/** CSS 길이 문자열('72rem' 또는 '1152px')을 px 숫자로. 컨테이너 폭 변수를 JS 계산에 맞추기 위한 것 */
function cssLength(value: string, rem: number) {
  const v = value.trim()
  const n = parseFloat(v)
  if (!Number.isFinite(n)) return 0
  return v.endsWith('rem') ? n * rem : n
}

/*
 * 데스크톱 메뉴가 실제로 들어가는지 재서 판단한다.
 * 고정 분기점(lg 등)으로 자르면 메뉴 항목 수·글자 길이가 바뀔 때마다 다시 맞춰야 하고,
 * 로고 옆 여백 같은 요구도 반영되지 않는다. 바 안에서 [로고 + 여백 + 메뉴 + CTA]가
 * 실제 폭을 넘기면 즉시 햄버거로 바꾼다.
 */
function useNavFits(
  headerRef: React.RefObject<HTMLElement | null>,
  barRef: React.RefObject<HTMLDivElement | null>,
  shrunk: boolean,
) {
  const [fits, setFits] = useState(true)
  /*
   * 메뉴가 숨겨지면(display:none) 폭을 잴 수 없어 다시 넓어져도 되돌아오지 못한다.
   * 그래서 "보이는 동안" 잰 값을 루트 폰트 크기로 나눠 rem 단위로 기억해 둔다.
   * 헤더의 모든 치수는 rem에 비례하므로(해상도 비례 스케일), 숨겨진 뒤에도
   * 기억한 값 × 현재 루트 폰트 = 필요한 폭이 된다.
   */
  const needPerRem = useRef(0)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const bar = barRef.current

      // 보이는 동안에만 실측해서 기준값을 갱신한다
      const logo = bar?.querySelector<HTMLElement>('[data-nav-logo]')
      const nav = bar?.querySelector<HTMLElement>('[data-nav-list]')
      const cta = bar?.querySelector<HTMLElement>('[data-nav-cta]')
      if (logo?.offsetWidth && nav?.offsetWidth && cta?.offsetWidth) {
        const need = logo.offsetWidth + LOGO_GAP_REM * rem + nav.scrollWidth + cta.offsetWidth
        needPerRem.current = need / rem
      }
      if (!needPerRem.current) return

      // 바에 주어지는 폭 — 헤더 좌우 px-4(1rem씩)를 빼고, 아래 className과 같은 규칙으로 계산한다:
      // 축소 상태면 min(72%, 바깥 틀의 92%), 아니면 바깥 틀(--plt-container-wide) 상한
      const headerInner = header.clientWidth - 2 * rem
      const wide = cssLength(getComputedStyle(document.documentElement).getPropertyValue('--plt-container-wide'), rem)
      const barOuter = shrunk ? Math.min(headerInner * 0.72, wide * 0.92) : Math.min(headerInner, wide)
      const avail = barOuter - 2 * rem // 바 자체의 px-4
      setFits(needPerRem.current * rem <= avail)
    }

    measure()
    const ro = new ResizeObserver(() => {
      if (!frame) frame = requestAnimationFrame(measure)
    })
    ro.observe(header)
    ro.observe(document.documentElement)
    return () => {
      ro.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [headerRef, barRef, shrunk])

  return fits
}

/*
 * 사이트 공통 헤더 — Aceternity "Resizable Navbar" 패턴 (드롭다운 없는 단순 링크 메뉴).
 *
 *  - 항상 떠 있다 (스크롤해도 사라지지 않음)
 *  - 맨 위: 전체 폭, 배경 없음(투명). SHRINK_AT 넘게 스크롤하면 가운데 떠 있는 블러 알약으로 폭이 줄어든다.
 *    motion 대신 CSS transition (width / transform / background / box-shadow)
 *  - 데스크톱 메뉴 호버: 하이라이트 알약이 항목 사이를 미끄러져 따라다닌다 (원본 layoutId="hovered")
 *  - 메뉴가 안 들어가는 폭이면 자동으로 햄버거로 전환 (useNavFits)
 *  - 모바일: 햄버거 → 바로 아래 패널이 펼쳐진다 (Sheet 대신, 원본 MobileNavMenu 방식)
 */
export function SiteHeader() {
  const { pathname } = useLocation()
  const shrunk = useScrolled(SHRINK_AT)
  const [mobileOpen, setMobileOpen] = useState(false)
  /*
   * 서브페이지는 첫 섹션이 다크 히어로다. 맨 위(알약으로 줄어들기 전)에는 헤더가 그 위에 겹쳐 뜨므로
   * 로고와 메뉴를 흰색으로 뒤집는다. 알약이 되면 흰 배경이 깔리므로 원래 색으로 돌아온다.
   * 홈은 첫 섹션이 밝은 캔버스라 항상 원래 색.
   */
  const isHome = pathname === '/' || pathname === '/hero-lab'
  const onDark = !isHome && !shrunk
  const headerRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const navFits = useNavFits(headerRef, barRef, shrunk)

  // 라우트가 바뀌면 모바일 패널을 닫는다
  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-4 z-50 px-4">
      {/* ── 데스크톱 ── 폭·위치·배경이 한 번에 전환되는 바 */}
      <div
        ref={barRef}
        className={cn(
          'mx-auto items-center justify-between rounded-full px-4 py-2',
          navFits ? 'flex' : 'hidden',
          'transition-[width,transform,background-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
          // 알약(축소) 상태의 72%는 큰 모니터에서 본문보다 훨씬 넓어져 버린다(2560에서 1817px) —
          // 바깥 틀의 92%로 상한을 둔다. 1512에서는 72%(1065px)가 먼저 걸려 그대로다.
          shrunk
            ? cn('w-[72%] max-w-[calc(var(--plt-container-wide)*0.92)] translate-y-3', GLASS_PILL)
            : cn('w-full max-w-(--plt-container-wide) translate-y-0', GLASS_WIDE),
        )}
      >
        <Logo onDark={onDark} data-nav-logo />
        <DesktopNav pathname={pathname} onDark={onDark} />
        <CtaButton className="text-sm" data-nav-cta />
      </div>

      {/* ── 모바일 ── 같은 축소 규칙 + 아래로 펼쳐지는 패널 */}
      <div
        className={cn(
          'relative mx-auto flex-col rounded-2xl px-4 py-2',
          navFits ? 'hidden' : 'flex',
          'transition-[width,transform,background-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
          shrunk || mobileOpen ? cn('w-[92%] translate-y-3', GLASS_PILL) : cn('w-full translate-y-0', GLASS_WIDE),
        )}
      >
        <div className="flex items-center justify-between">
          <Logo onDark={onDark && !mobileOpen} />
          {/* 상담 신청은 패널 안에 숨기지 않고 햄버거 옆에 그대로 노출한다 — 가장 중요한 행동이라 한 번에 닿아야 한다 */}
          <div className="flex items-center gap-1">
            <CtaButton className="text-sm" />
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
              className={cn('p-2 transition-colors', onDark && !mobileOpen ? 'text-white' : 'text-foreground')}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav
            aria-label="모바일 메뉴"
            className="animate-in fade-in slide-in-from-top-2 mt-2 flex flex-col gap-1 border-t border-border pt-3 pb-2 duration-200"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn('rounded-md px-3 py-2.5 text-sm font-medium text-foreground', isActive && 'text-primary')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function Logo({ onDark, ...rest }: { onDark?: boolean } & ComponentPropsWithoutRef<'a'>) {
  return (
    <Link to="/" className="flex shrink-0 items-center" {...rest}>
      {/* 다크 히어로 위에서는 로고를 흰색으로 뒤집는다 (별도 흰색 자산 없이 필터로) */}
      <img
        src={asset('/img/logo3.png')}
        alt="Placeuticals"
        className={cn('h-9 w-auto transition-[filter] duration-300', onDark && 'brightness-0 invert')}
      />
    </Link>
  )
}

/** 원본 NavbarButton(primary) — 알약, 은은한 그림자, 호버 시 살짝 떠오름. 색만 브랜드 퍼플 */
function CtaButton({ className, ...rest }: { className?: string } & ComponentPropsWithoutRef<'a'>) {
  return (
    <Link
      to="/support#contact"
      {...rest}
      className={cn(
        'inline-flex shrink-0 items-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground',
        'shadow-[0_0_24px_rgba(133,123,248,0.25),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(133,123,248,0.2)]',
        'transition-transform duration-200 hover:-translate-y-0.5',
        className,
      )}
    >
      상담 신청
    </Link>
  )
}

/**
 * 데스크톱 메뉴 — 항목 위에 마우스를 올리면 하이라이트 알약이 그 항목 위치·폭으로 미끄러진다.
 * 원본은 motion의 layoutId로 하는 것을, 호버된 항목의 offset을 재서 absolute div를 transition으로 옮긴다.
 */
function DesktopNav({ pathname, onDark }: { pathname: string; onDark: boolean }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const onItemEnter = (e: MouseEvent<HTMLElement>) => {
    const list = listRef.current
    if (!list) return
    const r = e.currentTarget.getBoundingClientRect()
    const l = list.getBoundingClientRect()
    setPill({ left: r.left - l.left, width: r.width })
  }

  return (
    <div ref={listRef} className="relative ml-12" onMouseLeave={() => setPill(null)}>
      {/* 미끄러지는 하이라이트 */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-full',
          onDark ? 'bg-white/15' : 'bg-accent',
          'transition-[left,width,opacity] duration-200 ease-out',
          pill ? 'opacity-100' : 'opacity-0',
        )}
        style={{ left: pill?.left ?? 0, width: pill?.width ?? 0 }}
      />
      <nav data-nav-list aria-label="주요 메뉴" className="relative flex items-center gap-0.5">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onMouseEnter={onItemEnter}
            className={triggerClass(item.to === '/' ? pathname === '/' : pathname.startsWith(item.to), onDark)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

/** 메뉴 링크 공통 — 배경은 항상 투명(하이라이트는 미끄러지는 알약이 담당), 둥근 알약 모양 */
function triggerClass(active: boolean, onDark = false) {
  return cn(
    // 14px — 굵기로 현재 페이지를 구분한다: 비활성 regular, 활성만 bold
    'relative z-10 inline-flex h-9 items-center rounded-full px-4 text-sm font-normal whitespace-nowrap transition-colors',
    onDark ? 'text-white/80 hover:text-white' : 'text-foreground/75 hover:text-foreground',
    active && cn('font-bold', onDark ? 'text-white' : 'text-primary'),
  )
}
