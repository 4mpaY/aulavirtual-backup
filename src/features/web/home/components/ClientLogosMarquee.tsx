'use client'

import React, { useRef } from 'react'

import { sectionDesc } from './typography'

type HardcodedLogo = { label: string; initials: string; color: string; light: string }
type DynamicLogo = { label: string; url: string }
type LogoItem = HardcodedLogo | DynamicLogo

const DEFAULT_LOGOS: HardcodedLogo[] = [
  { label: 'TechCorp', initials: 'TC', color: '#1a73e8', light: '#e8f0fe' },
  { label: 'Minera Sur', initials: 'MS', color: '#d93025', light: '#fce8e6' },
  { label: 'Grupo Alfa', initials: 'GA', color: '#e37400', light: '#fef3e2' },
  { label: 'Innovatech', initials: 'IT', color: '#6d4c41', light: '#efebe9' },
  { label: 'Petrol SA', initials: 'PS', color: '#1e7e34', light: '#d4edda' },
  { label: 'Construmax', initials: 'CM', color: '#4527a0', light: '#ede7f6' },
  { label: 'AgroPerú', initials: 'AP', color: '#00838f', light: '#e0f7fa' },
  { label: 'Energía+', initials: 'E+', color: '#c62828', light: '#ffebee' },
  { label: 'Mantención', initials: 'MN', color: '#2e7d32', light: '#e8f5e9' },
  { label: 'HidroCorp', initials: 'HC', color: '#01579b', light: '#e3f2fd' },
]

interface Props {
  logos?: DynamicLogo[]
  title?: string
  description?: string
}

export default function ClientLogosMarquee({
  logos: logosFromProps,
  title = 'Capacita a tu equipo,\nsin complicaciones',
  description
}: Props) {
  const activeLogos: LogoItem[] =
    logosFromProps && logosFromProps.length > 0 ? logosFromProps : DEFAULT_LOGOS

  const [titleLine1, titleLine2] = title.split('\n')

  // Con pocos logos el marquee deja un hueco vacío en vez de hacer scroll continuo:
  // en ese caso los mostramos estáticos y centrados.
  const MIN_LOGOS_FOR_MARQUEE = 6
  const shouldScroll = activeLogos.length >= MIN_LOGOS_FOR_MARQUEE
  const track = shouldScroll ? [...activeLogos, ...activeLogos, ...activeLogos] : activeLogos
  const rowRef = useRef<HTMLDivElement>(null)

  const pauseAnimation = () => {
    if (rowRef.current) rowRef.current.style.animationPlayState = 'paused'
  }

  const resumeAnimation = () => {
    if (rowRef.current) rowRef.current.style.animationPlayState = 'running'
  }

  return (
    <section
      style={{
        backgroundColor: '#f8fafc',
        borderTop: '1px solid hsl(214,20%,91%)',
        borderBottom: '1px solid hsl(214,20%,91%)',
        padding: '3rem 0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 1rem' }}>
        <h2
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            color: '#0A0A0A',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: description?.trim() ? '0.75rem' : 0,
          }}
        >
          {titleLine1}
          {titleLine2 && (
            <>
              {' '}
              <span style={{ color: 'var(--web-primary, #25927F)' }}>{titleLine2}</span>
            </>
          )}
        </h2>
        {description?.trim() && (
          <p style={{ ...sectionDesc, textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            {description}
          </p>
        )}
      </div>

      {/* Marquee wrapper */}
      <div style={{ position: 'relative' }}>
        {shouldScroll && (
          <>
            {/* Fade izquierdo */}
            <div
              aria-hidden
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '10rem', zIndex: 2,
                background: 'linear-gradient(to right, #f8fafc 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
            {/* Fade derecho */}
            <div
              aria-hidden
              style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: '10rem', zIndex: 2,
                background: 'linear-gradient(to left, #f8fafc 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Track */}
        <div
          ref={rowRef}
          onMouseEnter={shouldScroll ? pauseAnimation : undefined}
          onMouseLeave={shouldScroll ? resumeAnimation : undefined}
          style={{
            display: 'flex',
            gap: '1.25rem',
            width: shouldScroll ? 'max-content' : '100%',
            justifyContent: shouldScroll ? 'flex-start' : 'center',
            flexWrap: shouldScroll ? 'nowrap' : 'wrap',
            padding: shouldScroll ? 0 : '0 1rem',
            animation: shouldScroll ? 'marqueeScroll 40s linear infinite' : 'none',
          }}
        >
          {track.map((logo, i) => (
            'url' in logo
              ? <DynamicLogoCard key={i} label={logo.label} url={logo.url} />
              : <LogoCard key={i} {...logo} />
          ))}
        </div>
      </div>

      {shouldScroll && (
        <style>{`
          @keyframes marqueeScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
        `}</style>
      )}
    </section>
  )
}

function DynamicLogoCard({ label, url }: { label: string; url: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (!ref.current) return
    ref.current.style.filter = 'grayscale(0) opacity(1)'
    ref.current.style.transform = 'scale(1.05)'
    ref.current.style.borderColor = 'var(--web-primary, #25927F)'
    ref.current.style.boxShadow = '0 6px 24px rgba(37,146,127,0.2)'
  }

  const handleLeave = () => {
    if (!ref.current) return
    ref.current.style.filter = 'grayscale(1) opacity(0.55)'
    ref.current.style.transform = 'scale(1)'
    ref.current.style.borderColor = 'hsl(214,20%,90%)'
    ref.current.style.boxShadow = 'none'
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        flexShrink: 0,
        width: '200px',
        height: '80px',
        padding: '0.5rem 0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        border: '1.5px solid hsl(214,20%,90%)',
        backgroundColor: '#ffffff',
        cursor: 'default',
        filter: 'grayscale(1) opacity(0.55)',
        transition: 'filter 0.3s ease, transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        userSelect: 'none',
      }}
    >
      <img
        src={url}
        alt={label}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  )
}

function LogoCard({ label, initials, color, light }: HardcodedLogo) {
  const ref = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (!ref.current) return
    ref.current.style.filter = 'grayscale(0) opacity(1)'
    ref.current.style.transform = 'scale(1.05)'
    ref.current.style.borderColor = color
    ref.current.style.boxShadow = `0 6px 24px ${color}22`
    const badge = ref.current.querySelector('.logo-badge') as HTMLElement | null

    if (badge) {
      badge.style.backgroundColor = light
      badge.style.color = color
    }
  }

  const handleLeave = () => {
    if (!ref.current) return
    ref.current.style.filter = 'grayscale(1) opacity(0.55)'
    ref.current.style.transform = 'scale(1)'
    ref.current.style.borderColor = 'hsl(214,20%,90%)'
    ref.current.style.boxShadow = 'none'
    const badge = ref.current.querySelector('.logo-badge') as HTMLElement | null

    if (badge) {
      badge.style.backgroundColor = '#f1f5f9'
      badge.style.color = '#64748b'
    }
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.875rem 1.5rem',
        borderRadius: '16px',
        border: '1.5px solid hsl(214,20%,90%)',
        backgroundColor: '#ffffff',
        cursor: 'default',
        filter: 'grayscale(1) opacity(0.55)',
        transition: 'filter 0.3s ease, transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        userSelect: 'none',
        minWidth: '180px',
      }}
    >
      <div
        className="logo-badge"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: '#f1f5f9',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.8125rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          transition: 'background-color 0.3s, color 0.3s',
        }}
      >
        {initials}
      </div>
      <span
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: '#1e293b',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  )
}
