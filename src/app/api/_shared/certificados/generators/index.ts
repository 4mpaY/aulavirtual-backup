import prisma from '@/utils/libs/prisma'

import type { GeneratorFn } from './types'
import { generarClasico } from './clasico'
import { generarClasicoResumido } from './clasico_resumido'
import { generarCorporativo } from './corporativo'
import { generarModerno } from './moderno'
import { generarElegante } from './elegante'
import { crearGeneradorPersonalizado } from './personalizado'

export const PLANTILLAS = {
  clasico: {
    id: 'clasico',
    nombre: 'Clásico',
    descripcion: 'Panel lateral con gradiente, diseño balanceado. Ideal para institutos y academias.',
    paginas: 2,
    thumbnail: '/images/plantillas-certificado/clasico.png',
  },
  clasico_resumido: {
    id: 'clasico_resumido',
    nombre: 'Clásico (Resumido)',
    descripcion: 'Versión del clásico con el temario resumido a dos columnas para ahorrar espacio.',
    paginas: 2,
    thumbnail: '/images/plantillas-certificado/clasico.png', // Reusing the same thumbnail for now, will replace
  },
  corporativo: {
    id: 'corporativo',
    nombre: 'Corporativo',
    descripcion: 'Diseño formal con borde y detalles dorados. Perfecto para empresas B2B.',
    paginas: 2,
    thumbnail: '/images/plantillas-certificado/corporativo.png',
  },
  moderno: {
    id: 'moderno',
    nombre: 'Moderno',
    descripcion: 'Fondo oscuro con acentos de color. Ideal para academias tech y startups.',
    paginas: 2,
    thumbnail: '/images/plantillas-certificado/moderno.png',
  },
  elegante: {
    id: 'elegante',
    nombre: 'Elegante',
    descripcion: 'Fondo crema con bordes ornamentales y estilo clásico universitario.',
    paginas: 2,
    thumbnail: '/images/plantillas-certificado/elegante.png',
  },
} as const

export type PlantillaId = keyof typeof PLANTILLAS

/**
 * Devuelve la función generadora correspondiente a la plantilla.
 * Si `plantilla` no es uno de los 5 ids fijos, se busca como el id de una
 * plantilla personalizada (imagen de fondo + campos posicionables). Si no
 * existe o está inactiva, cae al generador clásico como fallback seguro.
 */
export async function getGenerator(plantilla: string): Promise<GeneratorFn> {
  switch (plantilla) {
    case 'clasico':          return generarClasico
    case 'clasico_resumido': return generarClasicoResumido
    case 'corporativo':      return generarCorporativo
    case 'moderno':          return generarModerno
    case 'elegante':         return generarElegante
  }

  const plantillaPersonalizada = await prisma.plantillaCertificadoPersonalizada.findUnique({
    where: { id: plantilla }
  })

  if (plantillaPersonalizada?.activo && plantillaPersonalizada.cara_frente_url) {
    return crearGeneradorPersonalizado(plantillaPersonalizada)
  }

  return generarClasico
}

export { generarClasico, generarClasicoResumido, generarCorporativo, generarModerno, generarElegante }
