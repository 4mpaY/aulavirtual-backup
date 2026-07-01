import Header from '@sout/components/layout/Header'
import Footer from '@sout/components/layout/Footer'
import LibroReclamacionesForm from '@/features/web/legal/components/LibroReclamacionesForm'
import { SOUT_COMPANY } from '@sout/lib/company'

const LibroReclamaciones = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Libro de Reclamaciones</h1>
            <p className="text-lg text-gray-600">
              Registro virtual de quejas y reclamos conforme a la legislación peruana
            </p>
          </div>
          <LibroReclamacionesForm />
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              {SOUT_COMPANY.legalName} — {SOUT_COMPANY.tradeName} | RUC: {SOUT_COMPANY.ruc}
            </p>
            <p>{SOUT_COMPANY.address}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LibroReclamaciones
