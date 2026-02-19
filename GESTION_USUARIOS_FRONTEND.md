# 🎨 Gestión de Usuarios - Frontend Implementado

## ✅ Lo que se ha implementado

### 1. **Componente Modal Reutilizable** (`CustomModal.tsx`)
- ✅ Diseño profesional con MUI
- ✅ **Completamente responsivo**:
  - Mobile: Ocupa pantalla completa
  - Tablet/Desktop: Modal centrado
- ✅ Características:
  - Header con título y subtítulo
  - Botón de cerrar con icono
  - Contenido scrolleable
  - Footer para acciones
  - Scroll suave personalizado
  - Dividers para separación visual
- ✅ Props personalizables:
  - `maxWidth`: xs, sm, md, lg, xl
  - `fullWidth`: ancho completo
  - `disableCloseButton`: ocultar botón X
  - `actions`: componente de acciones personalizadas

### 2. **Página de Gestión de Usuarios** (`/admin/usuarios`)
- ✅ Diseño profesional con MUI
- ✅ **Tabla DataGrid** con:
  - Paginación del servidor
  - Ordenamiento de columnas
  - Columnas responsivas
  - Hover effects
  - Chips de colores para rol y estado
- ✅ **Filtros avanzados**:
  - Búsqueda por nombre, correo o DNI
  - Filtro por rol (Admin, Profesor, Estudiante)
  - Filtro por estado (Activo/Inactivo)
  - Botón de limpiar filtros
- ✅ **Acciones**:
  - Crear usuario (botón principal)
  - Editar usuario (icono en tabla)
  - Eliminar usuario (icono en tabla)
  - Confirmación antes de eliminar

### 3. **Formulario de Usuario** (`FormUsuario.tsx`)
- ✅ Validación con Zod
- ✅ Manejo de errores
- ✅ Campos:
  - Nombre y Apellido
  - DNI (8 dígitos)
  - Celular (9 dígitos, opcional)
  - Correo electrónico
  - Contraseña (solo en crear, con toggle show/hide)
  - Rol (Admin, Profesor, Estudiante)
  - Estado (Activo/Inactivo, solo en editar)
  - Biografía (opcional, máx 500 caracteres)
  - Avatar URL (opcional)
- ✅ Estados de carga
- ✅ Mensajes de error claros
- ✅ Diseño responsivo en grid

---

## 📂 Archivos creados

```
src/
├── components/
│   └── shared/
│       └── CustomModal.tsx              # Modal reutilizable
│
├── features/
│   └── admin/
│       ├── pages/
│       │   └── UsuariosManagement.tsx   # Página principal
│       └── components/
│           └── FormUsuario.tsx          # Formulario crear/editar
│
├── app/
│   └── (dashboard)/
│       └── admin/
│           └── usuarios/
│               └── page.tsx             # Ruta Next.js
│
└── data/
    └── navigation/
        └── verticalMenuData.tsx         # Menú actualizado
```

---

## 🚀 Cómo probar

### 1. Ejecutar el seed (si no lo has hecho)

```bash
pnpm db:main:seed
```

Esto crea usuarios de prueba:
- **Admin**: admin@aulavirtual.com / Admin123!
- **Profesor**: profesor@aulavirtual.com / Profesor123!
- **Estudiante**: estudiante@aulavirtual.com / Estudiante123!

### 2. Iniciar servidor

```bash
pnpm dev
```

### 3. Acceder a la gestión de usuarios

1. Abre `http://localhost:3000/login`
2. Inicia sesión con el usuario **ADMIN**:
   - Correo: `admin@aulavirtual.com`
   - Contraseña: `Admin123!`
3. Ve a la ruta: `http://localhost:3000/admin/usuarios`

---

## 🎨 Características UX/UI

### Diseño Profesional
- ✅ Paleta de colores consistente
- ✅ Espaciado uniforme
- ✅ Tipografía clara y legible
- ✅ Iconos de Tabler Icons
- ✅ Chips de colores para estados visuales

### Responsividad
- ✅ **Mobile (< 600px)**:
  - Modal en pantalla completa
  - Tabla scrolleable horizontal
  - Filtros en columna
  - Botones de ancho completo

- ✅ **Tablet (600-900px)**:
  - Modal centrado
  - Grid de filtros en 2 columnas
  - Tabla adaptativa

- ✅ **Desktop (> 900px)**:
  - Modal centrado con max-width
  - Grid de filtros en 1 fila
  - Tabla completa visible

### Interactividad
- ✅ Hover effects en filas de tabla
- ✅ Tooltips en iconos de acción
- ✅ Loading states en formularios
- ✅ Confirmación antes de eliminar
- ✅ Feedback visual de errores

