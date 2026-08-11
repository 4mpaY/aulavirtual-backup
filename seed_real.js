const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get a professor and category to assign to courses
  let profesor = await prisma.usuario.findFirst({ where: { rol: 'PROFESOR' } });
  if (!profesor) {
    profesor = await prisma.usuario.findFirst();
  }
  let categoria = await prisma.categoria.findFirst();

  console.log('Profesor ID:', profesor?.id);
  console.log('Categoria ID:', categoria?.id);

  if (!profesor || !categoria) {
    console.log('Se necesita al menos un profesor y una categoría en la base de datos para crear cursos.');
    return;
  }

  // 1. Clean existing escuelas (we recreate them from scratch to avoid duplicates)
  await prisma.escuela.deleteMany({});

  // 2. Create Escuelas
  const escTecnologia = await prisma.escuela.create({
    data: {
      nombre: 'Tecnología e Innovación',
      slug: 'tecnologia-e-innovacion',
      estado: 'DISPONIBLE',
      orden: 1,
    }
  });

  const escCiudadano = await prisma.escuela.create({
    data: {
      nombre: 'Ciudadano Digital 2050',
      slug: 'ciudadano-digital-2050',
      estado: 'DISPONIBLE',
      orden: 2,
    }
  });

  await prisma.escuela.create({
    data: {
      nombre: 'Gestión Social y Desarrollo Sostenible',
      slug: 'gestion-social',
      estado: 'PROXIMAMENTE',
      orden: 3,
    }
  });

  await prisma.escuela.create({
    data: {
      nombre: 'ERP y Transformación Empresarial',
      slug: 'erp-transformacion',
      estado: 'MEDIANTE_ALIANZAS',
      orden: 4,
    }
  });

  await prisma.escuela.create({
    data: {
      nombre: 'Gestión, Industria 5.0 e Innovación',
      slug: 'gestion-industria',
      estado: 'EN_DESARROLLO',
      orden: 5,
    }
  });

  console.log('Escuelas creadas.');

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

  // Create Rutas for Tecnología e Innovación
  async function createRuta(nombre, escuelaId, cursosEnRuta) {
    const ruta = await prisma.rutaAprendizaje.create({
      data: {
        titulo: nombre,
        slug: nombre.toLowerCase().replace(/ /g, '-'),
        escuela_id: escuelaId,
      }
    });

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

  await createRuta('Programador con IA', escTecnologia.id, [c1, c2, c3, c6, c7]);
  await createRuta('Analista de Datos', escTecnologia.id, [c2, c4, c5, c6]);
  await createRuta('IA Aplicada', escTecnologia.id, [c2, c6, c7]);
  await createRuta('Desarrollador de Aplicaciones', escTecnologia.id, [c1, c2, c3, c4, c6]);
  await createRuta('Profesional Digital 2050', escTecnologia.id, [c1, c2, c4, c5, c6, c7]);

  console.log('Cursos y rutas de Tecnología creados.');

  // 4. Create Cursos for Ciudadano Digital
  const cd1 = await createCurso('CD1', 'Inteligencia Artificial para la Vida y el Trabajo');
  const cd2 = await createCurso('CD2', 'Cómo Hablar con la Inteligencia Artificial');
  const cd3 = await createCurso('CD3', 'Productividad Personal con IA');
  const cd4 = await createCurso('CD4', 'Emprender con Inteligencia Artificial');

  // Create Ruta for Ciudadano Digital
  await createRuta('Ciudadano Digital 2050 Ruta', escCiudadano.id, [cd1, cd2, cd3, cd4]);

  console.log('Cursos y rutas de Ciudadano Digital creados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
