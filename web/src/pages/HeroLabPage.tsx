import type { ReactNode } from 'react'
import { HeroAurora } from '@/components/hero/HeroAurora'
import { HeroSpotlight } from '@/components/hero/HeroSpotlight'
import { HeroParticles } from '@/components/hero/HeroParticles'
import { HeroCalm } from '@/components/hero/HeroCalm'
import { HeroCursorRing } from '@/components/hero/HeroCursorRing'

/**
 * /hero-lab — 히어로 효과 후보 비교용 임시 페이지.
 * 하나를 고르면 그 컴포넌트를 HomePage로 옮기고, 이 페이지와 나머지 후보는 지운다.
 */

type Candidate = {
  id: string
  label: string
  name: string
  hero: ReactNode
  weight: string
  notes: string[]
}

const CANDIDATES: Candidate[] = [
  {
    id: 'a-aurora',
    label: 'A',
    name: '오로라 글로우',
    hero: <HeroAurora />,
    weight: 'CSS만 · JS 0KB',
    notes: [
      '브랜드 3색이 그대로 배경이 되므로 "남의 것 가져다 붙인 티"가 구조적으로 안 난다.',
      '지금 쓰는 gero.ai CDN 배경 이미지를 그대로 대체할 수 있는 유일한 후보 (1순위 작업이 같이 해결됨).',
      '단점: 흔한 효과다. 2024년 이후 SaaS 랜딩에서 많이 봤던 인상을 줄 수 있다.',
    ],
  },
  {
    id: 'b-spotlight',
    label: 'B',
    name: '격자 + 커서 스포트라이트',
    hero: <HeroSpotlight />,
    weight: 'CSS + pointermove 리스너 1개',
    notes: [
      '마우스를 움직여야 효과가 보인다 — 데스크톱에서 "반응한다"는 인상이 가장 강하다.',
      '터치 기기에서는 리스너를 아예 안 붙이고 고정 글로우로 보인다. 모바일 비용 0.',
      '단점: 격자가 기술/개발사 느낌을 준다. 바이오 기업 톤과 맞는지 판단 필요.',
    ],
  },
  {
    id: 'c-particles',
    label: 'C',
    name: '분자 네트워크',
    hero: <HeroParticles />,
    weight: 'canvas 상시 렌더 · 넷 중 가장 무거움',
    notes: [
      '세포·분자 결합을 연상시켜 네 후보 중 업종과 의미가 유일하게 맞는다.',
      '모바일·reduced-motion에서는 canvas를 마운트조차 안 하고 정적 그라디언트로 폴백.',
      '화면 밖으로 스크롤되면 IntersectionObserver로 렌더를 멈춘다.',
      '단점: 저사양 노트북에서 팬이 돈다. 점 개수(현재 최대 70)를 더 줄여야 할 수 있다.',
    ],
  },
  {
    id: 'd-calm',
    label: 'D',
    name: '절제형 (헤드라인 스윕)',
    hero: <HeroCalm />,
    weight: 'CSS만 · 성능 비용 사실상 0',
    notes: [
      '배경은 조용하고, 움직이는 건 제목을 훑는 빛 한 줄뿐.',
      '신뢰가 먼저인 제약·바이오 업종에서 가장 안전하다. 투자자·병원이 보는 사이트라면 유력.',
      '단점: 스크린샷으로는 밋밋하다. "화려한 거 하나"를 히어로가 아닌 다른 섹션에 양보하는 선택.',
    ],
  },
  {
    id: 'e-cursor-ring',
    label: 'E',
    name: 'Cursor Ring Field (Originkit)',
    hero: <HeroCursorRing />,
    weight: 'WebGL · 다섯 중 가장 무거움 · 라이선스 확인 필요',
    notes: [
      '커서를 따라 링 모양 파동이 점 필드를 훑는다. 마우스를 떼면 스스로 천천히 떠돈다.',
      '완성도는 다섯 중 가장 높다. 직접 구현으로는 이 수준이 안 나온다.',
      '⚠️ Originkit은 일부 컴포넌트가 유료(크레딧)다. 상용 배포 전 이 컴포넌트가 무료 범위인지 확인 필요.',
      '가드 3겹: lazy import(안 쓰면 번들에서 빠짐) + 모바일/reduced-motion 정적 폴백 + 화면 밖이면 언마운트.',
      '단점: 점이 어두워지는 구간이 있어 크림색 배경에서 회색 얼룩처럼 보일 수 있다. 실제로 보고 판단 필요.',
    ],
  },
]

export function HeroLabPage() {
  return (
    <div>
      {/* 헤더와 겹치지 않도록 화면 하단에 고정 — 히어로 상단은 홈과 동일하게 비워둔다 */}
      <nav className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
          {CANDIDATES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full px-3 py-1 text-xs font-semibold transition-colors hover:bg-accent hover:text-primary"
            >
              {c.label}. {c.name}
            </a>
          ))}
        </div>
      </nav>

      {CANDIDATES.map((c) => (
        <section key={c.id} id={c.id} className="scroll-mt-40">
          <div className="relative">
            {/* 헤더(고정, ~100px) 아래에 오도록 top-28 */}
            <div className="absolute top-28 right-6 z-10 rounded-full bg-brand-navy px-4 py-1.5 text-xs font-bold text-white">
              {c.label}. {c.name}
            </div>
            {c.hero}
          </div>

          <div className="border-y border-border bg-brand-panel px-6 py-6">
            <div className="mx-auto max-w-6xl">
              <p className="text-xs font-bold tracking-wide text-primary uppercase">{c.weight}</p>
              <ul className="mt-3 space-y-1.5">
                {c.notes.map((note) => (
                  <li key={note} className="flex gap-2 text-sm leading-6 text-foreground">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
