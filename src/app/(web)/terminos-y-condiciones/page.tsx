import { getConfigs } from '@/utils/libs/config'
import LegalPageContent from '@/features/web/legal/components/LegalPageContent'
import type { LegalSeccion } from '@/features/web/legal/components/LegalPageContent'

export const metadata = {
  title: 'Términos y Condiciones',
}

const DEFAULT_SECCIONES: LegalSeccion[] = [
  { titulo: '1. Generalidades de los Servicios', contenido: 'Brindamos servicios de capacitación, consultoría en sistemas de gestión (ISO), capacitaciones y entrenamiento, eventos, activaciones BTL y campañas en SST y respuesta ante emergencias, y actividades de trabajos de alto riesgo.\n\nNuestra Aula Virtual contiene cursos y certificaciones dirigidos a profesionales de las diferentes especialidades y sectores económicos. Al adquirir un curso, está comprando una licencia de acceso individual e intransferible.' },
  { titulo: '2. Pagos, Precios e Impuestos', contenido: 'Todos los pagos procesados en nuestro sitio web se gestionan a través de pasarelas de pago seguras. Los precios expuestos pueden estar sujetos a cambios; no obstante, una vez procesada una orden y validado el pago, el precio se mantendrá respetado.' },
  { titulo: '3. Políticas de Devolución', contenido: 'Debido a la naturaleza de los bienes digitales, las devoluciones o reembolsos no están permitidos una vez que el usuario ingresa al Aula Virtual o se comprueba la descarga del material.' },
  { titulo: '4. Propiedad Intelectual e Industrial', contenido: 'Todo el material expuesto en la plataforma web pertenece originariamente a NOMBRE DE TU EMPRESA o a sus instructores afiliados. Queda estrictamente prohibida su copia o distribución sin autorización.' },
  { titulo: '5. Certificaciones', contenido: 'La emisión de certificados se somete a los requisitos técnicos indicados en cada curso. Nos reservamos el derecho de verificar la identidad de los estudiantes y de no emitir certificaciones si constatamos fraude.' },
  { titulo: '6. Privacidad y Datos Personales', contenido: 'Nos comprometemos a mantener la confidencialidad de la información proporcionada por los usuarios en el momento del registro.' },
  { titulo: '7. Contacto y Libro de Reclamaciones', contenido: 'Para consultas de soporte, escríbanos. De acuerdo a la legislación vigente, mantenemos un Libro de Reclamaciones a disposición pública.' },
]

export default async function TerminosYCondicionesPage() {
  const configs = await getConfigs()

  let secciones: LegalSeccion[] = DEFAULT_SECCIONES

  try {
    const parsed = configs.LEGAL_TERMINOS_SECCIONES ? JSON.parse(configs.LEGAL_TERMINOS_SECCIONES) : null

    if (Array.isArray(parsed) && parsed.length > 0) secciones = parsed
  } catch { /* usa el default */ }

  return (
    <LegalPageContent
      titulo={configs.LEGAL_TERMINOS_TITULO || 'Términos y Condiciones'}
      subtitulo={configs.LEGAL_TERMINOS_SUBTITULO || 'Última actualización: Noviembre de 2024'}
      intro={configs.LEGAL_TERMINOS_INTRO || 'Bienvenido a nuestra plataforma. Al acceder a nuestro sitio web y utilizar nuestros servicios, usted acepta estar sujeto a los presentes Términos y Condiciones.'}
      secciones={secciones}
    />
  )
}
