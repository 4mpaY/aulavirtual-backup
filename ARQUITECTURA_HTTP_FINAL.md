# Arquitectura HTTP Unificada con AxiosUsuario

## 📋 Resumen

Arquitectura simplificada usando **AxiosUsuario** como cliente HTTP único para Server Components y Client Components, eliminando la duplicación de código y aprovechando React Query para cache inteligente.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                  ARQUITECTURA UNIFICADA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────┐              ┌────────────────────┐     │
│  │ Server Component   │              │ Client Component   │     │
│  │ (page.tsx)         │              │ (modales)          │     │
│  └─────────┬──────────┘              └─────────┬──────────┘     │
│            │                                    │                │
│            │ getServerSession()                 │ getSession()   │
│            │ → token estático                   │ → dinámico     │
│            │                                    │                │
│            └────────────┬───────────────────────┘                │
│                         ↓                                        │
│            ┌──────────────────────────────┐                     │
│            │    AxiosUsuario              │                     │
│            │  (Cliente HTTP Único)        │                     │
│            │                              │                     │
│            │  - Extiende                  │                     │
│            │    AxiosInternalHttpClient   │                     │
│            │  - Interceptor Bearer token  │                     │
│            │  - Métodos CRUD              │                     │
│            └──────────────┬───────────────┘                     │
│                           │                                      │
│                           ↓                                      │
│              ┌──────────────────────┐                           │
│              │  /api/usuarios       │                           │
│              │  (Route Handlers)    │                           │
│              └──────────┬───────────┘                           │
│                         │                                        │
│                         ↓                                        │
│                ┌──────────────────┐                             │
│                │ Prisma + Postgres│                             │
│                └──────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Estructura de Archivos

```
src/
├── app/
│   └── (dashboard)/
│       └── admin/
│           └── usuarios/
│               └── page.tsx                    # Server Component - usa AxiosUsuario
├── features/
│   ├── admin/
│   │   └── usuarios/
│   │       ├── components/
│   │       │   ├── CreateUsuarioModal.tsx    # usa useCreateUsuario
│   │       │   ├── EditUsuarioModal.tsx      # usa useEditUsuario
│   │       │   ├── DeleteUsuarioModal.tsx    # usa useDeleteUsuario
│   │       │   └── UsuariosActions.tsx       # wrapper de modales
│   │       ├── entity/
│   │       │   └── Usuario.ts                # Tipos
│   │       ├── hooks/
│   │       │   └── useUsuarios.ts            # React Query hooks
│   │       ├── http/
│   │       │   └── axiosUsuario.ts           # ⭐ Cliente HTTP único
│   │       ├── pages/
│   │       │   └── UsuariosPage.tsx          # Página principal
│   │       └── index.ts                      # Exportaciones
│   └── shared/
│       └── http/
│           └── httpClient.ts                 # Base class
└── utils/
    └── configs/
        └── auth.ts                           # NextAuth config + accessToken
```

## 🔧 Implementación

### 1. Server Component (page.tsx)

**Ubicación**: `src/app/(dashboard)/admin/usuarios/page.tsx`

```typescript
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { UsuariosPage } from '@/features/admin/usuarios'
import { AxiosUsuario } from '@/features/admin/usuarios/http/axiosUsuario'
import { authOptions } from '@/utils/configs/auth'

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosUsuario = new AxiosUsuario({
    getAuthToken: () => token
  })

  let initialData = []

  try {
    initialData = await axiosUsuario.searchAll()
  } catch (error) {
    console.error('Error fetching usuarios:', error)
  }

  return <UsuariosPage initialDataUsuarios={initialData} />
}
```

**Características**:
- ✅ Obtiene sesión en el servidor
- ✅ Extrae `accessToken` de la sesión
- ✅ Instancia `AxiosUsuario` con token estático
- ✅ Fetching de datos inicial (SSR)
- ✅ Pasa `initialData` al componente de página

### 2. AxiosUsuario (Cliente HTTP)

**Ubicación**: `src/features/admin/usuarios/http/axiosUsuario.ts`

