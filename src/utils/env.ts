export const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // En el navegador usar rutas relativas (/api/...) para respetar el puerto actual (3000, 3001, etc.)
    return ''
  }

  const port = process.env.PORT
  const localhostFallback =
    port && port !== '3000' ? `http://localhost:${port}` : 'http://localhost:3000'

  // En el servidor: evita llamadas al puerto incorrecto cuando Next usa 3001, 3002, etc.
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    localhostFallback
  )
}
