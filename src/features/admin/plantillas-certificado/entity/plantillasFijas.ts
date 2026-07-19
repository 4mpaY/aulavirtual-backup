/**
 * Las 5 plantillas de certificado dibujadas por código (jsPDF), fijas en el
 * sistema. Se comparten entre el selector global (Configuración > Certificación)
 * y el selector por curso (Curso > Configuración) para no duplicar la lista.
 */
export const PLANTILLAS_CERTIFICADO_FIJAS = [
  {
    id: 'clasico',
    nombre: 'Clásico',
    descripcion: 'Panel lateral con gradiente. Ideal para institutos y academias.',
    thumbnail: '/images/plantillas-certificado/clasico.png'
  },
  {
    id: 'clasico_resumido',
    nombre: 'Clásico (Resumido)',
    descripcion: 'Temario a dos columnas sin cuadro de notas para ahorrar espacio.',
    thumbnail: '/images/plantillas-certificado/clasico_resumido.png'
  },
  {
    id: 'corporativo',
    nombre: 'Corporativo',
    descripcion: 'Diseño formal con borde y detalles dorados. Empresas B2B.',
    thumbnail: '/images/plantillas-certificado/corporativo.png'
  },
  {
    id: 'moderno',
    nombre: 'Moderno',
    descripcion: 'Fondo oscuro con acentos de color. Academias tech y startups.',
    thumbnail: '/images/plantillas-certificado/moderno.png'
  },
  {
    id: 'elegante',
    nombre: 'Elegante',
    descripcion: 'Fondo crema con bordes ornamentales. Estilo universitario.',
    thumbnail: '/images/plantillas-certificado/elegante.png'
  }
]
