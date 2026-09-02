'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image'

interface SplashScreenProps {
  platformName?: string
  platformSlogan?: string
  logoUrl?: string
}

export default function SplashScreen({
  platformName = 'AGENDA 2050 PERÚ',
  platformSlogan = 'Formación con criterio, lideramos con tecnología',
  logoUrl = '/images/agenda/logo-sin-fondo.png'
}: SplashScreenProps) {
  const [visible, setVisible] = useState(true)
  const [animatingOut, setAnimatingOut] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animación de progreso fluida de 0 a 100% durante 2.8 segundos
    const duration = 2800
    const intervalTime = 30
    const steps = duration / intervalTime
    let currentStep = 0

    const progressTimer = setInterval(() => {
      currentStep++
      const percentage = Math.min(100, Math.round((currentStep / steps) * 100))

      setProgress(percentage)

      if (percentage >= 100) {
        clearInterval(progressTimer)

        // Esperar un breve instante con 100% y luego iniciar salida suave
        setTimeout(() => {
          setAnimatingOut(true)
          setTimeout(() => {
            setVisible(false)
          }, 800)
        }, 300)
      }
    }, intervalTime)

    return () => {
      clearInterval(progressTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 45%, #024b37 0%, #01221a 60%, #00140f 100%)',
        opacity: animatingOut ? 0 : 1,
        transform: animatingOut ? 'scale(1.05)' : 'scale(1)',
        filter: animatingOut ? 'blur(10px)' : 'none',
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.8s ease',
        pointerEvents: animatingOut ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Fondo con textura sutil */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.7
        }}
      />

      {/* Resplandor radial decorativo */}
      <div
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(189, 217, 98, 0.22) 0%, rgba(0, 111, 101, 0.14) 45%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'splashPulse 3s infinite alternate ease-in-out'
        }}
      />

      {/* Contenedor central animado */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '580px'
        }}
      >
        {/* Contenedor del Logo con Aura Ampliada */}
        <div
          style={{
            position: 'relative',
            width: '190px',
            height: '190px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            animation: 'splashLogoIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* Anillos concéntricos giratorios */}
          <div
            style={{
              position: 'absolute',
              inset: '-14px',
              borderRadius: '50%',
              border: '2.5px dashed rgba(189, 217, 98, 0.4)',
              animation: 'splashSpin 10s linear infinite'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '-3px',
              borderRadius: '50%',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.45)'
            }}
          />

          <div style={{ position: 'relative', width: '135px', height: '135px' }}>
            <Image
              src={logoUrl}
              alt={platformName}
              fill
              priority
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 20px rgba(189, 217, 98, 0.35))'
              }}
            />
          </div>
        </div>

        {/* Título & Slogan con animación de aparición */}
        <div
          style={{
            animation: 'splashTextIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards',
            opacity: 0
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#BDD962',
              marginBottom: '0.5rem',
              background: 'rgba(189, 217, 98, 0.12)',
              padding: '0.35rem 1.1rem',
              borderRadius: '999px',
              border: '1px solid rgba(189, 217, 98, 0.3)'
            }}
          >
            Aula Virtual & Capacitaciones
          </span>
          <h1
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 5vw, 2.6rem)',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: '0.25rem 0 0.5rem 0',
              lineHeight: 1.1
            }}
          >
            AGENDA 2050 <span style={{ color: '#BDD962' }}>PERÚ</span>
          </h1>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '0 0 2rem 0',
              lineHeight: 1.5,
              fontWeight: 400
            }}
          >
            {platformSlogan}
          </p>
        </div>

        {/* Barra de progreso de carga estilizada y porcentaje */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '240px',
              height: '5px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #025E44, #BDD962)',
                borderRadius: '999px',
                transition: 'width 0.1s linear',
                boxShadow: '0 0 10px rgba(189, 217, 98, 0.5)'
              }}
            />
          </div>

          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.05em'
            }}
          >
            Cargando plataforma {progress}%
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes splashLogoIn {
          0% {
            opacity: 0;
            transform: scale(0.65) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes splashTextIn {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes splashSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes splashPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.15);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  )
}
