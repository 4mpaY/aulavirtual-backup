'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

import AuthModal from '@/features/shared/components/AuthModal'

type Mode = 'login' | 'register' | 'forgot-password' | 'reset-password'

type AuthModalContextType = {
  openLogin: (callbackUrl?: string, onSuccess?: () => void) => void
  openRegister: (callbackUrl?: string, onSuccess?: () => void) => void
  close: () => void
}

const AuthModalContext = createContext<AuthModalContextType | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [callbackUrl, setCallbackUrl] = useState<string | undefined>()
  const [onSuccess, setOnSuccess] = useState<(() => void) | undefined>()

  const openLogin = (url?: string, successCb?: () => void) => {
    setMode('login')
    setCallbackUrl(url)
    setOnSuccess(successCb ? () => successCb : undefined)
    setOpen(true)
  }

  const openRegister = (url?: string, successCb?: () => void) => {
    setMode('register')
    setCallbackUrl(url)
    setOnSuccess(successCb ? () => successCb : undefined)
    setOpen(true)
  }

  const close = () => setOpen(false)

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, close }}>
      {children}
      <AuthModal
        open={open}
        mode={mode}
        callbackUrl={callbackUrl}
        onSuccess={onSuccess}
        onClose={close}
        onSwitchMode={setMode}
      />
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)

  if (!ctx) throw new Error('useAuthModal debe usarse dentro de AuthModalProvider')

  return ctx
}