```typescript
import { AxiosInternalHttpClient } from '@/features/shared/http/httpClient'
import type { Usuario } from '../entity/Usuario'
import type { CrearUsuarioDto, ActualizarUsuarioDto } from '@/schemas/usuario.schema'
import axios from 'axios'
import type { AxiosStatic } from 'axios'

type Params = {
  axiosLib?: AxiosStatic
  baseURL?: string
  getAuthToken?: () => Promise<string | null> | string | null
}

export class AxiosUsuario extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_API_URL || ''}/api/usuarios`,
      getAuthToken: params.getAuthToken
    })
  }

  async searchAll(): Promise<Usuario[]> {
    try {
      const payload = await this.iGet<Usuario[]>()
      return payload || []
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async getById(id: string): Promise<Usuario> {
    try {
      const payload = await this.iGet<Usuario>(`/${id}`)
      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async create(usuario: CrearUsuarioDto): Promise<{ id: string }> {
    try {
      const payload = await this.iPost<{ id: string }>('', usuario)
      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async update(id: string, usuario: ActualizarUsuarioDto): Promise<Usuario> {
    try {
      const payload = await this.iPatch<Usuario>(`/${id}`, usuario)
      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const payload = await this.iDelete<{ message: string }>(`/${id}`)
      return payload
    } catch (err: any) {
      throw err?.response?.data ?? err
    }
  }
}
```

**Características**:
- ✅ Extiende `AxiosInternalHttpClient`
- ✅ Interceptor automático de Bearer token
- ✅ `baseURL` funciona en server (`||  ''`) y client
- ✅ Métodos CRUD tipados
- ✅ Manejo de errores consistente

### 3. React Query Hooks (useUsuarios.ts)

**Ubicación**: `src/features/admin/usuarios/hooks/useUsuarios.ts`

```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'
import type { Usuario } from '../entity/Usuario'
import type { CrearUsuarioDto, ActualizarUsuarioDto } from '@/schemas/usuario.schema'
import { AxiosUsuario } from '../http/axiosUsuario'

const QUERY_KEY = { USUARIOS: ['usuarios'] }

// Factory para crear instancia con autenticación dinámica
const axiosUsuarioFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()
    return s?.user?.accessToken ?? null
  }

  return new AxiosUsuario({ getAuthToken })
}

export function useUsuarios(initialData?: Usuario[]) {
  const axiosUsuario = axiosUsuarioFactory()

  return useQuery<Usuario[], any>({
    queryKey: QUERY_KEY.USUARIOS,
    queryFn: async () => await axiosUsuario.searchAll(),
    initialData,
    staleTime: 60_000,
    retry: 1,
    select: data => {
      return [...data].sort((a, b) => {
        const dateA = new Date(a.creado_en).getTime()
        const dateB = new Date(b.creado_en).getTime()
        return dateB - dateA
      })
    }
  })
}

export function useCreateUsuario() {
  const qc = useQueryClient()
  const axiosUsuario = axiosUsuarioFactory()

  return useMutation<{ id: string }, any, CrearUsuarioDto>({
    mutationFn: async (payload: CrearUsuarioDto) => await axiosUsuario.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.USUARIOS })
  })
}

export function useEditUsuario() {
  const qc = useQueryClient()
  const axiosUsuario = axiosUsuarioFactory()

  return useMutation<Usuario, any, { id: string; data: ActualizarUsuarioDto }>({
    mutationFn: async ({ id, data }) => await axiosUsuario.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.USUARIOS })
  })
}

export function useDeleteUsuario() {
  const qc = useQueryClient()
  const axiosUsuario = axiosUsuarioFactory()

  return useMutation<{ message: string }, any, string>({
    mutationFn: async (id: string) => await axiosUsuario.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.USUARIOS })
  })
}
```

**Características**:
- ✅ `axiosUsuarioFactory()` crea instancia con token dinámico
- ✅ React Query maneja cache, refetch, loading states
- ✅ Invalidación automática de queries al mutar
- ✅ Optimistic updates disponibles
- ✅ Retry automático en errores

### 4. NextAuth Config (auth.ts)

**Ubicación**: `src/utils/configs/auth.ts`

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
      token.rol = user.rol
      token.avatar = user.avatar
      token.numero_documento = user.numero_documento
      token.esta_activo = user.esta_activo
      // ⭐ Agregar accessToken
      token.accessToken = user.id
    }
    return token
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string
      session.user.rol = token.rol as string
      session.user.avatar = token.avatar as string | null
      session.user.numero_documento = token.numero_documento as string
      session.user.esta_activo = token.esta_activo as boolean
      // ⭐ Agregar accessToken a la sesión
      session.user.accessToken = token.accessToken as string
    }
    return session
  }
}
```

