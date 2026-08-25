import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ALUMNO_EMAIL = 'jose@gmail.com'

// Notas en escala vigesimal (0-20) -> se guardan como porcentaje (0-100) en intentos
const NOTAS_VIGESIMALES = [13, 12, 13, 12]

async function main() {
  const alumno = await prisma.usuario.findUnique({
    where: { correo: ALUMNO_EMAIL },
    select: { id: true, nombre: true, apellido: true, correo: true }
  })

  if (!alumno) {
    console.error(`No se encontró el usuario ${ALUMNO_EMAIL}`)
    process.exit(1)
  }

  console.log(`Alumno: ${alumno.nombre} ${alumno.apellido} (${alumno.correo})`)

  const inscripciones = await prisma.inscripcion.findMany({
    where: { usuario_id: alumno.id },
    include: {
      curso: {
        select: {
          id: true,
          titulo: true,
          codigo: true,
          examenes: {
            orderBy: [{ modulo: { orden: 'asc' } }, { orden: 'asc' }],
            include: { modulo: { select: { orden: true, titulo: true } } }
          }
        }
      }
    }
  })

  if (inscripciones.length === 0) {
    console.error('El alumno no tiene inscripciones. Inscríbelo en al menos un curso primero.')
    process.exit(1)
  }

  let cursosProcesados = 0

  for (const ins of inscripciones) {
    let examenes = ins.curso.examenes

    // Crear exámenes publicados si el curso no tiene
    if (examenes.length === 0) {
      const modulo = await prisma.modulo.findFirst({
        where: { curso_id: ins.curso.id },
        orderBy: { orden: 'asc' }
      })

      if (!modulo) {
        console.warn(`Curso "${ins.curso.titulo}" sin módulos, se omite.`)
        continue
      }

      const titulos = ['Unidad I', 'Unidad II', 'Unidad III', 'Unidad IV']

      for (let i = 0; i < titulos.length; i++) {
        await prisma.examen.create({
          data: {
            titulo: titulos[i],
            curso_id: ins.curso.id,
            modulo_id: modulo.id,
            tipo: i === titulos.length - 1 ? 'FINAL' : 'INTERMEDIO',
            peso: 1,
            orden: i + 1,
            esta_publicado: true,
            puntaje_aprobacion: 11,
            intentos_maximos: 3
          }
        })
      }

      examenes = await prisma.examen.findMany({
        where: { curso_id: ins.curso.id, esta_publicado: true },
        orderBy: [{ modulo: { orden: 'asc' } }, { orden: 'asc' }],
        include: { modulo: { select: { orden: true, titulo: true } } }
      })

      console.log(`Creados ${examenes.length} exámenes en "${ins.curso.titulo}"`)
    } else {
      // Asegurar que estén publicados
      await prisma.examen.updateMany({
        where: { curso_id: ins.curso.id },
        data: { esta_publicado: true }
      })
    }

    // Eliminar intentos previos del alumno en este curso (re-seed limpio)
    await prisma.intentoExamen.deleteMany({
      where: {
        usuario_id: alumno.id,
        examen_id: { in: examenes.map(e => e.id) }
      }
    })

    const notas = NOTAS_VIGESIMALES.slice(0, examenes.length)
    let sumaPonderada = 0
    let pesoTotal = 0

    for (let i = 0; i < examenes.length; i++) {
      const examen = examenes[i]
      const notaVigesimal = notas[i] ?? 12
      const puntajePorcentaje = notaVigesimal * 5 // 13 -> 65%
      const enviadoEn = new Date()

      enviadoEn.setMonth(enviadoEn.getMonth() - (examenes.length - i))

      await prisma.intentoExamen.create({
        data: {
          usuario_id: alumno.id,
          examen_id: examen.id,
          puntaje: puntajePorcentaje,
          esta_aprobado: notaVigesimal >= 11,
          enviado_en: enviadoEn
        }
      })

      sumaPonderada += puntajePorcentaje * examen.peso
      pesoTotal += examen.peso

      console.log(
        `  ${examen.titulo}: ${notaVigesimal.toFixed(2)} (${puntajePorcentaje}% en BD)`
      )
    }

    const promedioPorcentaje = pesoTotal > 0 ? sumaPonderada / pesoTotal : 0
    const notaFinalPorcentaje = promedioPorcentaje

    await prisma.inscripcion.update({
      where: { id: ins.id },
      data: {
        nota_final: notaFinalPorcentaje,
        estado_nota: 'APROBADO',
        completado_en: new Date()
      }
    })

    const promedioVigesimal = (promedioPorcentaje * 0.2).toFixed(2)

    console.log(`Curso "${ins.curso.titulo}" (${ins.curso.codigo ?? 'sin código'}) → promedio ${promedioVigesimal}`)
    cursosProcesados++
  }

  console.log(`\nListo: ${cursosProcesados} curso(s) con notas para ${ALUMNO_EMAIL}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
