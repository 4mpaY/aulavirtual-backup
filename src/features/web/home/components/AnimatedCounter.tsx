'use client'

import { useEffect, useRef, useState } from 'react'

import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}

export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1400 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3

      setDisplay(Math.round(eased * value))

      if (progress < 1) requestAnimationFrame(tick)
    }

    const frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString('es-PE')}{suffix}
    </span>
  )
}
