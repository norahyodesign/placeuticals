import type { ComponentType } from 'react'
import { PocPage } from '@/pages/PocPage'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { ConsultingPage } from '@/pages/ConsultingPage'
import { ResearchPage } from '@/pages/ResearchPage'
import { PlatformPage } from '@/pages/PlatformPage'
import { SupportPage } from '@/pages/SupportPage'
import { PrivacyPage } from '@/pages/PrivacyPage'

/** data-plt-page 값 ↔ 렌더할 페이지 컴포넌트. site/embed 두 진입점이 공유한다. */
export const PAGE_REGISTRY: Record<string, ComponentType> = {
  poc: PocPage,
  home: HomePage,
  about: AboutPage,
  consulting: ConsultingPage,
  research: ResearchPage,
  platform: PlatformPage,
  support: SupportPage,
  privacy: PrivacyPage,
}
