const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const escuelas = [
    {
      nombre: 'Escuela de Diseño',
      slug: 'escuela-diseno',
      descripcion: 'Cursos de diseño gráfico y UI/UX',
      estado: 'PROXIMAMENTE',
      orden: 3,
    },
    {
      nombre: 'Escuela de Ingeniería',
      slug: 'escuela-ingenieria',
      descripcion: 'Cursos de ingeniería y arquitectura',
      estado: 'PROXIMAMENTE',
      orden: 4,
    },
    {
      nombre: 'Escuela de Idiomas',
      slug: 'escuela-idiomas',
      descripcion: 'Cursos de inglés y otros idiomas',
      estado: 'PROXIMAMENTE',
      orden: 5,
    }
  ];

  for (const esc of escuelas) {
    await prisma.escuela.upsert({
      where: { slug: esc.slug },
      update: {},
      create: esc,
    });
  }
  console.log('Escuelas adicionales creadas correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
