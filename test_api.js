const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const userId = (await prisma.usuario.findFirst({where: {correo: 'jose@gmail.com'}})).id;
  const inscripciones = await prisma.inscripcion.findMany({
    where: { usuario_id: userId },
    select: { curso_id: true, completado_en: true, certificado_habilitado: true }
  });
  const cursosInscritosIds = inscripciones.map(i => i.curso_id);
  const rutas = await prisma.rutaAprendizaje.findMany({
    where: { cursos: { some: { curso_id: { in: cursosInscritosIds } } } },
    include: { escuela: true, cursos: { include: { curso: { select: { id: true, titulo: true, miniatura: true } } }, orderBy: { orden: 'asc' } } }
  });
  console.log(rutas.length);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
