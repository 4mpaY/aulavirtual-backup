'use client'

import { useEffect, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

import { useConfig } from '@/contexts/ConfigContext'
import { buildWhatsAppUrl } from '@/utils/functions/whatsapp'

const HIDDEN_PATH_PREFIXES = ['/cursos', '/landing']

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const CloseIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
)

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M2.5 21.5l19-9.5-19-9.5v7.4l14 2.1-14 2.1z" />
  </svg>
)

const GREETING = '¡Hola! 👋 ¿Tienes alguna duda? Escríbenos y te ayudamos al instante.'
const SUPPORT_NAME = 'Equipo de soporte'
const MAX_MESSAGE_LENGTH = 500

export default function FloatingContactButtons() {
  const [hovered, setHovered] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [message, setMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const [greetingShown, setGreetingShown] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [outgoing, setOutgoing] = useState<string[]>([])

  const configs = useConfig()
  const pathname = usePathname()

  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const threadEndRef = useRef<HTMLDivElement>(null)

  const closePanel = () => {
    if (!panelOpen || closing) return
    setClosing(true)
    setTimeout(() => {
      setPanelOpen(false)
      setClosing(false)
    }, 200)
  }

  const openPanel = () => {
    setClosing(false)
    setPanelOpen(true)
  }

  useEffect(() => {
    if (!panelOpen) return
    textareaRef.current?.focus()

    if (hasGreeted) return

    setTyping(true)

    const t = setTimeout(() => {
      setTyping(false)
      setGreetingShown(true)
      setHasGreeted(true)
    }, 1100)

    return () => clearTimeout(t)
  }, [panelOpen, hasGreeted])

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: 'end' })
  }, [typing, greetingShown, outgoing])

  useEffect(() => {
    if (!panelOpen) return

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node

      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      closePanel()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen, closing])

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget

    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }

  const handleSend = () => {
    const trimmed = message.trim()

    if (!trimmed) return

    setOutgoing(prev => [...prev, trimmed])
    setMessage('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    const url = buildWhatsAppUrl(configs.WHATSAPP_NUMERO, { text: trimmed })

    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
      closePanel()
    }, 400)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isHidden = HIDDEN_PATH_PREFIXES.some(prefix => pathname === prefix || pathname?.startsWith(`${prefix}/`))

  if (isHidden) return null

  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '30px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '14px',
      }}
    >
      {panelOpen && (
        <div ref={panelRef} role="dialog" aria-label="Chat de WhatsApp" className={`wa-panel ${closing ? 'wa-panel-closing' : ''}`}>
          <div className="wa-panel-header">
            <span className="wa-panel-avatar">
              <WhatsAppIcon />
            </span>
            <div className="wa-panel-headinfo">
              <div className="wa-panel-title">{SUPPORT_NAME}</div>
              <div className="wa-panel-status">
                <span className="wa-status-dot" />
                En línea
              </div>
            </div>
            <button type="button" className="wa-panel-close" onClick={closePanel} aria-label="Cerrar chat">
              <CloseIcon size={16} />
            </button>
          </div>

          <div className="wa-panel-thread">
            {greetingShown && <div className="wa-bubble-in">{GREETING}</div>}
            {typing && (
              <div className="wa-bubble-in wa-typing">
                <span />
                <span />
                <span />
              </div>
            )}
            {outgoing.map((m, i) => (
              <div key={i} className="wa-bubble-out">
                {m}
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>

          <div className="wa-panel-footer">
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={e => setMessage(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              className="wa-panel-input"
            />
            <button
              type="button"
              className="wa-panel-send"
              disabled={!message.trim()}
              onClick={handleSend}
              aria-label="Enviar mensaje"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span className="wa-ping" />
        <button
          ref={buttonRef}
          type="button"
          aria-label={panelOpen ? 'Cerrar chat' : 'Abrir chat de WhatsApp'}
          className="wa-fab"
          onClick={() => (panelOpen ? closePanel() : openPanel())}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {panelOpen ? <CloseIcon size={24} /> : <WhatsAppIcon />}
          <span className="wa-fab-dot" />
        </button>
        {!panelOpen && <span className={`wa-tooltip ${hovered ? 'wa-tooltip-visible' : ''}`}>Escríbenos al WhatsApp</span>}
      </div>

      <style jsx>{`
        .wa-fab {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #25d366, #1ebe57);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.5);
          border: none;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }

        .wa-fab:hover {
          transform: scale(1.12) rotate(-4deg);
          box-shadow: 0 10px 26px rgba(37, 211, 102, 0.65);
        }

        .wa-fab-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #34e075;
          border: 2px solid #ffffff;
        }

        .wa-ping {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.55);
          animation: wa-ping-anim 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        }

        @keyframes wa-ping-anim {
          0% {
            transform: scale(1);
            opacity: 0.65;
          }
          75%,
          100% {
            transform: scale(1.9);
            opacity: 0;
          }
        }

        .wa-tooltip {
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          background-color: rgba(15, 23, 42, 0.9);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          padding: 6px 12px;
          border-radius: 8px;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .wa-tooltip-visible {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        .wa-panel {
          width: 320px;
          max-width: calc(100vw - 32px);
          height: 420px;
          max-height: min(420px, calc(100vh - 140px));
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(15, 23, 42, 0.22);
          display: flex;
          flex-direction: column;
          background: #ffffff;
          transform-origin: bottom right;
          animation: wa-panel-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .wa-panel-closing {
          animation: wa-panel-out 0.2s ease forwards;
        }

        @keyframes wa-panel-in {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes wa-panel-out {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.85) translateY(12px);
          }
        }

        .wa-panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #075e54;
          color: #ffffff;
          flex-shrink: 0;
        }

        .wa-panel-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wa-panel-avatar :global(svg) {
          width: 18px;
          height: 18px;
        }

        .wa-panel-headinfo {
          flex: 1;
          min-width: 0;
        }

        .wa-panel-title {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .wa-panel-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .wa-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
        }

        .wa-panel-close {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }

        .wa-panel-close:hover {
          background: rgba(255, 255, 255, 0.24);
        }

        .wa-panel-thread {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #e9e2d8;
        }

        .wa-bubble-in,
        .wa-bubble-out {
          max-width: 82%;
          padding: 8px 12px;
          font-size: 0.83rem;
          line-height: 1.4;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
          word-wrap: break-word;
        }

        .wa-bubble-in {
          align-self: flex-start;
          background: #ffffff;
          color: #111b21;
          border-radius: 12px 12px 12px 2px;
        }

        .wa-bubble-out {
          align-self: flex-end;
          background: #dcf8c6;
          color: #111b21;
          border-radius: 12px 12px 2px 12px;
        }

        .wa-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 12px;
        }

        .wa-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94a3b8;
          animation: wa-typing-bounce 1s infinite ease-in-out;
        }

        .wa-typing span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .wa-typing span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes wa-typing-bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        .wa-panel-footer {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 10px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
          flex-shrink: 0;
        }

        .wa-panel-input {
          flex: 1;
          resize: none;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 8px 14px;
          font-size: 0.85rem;
          font-family: inherit;
          max-height: 96px;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .wa-panel-input:focus {
          border-color: #25d366;
        }

        .wa-panel-send {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: #25d366;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .wa-panel-send:hover:not(:disabled) {
          transform: scale(1.06);
        }

        .wa-panel-send:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
