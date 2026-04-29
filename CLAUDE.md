# Aula Virtual — Documentación del Proyecto

## Descripción

Plataforma de e-learning (LMS) que permite a instituciones educativas gestionar cursos, estudiantes, profesores, pagos y certificados. Soporta contenido asíncrono y síncrono (clases en vivo), examenes, rutas de aprendizaje y emisión de certificados verificables por QR.

El sistema tiene tres roles principales: **Admin**, **Profesor** y **Estudiante**, cada uno con su propio panel.

---

## Stack Tecnológico

### Framework y Runtime
- **Next.js 14** (App Router) — framework principal con SSR/SSG
- **React 18** — biblioteca de UI
- **TypeScript 5** — tipado estático
- **Node.js** — runtime del servidor

### Base de Datos
- **PostgreSQL** — base de datos relacional
- **Prisma 6** — ORM con migraciones y generación de tipos

### Autenticación
- **NextAuth v4** — sesiones con JWT, soporte para credenciales y Google OAuth
- **bcryptjs** — hash de contraseñas
- **jsonwebtoken** — tokens adicionales (reset de contraseña, etc.)

### UI / Estilos
- **MUI (Material UI) v5** — componentes principales
- **Tailwind CSS 3** — utilidades de estilo
- **Emotion** — CSS-in-JS (requerido por MUI)
- **Framer Motion** — animaciones
- **Lucide React + Iconify** — iconografía
- **Notistack / React Toastify / SweetAlert2** — notificaciones y alertas

### Formularios y Validación
- **React Hook Form v7** — manejo de formularios
- **Zod + zod-formik-adapter** — validación de esquemas
- **Yup** — validación alternativa (usado con Formik en partes legacy)

### Estado y Datos del Servidor
- **TanStack Query v5 (React Query)** — fetching, caché y sincronización de datos del servidor
- **Zustand** — estado global del cliente (carrito, UI)
- **Axios** — cliente HTTP para llamadas a la API

### Tablas
- **TanStack Table v8** — tablas con filtros, ordenamiento y paginación

### Pagos
- **IziPay** — pasarela principal (Perú)
- **PayPal** — pasarela internacional
- **Culqi** — pasarela alternativa (Perú)

### Utilidades
- **jsPDF** — generación de certificados en PDF
- **QRCode** — generación de códigos QR para verificación de certificados
- **Nodemailer** — envío de correos (reset de contraseña, notificaciones)
- **dnd-kit** — drag & drop (reordenamiento de módulos/lecciones)
- **Sharp** — procesamiento de imágenes

### Herramientas de Desarrollo
- **pnpm** — gestor de paquetes
- **ESLint + Prettier** — linting y formato
- **Stylelint** — linting de estilos
- **dotenv-cli** — manejo de variables de entorno por entorno

---

## Estructura del Proyecto

