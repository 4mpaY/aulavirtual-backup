'use client'

/* eslint-disable import/no-unresolved */
import { useEffect, useRef, useState } from 'react'

import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

import { Box, CircularProgress, IconButton, InputBase, Stack, Tooltip, Typography } from '@mui/material'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface PdfViewerProps {
    url?: string | null
}

const ZOOM_STEP = 0.25
const ZOOM_MIN = 0.5
const ZOOM_MAX = 3
const SCROLL_TOP_GAP = 16

const PdfViewer = ({ url }: PdfViewerProps) => {
    const [pdfData, setPdfData] = useState<{ data: ArrayBuffer } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [numPages, setNumPages] = useState(0)
    const [baseWidth, setBaseWidth] = useState(800)
    const [zoom, setZoom] = useState(1)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [visiblePage, setVisiblePage] = useState(1)
    const [pageInput, setPageInput] = useState('')
    const [isEditingPage, setIsEditingPage] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const pageRefs = useRef<Record<number, HTMLDivElement | null>>({})

    const pageWidth = Math.round(baseWidth * zoom)

    useEffect(() => {
        setPdfData(null)
        setError(false)
        setNumPages(0)

        if (!url) return

        setLoading(true)

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('No se pudo cargar el PDF')

                return res.arrayBuffer()
            })
            .then(buf => setPdfData({ data: buf }))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [url])

    useEffect(() => {
        const el = wrapperRef.current

        if (!el) return

        const obs = new ResizeObserver(() => setBaseWidth(el.clientWidth - 2))

        obs.observe(el); setBaseWidth(el.clientWidth - 2)

        return () => obs.disconnect()
    }, [pdfData, isFullscreen])

    useEffect(() => {
        const handle = () => setIsFullscreen(!!document.fullscreenElement)

        document.addEventListener('fullscreenchange', handle)

        return () => document.removeEventListener('fullscreenchange', handle)
    }, [])

    useEffect(() => {
        const el = wrapperRef.current

        if (!el || !numPages) return

        // Las páginas suelen ser más altas que el área visible del visor, por lo que
        // no alcanzan un % alto de intersección: se calcula la página actual a partir
        // de cuál es la última cuyo borde superior ya pasó el tope visible.
        const computeVisiblePage = () => {
            const scrollTop = el.scrollTop + SCROLL_TOP_GAP + 8
            let current = 1

            for (let p = 1; p <= numPages; p++) {
                const pageEl = pageRefs.current[p]

                if (pageEl && pageEl.offsetTop <= scrollTop) current = p
            }

            setVisiblePage(current)
        }

        computeVisiblePage()
        el.addEventListener('scroll', computeVisiblePage, { passive: true })

        return () => el.removeEventListener('scroll', computeVisiblePage)
    }, [numPages, pageWidth])

    const toggleFullscreen = () => {
        if (!containerRef.current) return
        document.fullscreenElement ? document.exitFullscreen() : containerRef.current.requestFullscreen()
    }

    const goToPage = (n: number) => {
        const target = Math.max(1, Math.min(numPages, n))
        const el = pageRefs.current[target]

        if (el && wrapperRef.current) {
            wrapperRef.current.scrollTo({ top: el.offsetTop - SCROLL_TOP_GAP, behavior: 'smooth' })
        }
    }

    const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        const n = parseInt(pageInput, 10)

        if (!isNaN(n)) {
            const target = Math.max(1, Math.min(numPages, n))

            goToPage(target)
            setVisiblePage(target)
        }

        setPageInput('')
        setIsEditingPage(false)
        e.currentTarget.blur()
    }

    const handleDownload = () => {
        if (!pdfData || !url) return

        const blob = new Blob([pdfData.data], { type: 'application/pdf' })
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = blobUrl
        a.download = url.split('/').pop() || 'documento.pdf'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(blobUrl)
    }

    if (!url || error) {
        return (
            <Box
                sx={{
                    width: '100%',
                    aspectRatio: '16/9',
                    bgcolor: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: { xs: 0, md: '12px' },
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ color: 'white', textAlign: 'center' }}>
                    <i className="tabler-file-off" style={{ fontSize: '3rem', opacity: 0.5 }} />
                    <Box sx={{ mt: 1, opacity: 0.7 }}>
                        {error ? 'No se pudo cargar el PDF' : 'No hay PDF disponible para esta lección'}
                    </Box>
                </Box>
            </Box>
        )
    }

    return (
        <Box
            ref={containerRef}
            sx={{
                width: '100%',
                aspectRatio: isFullscreen ? undefined : '16/9',
                height: isFullscreen ? '100vh' : undefined,
                bgcolor: '#1a1a1a',
                borderRadius: isFullscreen ? 0 : { xs: 0, md: '12px' },
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Toolbar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.75, bgcolor: '#2a2a2a', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Tooltip title="Ir a página (Enter)" placement="bottom">
                        <InputBase
                            value={isEditingPage ? pageInput : String(visiblePage)}
                            onFocus={() => { setIsEditingPage(true); setPageInput('') }}
                            onBlur={() => { setIsEditingPage(false); setPageInput('') }}
                            onChange={e => setPageInput(e.target.value)}
                            onKeyDown={handlePageInputSubmit}
                            inputProps={{ style: { textAlign: 'center', width: 28, padding: 0, fontSize: '0.78rem', color: '#ccc' } }}
                            sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '6px', px: 1, height: 26, border: '1px solid rgba(255,255,255,0.12)' }}
                        />
                    </Tooltip>
                    <Typography sx={{ color: '#888', fontSize: '0.78rem' }}>/ {numPages || '—'}</Typography>
                </Stack>

                <Box sx={{ flex: 1 }} />

                <Tooltip title="Alejar" placement="bottom">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => setZoom(z => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
                            disabled={zoom <= ZOOM_MIN}
                            sx={{ color: '#888', '&:not(:disabled):hover': { color: '#fff' } }}
                        >
                            <i className="tabler-zoom-out" style={{ fontSize: '1rem' }} />
                        </IconButton>
                    </span>
                </Tooltip>
                <Typography onClick={() => setZoom(1)} sx={{ color: '#ccc', fontSize: '0.78rem', minWidth: 42, textAlign: 'center', cursor: 'pointer' }} title="Restablecer zoom">
                    {Math.round(zoom * 100)}%
                </Typography>
                <Tooltip title="Acercar" placement="bottom">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => setZoom(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
                            disabled={zoom >= ZOOM_MAX}
                            sx={{ color: '#888', '&:not(:disabled):hover': { color: '#fff' } }}
                        >
                            <i className="tabler-zoom-in" style={{ fontSize: '1rem' }} />
                        </IconButton>
                    </span>
                </Tooltip>

                <Box sx={{ width: '1px', height: 20, bgcolor: 'rgba(255,255,255,0.12)', mx: 0.5 }} />

                <Tooltip title={isFullscreen ? 'Salir (Esc)' : 'Pantalla completa'} placement="bottom">
                    <IconButton size="small" onClick={toggleFullscreen} sx={{ color: '#888', '&:hover': { color: '#fff' } }}>
                        <i className={isFullscreen ? 'tabler-arrows-minimize' : 'tabler-arrows-maximize'} style={{ fontSize: '1.05rem' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Abrir en pestaña nueva" placement="bottom">
                    <IconButton size="small" component="a" href={url} target="_blank" rel="noopener noreferrer" sx={{ color: '#888', '&:hover': { color: '#fff' } }}>
                        <i className="tabler-external-link" style={{ fontSize: '0.95rem' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Descargar" placement="bottom">
                    <span>
                        <IconButton size="small" onClick={handleDownload} disabled={!pdfData} sx={{ color: '#888', '&:not(:disabled):hover': { color: '#fff' } }}>
                            <i className="tabler-download" style={{ fontSize: '1rem' }} />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            {/* Document area */}
            <Box ref={wrapperRef} sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, minHeight: 0 }}>
                {loading && <CircularProgress sx={{ color: '#fff', my: 4 }} />}
                {pdfData && (
                    <Document
                        file={pdfData}
                        onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                        loading={<CircularProgress sx={{ color: '#fff', my: 4 }} />}
                    >
                        {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => (
                            <Box
                                key={pageNum}
                                data-page={pageNum}
                                ref={(el: HTMLDivElement | null) => { pageRefs.current[pageNum] = el }}
                                sx={{ mb: 2, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', flexShrink: 0 }}
                            >
                                <Page pageNumber={pageNum} width={pageWidth} renderTextLayer renderAnnotationLayer={false} />
                            </Box>
                        ))}
                    </Document>
                )}
            </Box>
        </Box>
    )
}

export default PdfViewer
