export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const adminUser = auth.user
    const body = await request.json()
    const { certificados } = body

    if (!Array.isArray(certificados) || certificados.length === 0) {
      return ApiResponse.error(request, 'No se enviaron certificados para importar', 400)
    }

    const generados = []

    for (const cert of certificados) {
      const { 
        nombres, 
        apellidos, 
        nombre_curso, 
        duracion, 
        fecha_inicio, 
        fecha_culminacion, 
        fecha_emision 
      } = cert

      // We no longer find or create Usuario and Curso
      // because we want imported certificates to be independent
      // and not pollute the system.

      // Parse dates (expected format DD/MM/YYYY)
      const parseDateOnly = (s: string) => {
        if (!s) return null


        // If it's Excel serialized date or string with /
        if (typeof s === 'number') {
           // excel serial date
           const date = new Date((s - (25567 + 1)) * 86400 * 1000)

           
return date
        }

        if (typeof s === 'string') {
          if (s.includes('/')) {
            const parts = s.split('/')

            if (parts.length === 3) {
              return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T12:00:00.000Z`)
            }
          } else if (s.includes('-')) {
             return new Date(`${s}T12:00:00.000Z`)
          }
        }

        
return new Date(`${s}T12:00:00.000Z`) // fallback
      }

      const fEmision = fecha_emision ? parseDateOnly(fecha_emision) : new Date()
      
      const snapshot = {
        usuario: { nombre: nombres, apellido: apellidos },
        curso: {
          titulo: nombre_curso,
          tipo_emision: 'ASINCRONO',
          duracion: duracion || '0 horas'
        },
        fechas: {
          emision: fEmision ? fEmision.toISOString() : new Date().toISOString(),
          inicio_curso: fecha_inicio ? parseDateOnly(fecha_inicio)?.toISOString() : null,
          culminacion: fecha_culminacion ? parseDateOnly(fecha_culminacion)?.toISOString() : null
        },
        profesor: {
          nombre: adminUser.nombre,
          apellido: adminUser.apellido,
          cargo: (adminUser as any).cargo || 'Director',
          firma: (adminUser as any).firma || null
        },
        emision_manual: true
      }

      const dni = 'SINDNI'
      const codigoVerificacion = `M-${Date.now().toString().slice(-6)}-${dni}`

      const nuevoCertificado = await prisma.certificado.create({
        data: {
          codigo_verificacion: codigoVerificacion,
          emitido_en: fEmision || new Date(),
          datos: snapshot
        }
      })

      generados.push({
        id: nuevoCertificado.id,
        nombre: nombres,
        apellido: apellidos,
        codigo: codigoVerificacion
      })
    }

    return ApiResponse.success(request, { 
      mensaje: `${generados.length} certificados generados con éxito`,
      generados 
    }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