**Tipos extendidos**:

```typescript
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      rol: string
      avatar?: string | null
      numero_documento: string
      esta_activo: boolean
      accessToken?: string  // ⭐ Nuevo
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    rol?: string
    avatar?: string | null
    numero_documento?: string
    esta_activo?: boolean
    accessToken?: string  // ⭐ Nuevo
  }
}
```

## 🔄 Flujo de Datos

### Primera Carga (Server-Side Rendering)

```
1. Usuario navega a /admin/usuarios
   ↓
2. Next.js ejecuta Server Component (page.tsx)
   ↓
3. getServerSession(authOptions)
   ↓
4. Extrae token: session.user?.accessToken
   ↓
5. new AxiosUsuario({ getAuthToken: () => token })
   ↓
6. await axiosUsuario.searchAll()
   ↓
7. Axios interceptor agrega: Authorization: Bearer {token}
   ↓
8. GET /api/usuarios
   ↓
9. requireAdmin() verifica permisos
   ↓
10. Prisma query a PostgreSQL
   ↓
11. Response con usuarios[]
   ↓
12. <UsuariosPage initialDataUsuarios={usuarios} />
   ↓
13. HTML pre-renderizado enviado al cliente
   ↓
14. React Query hidrata cache con initialData
```

### Mutations (Client-Side)

```
1. Usuario hace clic en "Crear Usuario"
   ↓
2. Modal se abre (CreateUsuarioModal)
   ↓
3. Usuario completa formulario
   ↓
4. Submit → useCreateUsuario()
   ↓
5. mutation.mutateAsync(values)
   ↓
6. axiosUsuarioFactory() crea instancia
   ↓
7. getSession() obtiene token dinámico
   ↓
8. axiosUsuario.create(values)
   ↓
9. Interceptor agrega: Authorization: Bearer {token}
   ↓
10. POST /api/usuarios
   ↓
11. Validación Zod + requireAdmin()
   ↓
12. Prisma create
   ↓
13. Response 201
   ↓
14. onSuccess → invalidateQueries(['usuarios'])
   ↓
15. React Query refetch automático
   ↓
16. Tabla se actualiza sin reload
```

## 📊 Comparación: Antes vs Ahora

| Aspecto | Antes (Server Actions) | Ahora (AxiosUsuario) |
|---------|------------------------|----------------------|
| **Clientes HTTP** | 2 (serverFetch + Axios) | 1 (AxiosUsuario) |
| **Archivos** | ~10 archivos | ~5 archivos |
| **Líneas de código** | ~800 LOC | ~300 LOC |
| **Complejidad** | Alta | Baja |
| **Duplicación** | Alta | Ninguna |
| **Cache** | Manual | React Query automático |
| **Optimistic Updates** | Manual | React Query built-in |
| **Retry lógic** | Manual | React Query built-in |
| **Loading states** | Manual | React Query built-in |
| **Error handling** | Múltiples lugares | Centralizado |
| **Mantenimiento** | Difícil | Fácil |
| **Performance** | Bueno | Excelente |

## ✅ Ventajas de la Arquitectura

### 1. **Un Solo Cliente HTTP**
- `AxiosUsuario` usado en server y client
- Sin duplicación de lógica
- Cambios en un solo lugar

### 2. **React Query Automático**
- Cache inteligente (60s staleTime)
- Refetch en background
- Deduplica requests automáticamente
- Loading/error states incluidos

### 3. **Type Safety Completo**
- TypeScript end-to-end
- Validación Zod compartida
- Tipos inferidos automáticamente

### 4. **Mejor UX**
- Primera carga ultra-rápida (SSR)
- Actualizaciones instantáneas (React Query)
- Optimistic updates posibles
- Sin reloads de página

### 5. **Developer Experience**
- Código más simple y legible
- Menos archivos que mantener
- Patrón consistente en todo el proyecto
- Fácil de extender a otros dominios

## 🚀 Cómo Extender a Otros Dominios

Para crear gestión de **Cursos**, **Categorías**, etc.:

### 1. Copiar la estructura de usuarios

```bash
src/features/admin/
├── cursos/
│   ├── components/
│   ├── entity/
│   │   └── Curso.ts
│   ├── hooks/
│   │   └── useCursos.ts
│   ├── http/
│   │   └── axiosCurso.ts      # ⭐ Copiar de axiosUsuario.ts
│   ├── pages/
│   │   └── CursosPage.tsx
│   └── index.ts
```

