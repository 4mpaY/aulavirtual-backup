const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.certificado.findFirst({ where: { codigo_verificacion: { contains: 'JL-01SSO' } } });
  console.log(JSON.stringify(c, null, 2));
  await prisma.$disconnect();
}
main();
