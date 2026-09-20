import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const isEmbed = process.env.BUILD_TARGET === 'embed'

/*
 * 배포 위치. GitHub Pages처럼 도메인 루트가 아닌 하위 경로에 올릴 때 SITE_BASE로 넘긴다
 * (예: SITE_BASE=/placeuticals/preview/). 개발 서버와 embed 빌드는 기본값 '/'.
 */
const base = process.env.SITE_BASE || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), isEmbed && cssInjectedByJsPlugin()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  define: {
    // IIFE lib 빌드에서는 react-dom 등이 참조하는 process.env.NODE_ENV가
    // Vite 앱 빌드와 달리 자동 치환되지 않아 "process is not defined"로 크래시한다.
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: isEmbed
    ? {
        outDir: 'dist-embed',
        cssCodeSplit: false,
        lib: {
          entry: path.resolve(import.meta.dirname, 'src/embed.tsx'),
          name: 'PltEmbed',
          formats: ['iife'],
          fileName: () => 'plt-embed.js',
        },
      }
    : {
        outDir: 'dist-site',
      },
})
