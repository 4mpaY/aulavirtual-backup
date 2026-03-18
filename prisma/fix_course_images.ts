import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const images = {
  // ISO 55000 / Asset Management
  'introduccion-la-gestion-de-activos-iso-55000': 'https://images.unsplash.com/photo-1454165833767-1314d792348a?w=800&q=80',
  'indicadores-y-ciclo-de-vida-de-activos': 'https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80',
  'plan-estrategico-de-gestion-de-activos-pega': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'riesgos-en-gestion-de-activos': 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80',
  'cama-certified-assessor': 'https://images.unsplash.com/photo-1454165833767-027eeef1596b?w=800&q=80',
  'madurez-gobernanza-gestion-activos': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  'iam-certificate-asset-management': 'https://images.unsplash.com/photo-1507537297325-592fe238199b?w=800&q=80',
  'gestion-de-activos-fisicos-preparacion-cama': 'https://images.unsplash.com/photo-1542332213-31f87348057f?w=800&q=80',

  // Confiabilidad
  'confiabilidad-basica-ingenieros': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
  'indicadores-confiabilidad-mtbf-mttr': 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=800&q=80',
  'mantenimiento-predictivo': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
  'lubricacion-y-tribologia': 'https://images.unsplash.com/photo-1590422204919-610e7b41e20e?w=800&q=80',
  'analisis-vibraciones-nivel-i-va-i': 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&q=80',
  'preparacion-cmrp-certified-maintenance-reliability-professional': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
  'preparacion-va-i-va-ii-vibration-analyst-mobius': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
  'preparacion-rct-i-rct-ii-reliability-centered-technician': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',

  // Mantenimiento (Fixed Slugs)
  'fundamentos-mantenimiento-industrial': 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=800&q=80',
  'seguridad-procedimientos-mantenimiento': 'https://images.unsplash.com/photo-1590402444521-4ea2e069151c?w=800&q=80',
  'lubricacion-industrial-y-analisis-de-aceite-preparacion-mla-i': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80',
  'mantenimiento-predictivo-y-tecnicas-de-diagnostico': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80',
  'analisis-de-criticidad-y-estrategias-de-mantenimiento': 'https://images.unsplash.com/photo-1504384308090-c89eececbf8e?w=800&q=80',
  'mantenimiento-centrado-en-confiabilidad-rcm': 'https://images.unsplash.com/photo-1581093458791-4e78a635678b?w=800&q=80',
  'optimizacion-de-planes-de-mantenimiento': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  'analisis-de-fallas-y-rca-root-cause-analysis': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  'preparacion-cmrt-tecnico-certificado': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
  'preparacion-mla1-mla2-icml': 'https://images.unsplash.com/photo-1596753426921-d007440c3451?w=800&q=80',
  'preparacion-rct1-rct2-mobius-cat': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80'
}

async function main() {
  console.log('🖼️ Actualizando imágenes de los cursos (Fase 2)...')
  
  for (const [slug, url] of Object.entries(images)) {
    const curso = await prisma.curso.updateMany({
      where: { slug },
      data: { miniatura: url }
    })
    
    if (curso.count > 0) {
      console.log(`✅ Actualizado: ${slug}`)
    } else {
      console.log(`⚠️ No encontrado: ${slug}`)
    }
  }
  
  console.log('🎉 Actualización final de imágenes completada!')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
