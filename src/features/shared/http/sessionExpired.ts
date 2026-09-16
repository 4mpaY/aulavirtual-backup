let handled = false

export function handleSessionExpired() {
  if (handled) return
  if (typeof window === 'undefined') return
  if (window.location.pathname.startsWith('/login')) return

  handled = true

  const callbackUrl = window.location.pathname + window.location.search
  
  // Usar endpoint nativo de NextAuth para evitar importar código cliente en componentes RSC
  window.location.href = `/api/auth/signout?callbackUrl=${encodeURIComponent(`/login?sessionExpired=1&callbackUrl=${encodeURIComponent(callbackUrl)}`)}`
}