```
aula-virtual/
├── prisma/
│   ├── schema.prisma          # Modelos de la BD y enums
│   ├── migrations/            # Historial de migraciones
│   └── seed/                  # Scripts de seed
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (blank-layout-pages)/   # Login, registro, recuperar contraseña
│   │   ├── (dashboard)/            # Panel admin, profesor, estudiante
│   │   │   ├── admin/              # Rutas del panel administrador
│   │   │   ├── profesor/           # Rutas del panel profesor
│   │   │   └── estudiante/         # Rutas del panel estudiante
│   │   ├── (web)/                  # Sitio público (catálogo, checkout, etc.)
│   │   └── api/                    # API Routes de Next.js
│   │       ├── admin/              # Endpoints exclusivos del admin
│   │       ├── auth/               # NextAuth handlers
│   │       ├── checkout/           # Proceso de compra
│   │       ├── cursos/             # CRUD de cursos
│   │       ├── cupones/            # Gestión de cupones
│   │       ├── izipay/ paypal/ culqi/  # Webhooks de pasarelas de pago
│   │       └── ...
│   │
│   ├── features/              # Lógica de negocio por dominio
│   │   ├── admin/             # Módulos del admin
│   │   │   ├── categorias/
│   │   │   ├── cupones/
│   │   │   ├── cursos/
│   │   │   ├── pedidos/
│   │   │   ├── usuarios/
│   │   │   └── ...
│   │   ├── estudiante/        # Módulos del estudiante
│   │   │   ├── mis-cursos/
│   │   │   ├── mis-pedidos/
│   │   │   └── player/        # Reproductor de lecciones
│   │   ├── profesor/          # Módulos del profesor
│   │   ├── web/               # Módulos del sitio público
│   │   │   ├── home/
│   │   │   ├── cursos/        # Catálogo y detalle de curso
│   │   │   ├── checkout/
│   │   │   ├── cart/
│   │   │   └── rutas/
│   │   ├── perfil/            # Perfil de usuario
│   │   └── shared/            # Componentes y funciones compartidas
│   │
│   ├── @core/                 # Sistema de diseño base (componentes MUI personalizados)
│   ├── @layouts/              # Layouts del dashboard (vertical/horizontal)
│   ├── @menu/                 # Sistema de menú de navegación
│   │
│   ├── components/            # Componentes globales reutilizables
│   ├── contexts/              # Contextos de React globales
│   ├── schemas/               # Esquemas de validación Zod/Yup globales
│   ├── utils/
│   │   ├── configs/           # Configuraciones (NextAuth, tema, etc.)
│   │   ├── functions/         # Helpers y utilidades
│   │   ├── libs/              # Instancias de librerías (axios, prisma)
│   │   ├── navigation/        # Definición de menús de navegación
│   │   └── types/             # Tipos TypeScript globales
│   └── data/                  # Datos estáticos
```

### Patrón de cada módulo en `features/`

Cada módulo de dominio sigue esta estructura interna:

```
features/<rol>/<modulo>/
├── components/     # Componentes React del módulo
├── entity/         # Interfaces/tipos TypeScript del dominio
├── hooks/          # Custom hooks (React Query: useQuery, useMutation)
├── http/           # Funciones axios que llaman a la API
└── pages/          # Componente de página principal del módulo
```

---

## Modelos de Datos Principales

| Modelo | Descripción |
|---|---|
| `Usuario` | Usuarios del sistema con roles: ADMIN, PROFESOR, ESTUDIANTE |
| `Curso` | Cursos con precio, nivel, estado (BORRADOR, PUBLICADO, ARCHIVADO) |
| `Modulo` / `Leccion` | Estructura jerárquica del contenido del curso |
| `ContenidoLeccion` | Archivos/videos/enlaces asociados a una lección |
| `Inscripcion` | Relación estudiante–curso, creada al completar un pedido |
| `Pedido` / `DetallePedido` | Órdenes de compra con soporte multi-curso y cupones |
| `Cupon` / `CuponCurso` | Cupones de descuento (porcentaje o monto fijo) aplicables por curso |
| `Examen` / `Pregunta` / `IntentoExamen` | Sistema de evaluaciones |
| `Certificado` | Certificados con código de verificación único |
| `RutaAprendizaje` | Agrupación de cursos en rutas secuenciales |
| `Notificacion` | Notificaciones por usuario |
| `Tenant` | Configuración de marca (multi-tenant básico) |
| `Reclamacion` | Libro de reclamaciones |

---

## Scripts Útiles

```bash
pnpm dev                    # Servidor de desarrollo
pnpm build                  # Build de producción
pnpm db:migration:dev       # Crear y aplicar migración en desarrollo
pnpm db:client:generate     # Regenerar cliente Prisma
pnpm db:main:seed           # Ejecutar seed principal
```

---

## Variables de Entorno Requeridas

```env
DATABASE_URL=               # Conexión a PostgreSQL
NEXTAUTH_SECRET=            # Secret para NextAuth
NEXTAUTH_URL=               # URL base de la app
GOOGLE_CLIENT_ID=           # OAuth Google
GOOGLE_CLIENT_SECRET=
# Pasarelas de pago:
IZIPAY_*
PAYPAL_*
CULQI_*
# Correo:
SMTP_*
```

PARA el uso de modales usa el <AppModal open={open} handleClose={handleClose}>, no uses tus propios componentes de modales, ya existe uno global para toda la aplicación
import AppModal from '@/utils/components/AppModal'
