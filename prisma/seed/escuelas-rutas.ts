/**
 * Seed de Escuelas de Formación Continua y Rutas de Aprendizaje.
 *
 * Crea las 5 escuelas, los 7 cursos base compartidos (Algoritmos, Python,
 * POO, SQL, Power BI, IA, Automatización) y las 5 rutas de aprendizaje que
 * los combinan, según la matriz de rutas provista:
 *
 *              C1  C2  C3  C4  C5  C6  C7
 * Programador  X   X   X               X   X
 * Analista         X       X   X   X
 * IA Aplicada      X                   X   X
 * Desarrollador X  X   X   X       X
 * Profesional  X   X       X   X   X   X
 *
 * (C1 Algoritmos, C2 Python, C3 POO, C4 SQL, C5 Power BI, C6 IA, C7 Automatización)
 *
 * Nota: las rutas "Programador con IA", "Analista de Datos", "IA Aplicada" y
 * "Desarrollador de Aplicaciones" se asignan a la escuela "Tecnología e
 * Innovación"; "Profesional Digital 2050" se asigna a "Ciudadano Digital
 * 2050" por coincidencia de nombre. Ajustar `escuelaSlug` si la asignación
 * real es distinta.
 *
 * Ejecutar: pnpm db:seed:escuelas
 */

import { PrismaClient, Rol, type NivelCurso } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const VIDEO_PLACEHOLDER = 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'

// ─── ESCUELAS ────────────────────────────────────────────────────────────────

interface EscuelaSeed {
  nombre: string
  slug: string
  descripcion: string
  estado: 'DISPONIBLE' | 'PROXIMAMENTE' | 'MEDIANTE_ALIANZAS' | 'EN_DESARROLLO'
  orden: number
  imagen: string
}

const escuelasData: EscuelaSeed[] = [
  {
    nombre: 'Tecnología e Innovación',
    slug: 'tecnologia-e-innovacion',
    descripcion: 'Fortalece competencias en programación, bases de datos, análisis de datos, inteligencia artificial y automatización para la industria moderna.',
    estado: 'DISPONIBLE',
    orden: 1,
    imagen: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
  },
  {
    nombre: 'Ciudadano Digital 2050',
    slug: 'ciudadano-digital-2050',
    descripcion: 'Acerca la inteligencia artificial y las herramientas digitales a profesionales, técnicos y ciudadanos de diferentes niveles de experiencia.',
    estado: 'DISPONIBLE',
    orden: 2,
    imagen: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop'
  },
  {
    nombre: 'Gestión Social y Desarrollo Sostenible',
    slug: 'gestion-social-desarrollo-sostenible',
    descripcion: 'Capacidades de vanguardia para la gestión de relaciones comunitarias, responsabilidad social, prevención de conflictos socioambientales e inversión de impacto.',
    estado: 'PROXIMAMENTE',
    orden: 3,
    imagen: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop'
  },
  {
    nombre: 'ERP y Transformación Empresarial',
    slug: 'erp-transformacion-empresarial',
    descripcion: 'Especialización en sistemas integrados de gestión empresarial y transformación organizacional mediante alianzas estratégicas.',
    estado: 'MEDIANTE_ALIANZAS',
    orden: 4,
    imagen: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop'
  },
  {
    nombre: 'Gestión, Industria 5.0 e Innovación',
    slug: 'gestion-industria-5-0-innovacion',
    descripcion: 'Gestión ágil de proyectos, innovación tecnológica, gemelos digitales e industria 5.0 aplicada a operaciones de alta complejidad.',
    estado: 'EN_DESARROLLO',
    orden: 5,
    imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop'
  }
]

// ─── CURSOS BASE (compartidos entre rutas) ────────────────────────────────────

interface CursoSeed {
  slug: string
  titulo: string
  descripcion: string
  nivel: NivelCurso
  duracion: string
  precio: number
  precio_falso: number
  objetivos: string[]
  beneficios: string[]
  modulo: { titulo: string; lecciones: { titulo: string; duracion: number }[] }
}

