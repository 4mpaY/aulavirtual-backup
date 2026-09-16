export const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // En el navegador usar rutas relativas (/api/...) para respetar el puerto actual (3000, 3001, etc.)
    return ''
  }

  const port = process.env.PORT

  const localhostFallback =
    port && port !== '3000' ? `http://127.0.0.1:${port}` : 'http://127.0.0.1:3000'

  // En desarrollo en el servidor, SIEMPRE usar localhost
  if (process.env.NODE_ENV === 'development') {
    return localhostFallback
  }

  // En el servidor: evita llamadas al puerto incorrecto cuando Next usa 3001, 3002, etc.
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    localhostFallback
  )
}
