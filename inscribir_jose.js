const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'jose@gmail.com';
  
  // 1. Ensure user exists
  let user = await prisma.usuario.findUnique({ where: { correo: email } });
  if (!user) {
    user = await prisma.usuario.create({
      data: {
        correo: email,
        nombre: 'Jose',
        apellido: 'Perez',
        rol: 'ESTUDIANTE'
      }
    });
    console.log(`Usuario creado: ${email}`);
  } else {
    console.log(`Usuario encontrado: ${email}`);
  }

  // 2. Find the ruta
  const ruta = await prisma.rutaAprendizaje.findFirst({
    where: { slug: { contains: 'ia-aplicada' } },
    include: {
      cursos: {
        include: { curso: true }
      }
    }
  });

  if (!ruta) {
    console.log('No se encontró la ruta "IA Aplicada"');
    return;
  }

  console.log(`Ruta encontrada: ${ruta.titulo}. Cursos: ${ruta.cursos.length}`);

  // 3. Enroll in all courses of the ruta
  for (const cursoEnRuta of ruta.cursos) {
    const cursoId = cursoEnRuta.curso.id;
    const inscripcion = await prisma.inscripcion.upsert({
      where: {
        usuario_id_curso_id: {
          usuario_id: user.id,
          curso_id: cursoId
        }
      },
      update: {},
      create: {
        usuario_id: user.id,
        curso_id: cursoId,
        estado: 'ACTIVO'
      }
    });
    console.log(`Inscrito en curso: ${cursoEnRuta.curso.titulo}`);
  }

  console.log('Inscripción a la ruta completada.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