const cursosData: CursoSeed[] = [
  {
    slug: 'algoritmos-logica-programacion',
    titulo: 'Algoritmos y Lógica de Programación',
    descripcion:
      'Desarrolla el pensamiento lógico y computacional necesario para programar: variables, condicionales, bucles y estructuras de datos básicas.',
    nivel: 'BASICO',
    duracion: '16 horas',
    precio: 129.0,
    precio_falso: 179.0,
    objetivos: [
      'Comprender la lógica de programación',
      'Diseñar algoritmos con pseudocódigo y diagramas de flujo',
      'Aplicar estructuras de control y repetición'
    ],
    beneficios: ['Acceso de por vida', 'Certificado al completar', 'Ejercicios prácticos guiados'],
    modulo: {
      titulo: 'Fundamentos de Algoritmos',
      lecciones: [
        { titulo: 'Introducción a la lógica de programación', duracion: 20 },
        { titulo: 'Estructuras de control y bucles', duracion: 25 },
        { titulo: 'Diseño de algoritmos con pseudocódigo y diagramas de flujo', duracion: 25 }
      ]
    }
  },
  {
    slug: 'python-desde-cero',
    titulo: 'Python desde Cero',
    descripcion: 'Aprende a programar en Python: sintaxis, tipos de datos, funciones, colecciones y manejo de archivos.',
    nivel: 'BASICO',
    duracion: '20 horas',
    precio: 149.0,
    precio_falso: 199.0,
    objetivos: ['Programar en Python usando sus estructuras fundamentales', 'Crear funciones y módulos reutilizables', 'Manipular archivos y colecciones de datos'],
    beneficios: ['Acceso de por vida', 'Certificado al completar', 'Proyectos prácticos con Python'],
    modulo: {
      titulo: 'Fundamentos de Python',
      lecciones: [
        { titulo: 'Sintaxis básica y tipos de datos', duracion: 25 },
        { titulo: 'Funciones, listas y diccionarios', duracion: 30 },
        { titulo: 'Manejo de archivos y librerías estándar', duracion: 25 }
      ]
    }
  },
  {
    slug: 'programacion-orientada-objetos',
    titulo: 'Programación Orientada a Objetos (POO)',
    descripcion: 'Domina los pilares de la POO: clases, objetos, herencia, encapsulamiento y polimorfismo aplicados con Python.',
    nivel: 'INTERMEDIO',
    duracion: '18 horas',
    precio: 159.0,
    precio_falso: 209.0,
    objetivos: ['Diseñar clases y objetos', 'Aplicar herencia, encapsulamiento y polimorfismo', 'Estructurar proyectos orientados a objetos'],
    beneficios: ['Acceso de por vida', 'Certificado al completar', 'Casos prácticos de diseño orientado a objetos'],
    modulo: {
      titulo: 'Fundamentos de POO',
      lecciones: [
        { titulo: 'Clases, objetos y atributos', duracion: 25 },
        { titulo: 'Herencia y polimorfismo', duracion: 30 },
        { titulo: 'Encapsulamiento y buenas prácticas', duracion: 25 }
      ]
    }
  },
  {
    slug: 'bases-de-datos-sql',
    titulo: 'Bases de Datos y SQL',
    descripcion: 'Aprende a diseñar y consultar bases de datos relacionales usando SQL: sentencias DML, DDL, joins y subconsultas.',
    nivel: 'INTERMEDIO',
    duracion: '18 horas',
    precio: 149.0,
    precio_falso: 199.0,
    objetivos: ['Diseñar modelos de bases de datos relacionales', 'Escribir consultas SQL con joins y subconsultas', 'Aplicar buenas prácticas de normalización'],
    beneficios: ['Acceso de por vida', 'Certificado al completar', 'Ejercicios con bases de datos reales'],
    modulo: {
      titulo: 'Fundamentos de SQL',
      lecciones: [
        { titulo: 'Modelo relacional y sentencias DDL/DML', duracion: 25 },
        { titulo: 'Consultas con JOIN y funciones de agregación', duracion: 30 },
        { titulo: 'Subconsultas y optimización básica', duracion: 25 }
      ]
    }
  },
  {
    slug: 'power-bi-analisis-datos',
    titulo: 'Power BI para Análisis de Datos',
    descripcion: 'Transforma y visualiza datos con Power BI: modelado, DAX, dashboards interactivos y publicación de reportes.',
    nivel: 'INTERMEDIO',
    duracion: '16 horas',
    precio: 159.0,
    precio_falso: 209.0,
    objetivos: ['Conectar y transformar datos con Power Query', 'Modelar datos y crear medidas con DAX', 'Diseñar dashboards interactivos'],
    beneficios: ['Acceso de por vida', 'Certificado al completar', 'Plantillas de dashboards descargables'],
    modulo: {
      titulo: 'Fundamentos de Power BI',
      lecciones: [
        { titulo: 'Conexión y transformación de datos con Power Query', duracion: 25 },
        { titulo: 'Modelado de datos y fórmulas DAX', duracion: 30 },
        { titulo: 'Diseño de dashboards y publicación de reportes', duracion: 25 }
      ]
    }
  },
  {
    slug: 'inteligencia-artificial-aplicada',
    titulo: 'Inteligencia Artificial Aplicada',
    descripcion:
      'Aplica inteligencia artificial e IA generativa a problemas reales: fundamentos de IA, modelos de lenguaje, prompting y casos de uso profesionales.',
    nivel: 'AVANZADO',
    duracion: '20 horas',
    precio: 179.0,
    precio_falso: 239.0,
    objetivos: ['Comprender los fundamentos de la IA y la IA generativa', 'Diseñar prompts efectivos para modelos de lenguaje', 'Aplicar IA a casos de uso profesionales'],
    beneficios: ['Acceso de por vida', 'Certificado al completar', 'Casos prácticos con herramientas de IA generativa'],
    modulo: {
      titulo: 'Fundamentos de Inteligencia Artificial',
      lecciones: [
        { titulo: 'Fundamentos de IA y IA generativa', duracion: 25 },
        { titulo: 'Prompting efectivo para modelos de lenguaje', duracion: 30 },
        { titulo: 'Aplicaciones profesionales de la IA', duracion: 25 }
      ]
    }
  },
  {
    slug: 'automatizacion-procesos',
    titulo: 'Automatización de Procesos',
    descripcion: 'Automatiza tareas y flujos de trabajo repetitivos combinando Python, IA y herramientas de automatización.',
    nivel: 'AVANZADO',
    duracion: '14 horas',
    precio: 159.0,
    precio_falso: 209.0,
    objetivos: ['Identificar procesos susceptibles de automatización', 'Automatizar tareas con Python e IA', 'Integrar flujos de automatización en el trabajo diario'],
    beneficios: ['Acceso de por vida', 'Certificado al completar', 'Plantillas de automatización reutilizables'],
    modulo: {
      titulo: 'Fundamentos de Automatización',
      lecciones: [
        { titulo: 'Identificación de procesos automatizables', duracion: 20 },
        { titulo: 'Automatización de tareas con Python', duracion: 25 },
        { titulo: 'Integración de IA en flujos de automatización', duracion: 25 }
      ]
    }
  }
]

