export interface UsuarioChatInfo {
  id: string
  nombre: string
  apellido: string
  avatar: string | null
  rol: 'ADMIN' | 'PROFESOR' | 'ESTUDIANTE'
}

export interface AdjuntoChat {
  id: string
  url: string
  nombre: string
  mimetype: string
  tipo: string
}

export interface MensajeChatItem {
  id: string
  contenido: string
  leido: boolean
  creado_en: string
  remitente_id: string
  remitente: UsuarioChatInfo
  adjunto: AdjuntoChat | null
}

export interface ConversacionResumen {
  id: string
  actualizado_en: string
  otroParticipante: UsuarioChatInfo | null
  ultimoMensaje: {
    id: string
    contenido: string
    creado_en: string
    remitente_id: string
    leido: boolean
  } | null
  mensajesNoLeidos: number
}

export interface ContactoDisponible {
  id: string
  nombre: string
  apellido: string
  avatar: string | null
  rol: 'ADMIN' | 'PROFESOR' | 'ESTUDIANTE'
  conversacion_id: string | null
}
