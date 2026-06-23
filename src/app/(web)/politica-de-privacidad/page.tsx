import React from 'react'

import { Box, Container, Typography, Divider } from '@mui/material'

export const metadata = {
  title: 'Política de Privacidad | CEGAE Ribeyro',
}

export default function PoliticaDePrivacidadPage() {
  return (
    <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 }, color: '#333' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--web-dark, #025E44)' }} mb={2} textAlign="center">
          Política de Privacidad
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
          Última actualización: Junio de 2026
        </Typography>

        <Box sx={{ '& h4': { color: 'var(--web-dark, #025E44)', fontWeight: 800, mt: 5, mb: 2 }, '& p': { mb: 2, lineHeight: 1.8 } }}>

          <Typography paragraph>
            <strong>CENTRO ESPECIALIZADO EN GESTION Y ASESORAMIENTO EDUCATIVO RIBEYRO S.A.C.</strong> (en adelante, &quot;CEGAE Ribeyro&quot;, &quot;Nosotros&quot;),
            identificada con RUC <strong>20608079646</strong> y domicilio en Manuel Segura 206 - Dep. 1201, Lince, Lima,
            es responsable del tratamiento de los datos personales que los usuarios proporcionan a través de
            su plataforma de Aula Virtual. La presente Política de Privacidad describe cómo recopilamos, usamos,
            almacenamos y protegemos dicha información, conforme a la Ley N° 29733 de Protección de Datos Personales
            y su Reglamento (D.S. N° 003-2013-JUS).
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4">1. Datos que Recopilamos</Typography>
          <Typography paragraph>
            Recopilamos datos personales como nombre completo, documento de identidad, correo electrónico, número de
            celular y dirección, brindados voluntariamente al registrarse, inscribirse en un curso, realizar un pago
            o completar el Libro de Reclamaciones. También podemos registrar información de navegación y uso de la
            plataforma (progreso de cursos, evaluaciones, certificados) con fines estrictamente educativos y de soporte.
          </Typography>

          <Typography variant="h4">2. Finalidad del Tratamiento</Typography>
          <Typography paragraph>
            Los datos personales recopilados son utilizados para: gestionar su inscripción y acceso a los programas
            educativos, especializaciones, capacitaciones, actualizaciones y diplomados que ofrecemos; procesar pagos
            y emitir comprobantes; emitir certificados; brindar soporte y atención al usuario; y enviar comunicaciones
            relacionadas con los servicios contratados. No se utilizan los datos para fines distintos a los aquí descritos
            sin el consentimiento expreso del usuario.
          </Typography>

          <Typography variant="h4">3. Confidencialidad y Protección de Datos</Typography>
          <Typography paragraph>
            CEGAE Ribeyro adopta medidas técnicas y organizativas razonables para proteger los datos personales contra
            pérdida, uso indebido, acceso no autorizado o alteración. El acceso a la información está restringido al
            personal autorizado que requiere dicha información para el cumplimiento de sus funciones.
          </Typography>

          <Typography variant="h4">4. Compartición de Datos con Terceros</Typography>
          <Typography paragraph>
            Sus datos personales <strong>no serán vendidos ni cedidos a bases de datos de terceros</strong> con fines
            comerciales ajenos a nuestros servicios. Únicamente compartimos información estrictamente necesaria con
            proveedores de pasarelas de pago (Culqi, PayPal) para procesar transacciones, y con proveedores de
            correo electrónico para el envío de notificaciones del servicio.
          </Typography>

          <Typography variant="h4">5. Derechos del Usuario (ARCO)</Typography>
          <Typography paragraph>
            El usuario tiene derecho a acceder, rectificar, cancelar y oponerse (derechos ARCO) al tratamiento de sus
            datos personales, así como a revocar el consentimiento otorgado. Para ejercer estos derechos, puede
            escribirnos a <strong>cegae.ribeyro@gmail.com</strong> indicando su solicitud, adjuntando copia de su
            documento de identidad.
          </Typography>

          <Typography variant="h4">6. Conservación de Datos</Typography>
          <Typography paragraph>
            Los datos personales se conservarán mientras dure la relación contractual o de servicio con el usuario,
            y posteriormente durante los plazos legales aplicables (tributarios, contables y de defensa del consumidor).
          </Typography>

          <Typography variant="h4">7. Contacto</Typography>
          <Typography paragraph>
            Para cualquier consulta relacionada con el tratamiento de sus datos personales, puede contactarnos al
            correo <strong>cegae.ribeyro@gmail.com</strong> o al celular <strong>943 570 195</strong>. De acuerdo a la
            legislación vigente de protección al consumidor peruano, también ponemos a su disposición nuestro{' '}
            <a href="/libro-de-reclamaciones" style={{ color: 'var(--web-dark, #025E44)', textDecoration: 'underline' }}>Libro de Reclamaciones</a>{' '}
            en la plataforma.
          </Typography>

        </Box>
      </Container>
    </Box>
  )
}