### 2. Crear AxiosCurso

```typescript
// src/features/admin/cursos/http/axiosCurso.ts
export class AxiosCurso extends AxiosInternalHttpClient {
  constructor(params: Params = {}) {
    super({
      axiosLib: params.axiosLib ?? axios,
      baseURL: `${process.env.NEXT_PUBLIC_API_URL || ''}/api/cursos`,
      getAuthToken: params.getAuthToken
    })
  }

  async searchAll(): Promise<Curso[]> { /* ... */ }
  async getById(id: string): Promise<Curso> { /* ... */ }
  async create(curso: CrearCursoDto): Promise<{ id: string }> { /* ... */ }
  async update(id: string, curso: ActualizarCursoDto): Promise<Curso> { /* ... */ }
  async delete(id: string): Promise<{ message: string }> { /* ... */ }
}
```

### 3. Crear hooks con React Query

```typescript
// src/features/admin/cursos/hooks/useCursos.ts
const axioCursoFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()
    return s?.user?.accessToken ?? null
  }
  return new AxiosCurso({ getAuthToken })
}

export function useCursos(initialData?: Curso[]) { /* ... */ }
export function useCreateCurso() { /* ... */ }
export function useEditCurso() { /* ... */ }
export function useDeleteCurso() { /* ... */ }
```

### 4. Crear page.tsx

```typescript
// src/app/(dashboard)/admin/cursos/page.tsx
export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const token = session.user?.accessToken ?? null
  const axioCurso = new AxiosCurso({ getAuthToken: () => token })

  let initialData = []
  try {
    initialData = await axioCurso.searchAll()
  } catch (error) {
    console.error('Error:', error)
  }

  return <CursosPage initialData={initialData} />
}
```

## 📝 Mejores Prácticas

### 1. **Siempre usar initialData en Server Components**

```typescript
// ✅ BIEN
const usuarios = await axiosUsuario.searchAll()
return <UsuariosPage initialDataUsuarios={usuarios} />

// ❌ MAL (no aprovechar SSR)
return <UsuariosPage /> // sin initialData
```

### 2. **Usar factory pattern en hooks**

```typescript
// ✅ BIEN (token dinámico)
const axiosUsuarioFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()
    return s?.user?.accessToken ?? null
  }
  return new AxiosUsuario({ getAuthToken })
}

// ❌ MAL (token estático)
const axiosUsuario = new AxiosUsuario({
  getAuthToken: () => 'token-hardcoded'
})
```

### 3. **Invalidar queries al mutar**

```typescript
// ✅ BIEN
return useMutation({
  mutationFn: async (data) => await axiosUsuario.create(data),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] })
})

// ❌ MAL (cache desactualizado)
return useMutation({
  mutationFn: async (data) => await axiosUsuario.create(data)
  // sin onSuccess
})
```

### 4. **Manejar errores apropiadamente**

```typescript
// ✅ BIEN
try {
  initialData = await axiosUsuario.searchAll()
} catch (error) {
  console.error('Error fetching usuarios:', error)
  // initialData queda como []
}

// ❌ MAL (error no manejado)
const initialData = await axiosUsuario.searchAll() // puede crashear
```

## 🐛 Troubleshooting

### Error: "accessToken is undefined"

**Solución**: Verificar que auth.ts tenga los callbacks actualizados:

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.accessToken = user.id // ⭐ Agregar esto
    }
    return token
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.accessToken = token.accessToken // ⭐ Agregar esto
    }
    return session
  }
}
```

### Error: "baseURL is undefined"

**Solución**: Usar `|| ''` en el baseURL:

```typescript
baseURL: `${process.env.NEXT_PUBLIC_API_URL || ''}/api/usuarios`
//                                             ^^^^^ importante
```

### Error: "Cannot read properties of null (reading 'accessToken')"

**Solución**: Usar optional chaining y nullish coalescing:

```typescript
const token = session?.user?.accessToken ?? null
//            ^       ^                  ^^
```

---

**Fecha de creación**: 2026-02-18
**Autor**: Claude Code
**Arquitectura**: AxiosUsuario Unificado (Server + Client)
**Estado**: ✅ Implementado y Documentado
