import { AxiosWebCursos } from '@/features/web/cursos/http/axiosWebCursos'
import type { TipoPrograma } from '@/utils/configs/tipoPrograma'

export async function getProgramCatalogData(tipo?: TipoPrograma, token: string | null = null) {
  try {
    const axiosWebCursos = new AxiosWebCursos({ getAuthToken: () => token })
    const data = await axiosWebCursos.getCatalog(tipo)

    if (data.courses) {
      data.courses = data.courses.map((c: any) => ({
        ...c,
        precio: c.precio ? Number(c.precio) : 0,
        precio_oferta: c.precio_oferta ? Number(c.precio_oferta) : null
      }))
    }

    return data
  } catch (error) {
    console.error(`Error fetching catalog (${tipo}):`, error)

    return { courses: [], categories: [] }
  }
}
