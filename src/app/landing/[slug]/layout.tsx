import React from 'react'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  // A clean layout without the standard sidebar or standard header/footer
  // since the landing page has its own specialized header
  return (
    <div className="landing-layout min-h-screen bg-background">
      {children}
    </div>
  )
}
