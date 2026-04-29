'use client'

import { Box, Typography, Stack, Chip } from '@mui/material'

interface Resource {
    id: string
    nombre: string
    url: string
    tipo?: 'enlace' | 'archivo'
}

interface LessonContentProps {
    id: string
    titulo: string
    descripcion?: string
    recursos?: Resource[]
}

// ── Helpers ──────────────────────────────────────────────────────

function isLink(r: Resource) {
    if (r.tipo === 'enlace') return true
    if (r.tipo === 'archivo') return false
    return r.url.startsWith('http://') || r.url.startsWith('https://')
}

type ServiceInfo = { name: string; icon: string; color: string; bg: string }

function detectService(url: string): ServiceInfo {
    if (/youtube\.com|youtu\.be/.test(url)) return { name: 'YouTube', icon: 'tabler-brand-youtube', color: '#ff0000', bg: '#fff1f1' }
    if (/drive\.google\.com/.test(url))      return { name: 'Google Drive', icon: 'tabler-brand-google-drive', color: '#34a853', bg: '#f0fdf4' }
    if (/docs\.google\.com/.test(url))       return { name: 'Google Docs', icon: 'tabler-file-text', color: '#4285f4', bg: '#eff6ff' }
    if (/vimeo\.com/.test(url))              return { name: 'Vimeo', icon: 'tabler-brand-vimeo', color: '#1ab7ea', bg: '#f0faff' }
    if (/dropbox\.com/.test(url))            return { name: 'Dropbox', icon: 'tabler-brand-dropbox', color: '#0061ff', bg: '#eff6ff' }
    if (/onedrive|sharepoint/.test(url))     return { name: 'OneDrive', icon: 'tabler-brand-onedrive', color: '#0078d4', bg: '#eff6ff' }
    if (/zoom\.us/.test(url))               return { name: 'Zoom', icon: 'tabler-video', color: '#2d8cff', bg: '#eff6ff' }
    if (/meet\.google\.com/.test(url))      return { name: 'Google Meet', icon: 'tabler-video', color: '#00832d', bg: '#f0fdf4' }
    if (/figma\.com/.test(url))             return { name: 'Figma', icon: 'tabler-brand-figma', color: '#f24e1e', bg: '#fff7f5' }
    if (/github\.com/.test(url))            return { name: 'GitHub', icon: 'tabler-brand-github', color: '#24292f', bg: '#f6f8fa' }
    return { name: 'Enlace externo', icon: 'tabler-link', color: '#6366f1', bg: '#f5f3ff' }
}

type FileInfo = { ext: string; icon: string; color: string; bg: string; label: string }

function detectFile(url: string, nombre: string): FileInfo {
    const ext = (url.split('.').pop() || nombre.split('.').pop() || '').toLowerCase()
    const map: Record<string, Omit<FileInfo, 'ext'>> = {
        pdf:  { icon: 'tabler-file-type-pdf',  color: '#dc2626', bg: '#fef2f2', label: 'PDF' },
        doc:  { icon: 'tabler-file-type-doc',  color: '#2563eb', bg: '#eff6ff', label: 'Word' },
        docx: { icon: 'tabler-file-type-docx', color: '#2563eb', bg: '#eff6ff', label: 'Word' },
        xls:  { icon: 'tabler-file-type-xls',  color: '#16a34a', bg: '#f0fdf4', label: 'Excel' },
        xlsx: { icon: 'tabler-file-type-xlsx', color: '#16a34a', bg: '#f0fdf4', label: 'Excel' },
        ppt:  { icon: 'tabler-file-type-ppt',  color: '#ea580c', bg: '#fff7ed', label: 'PowerPoint' },
        pptx: { icon: 'tabler-file-type-ppt',  color: '#ea580c', bg: '#fff7ed', label: 'PowerPoint' },
        jpg:  { icon: 'tabler-photo',           color: '#9333ea', bg: '#faf5ff', label: 'Imagen' },
        jpeg: { icon: 'tabler-photo',           color: '#9333ea', bg: '#faf5ff', label: 'Imagen' },
        png:  { icon: 'tabler-photo',           color: '#9333ea', bg: '#faf5ff', label: 'Imagen' },
        gif:  { icon: 'tabler-gif',             color: '#9333ea', bg: '#faf5ff', label: 'GIF' },
        webp: { icon: 'tabler-photo',           color: '#9333ea', bg: '#faf5ff', label: 'Imagen' },
        mp4:  { icon: 'tabler-video',           color: '#0891b2', bg: '#ecfeff', label: 'Video' },
        mp3:  { icon: 'tabler-music',           color: '#db2777', bg: '#fdf2f8', label: 'Audio' },
        zip:  { icon: 'tabler-file-zip',        color: '#d97706', bg: '#fffbeb', label: 'ZIP' },
        rar:  { icon: 'tabler-file-zip',        color: '#d97706', bg: '#fffbeb', label: 'RAR' },
        txt:  { icon: 'tabler-file-text',       color: '#64748b', bg: '#f8fafc', label: 'Texto' },
        csv:  { icon: 'tabler-table',           color: '#16a34a', bg: '#f0fdf4', label: 'CSV' },
    }
    return { ext, ...(map[ext] ?? { icon: 'tabler-file', color: '#64748b', bg: '#f8fafc', label: ext.toUpperCase() || 'Archivo' }) }
}

