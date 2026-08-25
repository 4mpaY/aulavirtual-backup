import Header from "@sout/components/layout/Header";
import Footer from "@sout/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-gray-600">
              En SOUT Training Center valoramos y protegemos tu información personal
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Última actualización: Enero 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Introducción
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SOUT S.A.C., con nombre comercial <strong>SOUT Training Center</strong> (RUC: 20605873872),
                se compromete a proteger la privacidad de nuestros clientes, usuarios y visitantes del sitio web
                www.soutrainingcenter.com. Esta Política de Privacidad explica de manera clara y transparente
                cómo recopilamos, usamos, almacenamos y protegemos tu información personal de acuerdo con la
                Ley N° 29733 - Ley de Protección de Datos Personales del Perú.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Al utilizar nuestro sitio web o nuestros servicios de capacitación, aceptas las prácticas
                descritas en esta política. Consulta también nuestros{' '}
                <a href="/terminos-de-uso" className="text-red-600 hover:underline">Términos de Uso</a> y nuestra{' '}
                <a href="/politica-de-cambios-y-devoluciones" className="text-red-600 hover:underline">
                  Política de Cambios y Devoluciones
                </a>.
              </p>
            </section>

            {/* Información que recopilamos */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                ¿Qué información recopilamos?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Recopilamos información que nos proporcionas directamente y datos generados automáticamente
                al navegar en nuestro sitio web:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Información que nos proporcionas:
              </h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Nombre de tu empresa o institución</li>
                <li>Cargo o puesto de trabajo</li>
                <li>DNI o documento de identidad (para emisión de certificados)</li>
                <li>Mensajes y consultas que envíes a través de formularios de contacto</li>
                <li>Información de inscripción a cursos y capacitaciones</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Información recopilada automáticamente:
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Dirección IP</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de navegación</li>
                <li>Cookies y tecnologías similares (para mejorar la experiencia del usuario)</li>
                <li>Datos de Google Analytics (comportamiento de navegación anónimo)</li>
              </ul>
            </section>

            {/* Uso de la información */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                ¿Para qué usamos tu información?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos tu información personal únicamente para los siguientes propósitos legítimos:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Responder a tus consultas</strong> y brindarte información sobre nuestros cursos y servicios</li>
                <li><strong>Procesar inscripciones</strong> a capacitaciones, cursos y certificaciones</li>
                <li><strong>Emitir certificados</strong> digitales o físicos una vez completados los cursos</li>
                <li><strong>Enviarte cotizaciones personalizadas</strong> cuando lo solicites</li>
                <li><strong>Comunicarnos contigo</strong> sobre actualizaciones de cursos, nuevas capacitaciones y promociones (con tu consentimiento)</li>
                <li><strong>Mejorar nuestro sitio web</strong> y servicios mediante análisis estadísticos</li>
                <li><strong>Cumplir con obligaciones legales</strong> y regulatorias aplicables en Perú</li>
                <li><strong>Proteger la seguridad</strong> de nuestros sistemas y prevenir fraudes</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales.
              </p>
            </section>

            {/* Protección de datos */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                ¿Cómo protegemos tu información?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En SOUT Training Center implementamos medidas de seguridad técnicas, administrativas y físicas
                para proteger tu información personal contra acceso no autorizado, pérdida, alteración o divulgación:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Uso de certificados SSL (conexión segura https://)</li>
                <li>Almacenamiento de datos en servidores seguros con acceso restringido</li>
                <li>Cifrado de información sensible</li>
                <li>Controles de acceso y autenticación para nuestro personal</li>
                <li>Monitoreo constante de nuestros sistemas</li>
                <li>Acuerdos de confidencialidad con proveedores de servicios externos</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Sin embargo, ningún método de transmisión por internet o almacenamiento electrónico es 100% seguro.
                Hacemos nuestro mejor esfuerzo para proteger tu información, pero no podemos garantizar seguridad absoluta.
              </p>
            </section>

            {/* Compartir información */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                ¿Compartimos tu información?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                No compartimos tu información personal con terceros, excepto en los siguientes casos limitados:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar nuestro sitio web
                  (hosting, email marketing, análisis de datos) bajo acuerdos de confidencialidad estrictos</li>
                <li><strong>Entidades regulatorias:</strong> Cuando sea requerido por ley o autoridades competentes en Perú</li>
                <li><strong>Empresas cliente:</strong> Si te inscribes a través de tu empresa, podemos compartir tu
                  progreso y certificaciones con tu empleador (solo con tu autorización previa)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Todos nuestros proveedores están obligados contractualmente a proteger tu información personal
                y no pueden usarla para otros fines.
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Cookies y Tecnologías de Seguimiento
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nuestro sitio web utiliza cookies (pequeños archivos de texto almacenados en tu dispositivo)
                para mejorar tu experiencia de navegación y analizar el tráfico del sitio:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies analíticas:</strong> Google Analytics para entender cómo los visitantes usan nuestro sitio</li>
                <li><strong>Cookies de funcionalidad:</strong> Para recordar tus preferencias (idioma, formularios guardados)</li>
              </ul>
              <div className="bg-gray-50 border-l-4 border-red-600 p-4 mb-4">
                <p className="text-gray-700">
                  <strong>Puedes desactivar las cookies</strong> en la configuración de tu navegador.
                  Ten en cuenta que esto puede afectar la funcionalidad del sitio web.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Para más información sobre Google Analytics y cómo desactivarlo, visita:
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline ml-1">
                  Google Analytics Opt-out
                </a>
              </p>
            </section>

            {/* Retención de datos */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                ¿Cuánto tiempo conservamos tu información?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conservamos tu información personal solo durante el tiempo necesario para cumplir con los
                propósitos descritos en esta política o según lo requiera la ley peruana:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Consultas y cotizaciones:</strong> Hasta 2 años después de la última interacción</li>
                <li><strong>Registros de cursos y certificaciones:</strong> Hasta 10 años (para fines de auditoría y revalidación)</li>
                <li><strong>Datos de marketing:</strong> Hasta que retires tu consentimiento</li>
                <li><strong>Datos contables y fiscales:</strong> Según los plazos establecidos por SUNAT (mínimo 5 años)</li>
              </ul>
            </section>

            {/* Derechos del usuario */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Tus Derechos (ARCO)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                De acuerdo con la Ley N° 29733, tienes los siguientes derechos sobre tu información personal:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">Acceso</h4>
                  <p className="text-gray-700 text-sm">Solicitar una copia de la información que tenemos sobre ti</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">Rectificación</h4>
                  <p className="text-gray-700 text-sm">Corregir datos inexactos o desactualizados</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">Cancelación</h4>
                  <p className="text-gray-700 text-sm">Solicitar la eliminación de tu información personal</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">Oposición</h4>
                  <p className="text-gray-700 text-sm">Oponerte al tratamiento de tus datos para ciertos fines</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>¿Cómo ejercer tus derechos?</strong><br />
                Envía un correo electrónico a <a href="mailto:administracion@soutrainingcenter.com" className="text-red-600 hover:underline">
                  administracion@soutrainingcenter.com</a> con el asunto &quot;Ejercicio de Derechos ARCO&quot;
                e incluye tu nombre completo, DNI, el derecho que deseas ejercer y una copia de tu documento de identidad.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Responderemos a tu solicitud en un plazo máximo de 10 días hábiles desde su recepción.
              </p>
            </section>

            {/* Enlaces externos */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Enlaces a Sitios de Terceros
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Nuestro sitio web puede contener enlaces a sitios externos (como redes sociales o partners).
                No somos responsables de las prácticas de privacidad de estos sitios. Te recomendamos leer
                sus políticas de privacidad antes de proporcionar información personal.
              </p>
            </section>

            {/* Cambios */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Cambios a esta Política de Privacidad
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en
                nuestras prácticas o por razones legales. Te notificaremos sobre cambios importantes
                publicando la nueva política en nuestro sitio web con la fecha de &quot;Última actualización&quot;.
                Te recomendamos revisar esta página periódicamente.
              </p>
            </section>

            {/* Contacto */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Información de Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tienes preguntas, comentarios o inquietudes sobre esta Política de Privacidad o sobre
                cómo manejamos tu información personal, contáctanos:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="font-bold text-gray-900 mb-3">SOUT S.A.C. - SOUT Training Center</p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>RUC:</strong> 20605873872</li>
                  <li><strong>Dirección:</strong> Av. Alameda del Corregidor 1769, La Molina, Lima, Perú</li>
                  <li><strong>Emails:</strong>
                    <a href="mailto:administracion@soutrainingcenter.com" className="text-red-600 hover:underline ml-1">
                      administracion@soutrainingcenter.com
                    </a> /
                    <a href="mailto:capacitaciones@soutrainingcenter.com" className="text-red-600 hover:underline ml-1">
                      capacitaciones@soutrainingcenter.com
                    </a>
                  </li>
                  <li><strong>Teléfonos:</strong> +51 977 959 001 / +51 932 191 033 / +51 966 424 257</li>
                  <li>
                    <strong>Libro de Reclamaciones:</strong>{' '}
                    <a href="/libro-de-reclamaciones" className="text-red-600 hover:underline">
                      Registro virtual disponible en la plataforma
                    </a>
                  </li>
                  <li><strong>Redes Sociales:</strong>
                    <span className="ml-1">Facebook: SOUT Training Center | TikTok: @sout.empresa</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Footer note */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Esta Política de Privacidad es efectiva desde enero de 2026 y cumple con la
                Ley N° 29733 - Ley de Protección de Datos Personales del Perú.
              </p>
              <p className="text-gray-600 text-sm mt-2">
                © 2026 SOUT Training Center. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
