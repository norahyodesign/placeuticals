import { createBrowserRouter, createHashRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { ConsultingPage } from '@/pages/ConsultingPage'
import { ResearchPage } from '@/pages/ResearchPage'
import { PlatformPage } from '@/pages/PlatformPage'
import { SupportPage } from '@/pages/SupportPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { HeroLabPage } from '@/pages/HeroLabPage'
import { CardColorLab } from '@/pages/CardColorLab'

/*
 * 하위 경로 배포(예: /placeuticals/preview/) 대응 — Vite가 넣어준 BASE_URL을 라우터 기준으로 삼는다.
 * 끝의 '/'는 떼야 한다 (react-router는 basename에 trailing slash가 붙으면 경로를 못 맞춘다).
 */
/*
 * 미리보기 배포(GitHub Pages)는 해시 라우팅을 쓴다.
 * Pages는 사이트 루트의 404.html만 SPA 폴백으로 써서, 하위 경로에 올린 미리보기는
 * /preview/about 같은 주소를 직접 열거나 새로고침하면 GitHub 기본 404가 뜬다.
 * 루트 404.html을 건드리면 운영 사이트의 오류 페이지까지 바뀌므로 여기서만 해시로 피한다.
 * 개발 서버와 운영 빌드는 그대로 깔끔한 주소(BrowserRouter)를 쓴다.
 */
const isHash = import.meta.env.VITE_ROUTER === 'hash'
const createRouter = isHash ? createHashRouter : createBrowserRouter

/*
 * 해시 라우팅에서는 basename이 주소가 아니라 '#' 뒤 경로에 적용된다. 하위 경로 배포의
 * '/placeuticals/preview'를 그대로 넘기면 #/about이 아무 라우트에도 안 맞아 빈 화면이 된다
 * (측정으로 확인). 해시 모드에서는 비운다.
 */
const basename = isHash ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '')

export const router = createRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/about', element: <AboutPage /> },
        { path: '/consulting', element: <ConsultingPage /> },
        { path: '/research', element: <ResearchPage /> },
        { path: '/platform', element: <PlatformPage /> },
        { path: '/support', element: <SupportPage /> },
        { path: '/privacy', element: <PrivacyPage /> },
        // 히어로 효과 후보 비교 페이지 (E가 채택되어 홈에 적용됨) — 참고용으로 남겨둠
        { path: '/hero-lab', element: <HeroLabPage /> },
        { path: '/card-lab', element: <CardColorLab /> }, // 임시: 카드 색 비교
      ],
    },
  ],
  { basename },
)
