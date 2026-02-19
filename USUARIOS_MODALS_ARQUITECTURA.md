# Arquitectura de Gestión de Usuarios

## 📋 Resumen

Se ha implementado un sistema completo de gestión de usuarios siguiendo la arquitectura establecida en el proyecto, utilizando:

- ✅ **Formik** para manejo de formularios
- ✅ **Zod** para validación (frontend y backend)
- ✅ **React Query (@tanstack/react-query)** para manejo de estado del servidor
- ✅ **TanStack Table** para la tabla de datos
- ✅ **AppModal** para los modales
- ✅ **Axios** como cliente HTTP
- ✅ **Notistack** para notificaciones

## 📁 Estructura de Archivos

```
src/
├── features/
│   ├── admin/
│   │   ├── modals/                          # Modales reutilizables
│   │   │   ├── CreateUsuarioModal.tsx       # Modal para crear usuario
│   │   │   ├── EditUsuarioModal.tsx         # Modal para editar usuario
│   │   │   ├── DeleteUsuarioModal.tsx       # Modal para eliminar usuario
│   │   │   └── index.ts                     # Exportaciones
│   │   └── usuarios/                        # Feature de usuarios
│   │       ├── components/
│   │       │   └── UsuariosActions.tsx      # Wrapper de modales
│   │       ├── entity/
│   │       │   └── Usuario.ts               # Tipos/interfaces de Usuario
│   │       ├── hooks/
│   │       │   └── useUsuarios.ts           # React Query hooks
│   │       ├── http/
│   │       │   └── axiosUsuario.ts          # Cliente HTTP Axios
│   │       ├── pages/
│   │       │   └── UsuariosPage.tsx         # Página principal
│   │       └── index.ts                     # Exportaciones
│   └── shared/
│       └── http/
│           └── httpClient.ts                # Cliente HTTP base
├── schemas/
│   └── usuario.schema.ts                    # Validaciones Zod
└── app/
    └── (dashboard)/
        └── admin/
            └── usuarios/
                └── page.tsx                 # Ruta Next.js
```

## 🔧 Componentes Principales

### 1. Modales (AppModal Pattern)

Los tres modales siguen el mismo patrón establecido en el proyecto:

#### **CreateUsuarioModal**
- Formulario con Formik + validación Zod
- Campos: nombre, apellido, correo, DNI, contraseña, celular, rol, biografía
- Validación en tiempo real con `toFormikValidationSchema(crearUsuarioSchema)`
- Notificaciones con notistack
- Callback `onSuccess` para refrescar datos

#### **EditUsuarioModal**
- Carga datos del usuario desde API
- Formulario con Formik + validación Zod
- No incluye campo contraseña (es opcional en actualización)
- Estado de carga mientras obtiene datos
- Callback `onSuccess` para refrescar datos

#### **DeleteUsuarioModal**
- Confirmación con checkbox obligatorio
- Muestra información del usuario a eliminar
- Advertencia visual con WarningBox
- Botón deshabilitado hasta confirmar
- Callback `onSuccess` para refrescar datos

### 2. HTTP Client (Axios Pattern)

**AxiosUsuario** extiende `AxiosInternalHttpClient` y proporciona:

```typescript
class AxiosUsuario {
  searchAll(): Promise<Usuario[]>
  getById(id: string): Promise<Usuario>
  create(usuario: CrearUsuarioDto): Promise<{ id: string }>
  update(id: string, usuario: ActualizarUsuarioDto): Promise<Usuario>
  delete(id: string): Promise<{ message: string }>
  toggleStatus(id: string, esta_activo: boolean): Promise<Usuario>
}
```

- Interceptor automático de autenticación (Bearer token)
- Manejo de errores centralizado
- Base URL: `/api/usuarios`

### 3. React Query Hooks

**useUsuarios.ts** proporciona 6 hooks:

```typescript
// Queries
useUsuarios(initialData?: Usuario[])        // Listar todos
useUsuario(id: string)                      // Obtener uno

// Mutations
useCreateUsuario()                          // Crear
useEditUsuario()                            // Editar
useDeleteUsuario()                          // Eliminar
useToggleUsuarioStatus()                    // Activar/desactivar
```

Características:
- Cache automático con `staleTime: 60_000` (60 segundos)
- Invalidación de queries al mutar datos
- Ordenamiento por fecha de creación (más recientes primero)
- Autenticación mediante `getSession()` de NextAuth

### 4. Página Principal (UsuariosPage)

**TanStack Table** con las siguientes características:

