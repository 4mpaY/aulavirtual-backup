import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

interface PageHeaderProps {
  label?: string
  title: string
  description?: string
  ctaText?: string
  ctaHref?: string
  imageSrc?: string
}

export default function PageHeader({ label, title, description, ctaText, ctaHref, imageSrc }: PageHeaderProps) {
  const background = imageSrc
    ? `linear-gradient(135deg, rgba(2,94,68,0.82) 0%, rgba(37,146,127,0.72) 100%), url("${imageSrc}") center/cover no-repeat`
    : 'linear-gradient(135deg, var(--web-dark, #025E44) 0%, var(--web-primary, #25927F) 100%)'

  return (
    <section
      className="page-header"
      style={{
        background,
        padding: '0 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid pattern */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' }}>
        {label && (
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: '0.75rem',
          }}>
            {label}
          </p>
        )}

        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          marginBottom: description ? '0.75rem' : (ctaText ? '1.5rem' : '0'),
          maxWidth: '640px',
        }}>
          {title}
        </h1>

        {description && (
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.9375rem',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.65,
            maxWidth: '520px',
            marginBottom: ctaText ? '1.5rem' : '0',
          }}>
            {description}
          </p>
        )}

        {ctaText && ctaHref && (
          <Link
            href={ctaHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: 'var(--web-dark, #025E44)',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            {ctaText} <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  )
}
