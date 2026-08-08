import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminUser = await prisma.usuario.findFirst({
    where: { rol: 'ADMIN' }
  })
  
  if (!adminUser) {
    throw new Error('No ADMIN user found')
  }

  // --- CIUDADANO DIGITAL 2050 (DISPONIBLE) ---
  const escCD = await prisma.escuela.upsert({
    where: { slug: 'ciudadano-digital-2050' },
    update: { nombre: 'Ciudadano Digital 2050', orden: 2, estado: 'DISPONIBLE' },
    create: {
      nombre: 'Ciudadano Digital 2050',
      slug: 'ciudadano-digital-2050',
      descripcion: 'Promover la alfabetización digital y facilitar el acceso a la Inteligencia Artificial para personas de distintas edades y perfiles profesionales.',
      orden: 2,
      estado: 'DISPONIBLE',
    }
  })

  const cursosCD = [
    { codigo: 'CD1', titulo: 'Inteligencia Artificial para la Vida y el Trabajo' },
    { codigo: 'CD2', titulo: 'Cómo Hablar con la Inteligencia Artificial' },
    { codigo: 'CD3', titulo: 'Productividad Personal con IA' },
    { codigo: 'CD4', titulo: 'Emprender con Inteligencia Artificial' },
    { codigo: 'CC1', titulo: 'Excel para la Productividad y Análisis de Datos' },
    { codigo: 'CC2', titulo: 'Python para No Especialistas' },
    { codigo: 'CC3', titulo: 'Marca Profesional, Empleabilidad y LinkedIn con IA' },
    { codigo: 'CC4', titulo: 'GitHub y Portafolio Profesional' },
    { codigo: 'CC5', titulo: 'Comunicación y Presentaciones con IA' },
  ]
  const createdCD: Record<string, any> = {}
  for (const c of cursosCD) {
    const slug = c.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    createdCD[c.codigo] = await prisma.curso.upsert({
      where: { slug },
      update: { titulo: c.titulo },
      create: { titulo: c.titulo, slug, descripcion: `Curso de ${c.titulo}`, precio: 0, es_gratis: true, estado: 'PUBLICADO', profesor_id: adminUser.id }
    })
  }

  // Clear existing paths
  await prisma.rutaAprendizaje.deleteMany({ where: { escuela_id: escCD.id } })

  const rutaCD = await prisma.rutaAprendizaje.create({
    data: {
      titulo: 'Ciudadano Digital 2050',
      slug: 'ciudadano-digital-2050-ruta',
      escuela: { connect: { id: escCD.id } },
      esta_activo: true,
    }
  })
  const cdCursos = ['CD1', 'CD2', 'CD3', 'CD4']
  for (let i = 0; i < cdCursos.length; i++) {
    await prisma.cursoEnRuta.create({
      data: {
        ruta: { connect: { id: rutaCD.id } },
        curso: { connect: { id: createdCD[cdCursos[i]].id } },
        orden: i + 1
      }
    })
  }

  const rutaCC = await prisma.rutaAprendizaje.create({
    data: {
      titulo: 'Cursos Complementarios',
      slug: 'cursos-complementarios-cd',
      escuela: { connect: { id: escCD.id } },
      esta_activo: true,
    }
  })
  const ccCursos = ['CC1', 'CC2', 'CC3', 'CC4', 'CC5']
  for (let i = 0; i < ccCursos.length; i++) {
    await prisma.cursoEnRuta.create({
      data: {
        ruta: { connect: { id: rutaCC.id } },
        curso: { connect: { id: createdCD[ccCursos[i]].id } },
        orden: i + 1
      }
    })
  }

  // --- ESCUELAS PROXIMAMENTE ---
  const proximas = [
    {
      nombre: 'Gestión Social y Desarrollo Sostenible',
      slug: 'gestion-social-y-desarrollo-sostenible',
      rutas: ['Relaciones Comunitarias', 'Responsabilidad Social', 'Gestión de Conflictos Socioambientales', 'Inversión Social', 'Proyectos de Inversión']
    },
    {
      nombre: 'ERP y Transformación Empresarial',
      slug: 'erp-y-transformacion-empresarial',
      rutas: ['ERP', 'SAP', 'SAP Analytics', 'Transformación Empresarial']
    },
    {
      nombre: 'Gestión, Industria 5.0 e Innovación',
      slug: 'gestion-industria-5-0-e-innovacion',
      rutas: ['Gestión de Proyectos', 'Industria 5.0', 'Gemelos Digitales', 'Innovación', 'Gestión del Cambio']
    }
  ]

  let ordenEsc = 3
  for (const p of proximas) {
    const esc = await prisma.escuela.upsert({
      where: { slug: p.slug },
      update: { nombre: p.nombre, estado: 'PROXIMAMENTE', orden: ordenEsc },
      create: { nombre: p.nombre, slug: p.slug, estado: 'PROXIMAMENTE', orden: ordenEsc }
    })
    ordenEsc++

    await prisma.rutaAprendizaje.deleteMany({ where: { escuela_id: esc.id } })
    
    let ordenRuta = 1
    for (const r of p.rutas) {
      const rslug = r.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + esc.id.substring(0, 4)
      await prisma.rutaAprendizaje.create({
        data: {
          titulo: r,
          slug: rslug,
          escuela: { connect: { id: esc.id } },
          esta_activo: true,
        }
      })
      ordenRuta++
    }
  }

  console.log('Seed de escuelas adicionales completado!')
}

main().catch(console.error).finally(async () => { await prisma.$disconnect() })