- **Columnas**:
  - Número (#)
  - Usuario (avatar + nombre completo + correo)
  - DNI
  - Celular
  - Rol (Chip con colores: Admin=rojo, Profesor=amarillo, Estudiante=azul)
  - Estado (Chip: Activo=verde, Inactivo=gris)
  - Acciones (editar, eliminar)

- **Filtros**:
  - Por rol (Todos, Admin, Profesor, Estudiante)
  - Búsqueda global con debounce (nombre, correo, DNI, celular)

- **Paginación**:
  - Tamaños: 10, 25, 50 registros
  - Navegación de páginas

- **Ordenamiento**:
  - Por cualquier columna (clic en header)

### 5. Wrapper de Modales (UsuariosActions)

Componente que encapsula los 3 modales y maneja su estado:

```typescript
<UsuariosActions
  usuarioClicked={usuarioToEdit || usuarioToDelete}
  addUsuario={{ isOpen, closeHandler }}
  editUsuario={{ isOpen, closeHandler }}
  deleteUsuario={{ isOpen, closeHandler }}
  onSuccess={() => refetchUsuarios()}
/>
```

## 🔐 Validación con Zod

### Esquemas compartidos (frontend y backend)

**crearUsuarioSchema**:
```typescript
{
  correo: string (email válido)
  contrasena: string (min 8 chars, mayúscula, minúscula, número)
  nombre: string (2-50 chars)
  apellido: string (2-50 chars)
  numero_documento: string (8 dígitos)
  celular: string? (9 dígitos, inicia con 9)
  biografia: string? (max 500 chars)
  rol: Rol (enum: ADMIN | PROFESOR | ESTUDIANTE)
  esta_activo: boolean (default true)
}
```

**actualizarUsuarioSchema**:
- Igual que `crearUsuarioSchema` pero todos los campos son opcionales (`.partial()`)
- No incluye `contrasena` obligatoria

### Integración Formik + Zod

Usando `zod-formik-adapter`:

```typescript
import { toFormikValidationSchema } from 'zod-formik-adapter'

<Formik
  validationSchema={toFormikValidationSchema(crearUsuarioSchema)}
  // ...
/>
```

## 🎨 Estilos y UX

### AppModal
- Responsive (fullscreen en móviles)
- Backdrop con fade animation
- Botón de cerrar (X) opcional
- Max width 700px
- Padding y border radius consistentes

### Formularios
- Grid responsive (2 columnas en desktop, 1 en móvil)
- CustomTextField de MUI
- Estados: normal, error, disabled
- Helper text para errores
- Botones alineados a la derecha

### Tabla
- Estilos consistentes con `table.module.css`
- Hover effects
- Avatares con fallback a inicial
- Chips con colores semánticos
- Responsive scroll horizontal

## 🔄 Flujo de Datos

### Crear Usuario
1. Usuario hace clic en "Añadir Usuario"
2. Se abre `CreateUsuarioModal`
3. Usuario completa formulario
4. Formik valida con Zod schema
5. Submit → `useCreateUsuario` mutation
6. POST `/api/usuarios`
7. Invalidación de cache React Query
8. Modal se cierra
9. Tabla se actualiza automáticamente
10. Notificación de éxito

### Editar Usuario
1. Usuario hace clic en icono editar
2. Se abre `EditUsuarioModal`
3. Modal carga datos con `fetch(/api/usuarios/${id})`
4. Usuario modifica campos
5. Submit → `useEditUsuario` mutation (no usado actualmente, usa fetch directo)
6. PUT `/api/usuarios/${id}`
7. Invalidación de cache
8. Modal se cierra
9. Tabla se actualiza
10. Notificación de éxito

### Eliminar Usuario
1. Usuario hace clic en icono eliminar
2. Se abre `DeleteUsuarioModal`
3. Usuario lee advertencia
4. Usuario marca checkbox de confirmación
5. Submit → `useDeleteUsuario` mutation (no usado actualmente, usa fetch directo)
6. DELETE `/api/usuarios/${id}`
7. Invalidación de cache
8. Modal se cierra
9. Tabla se actualiza
10. Notificación de éxito

## 📦 Dependencias Instaladas

```json
{
  "formik": "^2.4.9",
  "zod-formik-adapter": "^2.0.0",
  "@tanstack/react-query": "ya instalado",
  "notistack": "^3.0.2",
  "@iconify/react": "^6.0.2",
  "axios": "ya instalado"
}
```

## 🚀 Próximos Pasos Sugeridos

1. **Migrar modales a usar hooks de React Query** en lugar de fetch directo
2. **Agregar búsqueda por servidor** (actualmente es client-side)
3. **Implementar paginación por servidor**
4. **Agregar modal de cambio de contraseña** para usuarios existentes
5. **Implementar toggle de estado activo/inactivo** sin necesidad de editar
6. **Agregar exportación a Excel** de la lista de usuarios
7. **Implementar roles y permisos** para limitar acciones según rol del usuario logueado

## 📝 Notas Técnicas

### ¿Por qué no se usan los hooks de React Query en los modales?

Actualmente los modales (`CreateUsuarioModal`, `EditUsuarioModal`, `DeleteUsuarioModal`) usan `fetch` directo en lugar de los hooks `useCreateUsuario`, `useEditUsuario`, `useDeleteUsuario`.

**Razón**: Simplificar la integración inicial y evitar problemas con el manejo de errores en los modales.

**Recomendación futura**: Migrar a usar los hooks para aprovechar:
- Estados de loading automáticos
- Manejo de errores centralizado
- Reintentos automáticos
- Optimistic updates

### Autenticación en HTTP Client

El `AxiosUsuario` espera un `accessToken` en la sesión de NextAuth, pero actualmente NextAuth está configurado solo con JWT (no devuelve `accessToken`).

**Solución temporal**: El interceptor maneja gracefully cuando no hay token.

**Solución definitiva**: Si la API requiere autenticación Bearer, agregar el token a la sesión de NextAuth o usar cookies HTTP-only.

## ✅ Checklist de Implementación

- [x] Crear modales (Create, Edit, Delete)
- [x] Crear HTTP client (AxiosUsuario)
- [x] Crear hooks React Query
- [x] Crear página principal con TanStack Table
- [x] Crear wrapper de modales (UsuariosActions)
- [x] Integrar con ruta Next.js
- [x] Validación Zod compartida
- [x] Documentación completa

## 🎯 Testing

Para probar la funcionalidad:

1. Ejecutar `pnpm dev`
2. Navegar a `/admin/usuarios`
3. Probar crear usuario
4. Probar editar usuario
5. Probar eliminar usuario
6. Probar filtros (por rol, búsqueda global)
7. Probar paginación
8. Probar ordenamiento

---

**Fecha de creación**: 2026-02-17
**Autor**: Claude Code
**Patrón**: Arquitectura establecida en ProductoPage
