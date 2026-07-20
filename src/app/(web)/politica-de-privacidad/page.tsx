import { getConfigs } from '@/utils/libs/config'
import LegalPageContent from '@/features/web/legal/components/LegalPageContent'
import type { LegalSeccion } from '@/features/web/legal/components/LegalPageContent'

export const metadata = {
  title: 'Política de Privacidad',
}

const DEFAULT_SECCIONES: LegalSeccion[] = [
  { titulo: '1. Información que Recopilamos', contenido: 'Recopilamos datos proporcionados directamente por el usuario al registrarse, inscribirse a un curso o realizar una compra.' },
  { titulo: '2. Finalidad del Tratamiento de Datos', contenido: 'Los datos personales se utilizan para gestionar la inscripción y acceso a los cursos, procesar pagos, emitir certificados y brindar soporte académico.' },
  { titulo: '3. Confidencialidad y Terceros', contenido: 'No vendemos ni cedemos la información personal de nuestros usuarios a terceros con fines comerciales.' },
  { titulo: '4. Derechos del Usuario (ARCO)', contenido: 'El usuario puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición sobre sus datos personales enviando una solicitud a nuestro correo de contacto.' },
  { titulo: '5. Seguridad de la Información', contenido: 'Implementamos medidas técnicas y organizativas razonables para proteger los datos personales contra accesos no autorizados.' },
  { titulo: '6. Cambios a esta Política', contenido: 'Nos reservamos el derecho de actualizar esta Política de Privacidad. Cualquier modificación relevante será comunicada a través de la plataforma.' },
  { titulo: '7. Contacto', contenido: 'Para consultas sobre el tratamiento de sus datos personales, también ponemos a su disposición nuestro Libro de Reclamaciones en la plataforma.' },
]

export default async function PoliticaDePrivacidadPage() {
  const configs = await getConfigs()

  let secciones: LegalSeccion[] = DEFAULT_SECCIONES

  try {
    const parsed = configs.LEGAL_PRIVACIDAD_SECCIONES ? JSON.parse(configs.LEGAL_PRIVACIDAD_SECCIONES) : null

    if (Array.isArray(parsed) && parsed.length > 0) secciones = parsed
  } catch { /* usa el default */ }

  return (
    <LegalPageContent
      titulo={configs.LEGAL_PRIVACIDAD_TITULO || 'Política de Privacidad'}
      subtitulo={configs.LEGAL_PRIVACIDAD_SUBTITULO || ''}
      intro={configs.LEGAL_PRIVACIDAD_INTRO || 'Valoramos la confianza que nuestros usuarios depositan al compartir su información personal. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos sus datos.'}
      secciones={secciones}
    />
  )
}
