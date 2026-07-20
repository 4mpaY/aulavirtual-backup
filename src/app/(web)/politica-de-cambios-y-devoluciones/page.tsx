import { getConfigs } from '@/utils/libs/config'
import LegalPageContent from '@/features/web/legal/components/LegalPageContent'
import type { LegalSeccion } from '@/features/web/legal/components/LegalPageContent'

export const metadata = {
  title: 'Política de Cambios y Devoluciones',
}

const DEFAULT_SECCIONES: LegalSeccion[] = [
  { titulo: '1. Naturaleza del Servicio', contenido: 'Los cursos y materiales ofrecidos en nuestra plataforma constituyen contenido digital de ejecución inmediata, activado desde el primer acceso del usuario.' },
  { titulo: '2. Excepción por Contenido Digital', contenido: 'De conformidad con la normativa de protección al consumidor, el usuario reconoce que al iniciar el consumo del curso otorga su consentimiento para el inicio inmediato de la prestación del servicio.' },
  { titulo: '3. Condiciones para Solicitar Reembolso', contenido: 'El usuario podrá solicitar el reembolso total únicamente antes de su primer acceso a la plataforma, dentro de un plazo máximo de 7 días calendario desde la fecha de pago.' },
  { titulo: '4. Proceso de Solicitud de Reembolso', contenido: 'Para iniciar un proceso de devolución, el usuario debe enviar un correo indicando el motivo, adjuntando el comprobante de pago y número de pedido.' },
  { titulo: '5. Modalidad de Reembolso', contenido: 'Si la solicitud es aprobada, el reembolso se gestionará a través de la pasarela de pago correspondiente, en un plazo de 15 a 30 días hábiles.' },
  { titulo: '6. Contacto y Atención al Cliente', contenido: 'Para consultas relacionadas con esta política, también ponemos a su disposición nuestro Libro de Reclamaciones en la plataforma.' },
]

export default async function PoliticaCambiosYDevolucionesPage() {
  const configs = await getConfigs()

  let secciones: LegalSeccion[] = DEFAULT_SECCIONES

  try {
    const parsed = configs.LEGAL_DEVOLUCIONES_SECCIONES ? JSON.parse(configs.LEGAL_DEVOLUCIONES_SECCIONES) : null

    if (Array.isArray(parsed) && parsed.length > 0) secciones = parsed
  } catch { /* usa el default */ }

  return (
    <LegalPageContent
      titulo={configs.LEGAL_DEVOLUCIONES_TITULO || 'Política de Cambios y Devoluciones'}
      subtitulo={configs.LEGAL_DEVOLUCIONES_SUBTITULO || ''}
      intro={configs.LEGAL_DEVOLUCIONES_INTRO || 'La presente política regula las condiciones de reembolso y cambios aplicables a los servicios educativos ofrecidos a través de nuestra Aula Virtual.'}
      secciones={secciones}
    />
  )
}
