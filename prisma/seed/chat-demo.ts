/**
 * Seed de demostración para probar el chat con muchos usuarios y mensajes.
 * Crea 3 profesores adicionales, 60 alumnos, inscripciones y conversaciones con mensajes.
 *
 * Ejecutar: pnpm db:seed:demo
 */

import { PrismaClient, Rol } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ─── DATOS DE MUESTRA ────────────────────────────────────────────────────────

const NOMBRES_MASCULINOS = [
  'Andrés', 'Carlos', 'Diego', 'Eduardo', 'Fernando', 'Gabriel', 'Hugo', 'Iván',
  'Javier', 'Kevin', 'Luis', 'Miguel', 'Nicolás', 'Oscar', 'Pablo', 'Rafael',
  'Sebastián', 'Tomás', 'Víctor', 'Walter', 'Ángel', 'Bruno', 'César', 'Daniel',
  'Ernesto', 'Felipe', 'Gustavo', 'Héctor', 'Ignacio', 'Jorge'
]

const NOMBRES_FEMENINOS = [
  'Andrea', 'Beatriz', 'Carmen', 'Diana', 'Elena', 'Fátima', 'Gabriela', 'Helena',
  'Isabel', 'Jessica', 'Karen', 'Laura', 'Mónica', 'Natalia', 'Olga', 'Patricia',
  'Rosa', 'Sandra', 'Teresa', 'Valeria', 'Alejandra', 'Brenda', 'Claudia', 'Daniela',
  'Estefanía', 'Fernanda', 'Gisela', 'Hilda', 'Irene', 'Julia'
]

const APELLIDOS = [
  'García', 'Martínez', 'López', 'Rodríguez', 'González', 'Pérez', 'Sánchez', 'Ramírez',
  'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 'Cruz', 'Morales', 'Ortiz',
  'Gutierrez', 'Herrera', 'Medina', 'Vargas', 'Castillo', 'Jiménez', 'Moreno', 'Álvarez',
  'Romero', 'Navarro', 'Mendoza', 'Ramos', 'Ruiz'
]

const MENSAJES_POOL = [
  '¿Podría ayudarme con la tarea de la semana pasada?',
  'Tengo una duda sobre el módulo 2.',
  'Muchas gracias por la explicación, quedó muy claro.',
  '¿Cuándo es la próxima clase en vivo?',
  'No pude abrir el archivo adjunto, ¿puede reenviarlo?',
  'Entendido, gracias.',
  '¿El examen incluye el tema de la unidad 3?',
  'Buenos días, ¿tiene un momento para revisar mi avance?',
  'Perfecto, lo reviso y le comento.',
  '¿Puede ampliar un poco más la explicación del ejercicio 4?',
  'Ya entendí, era un error de concepto de mi parte.',
  'Estoy teniendo problemas para acceder al material.',
  '¿Hay algún recurso adicional que recomiende?',
  'Listo, ya completé la tarea.',
  '¿Podría revisar mi informe antes de entregarlo?',
  'Recibido, lo reviso esta tarde.',
  'Disculpe la demora, tuve problemas de conexión.',
  'Muchas gracias por su tiempo.',
  '¿El certificado se entrega al finalizar todos los módulos?',
  'Sí, quedo pendiente de su respuesta.',
  '¿Puedo avanzar al siguiente módulo sin completar todos los ejercicios?',
  'Claro, no hay problema. Avance y luego completa.',
  'Hola, buenas tardes. ¿Cómo va todo?',
  'Todo bien, gracias. ¿En qué le puedo ayudar?',
  '¿Los ejercicios prácticos son obligatorios para la nota?',
  'Sí, representan el 30% de la evaluación.',
  'Entendido. Empiezo esta noche.',
  '¿Hay foro de preguntas para este curso?',
  'Puede usar el chat de mensajes directos también.',
  'Perfecto, muchas gracias.',
]

