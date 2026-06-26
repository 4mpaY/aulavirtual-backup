'use client'

import { Toaster } from '@sout/components/ui/toaster'
import { Toaster as Sonner } from '@sout/components/ui/sonner'
import { TooltipProvider } from '@sout/components/ui/tooltip'
import FloatingContactButtons from '@sout/components/WhatsAppButton'
import { AuthModalProvider } from '@/contexts/AuthModalContext'

export default function SouProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthModalProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
        <FloatingContactButtons />
      </TooltipProvider>
    </AuthModalProvider>
  )
}
