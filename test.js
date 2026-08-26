const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const certs = await prisma.certificado.findMany();
  console.log('Found ' + certs.length + ' certificates.');
  let errs = 0;
  for (const c of certs) {
    try {
      const res = await fetch('http://localhost:3000/api/estudiante/certificado/' + c.id + '/pdf');
      if (!res.ok) {
        console.log('Cert ' + c.id + ' failed: ' + res.status + ' ' + await res.text());
        errs++;
      }
    } catch (e) {
      console.log('Cert ' + c.id + ' crashed: ' + e.message);
      errs++;
    }
  }
  console.log('Total errors: ' + errs);
  await prisma.$disconnect();
}
main();
