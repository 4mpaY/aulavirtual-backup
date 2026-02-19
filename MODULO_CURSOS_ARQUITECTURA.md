# 📚 Módulo Cursos - Arquitectura & Diseño UX/UI Profesional

## 📋 Índice
1. [Arquitectura de Base de Datos](#1-arquitectura-de-base-de-datos)
2. [Estructura API](#2-estructura-api)
3. [Estructura Frontend](#3-estructura-frontend)
4. [Diseño UX/UI Detallado](#4-diseño-uxui-detallado)
5. [Flujos de Usuario](#5-flujos-de-usuario)
6. [Especificaciones Técnicas](#6-especificaciones-técnicas)

---

## 1. Arquitectura de Base de Datos

### Modelos Prisma (ya existentes en schema.prisma)

```prisma
// Cursos
model Curso {
  id                 String      @id @default(uuid())
  titulo             String
  slug               String      @unique
  descripcion        String?
  descripcion_corta  String?      // Para cards (máx 160 caracteres)
  miniatura          String?
  video_presentacion String?
  duracion           String?     // ej: "4 semanas"
  tipo_emision       TipoEmision @default(ASINCRONO)
  estado             EstadoCurso @default(BORRADOR)
  es_gratis          Boolean     @default(false)
  precio             Decimal     @default(0) @db.Decimal(10, 2)
  moneda             String      @default("PEN")
  
  // Metadatos SEO
  seo_titulo         String?
  seo_descripcion    String?
  seo_keywords       String?    // comma-separated
  
  // Estadísticas
  estudiantes_inscritos Int @default(0)
  calificacion_promedio Float @default(0)
  total_lecciones   Int @default(0)
  
  creado_en          DateTime    @default(now())
  actualizado_en     DateTime    @updatedAt
  publicado_en       DateTime?

  profesor_id String
  profesor    Usuario @relation("ProfesorCursos", fields: [profesor_id], references: [id])

  categoria_id String?
  categoria    Categoria? @relation(fields: [categoria_id], references: [id])

  // Relaciones
  modulos           Modulo[]
  inscripciones     Inscripcion[]
  examenes          Examen[]
  certificados      Certificado[]
  comentarios       ComentarioCurso[]
  objetivos         ObjetivosCurso[]
  requisitos        RequisitosCurso[]

  @@index([profesor_id])
  @@index([categoria_id])
  @@index([estado])
  @@index([creado_en])
  @@map("cursos")
}

// Objetivos del curso
model ObjetivosCurso {
  id        String   @id @default(uuid())
  descripcion String  // Qué aprenderá el estudiante
  orden     Int
  
  curso_id  String
  curso     Curso    @relation(fields: [curso_id], references: [id], onDelete: Cascade)
  
  @@unique([curso_id, orden])
  @@map("objetivos_curso")
}

// Requisitos del curso
model RequisitosCurso {
  id        String   @id @default(uuid())
  descripcion String
  orden     Int
  
  curso_id  String
  curso     Curso    @relation(fields: [curso_id], references: [id], onDelete: Cascade)
  
  @@unique([curso_id, orden])
  @@map("requisitos_curso")
}

// Comentarios y reseñas
model ComentarioCurso {
  id        String   @id @default(uuid())
  texto     String
  calificacion Int   // 1-5 stars
  
  usuario_id String
  usuario   Usuario  @relation("ComentarioCurso", fields: [usuario_id], references: [id])
  
  curso_id  String
  curso     Curso    @relation(fields: [curso_id], references: [id], onDelete: Cascade)
  
  creado_en DateTime @default(now())
  actualizado_en DateTime @updatedAt
  
  @@index([curso_id])
  @@index([usuario_id])
  @@map("comentarios_curso")
}
```

---

## 2. Estructura API

### 2.1 Endpoints Disponibles

```
GET     /api/cursos                    # Listar todos los cursos (público/estudiantes)
GET     /api/cursos/:id                # Obtener detalles de un curso
POST    /api/cursos                    # Crear curso (PROFESOR/ADMIN)
PUT     /api/cursos/:id                # Actualizar curso (PROFESOR propietario/ADMIN)
DELETE  /api/cursos/:id                # Eliminar curso (PROFESOR propietario/ADMIN)
PATCH   /api/cursos/:id/estado         # Cambiar estado (BORRADOR→PUBLICADO)

GET     /api/cursos/:id/inscripciones  # Listar inscritos (PROFESOR del curso/ADMIN)
GET     /api/cursos/:id/comentarios    # Listar comentarios
POST    /api/cursos/:id/comentarios    # Agregar comentario (ESTUDIANTE inscrito)
DELETE  /api/cursos/:id/comentarios/:commentId  # Eliminar comentario

GET     /api/cursos/profesor/:profesorId       # Cursos de un profesor
GET     /api/cursos/categoria/:categoriaId     # Cursos por categoría
GET     /api/cursos/buscar?q=python&categoria=programacion  # Buscar
```

### 2.2 DTOs (Data Transfer Objects)

```typescript
// schemas/curso.schema.ts

import { z } from 'zod'
import { TipoEmision, EstadoCurso } from '@prisma/client'

/**
 * DTO para crear un curso (PROFESOR)
 */
export const crearCursoSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  
  descripcion: z
    .string()
    .trim()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(5000, 'La descripción no puede exceder 5000 caracteres'),
  
  descripcion_corta: z
    .string()
    .trim()
    .max(160, 'Máximo 160 caracteres para la descripción corta')
    .optional(),
  
  categoria_id: z
    .string()
    .uuid('ID de categoría inválido')
    .optional(),
  
  tipo_emision: z
    .nativeEnum(TipoEmision)
    .default('ASINCRONO'),
  
  es_gratis: z.boolean().default(false),
  
  precio: z
    .number()
    .positive('El precio debe ser mayor a 0')
    .optional(),
  
  miniatura: z
    .string()
    .url('URL de miniatura inválida')
    .optional(),
  
  video_presentacion: z
    .string()
    .url('URL de video inválida')
    .optional(),
  
  duracion: z
    .string()
    .optional(),
  
  objetivos: z
    .array(z.string().min(1))
    .min(1, 'Agregue al menos un objetivo')
    .optional(),
  
  requisitos: z
    .array(z.string().min(1))
    .optional(),
  
  seo_titulo: z.string().max(60).optional(),
  seo_descripcion: z.string().max(160).optional(),
  seo_keywords: z.string().optional(),
})

export type CrearCursoDto = z.infer<typeof crearCursoSchema>

/**
 * DTO para actualizar un curso
 */
export const actualizarCursoSchema = crearCursoSchema.partial()
export type ActualizarCursoDto = z.infer<typeof actualizarCursoSchema>

/**
 * DTO para comentarios
 */
export const crearComentarioCursoSchema = z.object({
  texto: z
    .string()
    .trim()
    .min(5, 'El comentario debe tener al menos 5 caracteres')
    .max(1000, 'El comentario no puede exceder 1000 caracteres'),
  
  calificacion: z
    .number()
    .int()
    .min(1, 'La calificación mínima es 1')
    .max(5, 'La calificación máxima es 5')
})

export type CrearComentarioCursoDto = z.infer<typeof crearComentarioCursoSchema>
```

### 2.3 Respuestas API Estandarizadas

```typescript
// Éxito - Listar cursos
{
  "status": true,
  "path": "/api/cursos",
  "statusCode": 200,
  "result": {
    "data": [
      {
        "id": "uuid-1",
        "titulo": "Python Avanzado",
        "slug": "python-avanzado",
        "descripcion": "...",
        "miniatura": "...",
        "profesor": {
          "id": "uuid-prof",
          "nombre": "Juan Pérez",
          "avatar": "..."
        },
        "categoria": {
          "id": "uuid-cat",
          "nombre": "Programación"
        },
        "estudiantes_inscritos": 245,
        "calificacion_promedio": 4.8,
        "es_gratis": false,
        "precio": 99.99,
        "tipo_emision": "ASINCRONO",
        "estado": "PUBLICADO",
        "creado_en": "2026-02-18T10:00:00Z"
      }
    ],
    "total": 150,
    "pagina": 1,
    "por_pagina": 10
  },
  "timestamp": "2026-02-18T10:00:00Z"
}

// Éxito - Obtener curso específico
{
  "status": true,
  "path": "/api/cursos/uuid-1",
  "statusCode": 200,
  "result": {
    "id": "uuid-1",
    "titulo": "Python Avanzado",
    "descripcion": "...",
    "profesor": { ... },
    "categoria": { ... },
    "objetivos": [
      "Dominar decoradores en Python",
      "Implementar patrones de diseño"
    ],
    "requisitos": [
      "Conocimiento básico de Python",
      "Familiaridad con POO"
    ],
    "modulos": [
      {
        "id": "uuid-mod-1",
        "titulo": "Fundamentos",
        "lecciones": [...]
      }
    ],
    "comentarios": [
      {
        "id": "uuid-comment",
        "usuario": { "nombre": "...", "avatar": "..." },
        "calificacion": 5,
        "texto": "Excelente curso",
        "creado_en": "..."
      }
    ],
    "estadisticas": {
      "estudiantes_inscritos": 245,
      "calificacion_promedio": 4.8,
      "total_lecciones": 42,
      "horas_contenido": 24
    }
  },
  "timestamp": "2026-02-18T10:00:00Z"
}
```

---

## 3. Estructura Frontend

### 3.1 Estructura de Carpetas

```
src/features/
├── admin/
│   └── cursos/
│       ├── components/
│       │   ├── CreateCursoModal.tsx
│       │   ├── EditCursoModal.tsx
│       │   ├── DeleteCursoModal.tsx
│       │   ├── CursoCard.tsx
│       │   ├── CursoTable.tsx
│       │   ├── CursoFilters.tsx
│       │   ├── CursoForm.tsx
│       │   ├── ObjetivosSection.tsx
│       │   ├── RequisitosSection.tsx
│       │   └── PreviewCurso.tsx
│       ├── hooks/
│       │   ├── useCursos.ts
│       │   ├── useCurso.ts
│       │   ├── useCreateCurso.ts
│       │   ├── useEditCurso.ts
│       │   ├── useDeleteCurso.ts
│       │   └── useComentarios.ts
│       ├── http/
│       │   └── axiosCursos.ts
│       ├── pages/
│       │   ├── CursosPage.tsx
│       │   ├── CrearCursoPage.tsx
│       │   └── EditarCursoPage.tsx
│       ├── schemas/
│       │   └── curso.schema.ts
│       └── index.ts
│
└── public/
    ├── pages/
    │   ├── CatalogoPage.tsx
    │   ├── DetalleCursoPage.tsx
    │   └── MisCursosPage.tsx
    └── components/
        ├── CursoCatalogCard.tsx
        ├── CatalogoFilters.tsx
        ├── CatalogoPaginacion.tsx
        ├── ComentariosSection.tsx
        ├── ResenasSection.tsx
        └── VistaPrevia3D.tsx
```

### 3.2 Estructura de APIs (HTTP Client)

```typescript
// src/features/admin/cursos/http/axiosCursos.ts

import { basePrismaHttpClient } from '@/utils/libs/httpClient'
import type { CrearCursoDto, ActualizarCursoDto, CrearComentarioCursoDto } from '@/schemas/curso.schema'
import type { Curso } from '@prisma/client'

export const axiosCursos = {
  // Listar cursos del profesor actual
  async listar(filtros?: { estado?: string; pagina?: number }): Promise<{
    data: Curso[]
    total: number
  }> {
    const response = await basePrismaHttpClient.get('/api/cursos', { params: filtros })
    return response.data.result
  },

  // Obtener un curso específico
  async obtener(id: string): Promise<Curso> {
    const response = await basePrismaHttpClient.get(`/api/cursos/${id}`)
    return response.data.result
  },

  // Crear nuevo curso
  async crear(curso: CrearCursoDto): Promise<{ curso: Curso }> {
    const response = await basePrismaHttpClient.post('/api/cursos', curso)
    return response.data.result
  },

  // Actualizar curso
  async actualizar(id: string, data: ActualizarCursoDto): Promise<{ curso: Curso }> {
    const response = await basePrismaHttpClient.put(`/api/cursos/${id}`, data)
    return response.data.result
  },

  // Cambiar estado de curso
  async cambiarEstado(id: string, nuevoEstado: string): Promise<{ curso: Curso }> {
    const response = await basePrismaHttpClient.patch(`/api/cursos/${id}/estado`, {
      estado: nuevoEstado
    })
    return response.data.result
  },

  // Eliminar curso
  async eliminar(id: string): Promise<void> {
    await basePrismaHttpClient.delete(`/api/cursos/${id}`)
  },

  // Agregar comentario
  async agregarComentario(cursoId: string, comentario: CrearComentarioCursoDto) {
    const response = await basePrismaHttpClient.post(
      `/api/cursos/${cursoId}/comentarios`,
      comentario
    )
    return response.data.result
  },

  // Obtener inscritos
  async obtenerInscritos(cursoId: string) {
    const response = await basePrismaHttpClient.get(`/api/cursos/${cursoId}/inscripciones`)
    return response.data.result
  }
}
```

---

## 4. Diseño UX/UI Detallado

### 4.1 Panel de Administración de Cursos (PROFESOR/ADMIN)

#### Vista Lista de Cursos

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  📚 MIS CURSOS                              🔍 Buscar... [x]     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Filtros:                                                    │ │
│  │ [Estado: Todos ▼] [Categoría: Todas ▼] [Limpiar filtros]  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                  [+ Crear Curso] │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Título                │ Inscritos │ Calif. │ Estado │ Acciones│
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ Python Avanzado       │ 245       │ ⭐4.8  │ 🟢 PUBLICADO   │ │
│  │                       │           │        │                 │ │
│  │ [Editar] [Copiar] [Más opciones]                             │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ React Fundamentals    │ 189       │ ⭐4.5  │ 🟢 PUBLICADO   │ │
│  │ [Editar] [Copiar] [Más opciones]                             │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ Node.js Curso Nuevo   │ 12        │ -      │ 🟡 BORRADOR    │ │
│  │ [Editar] [Copiar] [Más opciones]                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ◄ 1 2 3 4 5 ► (Mostrar 10 de 45)                               │
└─────────────────────────────────────────────────────────────────┘
```

#### Vista Crear/Editar Curso (Modal + Pasos)

```
┌──────────────────────────────────────────────────────────────────┐
│ ✕ CREAR NUEVO CURSO                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Información Básica  2. Contenido  3. Configuración  4. Revisión
│  ●────────────────────────────────────────────────────────      │
│                                                                   │
│  INFORMACIÓN BÁSICA                                              │
│  ─────────────────────────                                       │
│                                                                   │
│  Título del Curso *                                              │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ Python Avanzado para Backend              [40/100]   │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  Descripción Breve (aparece en catálogo) *                       │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ Aprende conceptos avanzados de Python para crear API │        │
│  │ profesionales...                           [98/160]   │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  Descripción Completa *                                          │
│  ┌──────────────────────────────────────────────────────┐        │
│  │                                                       │        │
│  │ En este curso aprenderás...                  [0/5000] │        │
│  │                                                       │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  Categoría *                      Tipo de Emisión *              │
│  ┌──────────────────────┐         ┌──────────────────────┐       │
│  │ Programación ▼       │         │ Asincrónico ▼        │       │
│  └──────────────────────┘         └──────────────────────┘       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │                    [Cancelar] [Siguiente →]         │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### Paso 2: Contenido (Modulos y Lecciones)

```
┌──────────────────────────────────────────────────────────────────┐
│ ✕ CREAR NUEVO CURSO                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Información Básica  2. Contenido  3. Configuración  4. Revisión
│  ─────────────────────●────────────────────────────────         │
│                                                                   │
│  CONTENIDO DEL CURSO                                             │
│  ────────────────────                                            │
│                                                                   │
│  Objetivos de Aprendizaje (mín. 1)                               │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ ☑ Dominar decoradores en Python                     │ ✕      │
│  │ ☑ Implementar patrones de diseño avanzados          │ ✕      │
│  │ ☑ Crear APIs REST profesionales                     │ ✕      │
│  │                                                       │        │
│  │ [+ Agregar objetivo]                                │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  Requisitos Previos (opcional)                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ ☑ Conocimiento básico de Python                      │ ✕      │
│  │ ☑ Familiaridad con POO                               │ ✕      │
│  │                                                       │        │
│  │ [+ Agregar requisito]                               │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  Miniatura (portada del curso)                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │  📸  Arrastra una imagen o haz clic para subir      │        │
│  │      (Máx 5MB, JPEG/PNG)                            │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  Video de Presentación (opcional)                                │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ https://youtube.com/watch?v=...                     │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  [← Anterior]  [Siguiente →]                        │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### Paso 3: Configuración (Precios, Disponibilidad)

```
┌──────────────────────────────────────────────────────────────────┐
│ ✕ CREAR NUEVO CURSO                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CONFIGURACIÓN                                                   │
│  ──────────────                                                  │
│                                                                   │
│  💰 Monetización                                                 │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ ◯ Curso Gratis                                       │        │
│  │ ◉ Pago requerido                                    │        │
│  │   Precio: [99.99] ┌──────┐                          │        │
│  │                   │ PEN ▼│                          │        │
│  │                   └──────┘                          │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  ⚙️ Ajustes Avanzados                                            │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ ☑ Permitir reembolsos (30 días)                     │        │
│  │ ☑ Certificado disponible                            │        │
│  │ ☑ Mostrar progreso a estudiantes                    │        │
│  │ ☐ Acceso por código de invitación                   │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  🔍 SEO (Opcional)                                               │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ Título SEO:                                          │        │
│  │ [Python Avanzado - Aprende Decoradores...]          │        │
│  │                                                       │        │
│  │ Meta descripción:                                    │        │
│  │ [Domina Python avanzado con proyectos reales...]   │        │
│  │                                                       │        │
│  │ Palabras clave:                                      │        │
│  │ [python, backend, programacion, decoradores]        │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  [← Anterior]  [Siguiente →]                        │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### Paso 4: Revisión y Publicación

```
┌──────────────────────────────────────────────────────────────────┐
│ ✕ CREAR NUEVO CURSO                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  REVISIÓN FINAL                                                  │
│  ──────────────                                                  │
│                                                                   │
│  ✅ Información Básica       |  ✅ Contenido                      │
│  ✅ Configuración            |  ✅ SEO                            │
│                                                                   │
│  VISTA PREVIA DEL CURSO                                          │
│  ┌────────────────────────────────────────────────────┐          │
│  │                                                    │          │
│  │         ┌──────────────────────┐                  │          │
│  │         │                      │                  │          │
│  │         │   [Miniatura Curso]  │                  │          │
│  │         │                      │                  │          │
│  │         └──────────────────────┘                  │          │
│  │                                                    │          │
│  │  Python Avanzado                          ⭐ N/A   │          │
│  │  Profesor: Juan Pérez                    👥 0    │          │
│  │                                                    │          │
│  │  Aprende conceptos avanzados de Python...        │          │
│  │                                                    │          │
│  │  📊 42 lecciones  ⏱️ 24 horas  💰 S/.99.99      │          │
│  │                                                    │          │
│  │  [Ver inscritos] [Editar] [Descartar]           │          │
│  │                                                    │          │
│  └────────────────────────────────────────────────────┘          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ ☑ Confirmo que toda la información es correcta     │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  [← Anterior]  [Guardar como Borrador] [Publicar] │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Catálogo Público (ESTUDIANTE/ANÓNIMO)

#### Vista Catálogo de Cursos

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  🏫 CATALOGO DE CURSOS                    🔍 [Buscar cursos...]  │
│                                                                   │
│  ┌─ Filtros ──────────────────────────────────────────────────┐  │
│  │ [Categoría: Todas ▼] [Precio: Todos ▼] [Calificación: ▼]  │  │
│  │ [Tipo: Todos ▼]      [Duración: Todas ▼]   [Limpiar]      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Mostrando 1-12 de 245 resultados                                │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │              │  │              │  │              │            │
│  │   [Imagen]   │  │   [Imagen]   │  │   [Imagen]   │            │
│  │              │  │              │  │              │            │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤            │
│  │Python Avanc  │  │React Fund    │  │Node.js Mástery
│  │              │  │              │  │              │            │
│  │ ⭐ 4.8      │  │ ⭐ 4.5      │  │ ⭐ 4.9      │            │
│  │(234 reyas)   │  │(189 reyas)   │  │(342 reyas)   │            │
│  │              │  │              │  │              │            │
│  │Juan Pérez    │  │María García  │  │Carlos López  │            │
│  │              │  │              │  │              │            │
│  │S/.99.99 👥245│  │S/.89.99 👥189│  │S/.79.99 👥342│           │
│  │[Agregar]     │  │[Agregar]     │  │[Agregar]     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   [Imagen]   │  │   [Imagen]   │  │   [Imagen]   │            │
│  │ ...          │  │ ...          │  │ ...          │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                   │
│  ◄ 1 [2] 3 4 5 ... ►  Mostrar [10▼] por página                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### Detalle del Curso

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  [← Volver al Catálogo]                                          │
│                                                                   │
│  PYTHON AVANZADO                                    ⭐ 4.8        │
│  ════════════════════════════════════════════════════════════    │
│                                                          (234)    │
│                                                                   │
│  ┌──────────────────────────┐                                    │
│  │                          │   Profesor: Juan Pérez             │
│  │                          │                                    │
│  │   [Miniatura Grande]     │   📊 Estadísticas:                │
│  │                          │   • 245 estudiantes inscritos     │
│  │                          │   • 42 lecciones                  │
│  │                          │   • 24 horas de contenido         │
│  │                          │   • Asincrónico                   │
│  │                          │                                    │
│  │      [▶ Ver introducción]│   Precio: $99.99 PEN              │
│  │                          │                                    │
│  └──────────────────────────┘   [Inscribirse] [Agregar Carrito] │
│                                                                   │
│  DESCRIPCIÓN                                                      │
│  ────────────                                                    │
│  En este curso aprenderás conceptos avanzados de Python que      │
│  te permitirán escribir código más eficiente y profesional...    │
│                                                                   │
│  QUÉ APRENDERÁS                                                   │
│  ───────────────                                                 │
│  ✓ Dominar decoradores en Python                               │
│  ✓ Implementar patrones de diseño avanzados                     │
│  ✓ Crear APIs REST profesionales                               │
│  ✓ Optimizar rendimiento de aplicaciones                       │
│                                                                   │
│  REQUISITOS                                                       │
│  ──────────                                                      │
│  ✓ Conocimiento básico de Python                               │
│  ✓ Familiaridad con POO                                        │
│                                                                   │
│  CONTENIDO DEL CURSO (42 lecciones)                              │
│  ───────────────────────────────────                            │
│  Módulo 1: Decoradores (6 lecciones)                            │
│  ├─ 1.1 Introducción a decoradores                             │
│  ├─ 1.2 Decoradores con argumentos                             │
│  ├─ 1.3 Decoradores encadenados                                │
│  └─ ...                                                         │
│                                                                   │
│  Módulo 2: Patrones de Diseño (8 lecciones)                     │
│  ├─ 2.1 Singleton Pattern                                      │
│  └─ ...                                                         │
│                                                                   │
│  RESEÑAS Y COMENTARIOS (34 reseñas)                             │
│  ──────────────────────────────────                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ⭐⭐⭐⭐⭐ "Excelente curso, muy completo"                  │ │
│  │ Juan Rodríguez - Tuvo acceso  2 meses atrás               │ │
│  │                                                             │ │
│  │ Texto de la reseña: "Este curso superó mis expectativas... │ │
│  │                                                             │ │
│  │ 👍 Útil (45)  👎 No útil (2)                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  [Mostrar más reseñas]  [Escribir reseña]                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.3 Mis Cursos (ESTUDIANTE)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  📚 MIS CURSOS                                                   │
│                                                                   │
│  [En Progreso] [Completados] [Todos]                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │                                                      │       │
│  │  Python Avanzado                                    │       │
│  │                                                      │       │
│  │  ┌────────────────────────────────┐                │       │
│  │  │ Progreso: ████████░░ 68%       │                │       │
│  │  └────────────────────────────────┘                │       │
│  │                                                      │       │
│  │  Última lección: "Decoradores avanzados"           │       │
│  │  Completada hace 2 días                             │       │
│  │                                                      │       │
│  │  [Continuar] [Ver certificado]                     │       │
│  │                                                      │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  React Fundamentals                                 │       │
│  │  Progreso: ███████----------── 35%                 │       │
│  │  [Continuar]                                       │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
│  Cursos Completados (3)                                          │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  HTML & CSS Básico                    ✅ Completado │       │
│  │  JavaScript Fundamentos                ✅ Completado │       │
│  │  SQL Básico                            ✅ Completado │       │
│  │  [Ver certificados]                                 │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Flujos de Usuario

### 5.1 Flujo: Profesor Crea un Curso

```
START
  │
  ├─→ Profesor entra a "Panel Admin" → "Cursos"
  │
  ├─→ Hace clic en "+ Crear Curso"
  │
  ├─→ [Modal Paso 1] Ingresa información básica
  │   • Título, descripción corta, descripción completa
  │   • Categoría, tipo de emisión
  │
  ├─→ [Modal Paso 2] Define contenido
  │   • Agrega objetivos de aprendizaje (mín 1)
  │   • Define requisitos (opcional)
  │   • Sube miniatura y video de presentación
  │
  ├─→ [Modal Paso 3] Configura precios
  │   • Define si es gratis o de pago
  │   • Establece precio
  │   • Habilita certificados, reembolsos
  │   • Rellena datos SEO
  │
  ├─→ [Modal Paso 4] Revisa información
  │   • Ve vista previa del curso
  │   • Confirma todos los datos
  │
  ├─→ Elige: "Guardar Borrador" o "Publicar"
  │
  ├→ Si guarda borrador:
  │  • Curso queda en estado BORRADOR
  │  • Puede editarlo después
  │  • No aparece en catálogo
  │
  ├→ Si publica:
  │  • Curso pasa a PUBLICADO
  │  • Aparece en catálogo público
  │  • Estudiantes pueden inscribirse
  │  • Notificación: "¡Curso publicado exitosamente!"
  │
  └─→ END - Redirige a panel de cursos
```

### 5.2 Flujo: Estudiante Se Inscribe

```
START
  │
  ├─→ Estudiante navega catálogo de cursos
  │
  ├─→ Busca/filtra cursos que le interesan
  │
  ├─→ Hace clic en una tarjeta de curso
  │
  ├─→ Ve página de detalle del curso
  │   • Información completa
  │   • Profesor y calificaciones
  │   • Contenido del curso
  │   • Reseñas de otros estudiantes
  │
  ├─→ Si es gratis:
  │  │ └─→ Botón "Inscribirse"
  │  └─────→ Sistema crea Inscripción en BD
  │         └─→ Acceso inmediato al curso
  │
  ├→ Si es de pago:
  │  │ └─→ Botón "Agregar al carrito" / "Comprar ahora"
  │  │
  │  ├─→ Si "Comprar ahora":
  │  │  │ └─→ Va a proceso de pago
  │  │  │    • Selecciona método de pago
  │  │  │    • Completa transacción
  │  │  │    • Si es exitosa → Inscripción creada
  │  │  │    • Redirección a "Mis Cursos"
  │  │  │
  │
  │  └─→ Si "Agregar al carrito":
  │     └─→ Carrito se actualiza
  │        └─→ Puede seguir comprando u ir a checkout
  │
  ├─→ Notificación: "¡Te has inscrito al curso!"
  │
  └─→ END - Acceso a "Mis Cursos" y lecciones
```

### 5.3 Flujo: Estudiante Deja Reseña

```
START
  │
  ├─→ Estudiante ingresado a un curso
  │
  ├─→ Va a página de detalle del curso
  │
  ├─→ Hace clic en "[Escribir reseña]"
  │
  ├─→ Modal de reseña aparece:
  │   ┌─────────────────────────────────┐
  │   │ Tu opinión nos importa           │
  │   │                                 │
  │   │ Calificación: ⭐⭐⭐⭐⭐ (5)  │
  │   │ [Por favor, sé constructivo]    │
  │   │                                 │
  │   │ Comentario:                     │
  │   │ [Cuéntanos tu experiencia...]  │
  │   │                                 │
  │   │ [Cancelar] [Enviar Reseña]     │
  │   └─────────────────────────────────┘
  │
  ├─→ Sistema valida:
  │   ✓ Mínimo 5 caracteres
  │   ✓ Máximo 1000 caracteres
  │   ✓ Calificación 1-5
  │
  ├─→ Si es válido:
  │   └─→ Se guarda en BD
  │      └─→ Notificación: "Reseña enviada"
  │         └─→ Aparece en listado con su comentario
  │
  └─→ END
```

---

## 6. Especificaciones Técnicas

### 6.1 Validaciones en Frontend

```typescript
// validaciones personalizadas para cursos

export const validacionesCurso = {
  titulo: {
    minLength: 5,
    maxLength: 100,
    patron: /^[a-zA-Z0-9\s\-áéíóúñ]+$/, // Solo letras, números, guiones
    mensajeError: 'Título inválido. Solo letras, números y guiones.'
  },

  descripcion: {
    minLength: 20,
    maxLength: 5000,
    mensajeError: 'La descripción debe tener entre 20 y 5000 caracteres.'
  },

  precio: {
    minValor: 0.01,
    maxValor: 99999.99,
    mensajeError: 'Ingresa un precio válido (0.01 - 99999.99)'
  },

  miniatura: {
    tiposPermitidos: ['image/jpeg', 'image/png', 'image/webp'],
    tamañoMaximo: 5 * 1024 * 1024, // 5MB
    mensajeError: 'Imagen debe ser JPEG, PNG o WebP (máx 5MB)'
  },

  videoUrl: {
    patrones: [
      /^https?:\/\/(www\.)?youtube\.com\//,
      /^https?:\/\/(www\.)?vimeo\.com\//
    ],
    mensajeError: 'URL de video debe ser de YouTube o Vimeo'
  },

  objetivos: {
    minimo: 1,
    maximo: 10,
    minCaracteres: 10,
    maxCaracteres: 200
  },

  requisitos: {
    maximo: 10,
    minCaracteres: 10,
    maxCaracteres: 200
  }
}
```

### 6.2 Estados del Curso y Transiciones

```
BORRADOR
   │
   ├─→ PUBLICADO (Cambio de estado por profesor)
   │      │
   │      ├─→ ARCHIVADO (Curso terminado/retirado)
   │      │
   │      └─→ BORRADOR (Volver a borrador para editar)
   │
   └─→ Eliminado (Solo ADMIN, si está en BORRADOR)

Reglas:
- Un curso BORRADOR NO aparece en catálogo
- Un curso PUBLICADO aparece en catálogo
- Un curso ARCHIVADO aparece pero marcado como "No aceptando nuevas inscripciones"
- Solo después de crear módulos y lecciones se puede publicar
- No se puede eliminar un curso con estudiantes inscritos
```

### 6.3 Permisos y Roles

```typescript
const permisosCursos = {
  ESTUDIANTE: {
    listar: true,           // Listar cursos públicos
    ver_detalles: true,     // Ver detalles de curso
    inscribirse: true,      // Inscribirse a curso
    dejar_resena: true,     // Dejar reseña
    ver_mi_progreso: true   // Ver su progreso
  },
  
  PROFESOR: {
    listar: true,
    ver_detalles: true,
    crear: true,            // Crear cursos
    editar_propios: true,   // Solo sus propios cursos
    eliminar_propios: true,
    cambiar_estado: true,   // Publicar/archivar
    ver_inscritos: true,
    ver_estadisticas: true,
    insertar_contenido: true
  },
  
  ADMIN: {
    ...PROFESOR,
    editar_todos: true,     // Todos los cursos
    eliminar_todos: true,
    cambiar_estado_todos: true,
    ver_estadsticas_globales: true,
    desactivar_cursos: true
  }
}
```

### 6.4 Índices de Base de Datos (Optimización)

```prisma
// Índices para búsqueda rápida
model Curso {
  @@index([profesor_id])    // Búsqueda cursos por profesor
  @@index([categoria_id])   // Búsqueda cursos por categoría
  @@index([estado])         // Filtrado por estado
  @@index([creado_en])      // Ordenamiento por fecha
  @@fulltext([titulo, descripcion])  // Búsqueda de texto completo
}
```

### 6.5 Caché con React Query

```typescript
// Estrategia de caché inteligente

const queryKeys = {
  // Búsqueda en catálogo
  all: ['cursos'],
  catalogo: ['cursos', 'catalogo'],
  catalogoFiltered: (filters) => ['cursos', 'catalogo', filters],
  
  // Panel de profesor
  misCursos: ['cursos', 'mios'],
  cursoDetails: (id) => ['cursos', id],
  
  // Estadísticas
  estadisticas: (cursoId) => ['cursos', cursoId, 'estadisticas'],
  inscritos: (cursoId) => ['cursos', cursoId, 'inscritos'],
  comentarios: (cursoId) => ['cursos', cursoId, 'comentarios']
}

// Configuración de tiempo de caché
const cacheConfig = {
  staleTime: 5 * 60 * 1000,      // 5 minutos
  cacheTime: 10 * 60 * 1000,     // 10 minutos
  refetchOnWindowFocus: false
}
```

---

## 📊 Resumen de Componentes Necesarios

| Componente | Ubicación | Responsabilidad |
|---------|-----------|-----------------|
| `CreateCursoModal` | `admin/cursos/components` | Modal form multi-paso para crear curso |
| `EditCursoModal` | `admin/cursos/components` | Modal para editar curso existente |
| `CursoTable` | `admin/cursos/components` | Tabla con lista de cursos del profesor |
| `CursoFilters` | `admin/cursos/components` | Filtros (estado, categoría, etc) |
| `CursoCatalogCard` | `public/components` | Card de curso en catálogo |
| `CatalogoFilters` | `public/components` | Filtros avanzados del catálogo |
| `DetalleCursoPage` | `public/pages` | Página completa de detalles |
| `ComentariosSection` | `public/components` | Sección de comentarios/reseñas |
| `MisCursosPage` | `public/pages` | Página "Mis Cursos" para estudiantes |

---

## 🎯 Próximos Pasos Recomendados

1. ✅ **Revisar y aprobar** esta arquitectura
2. 🔧 **Crear migrations** de Prisma para nuevos modelos
3. 📁 **Crear estructura** de carpetas en frontend
4. 🛠️ **Implementar API routes** (endpoints)
5. 🎨 **Desarrollar componentes** de UI/UX
6. 🔌 **Conectar con React Query** y hooks
7. ✨ **Testing** y refinamiento
8. 🚀 **Deployment** y monitoreo

---

**Documento creado:** 19/02/2026  
**Especialista UX/UI:** Claude  
**Patrón arquitectónico:** Clean Architecture + MVC
