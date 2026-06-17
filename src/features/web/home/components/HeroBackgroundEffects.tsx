'use client'

import { useEffect, useRef } from 'react'

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: Math.round(Math.random() * 100),
  size: Math.round(2 + Math.random() * 3),
  duration: Math.round(12 + Math.random() * 10),
  delay: -Math.round(Math.random() * 20),
}))

export default function HeroBackgroundEffects() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = glowRef.current

      if (!el) return

      const x = (e.clientX / window.innerWidth - 0.5) * 30
      const y = (e.clientY / window.innerHeight - 0.5) * 30

      el.style.transform = `translate(${x}px, ${y}px)`
    }

    window.addEventListener('mousemove', handleMove)

    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--web-primary-rgb, 37, 146, 127),0.25) 0%, transparent 65%)',
          transition: 'transform 0.6s ease-out',
        }}
      />
      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: 'rgba(189,217,98,0.55)',
            animation: `heroParticleFloat ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes heroParticleFloat {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.25; }
          100% { transform: translateY(-520px) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
