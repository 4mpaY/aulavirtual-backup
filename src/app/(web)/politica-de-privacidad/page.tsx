import React from 'react'

import { Box, Container, Typography, Divider } from '@mui/material'

export const metadata = {
  title: 'Política de Privacidad | ARM Asset Reliability Management',
}

export default function PoliticaDePrivacidadPage() {
  return (
    <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 }, color: '#333' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--web-dark, #025E44)' }} mb={2} textAlign="center">
          Política de Privacidad
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
          Última actualización: Marzo de 2026
        </Typography>

        <Box sx={{ '& h4': { color: 'var(--web-dark, #025E44)', fontWeight: 800, mt: 5, mb: 2 }, '& p': { mb: 2, lineHeight: 1.8 } }}>

          <Typography paragraph>
            En <strong>[NOMBRE DE EMPRESA]</strong> valoramos la confianza que nuestros usuarios depositan al
            compartir su información personal. Esta Política de Privacidad describe cómo recopilamos, usamos,
            almacenamos y protegemos los datos personales de quienes acceden a nuestra Aula Virtual, de acuerdo
            con la <strong>Ley N° 29733, Ley de Protección de Datos Personales</strong>, y su reglamento.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4">1. Información que Recopilamos</Typography>
          <Typography paragraph>
            Recopilamos datos proporcionados directamente por el usuario al registrarse, inscribirse a un curso
            o realizar una compra, tales como: nombres, apellidos, correo electrónico, número de teléfono,
            documento de identidad y datos de facturación. Asimismo, registramos información de uso de la
            plataforma (progreso de cursos, intentos de examen y actividad de acceso) con fines académicos.
          </Typography>

          <Typography variant="h4">2. Finalidad del Tratamiento de Datos</Typography>
          <Typography paragraph>
            Los datos personales se utilizan para: gestionar la inscripción y acceso a los cursos, procesar
            pagos a través de las pasarelas autorizadas (IziPay, PayPal, Culqi), emitir certificados de
            finalización, enviar comunicaciones sobre el estado de sus pedidos o cursos, y brindar soporte
            académico y técnico.
          </Typography>

          <Typography variant="h4">3. Confidencialidad y Terceros</Typography>
          <Typography paragraph>
            No vendemos ni cedemos la información personal de nuestros usuarios a terceros con fines
            comerciales. Solo compartimos datos estrictamente necesarios con proveedores de pago y correo
            electrónico para la correcta prestación del servicio, quienes están obligados a mantener la
            confidencialidad de dicha información.
          </Typography>

          <Typography variant="h4">4. Derechos del Usuario (ARCO)</Typography>
          <Typography paragraph>
            El usuario puede ejercer sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición</strong>{' '}
            sobre sus datos personales, enviando una solicitud a <strong>flyup.sale@gmail.com</strong>, adjuntando
            copia de su documento de identidad para validar la titularidad de la solicitud.
          </Typography>

          <Typography variant="h4">5. Seguridad de la Información</Typography>
          <Typography paragraph>
            Implementamos medidas técnicas y organizativas razonables (cifrado de contraseñas, conexiones
            seguras y controles de acceso) para proteger los datos personales contra accesos no autorizados,
            pérdida o alteración.
          </Typography>

          <Typography variant="h4">6. Cambios a esta Política</Typography>
          <Typography paragraph>
            Nos reservamos el derecho de actualizar esta Política de Privacidad para reflejar cambios legales
            o mejoras en nuestros procesos. Cualquier modificación relevante será comunicada a través de la
            plataforma.
          </Typography>

          <Typography variant="h4">7. Contacto</Typography>
          <Typography paragraph>
            Para consultas sobre el tratamiento de sus datos personales, escríbanos a{' '}
            <strong>flyup.sale@gmail.com</strong>. De acuerdo a la legislación de protección al consumidor
            vigente, también ponemos a su disposición nuestro{' '}
            <a href="/libro-de-reclamaciones" style={{ color: 'var(--web-dark, #025E44)', textDecoration: 'underline' }}>
              Libro de Reclamaciones
            </a>{' '}
            en la plataforma.
          </Typography>

        </Box>
      </Container>
    </Box>
  )
}
