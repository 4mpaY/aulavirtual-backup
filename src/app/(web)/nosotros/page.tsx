import Image from 'next/image'
import Link from 'next/link'

import { Mail, Globe, Award, Briefcase, Sparkles, BookOpen, Layers, Cpu, Laptop, Leaf, Building2, Rocket, MapPin, Phone } from 'lucide-react'

import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

function parseBioSections(html: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = []
  const parts = html.split(/<h[1-3][^>]*>/i)

  for (const part of parts) {
    const closeMatch = part.match(/^(.*?)<\/h[1-3]>([\s\S]*)/i)

    if (closeMatch) {
      const title = stripHtml(closeMatch[1])
      const content = stripHtml(closeMatch[2])

      if (content) sections.push({ title, content })
    }
  }

  if (sections.length === 0) {
    const text = stripHtml(html)

    if (text) sections.push({ title: '', content: text })
  }

  return sections
}

export const metadata = {
  title: 'Nosotros — Dirección Académica',
  description: 'Conoce a nuestro equipo directivo, nuestra misión, visión y los valores que guían nuestra plataforma educativa.',
}

async function getTeachers() {
  try {
    return await prisma.usuario.findMany({
      where: { rol: 'PROFESOR' },
      select: { id: true, nombre: true, apellido: true, slug: true, avatar: true, cargo: true, biografia: true, _count: { select: { cursos_dictados: true } } },
      orderBy: { cursos_dictados: { _count: 'desc' } },
      take: 8,
    })
  } catch {
    return []
  }
}

