const { PrismaClient, TipoEmision, EstadoCurso, NivelCurso } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del curso PEGA...')

  // Buscar profesor existente
  let profesor = await prisma.usuario.findFirst({
    where: { rol: 'PROFESOR' }
  })

  if (!profesor) {
    profesor = await prisma.usuario.findFirst({
      where: { rol: 'ADMIN' }
    })
  }

  if (!profesor) {
    throw new Error('No se encontró ningún usuario para asignar el curso.')
  }

  // Buscar o crear categoría
  const categoria = await prisma.categoria.upsert({
    where: { slug: 'gestion-activos' },
    update: {},
    create: {
      nombre: 'Gestión de Activos',
      slug: 'gestion-activos'
    }
  })

  // Datos del curso
  const cursoData = {
    titulo: 'Plan Estratégico de Gestión de Activos (PEGA)',
    slug: 'pega-gestion-activos',
    descripcion: 'Curso clave para diseñar el Plan Estratégico de Gestión de Activos (PEGA), documento central del sistema ISO 55001. Enfatiza alineación estratégica, valor, riesgo y gobernanza.',
    fecha_inicio: new Date(),
    duracion: '24–36 horas',
    tipo_emision: TipoEmision.ASINCRONO,
    nivel: NivelCurso.INTERMEDIO,
    estado: EstadoCurso.PUBLICADO,
    precio: 0,
    es_gratis: true,
    profesor_id: profesor.id,
    categoria_id: categoria.id,
    miniatura: 'https://images.unsplash.com/photo-1507537297325-592fe238199b?w=800&q=80',
    
    // Detalles Premium
    objetivos: [
      'Elaborar un PEGA completo y alineado a ISO 55001.',
      'Integrar objetivos corporativos con gestión de activos.',
      'Definir políticas, estrategias y planes de acción.',
      'Evaluar riesgos y priorizar iniciativas.'
    ],
    
    beneficios: [
      { title: 'Diseño Estratégico', desc: 'Capacidad de diseñar el documento clave de ISO 55001.', icon: 'tabler-pencil-rule' },
      { title: 'Influencia', desc: 'Mayor influencia en decisiones estratégicas.', icon: 'tabler-chart-arrows' },
      { title: 'Certificación Profesional', desc: 'Reconocimiento profesional como especialista en gestión de activos.', icon: 'tabler-certificate' },
      { title: 'Visión de Negocio', desc: 'Visión integral del negocio y los activos.', icon: 'tabler-eye' }
    ],

    metodologia: [
      { title: 'Plantilla PEGA', desc: 'Plantilla PEGA lista para implementar en tu organización.', icon: 'tabler-file-text' },
      { title: 'Taller Práctico', desc: 'Taller completo basado en un caso real para aplicar lo aprendido.', icon: 'tabler-tools' },
      { title: 'Necesidad Crítica', desc: 'Resuelve la necesidad de contar con PEGA sólidos para cumplir con ISO 55001.', icon: 'tabler-shield-check' }
    ],

    incluye: [
      { text: 'Certificado ARM – PEGA', active: true },
      { text: 'Duración: 24–36 horas de capacitación avanzada', active: true },
      { text: 'Modalidad: Online en vivo', active: true },
      { text: 'Plantilla PEGA descargable', active: true },
      { text: 'Público: Ingenieros senior, jefes y gerentes', active: true },
      { text: 'Recomendación: Avanzar hacia “Riesgos en Gestión de Activos”', active: true }
    ]
  }

  const curso = await prisma.curso.upsert({
    where: { slug: cursoData.slug },
    update: cursoData,
    create: cursoData
  })

  console.log(`Curso creado/actualizado: ${curso.titulo}`)

  // Temario
  const temario = [
    'Rol del PEGA en ISO 55001.',
    'Alineación estratégica y objetivos corporativos.',
    'Políticas y estrategias de gestión de activos.',
    'Evaluación de riesgos y priorización.',
    'Planes de acción y recursos.',
    'Indicadores estratégicos.',
    'Taller de elaboración de PEGA.'
  ]

  const modulo = await prisma.modulo.upsert({
    where: { curso_id_orden: { curso_id: curso.id, orden: 1 } },
    update: { titulo: 'Diseño del PEGA' },
    create: {
      titulo: 'Diseño del PEGA',
      orden: 1,
      curso_id: curso.id
    }
  })

  for (let i = 0; i < temario.length; i++) {
    await prisma.leccion.upsert({
      where: { modulo_id_orden: { modulo_id: modulo.id, orden: i + 1 } },
      update: { titulo: temario[i] },
      create: {
        titulo: temario[i],
        orden: i + 1,
        modulo_id: modulo.id
      }
    })
  }

  console.log(`✅ ${temario.length} lecciones creadas.`)
  console.log('🎉 Seed PEGA completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
