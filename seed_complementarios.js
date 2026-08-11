const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let profesor = await prisma.usuario.findFirst({ where: { rol: 'PROFESOR' } });
  if (!profesor) {
    profesor = await prisma.usuario.findFirst();
  }
  let categoria = await prisma.categoria.findFirst();

  if (!profesor || !categoria) {
    console.log('Se necesita al menos un profesor y una categoría en la base de datos para crear cursos.');
    return;
  }

  async function createCurso(codigo, titulo) {
    return prisma.curso.upsert({
      where: { slug: codigo.toLowerCase() },
      update: { titulo },
      create: {
        titulo: titulo,
        slug: codigo.toLowerCase(),
        codigo: codigo,
        descripcion: titulo,
        precio: 0,
        precio_falso: 0,
        moneda: 'PEN',
        nivel: 'BASICO',
        estado: 'PUBLICADO',
        tipo_emision: 'ASINCRONO',
        duracion: '10 horas',
        profesor_id: profesor.id,
        categoria_id: categoria.id,
      }
    });
  }

  // Cursos Complementarios
  await createCurso('CC1', 'Excel para la Productividad y Análisis de Datos');
  await createCurso('CC2', 'Python para No Especialistas');
  await createCurso('CC3', 'Marca Profesional, Empleabilidad y LinkedIn con IA');
  await createCurso('CC4', 'GitHub y Portafolio Profesional');
  await createCurso('CC5', 'Comunicación y Presentaciones con IA');

  console.log('Cursos complementarios agregados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
