declare module 'react-pdf' {
  import type { ReactNode } from 'react'

  export const pdfjs: {
    GlobalWorkerOptions: { workerSrc: string }
    version: string
  }

  export interface DocumentProps {
    file: string | File | ArrayBuffer | { url: string } | { data: ArrayBuffer } | null
    onLoadSuccess?: (pdf: { numPages: number }) => void
    onLoadError?: (error: Error) => void
    loading?: ReactNode
    error?: ReactNode
    children?: ReactNode
    className?: string
    options?: Record<string, unknown>
  }

  export interface PageProps {
    pageNumber: number
    width?: number
    height?: number
    scale?: number
    rotate?: number
    renderAnnotationLayer?: boolean
    renderTextLayer?: boolean
    loading?: ReactNode
    className?: string
    onLoadSuccess?: (page: { width: number; height: number }) => void
  }

  export function Document(props: DocumentProps): JSX.Element
  export function Page(props: PageProps): JSX.Element
}