const MENSAJES_PROFESOR = [
  'Hola, ¿cómo va tu avance en el curso?',
  'Recuerda que el plazo de entrega es el viernes.',
  'Revisa el material del módulo 2, está actualizado.',
  'Buen trabajo en el ejercicio anterior.',
  'Si tienes dudas, no dudes en escribirme.',
  'El próximo tema es más práctico, te va a gustar.',
  'He subido nuevos ejercicios de práctica.',
  'Por favor revisa los comentarios que dejé en tu tarea.',
  '¿Pudiste ver el video de la clase anterior?',
  'Recuerda que el examen cubre los módulos 1 al 3.',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickMany<T>(arr: T[], min: number, max: number): T[] {
  const n = min + Math.floor(Math.random() * (max - min + 1))
  const shuffled = [...arr].sort(() => Math.random() - 0.5)

  return shuffled.slice(0, n)
}

function randomDate(daysBack: number): Date {
  const ms = Date.now() - Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000)

  return new Date(ms)
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed de demostración (chat masivo)...\n')

  const passwordHash = await bcrypt.hash('Demo123456@', 10)

  // ── 1. Obtener admin y cursos existentes ──────────────────────────────────

  const admin = await prisma.usuario.findUnique({ where: { correo: 'admin@gmail.com' } })

  if (!admin) {
    console.error('❌ No existe el admin. Ejecuta primero: pnpm db:seed')
    process.exit(1)
  }

  const cursos = await prisma.curso.findMany({
    where: { estado: 'PUBLICADO' },
    select: { id: true, titulo: true }
  })

  if (cursos.length === 0) {
    console.error('❌ No hay cursos publicados. Ejecuta primero: pnpm db:seed')
    process.exit(1)
  }

  console.log(`✅ Admin y ${cursos.length} cursos encontrados`)

  // ── 2. Crear 3 profesores adicionales ─────────────────────────────────────

  const profesoresData = [
    { correo: 'prof2@demo.com', nombre: 'Roberto', apellido: 'Silva', doc: '10000101' },
    { correo: 'prof3@demo.com', nombre: 'Lucía', apellido: 'Mendoza', doc: '10000102' },
    { correo: 'prof4@demo.com', nombre: 'Ernesto', apellido: 'Vargas', doc: '10000103' },
  ]

  const profesores: { id: string }[] = []

  // Incluir el profesor del seed principal
  const profesorPrincipal = await prisma.usuario.findUnique({ where: { correo: 'profesor@gmail.com' } })

  if (profesorPrincipal) profesores.push(profesorPrincipal)

  for (let i = 0; i < profesoresData.length; i++) {
    const pd = profesoresData[i]

    const prof = await prisma.usuario.upsert({
      where: { correo: pd.correo },
      update: {},
      create: {
        correo: pd.correo,
        contrasena: passwordHash,
        nombre: pd.nombre,
        apellido: pd.apellido,
        numero_documento: pd.doc,
        celular: `91000010${i + 1}`,
        rol: Rol.PROFESOR,
        esta_activo: true
      }
    })

    profesores.push(prof)
  }

  console.log(`✅ ${profesores.length} profesores disponibles`)

  // Asignar cursos extra a los nuevos profesores (actualizar profesor_id)
  if (cursos.length >= 2 && profesores.length >= 2) {
    await prisma.curso.update({
      where: { id: cursos[Math.min(1, cursos.length - 1)].id },
      data: { profesor_id: profesores[1].id }
    })
  }

  if (cursos.length >= 3 && profesores.length >= 3) {
    await prisma.curso.update({
      where: { id: cursos[Math.min(2, cursos.length - 1)].id },
      data: { profesor_id: profesores[2].id }
    })
  }

  if (cursos.length >= 4 && profesores.length >= 4) {
    await prisma.curso.update({
      where: { id: cursos[Math.min(3, cursos.length - 1)].id },
      data: { profesor_id: profesores[3].id }
    })
  }

  // ── 3. Crear 60 alumnos ───────────────────────────────────────────────────

  const alumnosCreados: { id: string }[] = []
  const TOTAL_ALUMNOS = 60

  for (let i = 1; i <= TOTAL_ALUMNOS; i++) {
    const esFemenino = i % 2 === 0
    const nombre = esFemenino ? pick(NOMBRES_FEMENINOS) : pick(NOMBRES_MASCULINOS)
    const apellido = pick(APELLIDOS)
    const correo = `alumno${String(i).padStart(3, '0')}@demo.com`
    const doc = `2000${String(i).padStart(4, '0')}`

    const alumno = await prisma.usuario.upsert({
      where: { correo },
      update: {},
      create: {
        correo,
        contrasena: passwordHash,
        nombre,
        apellido,
        numero_documento: doc,
        celular: `9${String(20000000 + i)}`,
        rol: Rol.ESTUDIANTE,
        esta_activo: true
      }
    })

    alumnosCreados.push(alumno)
  }

  console.log(`✅ ${alumnosCreados.length} alumnos creados`)

  // ── 4. Inscribir alumnos en cursos ────────────────────────────────────────

  // Distribuir alumnos en cursos con solapamiento
  const inscripcionesCreadas: { alumnoId: string; cursoId: string; profesorId: string }[] = []

  for (let i = 0; i < alumnosCreados.length; i++) {
    const alumno = alumnosCreados[i]

    // Cada alumno se inscribe en 1 a 3 cursos
    const cursosElegidos = pickMany(cursos, 1, Math.min(3, cursos.length))

    for (const curso of cursosElegidos) {
      await prisma.inscripcion.upsert({
        where: {
          usuario_id_curso_id: { usuario_id: alumno.id, curso_id: curso.id }
        },
        update: {},
        create: {
          usuario_id: alumno.id,
          curso_id: curso.id,
          estado: 'ACTIVO'
        }
      })

      // Encontrar el profesor del curso (después de los updates anteriores)
      const cursoConProf = await prisma.curso.findUnique({
        where: { id: curso.id },
        select: { profesor_id: true }
      })

      if (cursoConProf) {
        inscripcionesCreadas.push({
          alumnoId: alumno.id,
          cursoId: curso.id,
          profesorId: cursoConProf.profesor_id
        })
      }
    }
  }

  console.log(`✅ ${inscripcionesCreadas.length} inscripciones creadas`)

  // ── 5. Crear conversaciones y mensajes ────────────────────────────────────

  // Construir pares únicos alumno ↔ profesor basados en inscripciones
  const paresVistos = new Set<string>()
  const pares: { alumnoId: string; profesorId: string }[] = []

  for (const insc of inscripcionesCreadas) {
    const clave = `${insc.alumnoId}:${insc.profesorId}`

    if (!paresVistos.has(clave)) {
      paresVistos.add(clave)
      pares.push({ alumnoId: insc.alumnoId, profesorId: insc.profesorId })
    }
  }

  // Pares alumno ↔ admin (30 alumnos al azar)
  const alumnosConAdmin = pickMany(alumnosCreados, 25, 35)

  for (const alumno of alumnosConAdmin) {
    const clave = `${alumno.id}:${admin.id}`

    if (!paresVistos.has(clave)) {
      paresVistos.add(clave)
      pares.push({ alumnoId: alumno.id, profesorId: admin.id })
    }
  }

  // Pares profesor ↔ admin
  for (const prof of profesores) {
    const clave = `${prof.id}:${admin.id}`

    if (!paresVistos.has(clave)) {
      paresVistos.add(clave)
      pares.push({ alumnoId: prof.id, profesorId: admin.id })
    }
  }

  console.log(`📨 Creando ${pares.length} conversaciones con mensajes...`)

  let totalMensajes = 0

  for (const par of pares) {
    // Crear conversación
    const conversacion = await prisma.conversacion.create({
      data: {
        participantes: {
          create: [
            { usuario_id: par.alumnoId },
            { usuario_id: par.profesorId }
          ]
        }
      }
    })

    // Generar entre 3 y 20 mensajes por conversación
    const cantMensajes = 3 + Math.floor(Math.random() * 18)
    let ultimaFecha = randomDate(30)

    for (let m = 0; m < cantMensajes; m++) {
      // Alternar quién envía, con tendencia al alumno iniciando
      const esProfesor = m > 0 && Math.random() > 0.6
      const remitenteId = esProfesor ? par.profesorId : par.alumnoId
      const contenido = esProfesor ? pick(MENSAJES_PROFESOR) : pick(MENSAJES_POOL)

      // Avanzar la fecha cronológicamente
      ultimaFecha = new Date(ultimaFecha.getTime() + Math.floor(Math.random() * 4 * 60 * 60 * 1000))

      await prisma.mensajeChat.create({
        data: {
          conversacion_id: conversacion.id,
          remitente_id: remitenteId,
          contenido,
          leido: Math.random() > 0.3,
          creado_en: ultimaFecha
        }
      })

      totalMensajes++
    }

    // Actualizar actualizado_en de la conversación con la fecha del último mensaje
    await prisma.conversacion.update({
      where: { id: conversacion.id },
      data: { actualizado_en: ultimaFecha }
    })
  }

  console.log(`✅ ${pares.length} conversaciones y ${totalMensajes} mensajes creados`)

  // ── 6. Resumen ────────────────────────────────────────────────────────────

  console.log('')
  console.log('🎉 Seed de demo completado!')
  console.log('')
  console.log('📋 Credenciales de demo (todas usan: Demo123456@):')
  console.log('   prof2@demo.com   → Profesor Roberto Silva')
  console.log('   prof3@demo.com   → Profesora Lucía Mendoza')
  console.log('   prof4@demo.com   → Profesor Ernesto Vargas')
  console.log('   alumno001@demo.com ... alumno060@demo.com → Alumnos')
  console.log('')
  console.log('📊 Resumen:')
  console.log(`   Profesores totales : ${profesores.length}`)
  console.log(`   Alumnos creados    : ${alumnosCreados.length}`)
  console.log(`   Conversaciones     : ${pares.length}`)
  console.log(`   Mensajes           : ${totalMensajes}`)
}

main()
  .catch((e: unknown) => {
    console.error('❌ Error en seed de demo:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
