import type { Simulacro, NivelSimulacro } from '@/features/admin/simulacros/entity/Simulacro'
import SimulacroCard from '../components/SimulacroCard'

const NIVELES: { value: NivelSimulacro | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'BASICO', label: 'Básico' },
  { value: 'INTERMEDIO', label: 'Intermedio' },
  { value: 'AVANZADO', label: 'Avanzado' },
]

// Componente server — el filtro de nivel se puede agregar como search param en el futuro
export default function SimulacrosWebPage({ simulacros }: { simulacros: Simulacro[] }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 100%)',
          padding: '5rem 1.5rem 3rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(var(--web-light-rgb, 189,217,98),0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 60, width: 260, height: 260, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--web-light, #BDD962)', marginBottom: '0.75rem' }}>
            Simulacros
          </p>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem' }}>
            Pon a prueba tus conocimientos
          </h1>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '520px', margin: '0 auto' }}>
            Exámenes de práctica con condiciones reales. Prepárate para certificaciones y oposiciones.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
        {simulacros.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.1rem' }}>No hay simulacros disponibles por el momento.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {simulacros.map(s => <SimulacroCard key={s.id} simulacro={s} />)}
          </div>
        )}
      </section>
    </div>
  )
}
