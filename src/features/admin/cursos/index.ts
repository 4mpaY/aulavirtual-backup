// Components
export { CursosPage } from './pages/CursosPage'
export { CursosActions } from './components/CursosActions'
export { CourseCreatePage } from './pages/CourseCreatePage'

// Hooks (React Query) — named exports instead of export *
export {
  useCursos,
  useCurso,
  useCreateCurso,
  useEditCurso,
  useDeleteCurso,
  useCambiarEstadoCurso,
  useCreateModulo,
  useUpdateModulo,
  useDeleteModulo,
  useReorderModulos,
  useCreateLeccion,
  useUpdateLeccion,
  useDeleteLeccion,
  useReorderLecciones,
  useComentariosCurso,
  useExamenCurso,
  useSaveExamen,
  useCreatePregunta,
  useUpdatePregunta,
  useDeletePregunta
} from './hooks/useCursos'

// Entities — named exports instead of export *
export type {
  Curso,
  CursoProfesor,
  CursoCategoria,
  CursoModulo,
  CursoLeccionResumen
} from './entity/Curso'

// HTTP Client
export { AxiosCurso } from './http/axiosCurso'
