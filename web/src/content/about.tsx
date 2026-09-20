import { FlaskConical, Award, Handshake, Route } from 'lucide-react'

/*
 * 사진 — Unsplash 예시본. Unsplash License(상업 사용 무료, 저작자 표시 불필요).
 * ⚠️ 임시본이다. 실제 사무실·연구소 사진이 확보되면 교체할 것 —
 *    스톡 사진으로 "우리 연구소"를 대신하면 아는 사람은 바로 알아본다.
 * 확정 시 다운로드해 public/img로 옮겨 자체 서빙할 것 (외부 CDN 의존 제거).
 */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`

/** 회사소개 본문 아래 — 흰 가운의 연구자들이 장비 앞에서 일하는 모습 (사람이 있는 실재감) */
export const COMPANY_PHOTO = unsplash('1581093450021-4a7360e9a6b5')

/** 기업부설연구소 — 유리벽의 현대적 시설 복도 (시설·인프라) */
export const LAB_PHOTO = unsplash('1497366754035-f200968a6e72')

export const ABOUT_HEADER = {
  tags: ['태반 유래 MSC', '엑소좀', '임상 진입 전략', '기업부설연구소'],
}

export const MISSION_QUOTE = {
  text: '연구와 임상 사이의 간극을 개발 전략으로 연결합니다',
  en: 'Bridging the gap between research and clinical entry through development strategy',
}

export const COMPANY_TAGS = [
  { title: 'Strategy-driven', sub: '임상 진입 중심의 개발 전략' },
  { title: 'Backward Design', sub: '목표 기반 역방향 설계 방법론' },
  { title: 'Regenerative Medicine', sub: '태반 유래 줄기세포·엑소좀 연구' },
  { title: '인증 벤처기업', sub: '벤처기업 인증 보유' },
]

export const ORG_CHART = {
  root: { title: 'CEO', en: 'Chief Executive Officer' },
  chain: [{ title: 'CTO', en: 'Chief Technology Officer' }, { title: '연구소장', en: 'Research Director' }],
  children: [
    { title: '개발팀', en: 'Development' },
    { title: '임상팀', en: 'Clinical' },
    { title: '기획팀', en: 'Strategy & Planning' },
  ],
}

export const LAB_DESC =
  '플라슈티컬즈는 기업부설연구소를 기반으로 재생의료 연구개발 및 임상 진입 전략을 수행합니다. ' +
  '자체 R&D 역량을 갖추고 외부 기업의 연구개발 전략도 함께 지원합니다.'

export const LAB_ITEMS = [
  {
    icon: <FlaskConical className="size-5" />,
    title: '재생의료 연구개발',
    desc: '태반 유래 줄기세포·엑소좀 기반 연구를 체계적으로 수행합니다. 임상 진입 요건에 맞춘 연구 설계로 효율적인 개발을 추진합니다.',
  },
  {
    icon: <Award className="size-5" />,
    title: '인증 R&D 역량',
    desc: '기업부설연구소 인정을 기반으로 공인된 연구개발 역량을 보유합니다. 연구비 세액공제 등 제도적 혜택을 활용한 지속 가능한 R&D를 운영합니다.',
  },
  {
    icon: <Handshake className="size-5" />,
    title: '외부 기업 지원',
    desc: '재생의료 기업의 기업부설연구소 인정 컨설팅도 제공합니다. 조직 설계, 연구개발 체계 구축, 인정 신청 대응을 지원합니다.',
  },
  {
    icon: <Route className="size-5" />,
    title: '통합 개발 전략',
    desc: '연구소 내에서 연구와 전략을 함께 설계합니다. Backward Design 방법론을 연구소 운영에 적용하여 임상 진입 목표와 정렬된 연구를 수행합니다.',
  },
]

export const LOCATION_INFO = [
  {
    label: '주소',
    value: '(13201) 경기도 성남시 중원구 갈마치로 314\n3층 305~306호 (상대원동, 성남 센트럴비즈타워 1)',
  },
  { label: '이메일', value: 'contact@placeuticals.co.kr' },
  { label: '대중교통', value: '지하철 8호선 남한산성입구역 2번 출구\n도보 약 10분' },
]

export const LOCATION_MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.5!2d127.1578!3d37.4382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca5!2z7ISx64Ko7IS87Yq4656067mE7KaI7YOA7JuMIDHssKg!5e0!3m2!1sko!2skr!4v1700000000000'
