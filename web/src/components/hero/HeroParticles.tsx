import { useEffect, useRef, useState } from 'react'
import { HeroCopy } from '@/components/hero/HeroCopy'

const LINK_DISTANCE = 150 // px — 이 거리 안의 점끼리만 선으로 잇는다
const DOT_COLORS = ['#6a5ef0', '#857bf8', '#c0baf7'] // 퍼플 딥 / 키 / 라이트

type Node = { x: number; y: number; vx: number; vy: number; r: number; color: string }

/**
 * 후보 C — 분자 네트워크
 * 점들이 떠다니며 가까운 것끼리 연결된다. 세포·분자 결합을 연상시켜 업종과 의미가 맞는다.
 * 다만 셋 중 유일하게 canvas를 계속 다시 그리므로 가장 무겁다.
 * → 모바일과 reduced-motion에서는 canvas를 아예 마운트하지 않고 정적 그라디언트로 대체한다.
 */
export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    const sync = () => setAnimate(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!animate) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let nodes: Node[] = []
    let width = 0
    let height = 0
    let frame = 0
    let running = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // 3x 화면에서 픽셀 4배로 그리는 낭비 방지
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // 면적에 비례해 점 개수 결정 (넓은 화면에서만 많아지도록). 상한 70.
      const count = Math.min(70, Math.round((width * height) / 18000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.4 + Math.random() * 2.2,
        color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        // 가장자리에서 반사
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      // 연결선 먼저 (점 아래에 깔리도록)
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.hypot(dx, dy)
          if (dist > LINK_DISTANCE) continue
          // 멀수록 옅게
          ctx.strokeStyle = `rgba(133, 123, 248, ${(1 - dist / LINK_DISTANCE) * 0.28})`
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = n.color
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      frame = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    resize()
    frame = requestAnimationFrame(draw)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // 화면 밖으로 스크롤되면 그리기를 멈춘다 (배터리·CPU 절약)
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(canvas)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
    }
  }, [animate])

  return (
    <section className="plt-hero plt-particles px-6 pt-56 pb-24 md:pt-64 md:pb-32">
      <div className="plt-hero__bg" aria-hidden="true">
        {animate ? (
          <canvas ref={canvasRef} className="plt-particles__canvas" />
        ) : (
          <div className="plt-particles__fallback" />
        )}
      </div>
      <HeroCopy />
    </section>
  )
}
