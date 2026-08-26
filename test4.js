const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.certificado.findMany({ include: { usuario: true } });
  const result = c.find(cert => {
    const isManual = cert.datos && cert.datos.emision_manual;
    if (isManual) {
      const nombre = cert.datos.usuario && cert.datos.usuario.nombre ? cert.datos.usuario.nombre : '';
      return nombre.includes('Lesly');
    }
    return cert.usuario && cert.usuario.nombre.includes('Lesly');
  });
  console.log(JSON.stringify(result, null, 2));
  await prisma.$disconnect();
}
main();
