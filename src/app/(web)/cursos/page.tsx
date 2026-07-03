import ProgramCatalogLayout from '@/features/web/home/components/ProgramCatalogLayout'
import { getProgramCatalogData } from '@/features/web/cursos/getProgramCatalogData'
import { getAuthSession } from '@/utils/libs/auth-helpers'

// Server Action / Data Fetching
async function getData(token: string | null) {
  try {
    const axiosWebCursos = new AxiosWebCursos({
      getAuthToken: () => token
    })

    const data = await axiosWebCursos.getCatalog()

    // Serialización manual de Decimal a Number para evitar errores en Client Components
    if (data.courses) {
      data.courses = data.courses.map((c: any) => ({
        ...c,
        precio: c.precio ? Number(c.precio) : 0,
        precio_oferta: c.precio_oferta ? Number(c.precio_oferta) : null
      }))
    }

    return data
  } catch (error) {
    console.error('Error fetching data in CursosPage via API:', error)

    return { courses: [], categories: [] }
  }
}

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Capacitaciones`,
  description: 'Explora nuestra amplia variedad de capacitaciones y comienza a aprender hoy mismo.'
}

export default async function CursosPage() {
  const session = await getAuthSession()
  const token = session?.user?.accessToken ?? null
  const { courses, categories } = await getProgramCatalogData('CURSO', token)

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      {/* Banner */}
      <section style={{ background: 'linear-gradient(135deg, #012d22 0%, #025E44 50%, #0f4438 100%)', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <a href="/" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Inicio</a>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: '#BDD962', fontWeight: 600 }}>Capacitaciones</span>
          </div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
            Catálogo de <span style={{ color: '#BDD962' }}>Capacitaciones</span>
          </h1>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.7 }}>
            Explora nuestra selección de capacitaciones, desarrolla nuevas habilidades y potencia tu carrera profesional.
          </p>
        </div>
      </section>

      <CourseCatalog courses={courses} categories={categories} />
    </Box>
  )
}
