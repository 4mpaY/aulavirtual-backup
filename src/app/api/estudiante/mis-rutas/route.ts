import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { getCurrentUser } from '@/utils/libs/auth-helpers'

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = user.id
    const prismaAny = prisma as any

    // Obtener las inscripciones formales a rutas
    const inscripcionesRuta = await prismaAny.inscripcionRuta.findMany({
      where: { usuario_id: userId },
      select: { ruta_id: true }
    })

    if (inscripcionesRuta.length === 0) {
      return NextResponse.json({ rutas: [] })
    }

    const rutasInscritasIds = inscripcionesRuta.map((i: any) => i.ruta_id)

    // Obtener inscripciones de cursos (para el progreso)
    const progresosCursos = await prisma.progresoCurso.findMany({
      where: { usuario_id: userId },
      select: { curso_id: true, porcentaje_progreso: true }
    })

    const progresoMap = progresosCursos.reduce((acc: any, p: any) => {
      acc[p.curso_id] = p.porcentaje_progreso
      
return acc
    }, {})

    // Obtener rutas a las que está inscrito
    const rutas = await prisma.rutaAprendizaje.findMany({
      where: {
        id: { in: rutasInscritasIds }
      },
      include: {
        escuela: true,
        cursos: {
          include: {
            curso: {
              select: {
                id: true,
                titulo: true,
                miniatura: true
              }
            }
          },
          orderBy: { orden: 'asc' }
        }
      }
    })

    // Calcular progreso
    const rutasConProgreso = rutas.map((ruta: any) => {
      const totalCursos = ruta.cursos?.length || 0

      if (totalCursos === 0) return { ...ruta, progreso: 0, completado: false }

      const sumaProgresos = ruta.cursos.reduce((sum: number, cr: any) => {
        const progresoCurso = progresoMap[cr.curso_id] || 0

        
return sum + Math.min(100, Math.max(0, progresoCurso))
      }, 0)

      const progreso = Math.round(sumaProgresos / totalCursos)

      return {
        ...ruta,
        progreso,
        completado: progreso === 100
      }
    })

    return NextResponse.json({ rutas: rutasConProgreso })
  } catch (error) {
    console.error('[MIS_RUTAS_GET]', error)
    
return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
