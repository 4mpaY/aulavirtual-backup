const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const escuelas = [
    {
      nombre: 'Escuela de Tecnología',
      slug: 'escuela-tecnologia',
      descripcion: 'Cursos de programación y desarrollo de software',
      estado: 'DISPONIBLE',
      orden: 1,
    },
    {
      nombre: 'Escuela de Negocios',
      slug: 'escuela-negocios',
      descripcion: 'Cursos de marketing y gestión',
      estado: 'DISPONIBLE',
      orden: 2,
    }
  ];

  for (const esc of escuelas) {
    await prisma.escuela.upsert({
      where: { slug: esc.slug },
      update: {},
      create: esc,
    });
  }
  console.log('Escuelas creadas correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
