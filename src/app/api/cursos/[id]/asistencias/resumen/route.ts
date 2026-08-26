import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireProfesorOrAdmin(req)

    if (!auth.authorized) return auth.error

    const { id: cursoId } = params

    // 1. Obtener los alumnos inscritos (activos)
    const inscripciones = await prisma.inscripcion.findMany({
      where: {
        curso_id: cursoId,
        estado: 'ACTIVO'
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            avatar: true
          }
        }
      }
    })

    // 2. Obtener total de lecciones del curso
    const totalLecciones = await prisma.leccion.count({
      where: {
        modulo: {
          curso_id: cursoId
        }
      }
    })

    if (totalLecciones === 0) {
      // Si no hay lecciones, devolvemos 0% para todos
      const resumen = inscripciones.map(insc => ({
        usuarioId: insc.usuario.id,
        nombre: insc.usuario.nombre,
        apellido: insc.usuario.apellido,
        correo: insc.usuario.correo,
        avatar: insc.usuario.avatar,
        clasesAsistidas: 0,
        clasesFaltadas: 0,
        porcentaje: 0
      }))

      
return NextResponse.json(resumen)
    }

    // 3. Obtener todas las asistencias del curso (de las lecciones de los módulos del curso)
    const asistencias = await prisma.asistencia.findMany({
      where: {
        leccion: {
          modulo: {
            curso_id: cursoId
          }
        }
      }
    })

    // 4. Calcular el resumen por alumno
    const resumen = inscripciones.map(insc => {
      // Filtrar las asistencias de este alumno
      const asistenciasAlumno = asistencias.filter(a => a.usuario_id === insc.usuario.id)
      
      const clasesAsistidas = asistenciasAlumno.filter(a => a.asistio).length

      // Las faltas son (Total de lecciones del curso - clases asistidas)
      // Ojo: Si el profesor no ha marcado asistencia de una clase futura, igual contaría como falta.
      // Pero esta fue la indicación acordada en el plan: "sobre el total de lecciones del curso".
      const clasesFaltadas = totalLecciones - clasesAsistidas
      
      const porcentaje = Math.round((clasesAsistidas / totalLecciones) * 100)

      return {
        usuarioId: insc.usuario.id,
        nombre: insc.usuario.nombre,
        apellido: insc.usuario.apellido,
        correo: insc.usuario.correo,
        avatar: insc.usuario.avatar,
        clasesAsistidas,
        clasesFaltadas,
        porcentaje
      }
    })

    return NextResponse.json(resumen)
  } catch (error: any) {
    console.error('[GET_ASISTENCIAS_RESUMEN]', error)
    
return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
