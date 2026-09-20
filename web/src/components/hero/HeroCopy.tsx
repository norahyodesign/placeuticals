import { type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { scrollElementToCenter } from '@/lib/scroll'
import { HOME_HERO } from '@/content/home'
import { cn } from '@/lib/utils'

/**
 * 히어로 후보 A~D가 공유하는 안쪽 내용.
 * 배경 효과만 다르고 문구·버튼은 동일해야 '효과' 자체를 비교할 수 있다.
 */
export function HeroCopy({ headlineClassName }: { headlineClassName?: string }) {
  /*
   * 2번째 섹션으로 이동 — 앵커 기본 동작은 '섹션 상단을 화면 위에 붙이기'라 해상도마다 보이는
   * 양이 달라진다. 기본 동작을 막고 화면 세로 가운데에 놓아 어느 모니터에서나 같게 보이게 한다.
   * 주소의 해시는 남겨 두되(공유·뒤로가기용) 라우팅은 일으키지 않는다.
   */
  const goToSection2 = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('what')
    if (!el) return
    e.preventDefault()
    scrollElementToCenter(el)
    history.replaceState(null, '', '#what')
  }

  return (
    <div className="mx-auto grid max-w-(--plt-container-wide) items-center gap-12 px-6 lg:grid-cols-[1.4fr_auto]">
      {/* data-quiet: 이 블록 뒤엔 보호막, 위에선 커서 링이 따라오지 않는다 (home-bg.css) */}
      <div data-quiet>
        {/* 데모(Cover)처럼 제목에 위→아래 미세 그라디언트. 잉크색에서 살짝 옅어진다 */}
        <h1
          className={cn(
            'bg-gradient-to-b from-foreground via-foreground to-foreground/75 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-6xl',
            headlineClassName,
          )}
        >
          {HOME_HERO.title}
        </h1>
        <p className="mt-5 text-lg text-primary italic">{HOME_HERO.subtitleEn}</p>
        {/* text-base — 2번째 섹션 부제(SectionHeading의 p, 16px)와 같은 크기.
            mt-7 — 영문 한 줄과 붙어 보여 16px에서 28px로 띄웠다 (제목·영문은 한 묶음, 본문은 별개) */}
        <p className="mt-7 max-w-xl text-base leading-[1.625rem] font-semibold text-foreground">{HOME_HERO.body}</p>
      </div>
      <div className="flex flex-col gap-3 sm:max-w-xs lg:w-56">
        <Button asChild size="lg">
          <a href="#what" onClick={goToSection2}>
            서비스 보기
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          {/* Link(라우터)로 — 생짜 <a>는 배포 하위 경로를 무시하고 도메인 루트로 가 404가 난다 */}
          <Link to="/support#contact">문의하기</Link>
        </Button>
      </div>
    </div>
  )
}