// ─── RUTAS DE APRENDIZAJE ──────────────────────────────────────────────────────

interface RutaSeed {
  slug: string
  titulo: string
  descripcion: string
  escuelaSlug: string
  secciones: { id: string; titulo: string; orden: number }[]
  cursos: { cursoSlug: string; orden: number; seccionId?: string }[]
}

const rutasData: RutaSeed[] = [
  {
    slug: 'programador-con-ia',
    titulo: 'Programador con IA',
    descripcion:
      'Conviértete en programador con IA: domina algoritmos, Python, programación orientada a objetos, inteligencia artificial y automatización.',
    escuelaSlug: 'tecnologia-e-innovacion',
    secciones: [
      { id: 'fundamentos', titulo: 'Fundamentos de Programación', orden: 1 },
      { id: 'especializacion', titulo: 'Especialización', orden: 2 },
      { id: 'integracion', titulo: 'Integración y Automatización', orden: 3 }
    ],
    cursos: [
      { cursoSlug: 'algoritmos-logica-programacion', orden: 1, seccionId: 'fundamentos' },
      { cursoSlug: 'python-desde-cero', orden: 2, seccionId: 'fundamentos' },
      { cursoSlug: 'programacion-orientada-objetos', orden: 3, seccionId: 'especializacion' },
      { cursoSlug: 'inteligencia-artificial-aplicada', orden: 4, seccionId: 'especializacion' },
      { cursoSlug: 'automatizacion-procesos', orden: 5, seccionId: 'integracion' }
    ]
  },
  {
    slug: 'analista-de-datos',
    titulo: 'Analista de Datos',
    descripcion:
      'Fórmate como analista de datos: Python, bases de datos SQL, visualización con Power BI e inteligencia artificial aplicada al análisis.',
    escuelaSlug: 'tecnologia-e-innovacion',
    secciones: [],
    cursos: [
      { cursoSlug: 'python-desde-cero', orden: 1 },
      { cursoSlug: 'bases-de-datos-sql', orden: 2 },
      { cursoSlug: 'power-bi-analisis-datos', orden: 3 },
      { cursoSlug: 'inteligencia-artificial-aplicada', orden: 4 }
    ]
  },
  {
    slug: 'ia-aplicada',
    titulo: 'IA Aplicada',
    descripcion: 'Aplica la inteligencia artificial generativa a proyectos reales: Python, IA generativa y automatización de procesos.',
    escuelaSlug: 'tecnologia-e-innovacion',
    secciones: [],
    cursos: [
      { cursoSlug: 'python-desde-cero', orden: 1 },
      { cursoSlug: 'inteligencia-artificial-aplicada', orden: 2 },
      { cursoSlug: 'automatizacion-procesos', orden: 3 }
    ]
  },
  {
    slug: 'desarrollador-de-aplicaciones',
    titulo: 'Desarrollador de Aplicaciones',
    descripcion:
      'Conviértete en desarrollador de aplicaciones: algoritmos, Python, programación orientada a objetos, bases de datos SQL e inteligencia artificial.',
    escuelaSlug: 'tecnologia-e-innovacion',
    secciones: [
      { id: 'fundamentos', titulo: 'Fundamentos de Programación', orden: 1 },
      { id: 'especializacion', titulo: 'Especialización', orden: 2 }
    ],
    cursos: [
      { cursoSlug: 'algoritmos-logica-programacion', orden: 1, seccionId: 'fundamentos' },
      { cursoSlug: 'python-desde-cero', orden: 2, seccionId: 'fundamentos' },
      { cursoSlug: 'programacion-orientada-objetos', orden: 3, seccionId: 'especializacion' },
      { cursoSlug: 'bases-de-datos-sql', orden: 4, seccionId: 'especializacion' },
      { cursoSlug: 'inteligencia-artificial-aplicada', orden: 5, seccionId: 'especializacion' }
    ]
  },
  {
    slug: 'profesional-digital-2050',
    titulo: 'Profesional Digital 2050',
    descripcion:
      'La ruta más completa: algoritmos, Python, SQL, Power BI, inteligencia artificial y automatización para el profesional del futuro.',
    escuelaSlug: 'ciudadano-digital-2050',
    secciones: [],
    cursos: [
      { cursoSlug: 'algoritmos-logica-programacion', orden: 1 },
      { cursoSlug: 'python-desde-cero', orden: 2 },
      { cursoSlug: 'bases-de-datos-sql', orden: 3 },
      { cursoSlug: 'power-bi-analisis-datos', orden: 4 },
      { cursoSlug: 'inteligencia-artificial-aplicada', orden: 5 },
      { cursoSlug: 'automatizacion-procesos', orden: 6 }
    ]
  }
]

