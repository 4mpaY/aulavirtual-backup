'use client'

import Header from '@sout/components/layout/Header'
import Footer from '@sout/components/layout/Footer'

type Props = {
  children: React.ReactNode
  className?: string
}

export default function SoutPageShell({ children, className }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className={className ?? 'flex-1 pt-[var(--sout-header-height)]'}>{children}</div>
      <Footer />
    </div>
  )
}
