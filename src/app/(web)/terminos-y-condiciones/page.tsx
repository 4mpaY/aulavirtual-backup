import React from 'react'

import { Box, Container, Typography, Divider } from '@mui/material'

export const metadata = {
  title: 'Términos y Condiciones | Abeja Smart',
}

export default function TerminosYCondicionesPage() {
  return (
    <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 }, color: '#333' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--web-dark, #025E44)' }} mb={2} textAlign="center">
          Términos y Condiciones
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
          Última actualización: Junio de 2026
        </Typography>

        <Box sx={{ '& h4': { color: 'var(--web-dark, #025E44)', fontWeight: 800, mt: 5, mb: 2 }, '& p': { mb: 2, lineHeight: 1.8 } }}>

          <Typography paragraph>
            Bienvenido a <strong>Abeja Smart</strong> (&quot;Nosotros&quot;, &quot;Abeja Smart&quot;).
            Al acceder a nuestro sitio web y utilizar nuestros servicios de capacitación y asesoría en marketing digital,
            usted (&quot;el Usuario&quot;) acepta estar sujeto a los presentes Términos y Condiciones.
            Le sugerimos leer esta página cuidadosamente antes de proceder con cualquier compra o inscripción.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4">1. Generalidades de los Servicios</Typography>
          <Typography paragraph>
            Abeja Smart brinda servicios de capacitación práctica en marketing digital (TikTok Ads, Meta Ads, Inteligencia Artificial aplicada a negocios, edición de video, cierre de ventas por WhatsApp, entre otros), asesorías personalizadas, mentoría grupal para emprendedores, gestión de campañas publicitarias y consultoría digital para emprendedores y dueños de negocios.
            Nuestra plataforma contiene cursos y capacitaciones dirigidos a emprendedores y profesionales del marketing digital.
            Al adquirir un curso, está comprando una licencia de acceso individual e intransferible.
          </Typography>

          <Typography variant="h4">2. Pagos, Precios e Impuestos</Typography>
          <Typography paragraph>
            Todos los pagos procesados en nuestro sitio web se gestionan a través de pasarelas de pago seguras (como Culqi o PayPal).
            Los precios expuestos pueden estar sujetos a cambios; no obstante, una vez procesada una orden y validado el pago,
            el precio se mantendrá respetado. En caso de aplicar cupones de descuento, estos deben validarse antes del check-out final.
          </Typography>

          <Typography variant="h4">3. Políticas de Devolución</Typography>
          <Typography paragraph>
            Debido a la naturaleza de los bienes digitales (cursos pre-grabados y contenido virtual descargable),
            <strong>las devoluciones o reembolsos no están permitidos</strong> una vez que el usuario accede a la plataforma
            o se comprueba la descarga del material. Ante cualquier incidencia inusual o fallo técnico,
            puede escribir a nuestro equipo de soporte que evaluará excepciones únicamente ante defectos probados del sistema.
          </Typography>

          <Typography variant="h4">4. Propiedad Intelectual e Industrial</Typography>
          <Typography paragraph>
            Todo el material expuesto en la plataforma web (textos, gráficos, videos, diagramas y recursos)
            pertenece originariamente a Abeja Smart o a sus instructores afiliados.
            Queda estrictamente prohibida su copia, distribución sin autorización comercial y cualquier modalidad de piratería.
            Cualquier violación directa implicará el bloqueo irrevocable de la cuenta y potenciales acciones civiles correspondientes.
          </Typography>

          <Typography variant="h4">5. Certificaciones</Typography>
          <Typography paragraph>
            La emisión de certificados dentro de nuestra plataforma se somete a los requisitos técnicos
            indicados en cada curso (visualización al 100%, aprobación de evaluaciones, etc.). Abeja Smart se reserva
            el derecho de verificar y cruzar la identidad de los estudiantes y de no emitir certificaciones si constata fraude o suplantación.
          </Typography>

          <Typography variant="h4">6. Privacidad y Datos Personales</Typography>
          <Typography paragraph>
            Nos comprometemos a mantener la confidencialidad de la información proporcionada por los usuarios en el momento
            del registro (Ley de Protección de Datos Personales o norma correspondiente en territorio Peruano).
            Los datos se utilizan estrictamente para el servicio comercial del curso y fines facturativos,
            nunca serán expendidos a bases de datos de terceros.
          </Typography>

          <Typography variant="h4">7. Contacto y Libro de Reclamaciones</Typography>
          <Typography paragraph>
            Para consultas de soporte, envíe sus requerimientos a <strong>ebeecorp@gmail.com</strong> o comuníquese al <strong>+51 918 424 922</strong>.
            De acuerdo a la legislación vigente de protección al consumidor peruano, mantenemos un{' '}
            <a href="/libro-de-reclamaciones" style={{ color: 'var(--web-dark, #025E44)', textDecoration: 'underline' }}>Libro de Reclamaciones a disposición pública</a>{' '}
            en nuestra plataforma web.
          </Typography>

        </Box>
      </Container>
    </Box>
  )
}