async function main() {
  console.log('🌱 Sembrando escuelas, cursos base y rutas de aprendizaje...')

  // ─── PROFESOR Y CATEGORÍA BASE ────────────────────────────────────────────

  const profesorPassword = await bcrypt.hash('Profesor123!', 10)

  const profesor = await prisma.usuario.upsert({
    where: { correo: 'profesor@gmail.com' },
    update: {},
    create: {
      correo: 'profesor@gmail.com',
      contrasena: profesorPassword,
      nombre: 'Juan',
      apellido: 'García',
      numero_documento: '00000002',
      celular: '900000002',
      rol: Rol.PROFESOR,
      esta_activo: true
    }
  })

  const categoria = await prisma.categoria.upsert({
    where: { slug: 'tecnologia-y-programacion' },
    update: {},
    create: {
      nombre: 'Tecnología y Programación',
      slug: 'tecnologia-y-programacion',
      descripcion: 'Cursos de programación, datos e inteligencia artificial',
      esta_activo: true,
      orden: 10
    }
  })

  console.log('✅ Profesor y categoría base listos')

  // ─── ESCUELAS ──────────────────────────────────────────────────────────────

  const escuelas: Record<string, { id: string }> = {}

  for (const e of escuelasData) {
    escuelas[e.slug] = await prisma.escuela.upsert({
      where: { slug: e.slug },
      update: {
        nombre: e.nombre,
        descripcion: e.descripcion,
        estado: e.estado,
        orden: e.orden,
        imagen: e.imagen
      },
      create: e
    })
  }

  console.log(`✅ ${escuelasData.length} escuelas creadas`)

  // ─── CURSOS BASE (compartidos entre rutas) ────────────────────────────────

  const cursos: Record<string, { id: string }> = {}

  for (const [index, c] of cursosData.entries()) {
    cursos[c.slug] = await prisma.curso.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        titulo: c.titulo,
        slug: c.slug,
        descripcion: c.descripcion,
        precio: c.precio,
        precio_falso: c.precio_falso,
        moneda: 'PEN',
        nivel: c.nivel,
        estado: 'PUBLICADO',
        tipo_emision: 'ASINCRONO',
        duracion: c.duracion,
        orden: index + 1,
        profesor_id: profesor.id,
        categoria_id: categoria.id,
        objetivos: c.objetivos,
        beneficios: c.beneficios,
        modulos: {
          create: [
            {
              titulo: c.modulo.titulo,
              orden: 0,
              lecciones: {
                create: c.modulo.lecciones.map((leccion, i) => ({
                  titulo: leccion.titulo,
                  orden: i,
                  duracion: leccion.duracion,
                  video_url: VIDEO_PLACEHOLDER,
                  es_vista_previa: i === 0
                }))
              }
            }
          ]
        }
      }
    })
  }

  console.log(`✅ ${cursosData.length} cursos base creados (Algoritmos, Python, POO, SQL, Power BI, IA, Automatización)`)

  // ─── RUTAS DE APRENDIZAJE + VÍNCULO CON CURSOS ────────────────────────────

  for (const r of rutasData) {
    const escuela = escuelas[r.escuelaSlug]

    const ruta = await prisma.rutaAprendizaje.upsert({
      where: { slug: r.slug },
      update: {
        titulo: r.titulo,
        descripcion: r.descripcion,
        escuela_id: escuela.id,
        secciones: r.secciones
      },
      create: {
        titulo: r.titulo,
        slug: r.slug,
        descripcion: r.descripcion,
        esta_activo: true,
        escuela_id: escuela.id,
        secciones: r.secciones
      }
    })

    // Se recrean los vínculos para que el seed sea idempotente ante cambios de orden/sección
    await prisma.cursoEnRuta.deleteMany({ where: { ruta_id: ruta.id } })

    await prisma.cursoEnRuta.createMany({
      data: r.cursos.map(c => ({
        ruta_id: ruta.id,
        curso_id: cursos[c.cursoSlug].id,
        orden: c.orden,
        seccion_id: c.seccionId ?? null
      }))
    })

    console.log(`✅ Ruta "${r.titulo}" → ${r.cursos.length} cursos vinculados (escuela: ${r.escuelaSlug})`)
  }

  // ─── RESUMEN ─────────────────────────────────────────────────────────────────

  console.log('')
  console.log('🎉 Seed de escuelas y rutas completado!')
  console.log('')
  console.log('🏫 Escuelas:')
  for (const e of escuelasData) {
    console.log(`   - ${e.nombre} (${e.estado})`)
  }

  console.log('')
  console.log('🗺️  Rutas de Aprendizaje:')
  for (const r of rutasData) {
    console.log(`   - ${r.titulo} — ${r.cursos.length} cursos (${r.escuelaSlug})`)
  }
}

main()
  .catch((e: any) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
