import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)
    
    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No autorizado', 403)
    }

    const cursoToDuplicate = await prisma.curso.findUnique({
      where: { id: params.id },
      include: {
        modulos: {
          include: {
            lecciones: true
          }
        }
      }
    })

    if (!cursoToDuplicate) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    const newCurso = await prisma.$transaction(async (tx) => {
      // 0. Shift order of all subsequent courses to make room
      await tx.curso.updateMany({
        where: {
          orden: {
            gt: cursoToDuplicate.orden
          }
        },
        data: {
          orden: {
            increment: 1
          }
        }
      })

      // 1. Create duplicate course
      const duplicatedCurso = await tx.curso.create({
        data: {
          titulo: `${cursoToDuplicate.titulo} (Copia)`,
          slug: `${cursoToDuplicate.slug}-copia-${Date.now()}`,
          descripcion: cursoToDuplicate.descripcion,
          tipo: cursoToDuplicate.tipo,
          categoria_id: cursoToDuplicate.categoria_id,
          profesor_id: cursoToDuplicate.profesor_id,
          miniatura: cursoToDuplicate.miniatura,
          video_presentacion: cursoToDuplicate.video_presentacion,
          precio: cursoToDuplicate.precio,
          precio_oferta: cursoToDuplicate.precio_oferta,
          precio_falso: cursoToDuplicate.precio_falso,
          estado: 'BORRADOR', // Copied course always in draft state
          nivel: cursoToDuplicate.nivel,
          duracion: cursoToDuplicate.duracion,
          beneficios: cursoToDuplicate.beneficios || [],
          incluye: cursoToDuplicate.incluye || [],
          metodologia: cursoToDuplicate.metodologia || [],
          objetivos: cursoToDuplicate.objetivos || [],
          orden: cursoToDuplicate.orden + 1
        }
      })

      // 2. Duplicate modules and lessons
      for (const modulo of cursoToDuplicate.modulos) {
        const newModulo = await tx.modulo.create({
          data: {
            curso_id: duplicatedCurso.id,
            titulo: modulo.titulo,
            descripcion: modulo.descripcion,
            orden: modulo.orden
          }
        })

        for (const leccion of modulo.lecciones) {
          await tx.leccion.create({
            data: {
              modulo_id: newModulo.id,
              titulo: leccion.titulo,
              contenido: leccion.contenido,
              video_url: leccion.video_url,
              recursos: leccion.recursos || [],
              es_vista_previa: leccion.es_vista_previa,
              orden: leccion.orden,
              duracion: leccion.duracion,
              enlace_reunion: leccion.enlace_reunion
            }
          })
        }
      }

      return duplicatedCurso
    })

    return ApiResponse.success(request, { curso: newCurso, message: 'Curso duplicado exitosamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
