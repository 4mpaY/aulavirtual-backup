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

  async function createRuta(nombre, escuelaId, cursosEnRuta) {
    const slug = nombre.toLowerCase().replace(/ /g, '-').replace(/,/g, '');
    const ruta = await prisma.rutaAprendizaje.upsert({
      where: { slug: slug },
      update: { escuela_id: escuelaId },
      create: {
        titulo: nombre,
        slug: slug,
        escuela_id: escuelaId,
      }
    });

    await prisma.cursoEnRuta.deleteMany({ where: { ruta_id: ruta.id } });

    for (let i = 0; i < cursosEnRuta.length; i++) {
      await prisma.cursoEnRuta.create({
        data: {
          orden: i + 1,
          ruta_id: ruta.id,
          curso_id: cursosEnRuta[i].id,
        }
      });
    }
    return ruta;
  }

  const escGestionSocial = await prisma.escuela.findUnique({ where: { slug: 'gestion-social' } });
  if (escGestionSocial) {
    const c1 = await createCurso('GS1', 'Relaciones Comunitarias');
    const c2 = await createCurso('GS2', 'Responsabilidad Social');
    const c3 = await createCurso('GS3', 'Gestión de Conflictos Socioambientales');
    const c4 = await createCurso('GS4', 'Inversión Social');
    const c5 = await createCurso('GS5', 'Proyectos de Inversión');
    await createRuta('Ruta de Gestión Social', escGestionSocial.id, [c1, c2, c3, c4, c5]);
    console.log('Cursos y rutas de Gestión Social creados.');
  }

  const escErp = await prisma.escuela.findUnique({ where: { slug: 'erp-transformacion' } });
  if (escErp) {
    const c1 = await createCurso('ERP1', 'ERP');
    const c2 = await createCurso('ERP2', 'SAP');
    const c3 = await createCurso('ERP3', 'SAP Analytics');
    const c4 = await createCurso('ERP4', 'Transformación Empresarial');
    await createRuta('Ruta de ERP y Transformación', escErp.id, [c1, c2, c3, c4]);
    console.log('Cursos y rutas de ERP creados.');
  }

  const escIndustria = await prisma.escuela.findUnique({ where: { slug: 'gestion-industria' } });
  if (escIndustria) {
    const c1 = await createCurso('IND1', 'Gestión de Proyectos');
    const c2 = await createCurso('IND2', 'Industria 5.0');
    const c3 = await createCurso('IND3', 'Gemelos Digitales');
    const c4 = await createCurso('IND4', 'Innovación');
    const c5 = await createCurso('IND5', 'Gestión del Cambio');
    await createRuta('Ruta de Industria 5.0 e Innovación', escIndustria.id, [c1, c2, c3, c4, c5]);
    console.log('Cursos y rutas de Industria 5.0 creados.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
