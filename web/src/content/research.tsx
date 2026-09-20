import { Pill, Dog, Sparkles } from 'lucide-react'

/*
 * 사진 — Unsplash 예시본 (Unsplash License: 상업 사용 무료, 저작자 표시 불필요).
 * ⚠️ 레이아웃 확인용 임시본. 확정되면 다운로드해 public/img로 옮겨 자체 서빙할 것.
 */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`

export const RESEARCH_HERO = {

  tags: ['Placenta-derived MSC', 'Exosome', 'R&BD Platform', 'Backward Design'],
}

export const RESEARCH_INTRO = {
  title: '태반 유래 줄기세포 및 엑소좀 기반 플랫폼',
  titleEn: 'Placenta-derived MSC & Exosome Platform',
  desc:
    '플라슈티컬즈는 태반 유래 줄기세포(MSC) 및 엑소좀 연구를 핵심 플랫폼으로, ' +
    '의약품, 동물의약품, 화장품 등 다양한 산업 분야로 응용 기술을 확장합니다. ' +
    'Backward Design 기반 개발 전략으로 연구부터 임상까지 일관된 로드맵을 제공합니다.',
}

export const RESEARCH_APPLICATIONS = [
  {
    icon: <Pill className="size-5" />,
    photo: unsplash('1579165466949-3180a3d056d5'), // 클린룸 가운 차림의 피펫팅 — 알약이 아니라 세포·엑소좀 치료제 개발
    title: '의약품',
    desc: '임상 진입을 목표로 하는 재생의료 치료제 개발. 첨단재생의료법 기반 임상연구 및 IND 승인 전략을 포함합니다.',
    tags: ['재생의료 치료제', '임상 진입', 'IND 전략'],
  },
  {
    icon: <Dog className="size-5" />,
    photo: unsplash('1543466835-00a7907e9de1'), // 반려견 — 브랜드 로고 없는 자연스러운 컷
    title: '동물의약품',
    desc: '반려동물 재생의료 치료제 개발. 동물용 의약품 허가 기준에 맞춘 비임상·임상 전략을 설계합니다.',
    tags: ['반려동물 재생의료', '동물 임상', '허가 전략'],
  },
  {
    icon: <Sparkles className="size-5" />,
    photo: unsplash('1556228720-195a672e8a03'), // 퍼플 세럼 — 브랜드 키컬러와 맞음
    title: '화장품',
    desc: '고기능성 바이오 소재 기반 화장품 개발. 태반 유래 성분의 기능성 원료 개발 및 제품화를 지원합니다.',
    tags: ['기능성 바이오소재', '원료 개발', '제품화'],
  },
]

export const RESEARCH_TIMELINE = [
  { num: '01', title: '기초 연구', desc: 'MSC / 엑소좀 특성 분석 및 작용기전 규명' },
  { num: '02', title: '비임상', desc: 'In vitro / In vivo 효능·독성 시험' },
  { num: '03', title: 'CMC', desc: '공정개발, 시료생산, 품질관리' },
  { num: '04', title: '임상', desc: '임상연구 계획 승인 및 임상 진입' },
  { num: '05', title: '상용화', desc: '허가 완료 및 제품 출시', highlight: true },
]

export const RESEARCH_QUOTE = {
  text: (
    <>
      하나의 플랫폼으로 <em>다양한 산업</em>으로 확장
    </>
  ),
  sub: 'Backward Design 기반 개발 전략 — 기초연구부터 상용화까지',
}

export const RESEARCH_CTA = {
  title: (
    <>
      공동 연구 및 <span>협업</span>을 환영합니다
    </>
  ),
  subtitle: '재생의료 연구, 플랫폼 활용, 컨설팅 등 모든 협업 문의를 환영합니다.',
}
