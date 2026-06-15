import crypto from 'crypto'

const SECRET = process.env.NGINX_VIDEO_SECRET || 'secret'
const NGINX_VIDEO_BASE = process.env.NGINX_VIDEO_BASE_URL || 'http://localhost/private-videos'

export function generateVideoUrl(filename: string): string {
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 // expira en 1 hora
  const path = `/private-videos/${filename}`

  // Genera el token MD5 para secure_link de Nginx
  const token = crypto
    .createHash('md5')
    .update(`${expires}${path} ${SECRET}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  // Normaliza la URL base quitando la barra final si existe
  const baseUrl = NGINX_VIDEO_BASE.endsWith('/') 
    ? NGINX_VIDEO_BASE.slice(0, -1) 
    : NGINX_VIDEO_BASE

  return `${baseUrl}/${filename}?token=${token}&expires=${expires}`
}
