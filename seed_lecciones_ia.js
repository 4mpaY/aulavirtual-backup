const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ruta = await prisma.rutaAprendizaje.findFirst({
    where: { slug: { contains: 'ia-aplicada' } },
    include: {
      cursos: { include: { curso: true } }
    }
  });

  if (!ruta) {
    console.log('No se encontró la ruta "IA Aplicada"');
    return;
  }

  for (const cursoEnRuta of ruta.cursos) {
    const cursoId = cursoEnRuta.curso.id;
    
    // Create a module
    const modulo = await prisma.modulo.create({
      data: {
        titulo: 'Módulo de Prueba',
        orden: 1,
        curso_id: cursoId,
      }
    });

    // Create a lesson
    await prisma.leccion.create({
      data: {
        titulo: 'Lección de Prueba 1',
        orden: 1,
        duracion: 10,
        es_vista_previa: false,
        modulo_id: modulo.id,
      }
    });

    // Create an exam
    const examen = await prisma.examen.create({
      data: {
        titulo: 'Examen de Prueba',
        tipo: 'FINAL',
        peso: 100,
        puntaje_aprobacion: 60,
        intentos_maximos: 3,
        esta_publicado: true,
        curso_id: cursoId,
      }
    });

    // Create a question
    const pregunta = await prisma.pregunta.create({
      data: {
        texto: '¿Pregunta de prueba?',
        tipo: 'OPCION_MULTIPLE',
        orden: 1,
        examen_id: examen.id,
      }
    });

    // Options
    await prisma.opcionPregunta.createMany({
      data: [
        { texto: 'Correcta', es_correcta: true, orden: 1, pregunta_id: pregunta.id },
        { texto: 'Incorrecta', es_correcta: false, orden: 2, pregunta_id: pregunta.id }
      ]
    });

    console.log(`Módulo, lección y examen añadidos a: ${cursoEnRuta.curso.titulo}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
