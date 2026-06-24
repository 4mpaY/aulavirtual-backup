import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'

import type {
  ConversacionResumen,
  ContactosPaginados,
  CursoChat,
  MensajeChatItem
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

  async getCursos(): Promise<CursoChat[]> {
    return this.iGet('/cursos')
  }

  async getContactos(params?: {
    curso_id?: string
    buscar?: string
    page?: number
    limit?: number
  }): Promise<ContactosPaginados> {
    const qs = new URLSearchParams()

    if (params?.curso_id) qs.set('curso_id', params.curso_id)
    if (params?.buscar) qs.set('buscar', params.buscar)
    if (params?.page) qs.set('page', String(params.page))
    if (params?.limit) qs.set('limit', String(params.limit))

    const query = qs.toString()

    return this.iGet(`/contactos${query ? `?${query}` : ''}`)
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
