import Link from 'next/link'

import { Grid } from '@mui/material'
import { ArrowRight } from 'lucide-react'

import EbookCard from '@/features/web/ebooks/components/EbookCard'

interface Ebook {
  id: string
  titulo: string
  slug: string
  miniatura?: string | null
  precio: number
  precio_falso: number
  moneda: string
  es_gratis: boolean
  autor?: string | null
  paginas?: number | null
  genero?: string | null
  categoria?: { nombre: string } | null
}

interface Props {
  ebooks: Ebook[]
}

export default function HomeEbooksSection({ ebooks }: Props) {
  if (!ebooks.length) return null

  return (
    <section style={{ backgroundColor: 'hsl(210, 15%, 97%)', borderTop: '1px solid hsl(214, 20%, 92%)' }}>
      <div className="section-container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div
              className="inline-flex items-center gap-2 mb-3"
              style={{ color: 'var(--web-primary, #25927F)', fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              <i className="tabler-book" style={{ fontSize: '0.875rem' }} />
              Material digital
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>Ebooks especializados</h2>
            <p className="section-subtitle">Amplía tu conocimiento con nuestra colección de recursos digitales.</p>
          </div>
          <Link
            href="/ebooks"
            className="no-underline hidden sm:inline-flex items-center gap-2 text-sm font-semibold"
            style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--web-primary, #25927F)' }}
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <Grid container spacing={4}>
          {ebooks.map(ebook => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={ebook.id}>
              <EbookCard {...ebook} adquirido={false} />
            </Grid>
          ))}
        </Grid>

        <div className="flex justify-center mt-6 sm:hidden">
          <Link
            href="/ebooks"
            className="no-underline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm"
            style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'var(--web-primary, #25927F)', color: '#ffffff' }}
          >
            Ver todos los ebooks <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
