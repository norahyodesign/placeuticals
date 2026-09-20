import { Cover } from '@/components/ui/cover'
import { CONSULTING_SERVICES } from '@/content/consulting'

export const HOME_HERO = {
  /** 히어로 제목 — "개발 전략"을 Cover(호버 시 빛줄기 박스)로 감싼다 */
  title: (
    <>
      재생의료를 임상으로
      <br />
      연결하는 <Cover>개발 전략</Cover>
    </>
  ),
  subtitleEn: 'Translating Regenerative Science into Clinical Strategy',
  body: (
    <>
      플라슈티컬즈는 태반 유래 줄기세포 및 엑소좀 기반 연구와
      <br />
      임상 진입 및 개발 전략 (Translational Development Strategy)을 수행합니다.
    </>
  ),
}

/*
 * photo: Unsplash 예시 사진 (PillarShowcase 카드용). Unsplash License — 상업 사용 무료, 저작자 표시 불필요.
 * 지금은 images.unsplash.com 직링크(시안용). 채택되면 다운로드해 public/img에 두고 자체 서빙할 것 —
 * 외부 CDN 의존은 gero.ai 배경에서 이미 한 번 걷어낸 문제다.
 * ⚠️ public/img/main1.jpg·main2.jpg는 Shutterstock 워터마크 미리보기라 쓰지 않는다.
 */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`

// detail·tags는 각 페이지 콘텐츠(research/consulting/platform.tsx)에 이미 있는 문구에서 뽑은 것 — 새로 지어낸 주장 없음
export const PILLARS = [
  {
    img: '/img/symbol2.png',
    photo: unsplash('1581093588401-fbb62a02f120'), // 보안경 쓴 연구자 옆모습 — 사람·판단·전략
    title: '개발 전략 컨설팅',
    en: 'Development Strategy Consulting',
    desc: '임상, 비임상, CMC 및 규제 요건을 통합적으로 고려한 개발 전략을 설계합니다.',
    detail:
      '임상 진입이라는 목표를 먼저 정의하고 CMC·비임상·공정개발을 역순으로 설계하는 Backward Design 방법론을 적용합니다. ' +
      '첨단재생의료 임상연구 계획 승인, 실시기관 인증, 기업부설연구소 인정, 비임상 시험 설계까지 전주기 전략을 지원합니다.',
    tags: ['Backward Design', '첨단재생의료', '비임상 설계', '기업부설연구소'],
    link: { label: '컨설팅 서비스 보기', to: '/consulting' },
    tint: '#6a5ef0', // 퍼플 딥
  },
  {
    img: '/img/symbol1.png',
    photo: unsplash('1576086213369-97a306d36557'), // 형광 염색 세포 — 퍼플 톤이 브랜드 색과 맞음
    title: '연구',
    en: 'Research',
    desc: '줄기세포, 엑소좀 및 바이오소재를 기반으로 재생의료 분야의 핵심 기술을 연구합니다.',
    detail:
      '태반 유래 줄기세포(MSC)와 엑소좀 연구를 핵심 플랫폼으로, 의약품·동물의약품·화장품 등 다양한 산업 분야로 응용 기술을 확장합니다. ' +
      '기초 연구에서 MSC·엑소좀 특성 분석과 작용기전을 규명하고, 비임상 효능·독성 시험으로 이어갑니다.',
    tags: ['Placenta-derived MSC', 'Exosome', '의약품 · 동물의약품 · 화장품'],
    link: { label: '연구 플랫폼 보기', to: '/research' },
    tint: '#857bf8', // 퍼플 키
  },
  {
    img: '/img/symbol3.png',
    photo: unsplash('1579154204601-01588f351e67'), // 실험실 시설 전경 — 인프라·플랫폼
    title: '플랫폼',
    en: 'Platform',
    desc: '연구부터 임상까지 전 주기를 연결하는 통합 R&BD 플랫폼을 제공합니다.',
    detail:
      '임상 요구사항을 기준으로 개발 전주기를 설계하는 통합 R&BD 플랫폼을 운영합니다. ' +
      '공정개발 → 시료생산 → 비임상 → CMC → 임상으로 이어지는 일관된 로드맵을 하나의 플랫폼에서 제공합니다.',
    tags: ['Integrated R&BD', '공정개발 · 시료생산', 'CMC', '임상 요구사항 기반'],
    link: { label: '플랫폼 구조 보기', to: '/platform' },
    tint: '#c0baf7', // 퍼플 라이트
  },
]

export const MESSAGE = {
  title: (
    <>
      <em id="backward-start">Backward Design</em>으로 설계합니다.
    </>
  ),
  subtitleEn: 'From Research to Clinical Entry, Designed Backward',
  // 스크롤 스토리(StickyScrollReveal) 항목. tint는 퍼플 3단계(딥/키/라이트), photo는 Unsplash 예시(위 주석 참고)
  // points는 consulting.tsx(서비스·프로세스)에 이미 있는 문구에서 뽑은 것 — 새로 지어낸 주장 없음
  items: [
    {
      tint: '#6a5ef0',
      category: 'Requirement-driven',
      title: '임상 요구사항 기반 설계',
      desc: '초기 연구 단계부터 임상 규제 요건을 반영해 개발 방향을 설계합니다.',
      points: [
        '임상 진입이라는 목표를 먼저 정의',
        'CMC · 비임상 · 공정개발을 역순으로 설계',
        '개발 전략 통합 로드맵 수립',
      ],
      photo: unsplash('1582560475093-ba66accbc424'), // 장갑 낀 손의 피펫팅 — 정밀한 설계
    },
    {
      tint: '#857bf8',
      category: 'Efficiency',
      title: '반복시험 최소화',
      desc: '불필요한 비임상·임상 반복시험을 줄여 개발 기간과 비용을 절감합니다.',
      points: [
        '임상 진입 요건 대비 현황 갭 분석',
        'In vitro / In vivo 모델 선정과 효능·독성 시험 계획',
        'GLP 전략까지 포함한 비임상 로드맵',
      ],
      photo: unsplash('1532187863486-abf9dbad1b69'), // 웰 플레이트 — 반복되는 시험
    },
    {
      tint: '#c0baf7',
      category: 'Clinical Entry',
      title: '효율적인 임상 진입 지원',
      desc: '인허가 전략을 사전에 정립해 임상 진입까지의 과정을 신속하게 지원합니다.',
      points: [
        '첨단재생의료 임상연구 계획 승인 전략',
        '첨단재생의료위원회 심의 · IRB 승인 대응',
        '단계별 문서 · 인증 · 심의 실행 지원',
      ],
      photo: unsplash('1628595351029-c2bf17511435'), // DNA 나선 — 앞으로 나아감
    },
  ],
}

/*
 * 4번째 섹션(핵심 컨설팅 영역) 카드 — 컨설팅 페이지의 5개 서비스와 1:1.
 * 설명은 각 서비스 설명의 첫 문장(핵심 한 줄)만. 전문은 클릭해서 컨설팅 서비스 섹션에서.
 */
export const HIGHLIGHT_ITEMS = [
  { num: '01', title: 'Backward Design' },
  { num: '02', title: '첨단재생의료임상연구 계획 승인' },
  { num: '03', title: '첨단재생의료실시기관 인증' },
  { num: '04', title: '기업부설연구소 인정' },
  { num: '05', title: '비임상 시험 설계' },
].map((item, i) => ({
  ...item,
  description: CONSULTING_SERVICES[i].desc.split('. ')[0].replace(/\.$/, '') + '.',
  link: '/consulting#services',
}))