// ── Sub-components ────────────────────────────────────────────────

function LinkCard({ res }: { res: Resource }) {
    const svc = detectService(res.url)
    return (
        <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider',
                bgcolor: 'background.paper', cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                '&:hover': { borderColor: svc.color, boxShadow: `0 0 0 3px ${svc.color}18` }
            }}>
                {/* Service icon */}
                <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: svc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={svc.icon} style={{ fontSize: '1.4rem', color: svc.color }} />
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {res.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {res.url}
                    </Typography>
                </Box>

                {/* Badge + arrow */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <Chip size="small" label={svc.name} sx={{ bgcolor: svc.bg, color: svc.color, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
                    <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: svc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="tabler-external-link" style={{ fontSize: '1rem', color: svc.color }} />
                    </Box>
                </Box>
            </Box>
        </a>
    )
}

function FileCard({ res }: { res: Resource }) {
    const file = detectFile(res.url, res.nombre)
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:hover': { borderColor: file.color, boxShadow: `0 0 0 3px ${file.color}18` }
        }}>
            {/* File type icon */}
            <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: file.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={file.icon} style={{ fontSize: '1.4rem', color: file.color }} />
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {res.nombre}
                </Typography>
                <Chip size="small" label={file.label} sx={{ mt: 0.25, bgcolor: file.bg, color: file.color, fontWeight: 700, fontSize: '0.65rem', height: 18 }} />
            </Box>

            {/* Download button */}
            <a href={res.url} download target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flexShrink: 0 }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 0.75,
                    px: 1.75, py: 0.875, borderRadius: '10px',
                    bgcolor: file.bg, color: file.color,
                    fontWeight: 700, fontSize: '0.78rem', fontFamily: 'inherit',
                    cursor: 'pointer', border: `1px solid ${file.color}30`,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: `${file.color}22` }
                }}>
                    <i className="tabler-download" style={{ fontSize: '1rem' }} />
                    <span>Descargar</span>
                </Box>
            </a>
        </Box>
    )
}

// ── Main component ────────────────────────────────────────────────

const LessonContent = ({ id, titulo, descripcion, recursos = [] }: LessonContentProps) => {
    const links = recursos.filter(isLink)
    const files = recursos.filter(r => !isLink(r))

    return (
        <Box>
            {titulo && (
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 2 }}>
                    {titulo}
                </Typography>
            )}

            {descripcion && (
                <Box sx={{ mb: 3, p: 3, borderRadius: '12px', border: '1px dashed', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.01)' }}>
                    <Typography
                        variant="body1"
                        sx={{ color: '#334155', lineHeight: 1.75 }}
                        dangerouslySetInnerHTML={{ __html: descripcion }}
                    />
                </Box>
            )}

            {recursos.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Links / Recursos en línea */}
                    {links.length > 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <i className="tabler-link" style={{ fontSize: '1rem', color: '#6366f1' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Enlaces y recursos en línea
                                </Typography>
                            </Box>
                            <Stack spacing={1.25}>
                                {links.map((r, i) => <LinkCard key={r.id || i} res={r} />)}
                            </Stack>
                        </Box>
                    )}

                    {/* Archivos descargables */}
                    {files.length > 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <i className="tabler-paperclip" style={{ fontSize: '1rem', color: '#64748b' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Archivos descargables
                                </Typography>
                            </Box>
                            <Stack spacing={1.25}>
                                {files.map((r, i) => <FileCard key={r.id || i} res={r} />)}
                            </Stack>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    )
}

export default LessonContent
