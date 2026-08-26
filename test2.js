const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.certificado.findFirst({ where: { usuario: { nombre: { contains: 'Lesly' } } }, include: { usuario: true, curso: true } });
  console.log(c);
  await prisma.$disconnect();
}
main();