export default async function NosotrosPage() {
  const [teachers, configs] = await Promise.all([getTeachers(), getConfigs()])
  const waNumber = configs.WHATSAPP_NUMERO || '51994356180'

  return (
    <main>
      {/* Encabezado */}
      <section style={{
        background: 'linear-gradient(135deg, #012d22 0%, #025E44 50%, #0f4438 100%)',
        padding: '6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#BDD962', marginBottom: '1.5rem' }}>
            Trayectoria institucional desde 2017
          </span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            AGENDA 2050 <span style={{ color: '#BDD962' }}>PERÚ</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Fortalecemos competencias, impulsamos la innovación y promovemos el aprendizaje permanente para afrontar los desafíos del presente y construir oportunidades hacia el año 2050.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/cursos" className="btn-primary-agenda" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}>
              Explorar capacitaciones
            </Link>
            <Link href="/ingresar" className="btn-outline-agenda" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Ingresar al Aula Virtual
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Quiénes somos? */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container-page">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }} data-animate="fade-up">
            <span className="eyebrow-agenda">Nuestra Identidad</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginTop: '1.5rem', marginBottom: '2rem', color: '#1A1A1A', lineHeight: 1.2 }}>
              ¿Quiénes <span style={{ color: 'var(--agenda-primary)' }}>somos?</span>
            </h2>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#555', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
              <p>
                <strong>AGENDA 2050 PERÚ</strong> es una consultora especializada en capacitación, innovación y desarrollo profesional aplicado, orientada al fortalecimiento de competencias y al aprendizaje permanente de personas, empresas y organizaciones.
              </p>
              <p>
                Nuestra propuesta integra tecnología, inteligencia artificial, empleabilidad, gestión social, desarrollo sostenible, transformación empresarial e innovación, respondiendo a las necesidades de un entorno laboral y social en permanente cambio.
              </p>
              <p>
                Desarrollamos cursos, seminarios, talleres, rutas de aprendizaje y programas corporativos con un enfoque práctico, flexible y conectado con situaciones reales. Para ello, combinamos experiencia profesional, herramientas digitales, metodologías activas y una plataforma propia de aprendizaje.
              </p>
              <p>
                En AGENDA 2050 PERÚ entendemos la capacitación como un proceso continuo. Por ello, acompañamos a nuestros participantes en la actualización y fortalecimiento de sus capacidades, permitiéndoles avanzar progresivamente de acuerdo con sus necesidades, intereses y objetivos profesionales.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Propósito */}
      <section className="bg-circuit" style={{ padding: '6rem 0' }}>
        <div className="container-page">
          <div style={{ maxWidth: '840px', margin: '0 auto' }} data-animate="fade-up">
            <div style={{ textAlign: 'center' }}>
              <span className="eyebrow-agenda">Historia de Agenda 2050 Perú</span>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginTop: '2rem', marginBottom: '2.5rem', color: '#1A1A1A', lineHeight: 1.2 }}>
                Formamos con criterio,<br />
                <span style={{ color: 'var(--agenda-primary)' }}>lideramos con tecnología</span>
              </h2>
            </div>
            
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#555', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p>
                <strong>Agenda 2030 Perú SAC</strong> nació en el año 2017 bajo el liderazgo del Ing. Roberto Tello Yuen, con una visión orientada a integrar consultoría, ingeniería, educación, innovación y desarrollo profesional en un entorno cada vez más influenciado por la tecnología y la transformación digital. Desde sus inicios, la organización se vinculó a actividades de consultoría de gestión, proyectos, ingeniería y desarrollo profesional, consolidando una experiencia multidisciplinaria conectada con sectores como minería, educación superior, tecnología, gestión social y desarrollo sostenible.
              </p>
              <p>
                Con el paso de los años, y como resultado de la evolución del mercado laboral, la inteligencia artificial y las nuevas necesidades de capacitación profesional, surge una nueva etapa institucional bajo el nombre comercial: <strong>Agenda 2050 Perú</strong>. Esta evolución representa una visión moderna de formación aplicada, orientada tanto a personas naturales (B2C) como a organizaciones y empresas (B2B), integrando educación, tecnología, empleabilidad y desarrollo sostenible.
              </p>
              <p>
                Agenda 2050 Perú nace con el propósito de fortalecer competencias profesionales mediante capacitaciones prácticas, flexibles y alineadas con las demandas actuales del entorno académico, tecnológico y empresarial. La propuesta académica se organiza en dos grandes líneas de formación:
              </p>
              <div style={{ paddingLeft: '1rem' }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#1A1A1A', marginBottom: '0.5rem' }}>1] Formación Tecnológica y Empleabilidad</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Programación</li>
                  <li>Bases de datos</li>
                  <li>Inteligencia artificial aplicada</li>
                  <li>Herramientas digitales</li>
                  <li>Empleabilidad y marca profesional</li>
                </ul>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#1A1A1A', marginBottom: '0.5rem' }}>2] Gerencia, Gestión Social y Desarrollo Sostenible</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Gerencia e inversión social</li>
                  <li>Relaciones comunitarias y gestión social</li>
                  <li>Responsabilidad social empresarial y desarrollo sostenible</li>
                  <li>Proyectos de inversión</li>
                  <li>Gestión aplicada a entornos corporativos y mineros</li>
                </ul>
              </div>
              <p>
                El modelo educativo de Agenda 2050 Perú incorpora clases virtuales en vivo, aula virtual, grabaciones por sesión, materiales digitales y certificación verificable con código QR, buscando combinar aprendizaje práctico, pensamiento crítico y aplicación profesional.
              </p>
              <p>
                Asimismo, la institución busca diferenciarse no solo por enseñar herramientas tecnológicas o conceptos de gestión, sino por promover una formación conectada con la realidad profesional, la empleabilidad y la capacidad de adaptación frente a los cambios tecnológicos y sociales. Todo ello respaldado por la experiencia académica y profesional del Ing. Roberto Tello Yuen, ingeniero, docente universitario y consultor con más de 20 años de trayectoria en minería, tecnología, educación superior, innovación, gestión social y desarrollo sostenible.
              </p>
              <p style={{ fontStyle: 'italic', color: '#1A1A1A', fontWeight: 500 }}>
                La visión institucional se resume en una idea central: “Formación tecnológica con criterio profesional y enfoque en empleabilidad.” y en el mensaje que acompaña permanentemente la trayectoria del Ing. Roberto Tello Yuen: “La educación abre caminos. La tecnología los multiplica.”
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginTop: '5rem' }} className="stagger-container">
            {[
              { icon: Globe, title: 'Misión', text: 'Brindar capacitación especializada, práctica y accesible a personas naturales (B2C) y organizaciones (B2B), mediante programas de formación tecnológica, empleabilidad, gestión social y desarrollo sostenible, combinando experiencia profesional, herramientas digitales e innovación educativa para fortalecer competencias y generar mayor valor profesional y organizacional.' },
              { icon: Sparkles, title: 'Visión', text: 'Ser una organización referente en Latinoamérica en formación tecnológica, empleabilidad y desarrollo profesional aplicado, integrando educación, innovación, inteligencia artificial y gestión sostenible para contribuir al crecimiento de personas, empresas y organizaciones frente a los desafíos del futuro.' },
              { icon: Award, title: 'Valores', text: 'Excelencia, Ética, Innovación constante y Compromiso con el éxito profesional de cada uno de nuestros estudiantes.' },
            ].map((item) => (
              <div
                key={item.title}
                data-animate="zoom-in-sm"
                style={{ padding: '2.5rem', borderRadius: '3rem', background: '#ffffff', border: '1px solid #e5e5e5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', transition: 'all 0.3s' }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--agenda-gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '2rem' }}>
                  <item.icon size={28} />
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.3rem', marginBottom: '1rem', color: '#1A1A1A' }}>{item.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#666', lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro modelo de formación */}
      <section style={{ padding: '6rem 0', background: '#fafafa' }}>
        <div className="container-page">
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', marginBottom: '4rem' }} data-animate="fade-up">
            <span className="eyebrow-agenda">Nuestra Metodología</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginTop: '1.5rem', marginBottom: '1.5rem', color: '#1A1A1A', lineHeight: 1.2 }}>
              Nuestro modelo de <span style={{ color: 'var(--agenda-primary)' }}>formación</span>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#666', lineHeight: 1.7 }}>
              AGENDA 2050 PERÚ desarrolla un modelo de formación continua que permite a cada participante avanzar de manera flexible y progresiva.
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#666', lineHeight: 1.7, marginTop: '1rem' }}>
              Los cursos pueden llevarse de manera independiente, de acuerdo con una necesidad puntual de capacitación. Asimismo, varios cursos relacionados pueden integrarse dentro de una Ruta de Aprendizaje, permitiendo desarrollar competencias complementarias y alcanzar una certificación integral asociada a la ruta completada.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '2rem', padding: '3rem', border: '1px solid #e5e5e5', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              {[
                { title: 'CURSO INDEPENDIENTE', icon: BookOpen, desc: 'Aprende una habilidad específica' },
                { title: 'RUTA DE APRENDIZAJE', icon: Layers, desc: 'Conecta conocimientos afines' },
                { title: 'CERTIFICACIÓN INTEGRAL', icon: Award, desc: 'Valida tu dominio de una ruta' },
                { title: 'FORTALECIMIENTO DE COMPETENCIAS', icon: Briefcase, desc: 'Aplica lo aprendido en el entorno laboral' },
                { title: 'APRENDIZAJE PERMANENTE', icon: Rocket, desc: 'Evoluciona con las nuevas tecnologías' }
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--agenda-accent)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, border: '4px solid #fff' }}>
                    <step.icon size={24} />
                  </div>
                  <div style={{ flex: 1, background: '#fafafa', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #eee' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#1A1A1A', marginBottom: '0.25rem' }}>{step.title}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>{step.desc}</p>
                  </div>
                  {idx < 4 && (
                    <div style={{ position: 'absolute', left: '30px', top: '60px', bottom: '-24px', width: '2px', background: 'var(--agenda-accent)', zIndex: 0 }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid #eee' }}>
              {[
                { title: '5', subtitle: 'Escuelas de Formación Continua' },
                { title: '21', subtitle: 'Rutas de Aprendizaje proyectadas' },
                { title: '+30', subtitle: 'Cursos actuales y proyectados' },
                { title: 'Integrales', subtitle: 'Certificados individuales e integrales' },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2rem', color: 'var(--agenda-primary)' }}>{stat.title}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#666', lineHeight: 1.4 }}>{stat.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nuestras escuelas */}
      <section style={{ padding: '6rem 0', background: '#ffffff' }}>
        <div className="container-page">
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', marginBottom: '4rem' }} data-animate="fade-up">
            <span className="eyebrow-agenda">PLAN AGENDA 2050</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginTop: '1.5rem', marginBottom: '1.5rem', color: '#1A1A1A', lineHeight: 1.2 }}>
              Nuestras <span style={{ color: 'var(--agenda-primary)' }}>Escuelas</span>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#666', lineHeight: 1.7 }}>
              El PLAN AGENDA 2050 organiza progresivamente su oferta de capacitación en cinco escuelas que responden a grandes líneas de desarrollo profesional, tecnológico, empresarial y social.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }} className="stagger-container">
            {[
              { title: 'Escuela de Tecnología e Innovación', state: 'Disponible', stateColor: '#10b981', stateBg: '#d1fae5', desc: 'Fortalece competencias en programación, bases de datos, análisis de datos, inteligencia artificial y automatización.', icon: Laptop, topics: ['Algoritmos', 'Python', 'Programación Orientada a Objetos', 'Bases de datos y SQL', 'Power BI', 'Inteligencia Artificial', 'Automatización'], btn: 'Ver capacitaciones', href: '/cursos' },
              { title: 'Escuela Ciudadano Digital 2050', state: 'Disponible', stateColor: '#10b981', stateBg: '#d1fae5', desc: 'Acerca la inteligencia artificial y las herramientas digitales a personas de diferentes edades, profesiones y niveles de experiencia tecnológica.', icon: Globe, topics: ['IA para la vida y el trabajo', 'Cómo comunicarse con la IA', 'Productividad personal', 'Emprendimiento con IA', 'Python para no especialistas', 'Comunicación con IA'], btn: 'Conocer la escuela', href: '/cursos' },
              { title: 'Escuela de Gestión Social y Desarrollo Sostenible', state: 'Próximamente', stateColor: '#f59e0b', stateBg: '#fef3c7', desc: 'Fortalecerá capacidades para la gestión de relaciones comunitarias, responsabilidad social, sostenibilidad, prevención de conflictos e inversión social.', icon: Leaf, topics: ['Relaciones Comunitarias', 'Responsabilidad Social', 'Gestión de Conflictos Socioambientales', 'Desarrollo Territorial', 'Inversión Social', 'Proyectos de Inversión'] },
              { title: 'Escuela ERP y Transformación Empresarial', state: 'Mediante alianzas', stateColor: '#3b82f6', stateBg: '#dbeafe', desc: 'Desarrollará conocimientos relacionados con sistemas integrados de gestión empresarial y transformación organizacional, mediante alianzas con especialistas.', icon: Building2, topics: ['Fundamentos de ERP', 'SAP S/4HANA', 'SAP MM', 'SAP SD', 'SAP Analytics', 'Gestión de procesos'] },
              { title: 'Escuela de Gestión, Industria 5.0 e Innovación', state: 'En desarrollo', stateColor: '#8b5cf6', stateBg: '#ede9fe', desc: 'Promoverá capacidades vinculadas con gestión de proyectos, innovación, transformación digital y nuevas tecnologías aplicadas a la industria.', icon: Cpu, topics: ['Gestión de Proyectos', 'Industria 5.0', 'Gemelos Digitales', 'Innovación y Liderazgo', 'Gestión del Cambio', 'Transformación Digital'] },
            ].map((school, i) => (
              <div key={i} data-animate="zoom-in-sm" style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                    <school.icon size={26} />
                  </div>
                  <span style={{ background: school.stateBg, color: school.stateColor, padding: '0.35rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase' }}>
                    {school.state}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.3rem', color: '#1A1A1A', marginBottom: '1rem', lineHeight: 1.3 }}>{school.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#666', lineHeight: 1.6, marginBottom: '1.5rem' }}>{school.desc}</p>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Temas principales:</p>
                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {school.topics.map((t, j) => (
                        <li key={j} style={{ background: '#fff', border: '1px solid #eee', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', color: '#555' }}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  {school.btn && school.href && (
                    <Link href={school.href} className="btn-outline-agenda" style={{ padding: '0.75rem', textAlign: 'center', display: 'block' }}>
                      {school.btn}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mensaje del Gerente General */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #012d22 0%, #025E44 100%)', color: '#fff', overflow: 'hidden' }}>
        <div className="container-page relative">
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, pointerEvents: 'none' }}>
            <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div data-animate="fade-right">
              <span style={{ display: 'inline-block', fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#BDD962', marginBottom: '1.5rem' }}>
                Mensaje Institucional
              </span>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', marginBottom: '2rem', lineHeight: 1.1 }}>
                El futuro se construye con <span style={{ color: '#BDD962' }}>conocimiento e innovación</span>
              </h2>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p>
                  En AGENDA 2050 PERÚ creemos que el aprendizaje permanente es una de las principales herramientas para afrontar los cambios tecnológicos, profesionales y sociales de nuestro tiempo.
                </p>
                <p>
                  Nuestra trayectoria institucional comenzó en 2017 y continúa evolucionando a través de nuevas propuestas de capacitación, una plataforma propia de aprendizaje y una visión estratégica orientada al año 2050.
                </p>
                <p>
                  Nuestro compromiso es ofrecer experiencias de aprendizaje prácticas, accesibles y conectadas con la realidad, que permitan a ciudadanos, técnicos, profesionales y organizaciones fortalecer sus capacidades y generar nuevas oportunidades.
                </p>
                <p style={{ fontStyle: 'italic', color: '#BDD962', fontWeight: 600 }}>
                  El futuro se construye con conocimiento, innovación y personas dispuestas a seguir aprendiendo.
                </p>
              </div>
              <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)' }}>
                  <Image src="/images/agenda/fondo5050.png" alt="Ing. Roberto Tello Yuen" width={80} height={80} style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>Ing. Roberto Tello Yuen</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Gerente General, AGENDA 2050 PERÚ</p>
                </div>
              </div>
            </div>
            <div data-animate="fade-left" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '450px', aspectRatio: '1/1' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', borderRadius: '3rem', transform: 'rotate(-5deg)' }} />
                <div style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: '3rem', overflow: 'hidden' }}>
                  <Image src="/images/agenda/fondo5050.png" alt="Ing. Roberto Tello Yuen" fill style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profesores (si hay) */}
      {teachers.length > 0 && (
        <section style={{ padding: '5rem 0', background: '#fafafa', borderTop: '1px solid #e5e5e5' }}>
          <div className="container-page">
            <div data-animate="fade-up" style={{ marginBottom: '3rem' }}>
              <span className="eyebrow-agenda">Nuestro Equipo</span>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em', marginTop: '1rem', color: '#1A1A1A' }}>
                Equipo de <span style={{ color: 'var(--agenda-primary)' }}>Docentes</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }} className="stagger-container">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  data-animate="zoom-in-sm"
                  style={{ display: 'flex', flexDirection: 'column', borderRadius: '2rem', background: '#ffffff', border: '1px solid #e5e5e5', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                >
                  {/* Header con avatar */}
                  <div style={{ background: 'linear-gradient(135deg, #012d22 0%, #025E44 100%)', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0, position: 'relative' }}>
                      {t.avatar ? (
                        <Image src={t.avatar} alt={`${t.nombre} ${t.apellido}`} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BDD962', fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.75rem' }}>
                          {t.nombre[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1rem', color: '#ffffff', lineHeight: 1.2 }}>{t.nombre} {t.apellido}</p>
                      {t.cargo && (
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#BDD962', marginTop: '0.375rem', fontWeight: 500 }}>{t.cargo}</p>
                      )}
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>

                    {/* Stat: capacitaciones */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,111,101,0.07)', borderRadius: '999px', padding: '0.3rem 0.85rem', alignSelf: 'flex-start' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--agenda-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: 'var(--agenda-primary)' }}>
                        {t._count.cursos_dictados} {t._count.cursos_dictados === 1 ? 'capacitación' : 'capacitaciones'}
                      </span>
                    </div>

                    {/* Secciones de la biografía */}
                    {t.biografia && parseBioSections(t.biografia).map((sec, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {sec.title && (
                          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: '#025E44', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                            {sec.title}
                          </p>
                        )}
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#555', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {sec.content}
                        </p>
                      </div>
                    ))}

                    {/* Link */}
                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f0f0f0' }}>
                      <Link
                        href={`/docentes/${t.slug || t.id}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.83rem', color: 'var(--agenda-primary)', textDecoration: 'none' }}
                      >
                        Ver perfil completo →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacto Institucional */}
      <section style={{ padding: '6rem 0', background: '#fafafa' }}>
        <div className="container-page">
          <div style={{ background: '#ffffff', borderRadius: '3rem', padding: 'clamp(3rem, 6vw, 5rem)', border: '1px solid #e5e5e5', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', position: 'relative', zIndex: 1 }}>
              <div data-animate="fade-right">
                <span className="eyebrow-agenda">Contacto Institucional</span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.03em', marginTop: '1.5rem', marginBottom: '1.5rem', color: '#1A1A1A', lineHeight: 1.1 }}>
                  ¿Listo para potenciar tu <span style={{ color: 'var(--agenda-primary)' }}>desarrollo profesional?</span>
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#666', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  Nuestro equipo está disponible para brindar información sobre cursos, rutas de aprendizaje, seminarios, programas corporativos, convenios y alianzas estratégicas.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="btn-primary-agenda" style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem' }}>
                    Escríbenos por WhatsApp
                  </a>
                  <Link href="/cursos" className="btn-outline-agenda" style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem' }}>
                    Explorar capacitaciones
                  </Link>
                  <Link href="/ingresar" className="btn-outline-agenda" style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem' }}>
                    Ingresar al Aula Virtual
                  </Link>
                </div>
              </div>

              <div data-animate="fade-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,111,101,0.08)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>Portales Web</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>Oficial: www.agenda2050.pe</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>Complementario: www.agenda2050peru.com</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'var(--agenda-primary)', fontWeight: 600, marginTop: '0.25rem' }}>Aula Virtual integrada</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,111,101,0.08)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>Central Telefónica / WhatsApp</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>+51 994 356 180</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,111,101,0.08)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>Correo Institucional</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>agenda2050peru@gmail.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,111,101,0.08)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>Ubicación</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>Santiago de Surco, Lima, Perú</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
