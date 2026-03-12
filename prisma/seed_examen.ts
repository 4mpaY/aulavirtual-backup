import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Obtener el primer curso disponible
    const curso = await prisma.curso.findFirst({
        where: { estado: 'PUBLICADO' },
        select: { id: true, titulo: true }
    })

    if (!curso) {
        console.log('No hay cursos publicados. Crea uno primero.')
        return
    }

    console.log(`Creando examen para: ${curso.titulo} (${curso.id})`)

    // 2. Verificar si ya existe un examen para este curso
    const existingExam = await prisma.examen.findFirst({
        where: { curso_id: curso.id }
    })

    if (existingExam) {
        console.log(`Ya existe un examen para este curso: ${existingExam.titulo}`)
        // Publicarlo si no está publicado
        if (!existingExam.esta_publicado) {
            await prisma.examen.update({
                where: { id: existingExam.id },
                data: { esta_publicado: true }
            })
            console.log('Examen publicado exitosamente')
        }
        return
    }

    // 3. Crear examen con preguntas y opciones
    const examen = await prisma.examen.create({
        data: {
            titulo: `Examen Final - ${curso.titulo}`,
            descripcion: 'Evaluación final del curso. Debes obtener al menos 60% para aprobar.',
            curso_id: curso.id,
            puntaje_aprobacion: 60,
            intentos_maximos: 3,
            limite_tiempo: 30, // 30 minutos
            mezclar_preguntas: false,
            esta_publicado: true,
            preguntas: {
                create: [
                    {
                        texto: '¿Cuál es el objetivo principal de este curso?',
                        tipo: 'OPCION_MULTIPLE',
                        puntos: 1,
                        orden: 1,
                        opciones: {
                            create: [
                                { texto: 'Aprender los fundamentos de la materia', es_correcta: true, orden: 1 },
                                { texto: 'Obtener un certificado sin esfuerzo', es_correcta: false, orden: 2 },
                                { texto: 'Conocer gente nueva', es_correcta: false, orden: 3 },
                                { texto: 'Ninguna de las anteriores', es_correcta: false, orden: 4 }
                            ]
                        }
                    },
                    {
                        texto: '¿Qué recursos son importantes para el aprendizaje efectivo?',
                        tipo: 'OPCION_MULTIPLE',
                        puntos: 1,
                        orden: 2,
                        opciones: {
                            create: [
                                { texto: 'Solo los videos del curso', es_correcta: false, orden: 1 },
                                { texto: 'Videos, materiales complementarios y práctica', es_correcta: true, orden: 2 },
                                { texto: 'Solo la lectura de textos', es_correcta: false, orden: 3 },
                                { texto: 'Solo los exámenes finales', es_correcta: false, orden: 4 }
                            ]
                        }
                    },
                    {
                        texto: 'El aprendizaje autodirigido requiere disciplina y constancia.',
                        tipo: 'VERDADERO_FALSO',
                        puntos: 1,
                        orden: 3,
                        opciones: {
                            create: [
                                { texto: 'Verdadero', es_correcta: true, orden: 1 },
                                { texto: 'Falso', es_correcta: false, orden: 2 }
                            ]
                        }
                    },
                    {
                        texto: '¿Cuál de las siguientes NO es una buena práctica de estudio?',
                        tipo: 'OPCION_MULTIPLE',
                        puntos: 1,
                        orden: 4,
                        opciones: {
                            create: [
                                { texto: 'Tomar notas durante las lecciones', es_correcta: false, orden: 1 },
                                { texto: 'Practicar con ejercicios', es_correcta: false, orden: 2 },
                                { texto: 'Memorizar sin entender', es_correcta: true, orden: 3 },
                                { texto: 'Repasar periódicamente', es_correcta: false, orden: 4 }
                            ]
                        }
                    },
                    {
                        texto: 'La retroalimentación es esencial en el proceso de aprendizaje.',
                        tipo: 'VERDADERO_FALSO',
                        puntos: 1,
                        orden: 5,
                        opciones: {
                            create: [
                                { texto: 'Verdadero', es_correcta: true, orden: 1 },
                                { texto: 'Falso', es_correcta: false, orden: 2 }
                            ]
                        }
                    }
                ]
            }
        }
    })

    console.log(`✅ Examen creado exitosamente: ${examen.titulo}`)
    console.log(`   ID: ${examen.id}`)
    console.log(`   Preguntas: 5`)
    console.log(`   Tiempo límite: 30 minutos`)
    console.log(`   Puntaje aprobación: 60%`)
    console.log(`   Intentos máximos: 3`)
    console.log(`   Publicado: ✅`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
