import Header from "@sout/components/layout/Header";
import Footer from "@sout/components/layout/Footer";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Términos de Uso
            </h1>
            <p className="text-lg text-gray-600">
              Condiciones de uso del sitio web y servicios de SOUT Training Center
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Última actualización: Junio 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            {/* Aceptación */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Aceptación de los Términos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bienvenido a <strong>www.soutrainingcenter.com</strong>, sitio web operado por
                <strong> SOUT S.A.C.</strong> (RUC: 20605873872), con nombre comercial
                <strong> SOUT Training Center</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Al acceder y utilizar este sitio web, aceptas cumplir con estos Términos de Uso,
                nuestra Política de Privacidad y todas las leyes aplicables en el Perú. Si no estás
                de acuerdo con alguna parte de estos términos, te solicitamos que no utilices nuestro sitio web.
              </p>
              <div className="bg-red-50 border-l-4 border-red-600 p-4">
                <p className="text-gray-700">
                  <strong>Importante:</strong> Estos términos pueden cambiar ocasionalmente.
                  Te recomendamos revisarlos periódicamente. El uso continuo del sitio después de
                  modificaciones implica la aceptación de los nuevos términos.
                </p>
              </div>
            </section>

            {/* Descripción del sitio */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Descripción del Sitio Web y Servicios
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SOUT Training Center es una empresa peruana especializada en capacitación y certificación en:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Manejo defensivo y seguridad vial</li>
                <li>Primeros auxilios y RCP</li>
                <li>Seguridad y salud ocupacional</li>
                <li>Prevención de riesgos laborales</li>
                <li>Capacitaciones para sectores minero, petrolero, industrial y de transporte</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Este sitio web tiene los siguientes propósitos:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Proporcionar información sobre nuestros cursos, certificaciones y servicios</li>
                <li>Facilitar la inscripción y compra de cursos en línea a través de nuestra Aula Virtual</li>
                <li>Permitir la solicitud de cotizaciones y consultas para capacitaciones presenciales o in-house</li>
                <li>Compartir recursos educativos, blog y testimonios</li>
                <li>Mostrar nuestros clientes, acreditaciones y alianzas estratégicas</li>
                <li>Emitir y verificar certificados digitales de los cursos completados</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                La plataforma permite adquirir cursos en línea mediante pasarelas de pago seguras (IziPay, PayPal y Culqi).
                También ofrecemos capacitaciones presenciales, virtuales en vivo e in-house, cuya contratación se coordina
                directamente con nuestro equipo comercial.
              </p>
            </section>

            {/* Propiedad intelectual */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Propiedad Intelectual
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todo el contenido de este sitio web, incluyendo pero no limitado a:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Textos, artículos, descripciones de cursos y material educativo</li>
                <li>Imágenes, fotografías, videos y gráficos</li>
                <li>Logotipos, marcas y diseños (incluido el logo de la flecha roja de SOUT)</li>
                <li>Código fuente, diseño web y estructura del sitio</li>
                <li>Brochures digitales, plantillas y documentos descargables</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Es propiedad exclusiva de <strong>SOUT S.A.C.</strong> o está licenciado legalmente
                para su uso. Está protegido por las leyes de propiedad intelectual del Perú y tratados internacionales.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Uso permitido:</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Puedes navegar, visualizar y descargar material exclusivamente para tu uso personal
                  y no comercial, siempre que mantengas intactos los avisos de derechos de autor.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2 mt-4">Uso NO permitido:</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  <li>Copiar, reproducir, modificar o distribuir contenido sin autorización escrita</li>
                  <li>Utilizar logos, marcas o imágenes para fines comerciales</li>
                  <li>Crear trabajos derivados basados en nuestro contenido</li>
                  <li>Extraer datos del sitio mediante scraping automático</li>
                  <li>Republicar contenido en otros sitios web sin permiso</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>Referencias a NSC (National Safety Council):</strong> El logo y materiales de NSC
                son propiedad de National Safety Council y se utilizan bajo licencia oficial otorgada a SOUT Training Center.
              </p>
            </section>

            {/* Uso del sitio */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Responsabilidades del Usuario
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Al utilizar nuestro sitio web, te comprometes a:
              </p>
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <p className="text-gray-700">Proporcionar información veraz, precisa y actualizada en los formularios</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <p className="text-gray-700">Utilizar el sitio solo para fines legítimos y legales</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <p className="text-gray-700">No interferir con el funcionamiento del sitio ni intentar acceder a áreas restringidas</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <p className="text-gray-700">Respetar los derechos de propiedad intelectual de SOUT y terceros</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <p className="text-gray-700">No enviar spam, virus, malware o cualquier código dañino</p>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <p className="text-gray-700">No usar el sitio para actividades fraudulentas, ilegales o que violen derechos de terceros</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Nos reservamos el derecho de suspender o cancelar el acceso de usuarios que violen estos términos,
                sin previo aviso y sin responsabilidad alguna.
              </p>
            </section>

            {/* Inscripciones y pagos */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Inscripción a Cursos y Servicios
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cursos en línea (Aula Virtual):
              </h3>
              <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">
                <li>Selecciona el curso de tu interés en el catálogo de la plataforma</li>
                <li>Completa el proceso de checkout con tus datos y método de pago</li>
                <li>Una vez confirmado el pago, recibirás acceso inmediato al curso en tu panel de estudiante</li>
                <li>Al acceder al contenido, aceptas la cláusula de ejecución inmediata del servicio digital</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Capacitaciones presenciales, virtuales en vivo e in-house:
              </h3>
              <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">
                <li>Solicita información o cotización a través de nuestro sitio web, WhatsApp o teléfonos</li>
                <li>Nuestro equipo te enviará una propuesta comercial personalizada</li>
                <li>Una vez aceptada, coordinaremos fechas, modalidad y requisitos</li>
                <li>Procederás con el pago según las instrucciones (transferencia bancaria, depósito o factura corporativa)</li>
                <li>Recibirás confirmación de inscripción y materiales del curso</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Pagos y facturación:
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Los precios en línea están expresados en soles peruanos (PEN) o dólares americanos (USD)</li>
                <li>Los pagos en línea se procesan a través de IziPay, PayPal o Culqi</li>
                <li>Para capacitaciones corporativas, ofrecemos facturación con crédito de 15-30 días (previa evaluación)</li>
                <li>Los precios pueden incluir o no IGV (18%) según se indique en cada curso</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cancelaciones y reembolsos:
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Las condiciones de devolución para cursos en línea y presenciales se detallan en nuestra{' '}
                <a href="/politica-de-cambios-y-devoluciones" className="text-red-600 hover:underline">
                  Política de Cambios y Devoluciones
                </a>.
                En resumen:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <strong>Cursos en línea:</strong> reembolso total solo antes del primer acceso al contenido, dentro de
                  7 días calendario desde la compra
                </li>
                <li>Cancelaciones presenciales con más de 7 días de anticipación: reembolso del 100%</li>
                <li>Cancelaciones entre 3-7 días: reembolso del 50% o reprogramación sin costo</li>
                <li>Cancelaciones con menos de 3 días: no hay reembolso, pero se puede reprogramar (sujeto a disponibilidad)</li>
                <li>SOUT se reserva el derecho de cancelar o reprogramar cursos por causas de fuerza mayor,
                  con reembolso total o reprogramación sin costo adicional</li>
              </ul>
            </section>

            {/* Certificados */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Certificados y Acreditaciones
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Los participantes que completen satisfactoriamente nuestros cursos recibirán:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Certificado digital</strong> enviado por correo electrónico (dentro de 5-7 días hábiles)</li>
                <li><strong>Certificado físico</strong> impreso (opcional, puede tener costo adicional de envío)</li>
                <li><strong>Certificación NSC</strong> (para cursos acreditados por National Safety Council)</li>
                <li><strong>Carnet de identificación</strong> para cursos de manejo defensivo (según aplique)</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-gray-700 text-sm">
                  <strong>Nota importante:</strong> Los certificados son emitidos a nombre del participante
                  registrado y no son transferibles. Para recibir el certificado, se debe cumplir con el
                  100% de asistencia y aprobar las evaluaciones correspondientes (cuando aplique).
                </p>
              </div>
            </section>

            {/* Limitación de responsabilidad */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Limitación de Responsabilidad
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SOUT Training Center proporciona capacitación educativa de alta calidad, sin embargo:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>El sitio web se proporciona &quot;tal cual&quot; sin garantías de ningún tipo</li>
                <li>No garantizamos que el sitio esté libre de errores, interrupciones o virus</li>
                <li>No somos responsables por decisiones tomadas con base en la información del sitio</li>
                <li>No somos responsables por el uso indebido de las técnicas aprendidas en nuestros cursos</li>
                <li>La participación en actividades prácticas (conducción, primeros auxilios) se realiza bajo
                  consentimiento informado y aceptación de riesgos inherentes</li>
                <li>No somos responsables por pérdida de datos, lucro cesante o daños indirectos</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>Importante:</strong> Nuestros cursos de manejo defensivo y seguridad vial están diseñados
                para mejorar habilidades y conciencia, pero no garantizan la prevención absoluta de accidentes.
                La responsabilidad final del conductor/operador es personal e intransferible.
              </p>
            </section>

            {/* Enlaces externos */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Enlaces a Sitios de Terceros
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nuestro sitio web puede contener enlaces a sitios externos (como:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Redes sociales (Facebook, TikTok, LinkedIn)</li>
                <li>Sitio oficial de National Safety Council (NSC)</li>
                <li>Plataformas de pago o servicios asociados</li>
                <li>Recursos educativos complementarios</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Estos enlaces se proporcionan únicamente para tu conveniencia. No tenemos control sobre
                el contenido de estos sitios y no somos responsables por sus prácticas. Te recomendamos
                leer sus términos de uso y políticas de privacidad.
              </p>
            </section>

            {/* Indemnización */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Indemnización
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Aceptas indemnizar, defender y mantener indemne a SOUT S.A.C., sus directores, empleados
                y asociados de cualquier reclamación, pérdida, responsabilidad, daño, costo o gasto
                (incluidos honorarios legales) que surjan del uso indebido del sitio web o la violación
                de estos Términos de Uso.
              </p>
            </section>

            {/* Modificaciones */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Modificaciones a los Términos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                SOUT Training Center se reserva el derecho de modificar estos Términos de Uso en cualquier
                momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en
                el sitio web. La fecha de &quot;Última actualización&quot; al inicio de este documento indicará
                cuándo se realizaron cambios. Tu uso continuo del sitio después de modificaciones constituye
                tu aceptación de los nuevos términos.
              </p>
            </section>

            {/* Ley aplicable */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Ley Aplicable y Jurisdicción
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Estos Términos de Uso se rigen e interpretan de acuerdo con las leyes de la
                <strong> República del Perú</strong>, sin considerar conflictos de principios legales.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cualquier disputa, controversia o reclamación que surja de o esté relacionada con estos
                términos o el uso de nuestro sitio web será sometida a la jurisdicción exclusiva de los
                tribunales de <strong>Lima, Perú</strong>.
              </p>
            </section>

            {/* Divisibilidad */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Divisibilidad
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Si alguna disposición de estos Términos de Uso se considera inválida o inaplicable por
                un tribunal competente, las demás disposiciones permanecerán en pleno vigor y efecto.
              </p>
            </section>

            {/* Contacto */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Información de Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tienes preguntas sobre estos Términos de Uso o necesitas más información sobre
                nuestros servicios, contáctanos:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">SOUT S.A.C. - SOUT Training Center</p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>RUC:</strong> 20605873872</li>
                  <li><strong>Dirección:</strong> Av. Alameda del Corregidor 1769, La Molina, Lima, Perú</li>
                  <li><strong>Emails:</strong>
                    <a href="mailto:capacitaciones@soutrainingcenter.com" className="text-red-600 hover:underline ml-1">
                      capacitaciones@soutrainingcenter.com
                    </a> /
                    <a href="mailto:administracion@soutrainingcenter.com" className="text-red-600 hover:underline ml-1">
                      administracion@soutrainingcenter.com
                    </a>
                  </li>
                  <li><strong>Teléfonos:</strong> +51 977 959 001 / +51 932 191 033 / +51 966 424 257</li>
                  <li><strong>Redes Sociales:</strong>
                    <span className="ml-1">Facebook: SOUT Training Center | TikTok: @sout.empresa</span>
                  </li>
                  <li><strong>Horario de atención:</strong> Lunes a Viernes 8:00 AM - 6:00 PM | Sábados 9:00 AM - 1:00 PM</li>
                  <li>
                    <strong>Libro de Reclamaciones:</strong>{' '}
                    <a href="/libro-de-reclamaciones" className="text-red-600 hover:underline">
                      Registro virtual disponible en la plataforma
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Footer note */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Estos Términos de Uso son efectivos desde enero de 2026 y se aplican a todos
                los usuarios del sitio web www.soutrainingcenter.com
              </p>
              <p className="text-gray-600 text-sm mt-2">
                © 2026 SOUT Training Center. Todos los derechos reservados.
              </p>
              <p className="text-gray-500 text-xs mt-4">
                Al utilizar este sitio web, confirmas que has leído, comprendido y aceptado
                estos Términos de Uso en su totalidad.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
