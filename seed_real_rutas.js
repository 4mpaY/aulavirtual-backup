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

  // Helper to create courses
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

  // 3. Create Cursos for Tecnología e Innovación
  const c1 = await createCurso('C1', 'Algoritmos y Fundamentos de Programación');
  const c2 = await createCurso('C2', 'Python');
  const c3 = await createCurso('C3', 'Programación Orientada a Objetos');
  const c4 = await createCurso('C4', 'Fundamentos de Bases de Datos y SQL');
  const c5 = await createCurso('C5', 'Fundamentos de Estadística y Power BI');
  const c6 = await createCurso('C6', 'IA Generativa e Ingeniería de Prompting');
  const c7 = await createCurso('C7', 'Automatización y Aplicaciones con IA');

  const escTecnologia = await prisma.escuela.findUnique({ where: { slug: 'tecnologia-e-innovacion' } });
  const escCiudadano = await prisma.escuela.findUnique({ where: { slug: 'ciudadano-digital-2050' } });

  // Create Rutas for Tecnología e Innovación
  async function createRuta(nombre, escuelaId, cursosEnRuta) {
    const slug = nombre.toLowerCase().replace(/ /g, '-');
    const ruta = await prisma.rutaAprendizaje.upsert({
      where: { slug: slug },
      update: { escuela_id: escuelaId },
      create: {
        titulo: nombre,
        slug: slug,
        escuela_id: escuelaId,
      }
    });

    // Clean old mappings to recreate
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

  if (escTecnologia) {
    await createRuta('Programador con IA', escTecnologia.id, [c1, c2, c3, c6, c7]);
    await createRuta('Analista de Datos', escTecnologia.id, [c2, c4, c5, c6]);
    await createRuta('IA Aplicada', escTecnologia.id, [c2, c6, c7]);
    await createRuta('Desarrollador de Aplicaciones', escTecnologia.id, [c1, c2, c3, c4, c6]);
    await createRuta('Profesional Digital 2050', escTecnologia.id, [c1, c2, c4, c5, c6, c7]);
    console.log('Cursos y rutas de Tecnología creados.');
  }

  // 4. Create Cursos for Ciudadano Digital
  const cd1 = await createCurso('CD1', 'Inteligencia Artificial para la Vida y el Trabajo');
  const cd2 = await createCurso('CD2', 'Cómo Hablar con la Inteligencia Artificial');
  const cd3 = await createCurso('CD3', 'Productividad Personal con IA');
  const cd4 = await createCurso('CD4', 'Emprender con Inteligencia Artificial');

  // Create Ruta for Ciudadano Digital
  if (escCiudadano) {
    await createRuta('Ciudadano Digital 2050 Ruta', escCiudadano.id, [cd1, cd2, cd3, cd4]);
    console.log('Cursos y rutas de Ciudadano Digital creados.');
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
