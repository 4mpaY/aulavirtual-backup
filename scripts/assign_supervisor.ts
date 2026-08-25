import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando asignación de supervisor...')

  // 1. Buscar al supervisor
  const supervisor = await prisma.usuario.findUnique({
    where: { correo: 'jefe@gmail.com' }
  })

  if (!supervisor) {
    console.error('No se encontró al supervisor con correo jefe@gmail.com')
    return
  }
  console.log(`Supervisor encontrado: ${supervisor.nombre} ${supervisor.apellido} (ID: ${supervisor.id})`)

  // 2. Buscar a los alumnos que contengan "alumno test" en el nombre (ignorando mayúsculas) y rol ESTUDIANTE
  const alumnos = await prisma.usuario.findMany({
    where: {
      nombre: {
        contains: 'alumno test',
        mode: 'insensitive' // Funciona bien con PostgreSQL, Prisma en SQLite puede variar, pero usaremos esto
      },
      rol: 'ESTUDIANTE'
    }
  })

  // Alternativa si el filtro anterior falla por la base de datos (ej MySQL antiguo sin mode):
  // const todosAlumnos = await prisma.usuario.findMany({ where: { rol: 'ESTUDIANTE' } })
  // const alumnos = todosAlumnos.filter(a => a.nombre.toLowerCase().includes('alumno test'))

  if (alumnos.length === 0) {
    console.log('No se encontraron alumnos con el nombre "alumno test".')
    return
  }

  console.log(`Se encontraron ${alumnos.length} alumnos para asignar.`)

  // 3. Asignar cada alumno al supervisor
  let asignados = 0
  for (const alumno of alumnos) {
    // Verificar si ya está asignado
    const existe = await prisma.supervisorAlumno.findUnique({
      where: {
        supervisor_id_alumno_id: {
          supervisor_id: supervisor.id,
          alumno_id: alumno.id
        }
      }
    })

    if (!existe) {
      await prisma.supervisorAlumno.create({
        data: {
          supervisor_id: supervisor.id,
          alumno_id: alumno.id
        }
      })
      console.log(`- Asignado: ${alumno.nombre} ${alumno.apellido} (${alumno.correo})`)
      asignados++
    } else {
      console.log(`- Ya estaba asignado: ${alumno.nombre} ${alumno.apellido} (${alumno.correo})`)
    }
  }

  console.log(`\nProceso finalizado. Se asignaron ${asignados} nuevos alumnos.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
