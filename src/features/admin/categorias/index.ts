// Components
export { CategoriasPage } from './pages/CategoriasPage'
export { CategoriasActions } from './components/CategoriasActions'

// Hooks (React Query) — named exports instead of export *
export { useCategorias } from './hooks/useCategorias'

// Entities — named exports instead of export *
export type { Categoria, CategoriaHijo } from './entity/Categoria'

// HTTP Client (usado en server y client)
export { AxiosCategoria } from './http/axiosCategoria'