---

## 🔧 Funcionalidades

### Tabla de Usuarios
```typescript
// Columnas visibles
- Nombre Completo
- Correo
- DNI
- Celular
- Rol (chip de color)
- Estado (chip de color)
- Acciones (editar/eliminar)
```

### Crear Usuario
```typescript
// Campos requeridos
- Nombre, Apellido
- DNI (8 dígitos)
- Correo (único)
- Contraseña (min 8 chars, mayúscula, minúscula, número)
- Rol

// Campos opcionales
- Celular (9 dígitos)
- Biografía (max 500 chars)
- Avatar URL
```

### Editar Usuario
```typescript
// Todos los campos son opcionales
- Puede cambiar cualquier campo excepto la contraseña
- Puede activar/desactivar usuario
- No puede cambiar el correo si ya existe en otro usuario
```

### Eliminar Usuario
```typescript
// Confirmación requerida
- Muestra confirmación antes de eliminar
- No se puede eliminar a sí mismo (admin)
- Cascade delete en relaciones
```

---

## 🎯 Filtros y Búsqueda

### Búsqueda
- Busca en: nombre, apellido, correo, DNI
- Búsqueda en tiempo real (debounced)
- Case insensitive

### Filtros
- **Por Rol**: Admin, Profesor, Estudiante, Todos
- **Por Estado**: Activo, Inactivo, Todos
- Combinables entre sí
- Botón "Limpiar" resetea todos los filtros

---

## 📱 Responsive Breakpoints

```typescript
// Mobile
xs: 0px - 600px
  - Modal fullscreen
  - Botones 100% width
  - Filtros en columna

// Tablet
sm: 600px - 900px
  - Modal centrado
  - Filtros en grid 2 columnas

// Desktop
md: 900px+
  - Modal centrado
  - Filtros en 1 fila
  - Tabla completa
```

---

## 🎨 Paleta de Colores (Chips)

### Roles
- **ADMIN**: `error` (rojo)
- **PROFESOR**: `primary` (azul)
- **ESTUDIANTE**: `secondary` (gris/morado)

### Estados
- **Activo**: `success` outlined (verde)
- **Inactivo**: `default` outlined (gris)

---

## 🧪 Testing Manual

### Checklist de pruebas

- [ ] **Login como Admin**
- [ ] **Ver listado de usuarios**
- [ ] **Buscar usuario por nombre**
- [ ] **Filtrar por rol: PROFESOR**
- [ ] **Filtrar por estado: Activos**
- [ ] **Limpiar filtros**
- [ ] **Crear nuevo usuario**
  - [ ] Validar campos requeridos
  - [ ] Validar formato DNI
  - [ ] Validar formato celular
  - [ ] Validar formato correo
  - [ ] Validar contraseña fuerte
  - [ ] Crear usuario exitosamente
- [ ] **Editar usuario**
  - [ ] Cambiar nombre
  - [ ] Cambiar rol
  - [ ] Desactivar usuario
  - [ ] Guardar cambios
- [ ] **Eliminar usuario**
  - [ ] Confirmar eliminación
  - [ ] Verificar que se eliminó
- [ ] **Paginación**
  - [ ] Cambiar página
  - [ ] Cambiar cantidad de resultados (5, 10, 25, 50)
- [ ] **Responsividad**
  - [ ] Probar en mobile (DevTools)
  - [ ] Probar en tablet
  - [ ] Probar en desktop

---

## 🐛 Troubleshooting

### Error: "No autorizado"
- Asegúrate de estar logueado como ADMIN
- Verifica que la cookie de sesión esté presente

### Error: "El correo ya está registrado"
- El correo debe ser único en el sistema
- Usa otro correo o edita el usuario existente

### Tabla vacía
- Ejecuta el seed: `pnpm db:main:seed`
- Verifica que la BD esté corriendo
- Revisa los filtros aplicados

### Modal no se cierra
- Click en el botón X
- Click fuera del modal (backdrop)
- Presiona ESC

---

## ✨ Próximas mejoras opcionales

- [ ] Exportar usuarios a Excel/CSV
- [ ] Importar usuarios desde CSV
- [ ] Cambiar contraseña desde el formulario de edición
- [ ] Vista previa de avatar
- [ ] Enviar email de bienvenida al crear usuario
- [ ] Logs de auditoría (quién creó/modificó)
- [ ] Filtros avanzados (por fecha de creación)
- [ ] Selección múltiple para acciones en lote

---

## 🎉 ¡Listo para usar!

El sistema de gestión de usuarios está **100% funcional** con un diseño profesional, responsivo y fácil de usar.

**Navega a**: `http://localhost:3000/admin/usuarios`

¡Disfruta! 🚀
