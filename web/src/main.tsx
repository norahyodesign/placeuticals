import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/index.css'
import { PltRoot } from '@/components/layout/PltRoot'
import { router } from '@/routes'

// site 진입점 — 로컬 개발(pnpm dev) 및 GitHub Pages 빌드용.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PltRoot>
      <RouterProvider router={router} />
    </PltRoot>
  </StrictMode>,
)
