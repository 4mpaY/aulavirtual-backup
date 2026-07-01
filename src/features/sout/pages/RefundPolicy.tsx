import Link from 'next/link'

import Header from '@sout/components/layout/Header'
import Footer from '@sout/components/layout/Footer'
import { SOUT_COMPANY } from '@sout/lib/company'

const RefundPolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Política de Cambios y Devoluciones
            </h1>
            <p className="text-lg text-gray-600">
              Condiciones de reembolso para cursos y servicios digitales de {SOUT_COMPANY.tradeName}
            </p>
            <p className="text-sm text-gray-500 mt-2">Última actualización: Junio 2026</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <p className="text-gray-700 leading-relaxed">
                La presente política regula las condiciones de reembolso y cambios aplicables a los
                servicios educativos ofrecidos por <strong>{SOUT_COMPANY.legalName}</strong>, con nombre comercial{' '}
                <strong>{SOUT_COMPANY.tradeName}</strong>, con RUC <strong>{SOUT_COMPANY.ruc}</strong>, con domicilio
                en {SOUT_COMPANY.address}, a través de su plataforma de Aula Virtual. Al adquirir cualquier curso,
                el usuario declara haber leído y aceptado los términos aquí descritos.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">1. Naturaleza del Servicio</h2>
              <p className="text-gray-700 leading-relaxed">
                Los cursos y materiales ofrecidos en nuestra plataforma constituyen{' '}
                <strong>contenido digital de ejecución inmediata</strong>. Esto implica que el servicio educativo se
                activa y se considera prestado desde el momento en que el usuario realiza su primer acceso a la
                plataforma, visualiza la primera lección o descarga cualquier material complementario del curso
                adquirido.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                2. Excepción por Contenido Digital — Cláusula de Ejecución Inmediata
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                De conformidad con el <strong>Código de Protección y Defensa del Consumidor (Ley N° 29571)</strong> y
                las disposiciones de <strong>INDECOPI</strong> sobre contratos a distancia y servicios de ejecución
                inmediata:
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                El usuario reconoce expresamente que, al realizar el primer inicio de sesión, visualizar la primera
                lección o descargar cualquier material del curso, otorga su{' '}
                <strong>consentimiento expreso para el inicio inmediato de la prestación del servicio</strong>,
                renunciando con ello a su derecho de arrepentimiento o solicitud de reembolso, dado que el servicio
                se considera consumido desde el inicio de su ejecución.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Esta condición es aplicable a todos los cursos, rutas de aprendizaje, paquetes y materiales digitales
                disponibles en la plataforma.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">3. Condiciones para Solicitar Reembolso</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                El usuario podrá solicitar el reembolso total de su compra únicamente bajo las siguientes condiciones:
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>a) Antes del primer acceso:</strong> Que el usuario no haya ingresado a la plataforma ni
                visualizado contenido alguno tras la compra. El plazo máximo para esta solicitud es de{' '}
                <strong>7 días calendario</strong> desde la fecha de pago confirmado.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>b) Falla técnica insubsanable:</strong> Si existe un error técnico atribuible a nuestra
                plataforma que impida el acceso al contenido, y que el equipo de soporte no pueda resolver en un plazo
                de <strong>72 horas hábiles</strong> desde la notificación formal del incidente.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">4. Cursos Presenciales e In-House</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para capacitaciones presenciales, virtuales en vivo o in-house contratadas directamente con nuestro
                equipo comercial, aplican las siguientes condiciones de cancelación:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Cancelaciones con más de 7 días de anticipación: reembolso del 100%</li>
                <li>Cancelaciones entre 3 y 7 días: reembolso del 50% o reprogramación sin costo</li>
                <li>Cancelaciones con menos de 3 días: no hay reembolso, pero se puede reprogramar según disponibilidad</li>
                <li>
                  {SOUT_COMPANY.tradeName} se reserva el derecho de cancelar o reprogramar cursos por causas de fuerza
                  mayor, con reembolso total o reprogramación sin costo adicional
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">5. Proceso de Solicitud de Reembolso</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para iniciar un proceso de devolución (si aplica), el usuario debe:
              </p>
              <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  Enviar un correo a{' '}
                  <a href={`mailto:${SOUT_COMPANY.emails.administracion}`} className="text-red-600 hover:underline">
                    {SOUT_COMPANY.emails.administracion}
                  </a>{' '}
                  con el asunto: <em>&quot;Solicitud de Reembolso — [Nombre del Curso]&quot;</em>
                </li>
                <li>Adjuntar el comprobante de pago y número de pedido correspondiente</li>
                <li>
                  Nuestro equipo auditará los registros de acceso (logs de IP y actividad) para verificar que el
                  contenido no haya sido consumido antes de proceder con la evaluación de la solicitud
                </li>
              </ol>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">6. Modalidad de Reembolso</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si la solicitud es aprobada, el reembolso se gestionará a través de la misma pasarela de pago utilizada
                en la compra (<strong>IziPay</strong>, <strong>PayPal</strong> o <strong>Culqi</strong>). El tiempo de
                acreditación en la cuenta del cliente dependerá de su entidad bancaria, generalmente entre{' '}
                <strong>15 y 30 días hábiles</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                {SOUT_COMPANY.legalName} se reserva el derecho de descontar las comisiones operativas cobradas por la
                pasarela de pago que no sean reembolsables por la misma.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">7. Contacto y Libro de Reclamaciones</h2>
              <p className="text-gray-700 leading-relaxed">
                Para consultas relacionadas con esta política, comuníquese con nosotros a través de{' '}
                <a href={`mailto:${SOUT_COMPANY.emails.capacitaciones}`} className="text-red-600 hover:underline">
                  {SOUT_COMPANY.emails.capacitaciones}
                </a>
                . De acuerdo con la legislación de protección al consumidor vigente, también ponemos a su disposición
                nuestro{' '}
                <Link href="/libro-de-reclamaciones" className="text-red-600 hover:underline">
                  Libro de Reclamaciones
                </Link>{' '}
                en la plataforma.
              </p>
            </section>

            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                © 2026 {SOUT_COMPANY.tradeName}. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RefundPolicy
