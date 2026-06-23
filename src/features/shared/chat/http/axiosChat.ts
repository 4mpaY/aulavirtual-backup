import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

import type {
  ConversacionResumen,
  MensajeChatItem,
  ContactoDisponible
} from '../entity/Chat'

type Params = {
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosChat extends AxiosInternalHttpClient {
  constructor({ getAuthToken }: Params = {}) {
    super({ baseURL: '/api/chat', getAuthToken })
  }

  async getUnreadCount(): Promise<{ total: number }> {
    return this.iGet('/unread-count')
  }

  async getContactos(): Promise<ContactoDisponible[]> {
    return this.iGet('/contactos')
  }

  async getConversaciones(): Promise<ConversacionResumen[]> {
    return this.iGet('/conversaciones')
  }

  async iniciarConversacion(receptor_id: string): Promise<{ conversacion_id: string }> {
    return this.iPost('/conversaciones', { receptor_id })
  }

  async getMensajes(conversacionId: string, cursor?: string): Promise<MensajeChatItem[]> {
    const params = cursor ? `?cursor=${cursor}` : ''

    return this.iGet(`/conversaciones/${conversacionId}/mensajes${params}`)
  }

  async enviarMensaje(conversacionId: string, contenido: string, adjunto_id?: string): Promise<MensajeChatItem> {
    return this.iPost(`/conversaciones/${conversacionId}/mensajes`, { contenido, adjunto_id })
  }

  async marcarLeidos(conversacionId: string): Promise<{ actualizados: number }> {
    return this.iPatch(`/conversaciones/${conversacionId}/leer`)
  }
}
