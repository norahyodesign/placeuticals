/*
 * 사진 — Unsplash 예시본 (상업 사용 무료). ⚠️ 레이아웃 확인용 임시본, 확정 시 자체 서빙할 것.
 */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`

/** 서비스와 프로세스 사이 가로 밴드 — 가운 입은 연구자가 화면을 보며 설명하는 장면 (전략 논의) */
export const CONSULTING_PHOTO = unsplash('1666214280557-f1b5022eb634')

export const CONSULTING_HERO = {
  tags: ['Backward Design', '첨단재생의료', '비임상 설계', '기업부설연구소'],
}

export const CONSULTING_SERVICES = [
  {
    num: '01',
    titleEn: 'Backward Design Strategy',
    title: 'Backward Design 컨설팅',
    desc:
      '임상 요구사항 기반 개발 전략 설계. 임상 진입이라는 목표를 먼저 정의하고, ' +
      '그 요건에 맞춰 CMC · 비임상 · 공정개발을 역순으로 설계하는 방법론을 적용합니다. ' +
      '반복시험을 최소화하고 통합 개발 로드맵을 수립합니다.',
    tags: ['임상 요구사항 기반 설계', '개발 전략 통합 로드맵', '반복시험 최소화', 'CMC 전략'],
  },
  {
    num: '02',
    titleEn: 'Advanced Regenerative Medicine Clinical Research',
    title: '첨단재생의료 임상연구 컨설팅',
    desc:
      '첨단재생의료법상 임상연구 계획 수립 및 승인 전략을 지원합니다. ' +
      '연구계획서 작성부터 첨단재생의료위원회 심의 대응, IRB 승인 전략까지 ' +
      '임상 진입을 위한 전주기 행정·전략 컨설팅을 제공합니다.',
    tags: ['연구계획서 작성', '첨단재생의료위원회 대응', 'IRB 대응', 'endpoint 설계'],
  },
  {
    num: '03',
    titleEn: 'Implementing Institution Certification',
    title: '첨단재생의료 실시기관 인증 컨설팅',
    desc:
      '첨단재생의료 실시기관 인증 획득을 위한 개발 환경 구축 전략을 제공합니다. ' +
      '시설 및 장비 설계부터 표준운영절차(SOP) 수립, 품질관리 체계 구축까지 ' +
      '인증 요건에 맞춘 종합 컨설팅을 진행합니다.',
    tags: ['시설 및 장비 설계', 'SOP 구축', '품질관리 체계'],
  },
  {
    num: '04',
    titleEn: 'Corporate R&D Institute Certification',
    title: '기업부설연구소 인정 컨설팅',
    desc:
      '연구개발 조직 구축 및 기업부설연구소 인정 전략을 수립합니다. ' +
      '조직 설계, 연구개발 체계 구축, 인정 신청 대응까지 체계적인 R&D 조직 구성을 지원합니다.',
    tags: ['조직 설계', '연구개발 체계 구축', '인정 대응'],
  },
  {
    num: '05',
    titleEn: 'Non-clinical Study Design',
    title: '비임상 시험 설계 컨설팅',
    desc:
      '임상 진입을 위한 최적화된 비임상 전략을 설계합니다. ' +
      'In vitro / In vivo 모델 선정부터 효능·독성 시험 계획, ' +
      'GLP(Good Laboratory Practice) 전략까지 체계적인 비임상 로드맵을 제공합니다.',
    tags: ['in vitro / in vivo 모델', '효능 및 독성 시험', 'GLP 전략'],
  },
]

export const CONSULTING_PROCESS = [
  { num: '01', title: '초기 진단', desc: '현재 연구 단계 및 임상 목표 파악' },
  { num: '02', title: '갭 분석', desc: '임상 진입 요건 대비 현황 분석' },
  { num: '03', title: '전략 설계', desc: 'Backward Design 기반 개발 로드맵 수립' },
  { num: '04', title: '실행 지원', desc: '각 단계별 문서·인증·심의 지원' },
  { num: '05', title: '임상 진입', desc: '승인 및 임상 진입 완료', highlight: true },
]

export const CONSULTING_CTA = {
  title: (
    <>
      지금 바로 <span>전략 상담</span>을 시작하세요
    </>
  ),
  subtitle: '어떤 단계에서든, 임상 진입을 목표로 하는 모든 기업의 문의를 환영합니다.',
}
