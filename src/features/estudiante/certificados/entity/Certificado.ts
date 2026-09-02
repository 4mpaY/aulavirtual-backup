export interface CertificadoCurso {
  id: string
  titulo: string
  slug: string
  miniatura: string | null
  duracion: number | null
  nivel: string | null
  modo_certificado: 'AUTOMATICO' | 'MANUAL'
  profesor: {
    nombre: string
    apellido: string
  }
}

export interface CertificadoRuta {
  id: string
  titulo: string
  slug: string
  miniatura: string | null
}

export interface MiCertificado {
  id: string
  codigo_verificacion: string
  emitido_en: string
  datos?: any
  curso: CertificadoCurso | null
  ruta?: CertificadoRuta | null
}

export interface MisCertificadosResponse {
  status: boolean
  result: {
    certificados: MiCertificado[]
  }
}
