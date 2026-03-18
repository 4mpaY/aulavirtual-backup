import { PrismaClient, TipoEmision, EstadoCurso, NivelCurso } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del curso ISO 55000 con detalles completos...')

  // Buscar profesor existente
  let profesor = await prisma.usuario.findFirst({
    where: { rol: 'PROFESOR' }
  })

  if (!profesor) {
    console.log('No se encontró un profesor, buscando admin...')
    profesor = await prisma.usuario.findFirst({
      where: { rol: 'ADMIN' }
    })
  }

  if (!profesor) {
    throw new Error('No se encontró ningún usuario (Profesor o Admin) para asignar el curso.')
  }

  // Buscar o crear categoría
  const categoria = await prisma.categoria.upsert({
    where: { slug: 'gestion-activos' },
    update: {},
    create: {
      nombre: 'Gestión de Activos',
      slug: 'gestion-activos',
      descripcion: 'Cursos relacionados con ISO 55000 y gestión de activos físicos.'
    }
  })

  // Datos del curso
  const cursoData = {
    titulo: 'ISO 55000 Nivel 1: Fundamentos de Gestión de Activos',
    slug: 'iso-55000-fundamentos-gestion-activos',
    descripcion: 'Curso fundamental para comprender los principios, conceptos y estructura del estándar ISO 55000. Ideal para profesionales que desean iniciar su camino en gestión de activos físicos.',
    fecha_inicio: new Date(),
    duracion: '16-20 horas',
    tipo_emision: TipoEmision.ASINCRONO,
    nivel: NivelCurso.BASICO,
    estado: EstadoCurso.PUBLICADO,
    precio: 0,
    es_gratis: true,
    profesor_id: profesor.id,
    categoria_id: categoria.id,
    miniatura: 'https://images.unsplash.com/photo-1454165833767-027ffea9e772?w=800&q=80',
    
    // Detalles Premium
    objetivos: [
      'Comprender los fundamentos de ISO 55000, 55001 y 55002.',
      'Identificar los elementos del sistema de gestión de activos.',
      'Relacionar gestión de activos con mantenimiento, confiabilidad y operaciones.',
      'Reconocer el valor del ciclo de vida del activo.'
    ],
    
    beneficios: [
      { title: 'Visión Estratégica', desc: 'Visión clara y estratégica del rol de los activos en la organización.', icon: 'tabler-eye' },
      { title: 'Empleabilidad', desc: 'Mayor empleabilidad en empresas que adoptan ISO 55000.', icon: 'tabler-briefcase' },
      { title: 'Base Sólida', desc: 'Base sólida para avanzar hacia PEGA, CAMA e IAM.', icon: 'tabler-stairs' },
      { title: 'Confianza', desc: 'Confianza profesional para participar en proyectos de gestión de activos.', icon: 'tabler-shield-check' }
    ],

    metodologia: [
      { title: 'Enfoque Práctico', desc: 'Enfoque práctico y orientado a implementación profesional.', icon: 'tabler-tool' },
      { title: 'Herramientas', desc: 'Plantillas y mapas conceptuales del sistema de gestión.', icon: 'tabler-layout-grid' },
      { title: 'Necesidad del Mercado', desc: 'Resuelve la necesidad de profesionales que mejoren la toma de decisiones y reduzcan riesgos.', icon: 'tabler-chart-bar' }
    ],

    incluye: [
      { text: 'Certificado ARM – Fundamentos ISO 55000', active: true },
      { text: 'Duración: 16–20 horas (Flexibles)', active: true },
      { text: 'Modalidad: Online en vivo / Asíncrono', active: true },
      { text: 'Público: Ingenieros, supervisores y jefes', active: true },
      { text: 'Competencias: ISO 55000, ciclo de vida, valor y riesgo', active: true },
      { text: 'Recomendación: Avanzar hacia “Indicadores y Ciclo de Vida”', active: true }
    ]
  }

  const curso = await prisma.curso.upsert({
    where: { slug: cursoData.slug },
    update: cursoData,
    create: cursoData
  })

  console.log(`Curso creado/actualizado: ${curso.titulo}`)

  // Crear Módulo y Lecciones (Temario)
  const temario = [
    '¿Qué es la gestión de activos?',
    'Principios de ISO 55000.',
    'Requisitos de ISO 55001.',
    'Rol del liderazgo y la gobernanza.',
    'Gestión del ciclo de vida del activo.',
    'Valor, riesgo y costo.',
    'Integración con mantenimiento y confiabilidad.',
    'Casos reales de implementación.'
  ]

  const modulo = await prisma.modulo.upsert({
    where: { 
      curso_id_orden: { 
        curso_id: curso.id, 
        orden: 1 
      } 
    },
    update: { titulo: 'Contenido General' },
    create: {
      titulo: 'Contenido General',
      orden: 1,
      curso_id: curso.id
    }
  })

  for (let i = 0; i < temario.length; i++) {
    await prisma.leccion.upsert({
      where: { 
        modulo_id_orden: { 
          modulo_id: modulo.id, 
          orden: i + 1 
        } 
      },
      update: { titulo: temario[i] },
      create: {
        titulo: temario[i],
        orden: i + 1,
        modulo_id: modulo.id,
        es_vista_previa: i === 0
      }
    })
  }

  console.log(`✅ ${temario.length} lecciones creadas en el módulo 'Contenido General'.`)
  console.log('🎉 Seed ISO 55000 completado con éxito!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed ISO 55000:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
