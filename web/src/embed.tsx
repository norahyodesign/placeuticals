import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { PltRoot } from '@/components/layout/PltRoot'
import { PAGE_REGISTRY } from '@/pages/registry'

/**
 * 임베드 진입점 — 아임웹 등 외부 호스트 페이지에 삽입되는 IIFE 번들.
 * 계약(마이그레이션 플랜 §8.2):
 *   <div data-plt-page="poc"></div>
 *   <script src=".../plt-embed.js" defer></script>
 */
declare global {
  interface Window {
    __PLT_EMBED__?: boolean
  }
}

function mount(el: HTMLElement) {
  const pageKey = el.dataset.pltPage ?? ''
  const Page = PAGE_REGISTRY[pageKey]
  if (!Page) {
    console.warn(`[plt-embed] unknown data-plt-page="${pageKey}"`)
    return
  }
  if (el.dataset.pltMounted === 'true') return
  el.dataset.pltMounted = 'true'
  createRoot(el).render(
    <PltRoot>
      <Page />
    </PltRoot>,
  )
}

function scanAndMount() {
  document
    .querySelectorAll<HTMLElement>('[data-plt-page]:not([data-plt-mounted="true"])')
    .forEach(mount)
}

if (!window.__PLT_EMBED__) {
  window.__PLT_EMBED__ = true
  scanAndMount()
  // 아임웹 편집기가 SPA 방식으로 위젯을 늦게 주입하는 경우를 대비한 감시
  new MutationObserver(() => scanAndMount()).observe(document.body, {
    childList: true,
    subtree: true,
  })
}
