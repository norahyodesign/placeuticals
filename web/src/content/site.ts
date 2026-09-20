export type NavItem = { label: string; to: string }

/*
 * 순서: 컨설팅 → 리서치 → 플랫폼.
 * 여기, NAV_MENU, content/home.tsx의 PILLARS, 홈 2섹션 부제 문구가 모두 같은 순서를 따라야 한다.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', to: '/' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CONSULTING', to: '/consulting' },
  { label: 'RESEARCH', to: '/research' },
  { label: 'PLATFORM', to: '/platform' },
  { label: 'CONTACT', to: '/support' },
]

/*
 * 메뉴 계층 구조 — 지금은 푸터(SiteFooter)가 컬럼을 만드는 데 쓴다.
 * (상단 메뉴의 호버 드롭다운을 없앤 뒤로 SiteHeader는 NAV_ITEMS만 쓴다.)
 * 하위 항목의 id는 각 페이지의 <Section id="..."> 와 같아야 한다 (해시 링크로 그 섹션에 착지).
 * description은 설명 문구용 초안 — 지금 화면에 쓰이는 곳은 없다.
 */
export type NavChild = { label: string; to: string; description: string }
export type NavGroup = { label: string; to: string; children?: NavChild[] }

export const NAV_MENU: NavGroup[] = [
  { label: 'HOME', to: '/' },
  {
    label: 'ABOUT',
    to: '/about',
    children: [
      { label: '회사소개 & 미션', to: '/about#mission', description: '재생의료를 임상으로 연결하는 플라슈티컬즈의 방향' },
      { label: '조직 구조', to: '/about#organization', description: '컨설팅·연구·플랫폼 세 축의 조직 체계' },
      { label: '기업부설연구소', to: '/about#lab', description: '인정 기업부설연구소의 연구 범위' },
      { label: '오시는길', to: '/about#location', description: '성남 센트럴비즈타워 1 · 찾아오시는 방법' },
    ],
  },
  {
    label: 'CONSULTING',
    to: '/consulting',
    children: [
      { label: '서비스', to: '/consulting#services', description: '임상·비임상·CMC·규제를 통합한 개발 전략 설계' },
      { label: '프로세스', to: '/consulting#process', description: 'Backward Design으로 임상 진입까지 가는 단계' },
    ],
  },
  {
    label: 'RESEARCH',
    to: '/research',
    children: [
      { label: '핵심 플랫폼', to: '/research#platform', description: '태반 유래 줄기세포 · 엑소좀 · 바이오소재' },
      { label: '적용 분야', to: '/research#application', description: '재생의료 분야별 적용 가능성' },
      { label: '개발 흐름', to: '/research#timeline', description: '연구에서 임상 진입까지의 개발 타임라인' },
    ],
  },
  {
    label: 'PLATFORM',
    to: '/platform',
    children: [
      { label: '개요', to: '/platform#overview', description: '연구부터 임상까지 전 주기를 잇는 통합 R&BD 플랫폼' },
      { label: '구조', to: '/platform#structure', description: '플랫폼을 구성하는 모듈과 연결 방식' },
    ],
  },
  {
    label: 'CONTACT',
    to: '/support',
    children: [
      { label: '자주 묻는 질문', to: '/support#qna', description: '상담 전에 많이 받는 질문과 답변' },
      { label: '상담 신청', to: '/support#contact', description: '연구 단계와 목표를 알려주시면 전략을 함께 검토합니다' },
    ],
  },
]


export const COMPANY = {
  name: '플라슈티컬즈',
  nameEn: 'Placeuticals',
  legalName: '주식회사 플라슈티컬즈',
  ceo: '이준',
  phone: '02-000-0000',
  fax: '02-000-0000',
  email: 'contact@placeuticals.co.kr',
  address: '경기도 성남시 중원구 갈마치로 314, 3층 305~306호(상대원동, 성남 센트럴비즈타워 1)',
  addressPostal: '(13201) 경기도 성남시 중원구 갈마치로 314, 3층 305~306호(상대원동, 성남 센트럴비즈타워 1)',
}

export const FOOTER_LINKS = [
  { label: '오시는길', to: '/about#location' },
  { label: '개인정보처리방침', to: '/privacy' },
]
