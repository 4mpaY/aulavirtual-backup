const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.modulo.deleteMany({});
  await prisma.examen.deleteMany({});
  console.log('Deleted');
}

main().finally(() => prisma.$disconnect());
