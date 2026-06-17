'use client'

import React, { useState } from 'react'

import {
  Box,
  TextField,
  Typography,
  Stack,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material'

interface FormacionItem {
  institucion: string
  titulo: string
  anio?: string
}

interface ProfesorBioData {
  titulo: string              // "Especialista en gestión y cumplimiento..."
  descripcion: string         // Nueva descripción profesional
  especificaciones: string    // Formación Académica (antes especificaciones técnicas)
  formacion_complementaria: FormacionItem[]
}

/**
 * Parsea el HTML guardado en `biografia` a un objeto estructurado.
 * Si el campo no tiene el formato esperado, devuelve valores vacíos.
 */
function parseBiografiaHtml(html: string | null | undefined): ProfesorBioData {
  if (!html) {
    return { titulo: '', descripcion: '', especificaciones: '', formacion_complementaria: [] }
  }

  // Intentar parsear como JSON (formato nuevo)
  try {
    const data = JSON.parse(html)

    if (data.__tipo === 'profesor_bio_v1') return {
      ...data,
      descripcion: data.descripcion || '',
      especificaciones: data.especificaciones || '',
      titulo: data.titulo || ''
    }
  } catch {}

  // Si ya es HTML legacy (campo libre), lo ponemos como especificaciones (ahora formación académica)
  return {
    titulo: '',
    descripcion: '',
    especificaciones: html.replace(/<[^>]*>/g, '').trim(),
    formacion_complementaria: []
  }
}

/**
 * Serializa el objeto estructurado a HTML legible para la página pública.
 * También embebe el JSON para poder hacer round-trip al editar.
 */
function bioDataToHtml(data: ProfesorBioData): string {
  const rows = data.formacion_complementaria
    .filter(f => f.titulo.trim())
    .map(f => `<li>${f.titulo}${f.institucion ? ` | ${f.institucion}` : ''}${f.anio ? ` | ${f.anio}` : ''}</li>`)
    .join('\n')

  const fcBlock = rows
    ? `<h2>FORMACIÓN COMPLEMENTARIA</h2><ul>\n${rows}\n</ul>`
    : ''

  const htmlContent = [
    data.titulo ? `<p><strong>${data.titulo}</strong></p>` : '',
    data.descripcion ? `<h2>DESCRIPCIÓN PROFESIONAL</h2><p>${data.descripcion.replace(/\n/g, '<br/>')}</p>` : '',
    data.especificaciones ? `<h2>FORMACIÓN ACADÉMICA</h2><p>${data.especificaciones.replace(/\n/g, '<br/>')}</p>` : '',
    fcBlock
  ].filter(Boolean).join('\n')

  // Embebemos el JSON dentro de un comentario para poder recuperarlo al editar
  const jsonTag = `<!--PROFESOR_BIO_JSON:${JSON.stringify({ ...data, __tipo: 'profesor_bio_v1' })}-->`

  return htmlContent + '\n' + jsonTag
}

interface Props {
  value: string | null | undefined
  onChange: (html: string) => void
  rol: string
}

export default function ProfesorBioEditor({ value, onChange, rol }: Props) {
  const [data, setData] = useState<ProfesorBioData>(() => {
    // Intentar extraer el JSON del comentario embebido
    if (value) {
      const match = value.match(/<!--PROFESOR_BIO_JSON:(.*?)-->/)

      if (match) {
        try {
          const parsed = JSON.parse(match[1])

          return {
            titulo: parsed.titulo || '',
            descripcion: parsed.descripcion || '',
            especificaciones: parsed.especificaciones || '',
            formacion_complementaria: parsed.formacion_complementaria || []
          }
        } catch {}
      }
    }

    return parseBiografiaHtml(value)
  })

  const update = (partial: Partial<ProfesorBioData>) => {
    const next = { ...data, ...partial }

    setData(next)
    onChange(bioDataToHtml(next))
  }

  const addFC = () => {
    update({
      formacion_complementaria: [
        ...data.formacion_complementaria,
        { titulo: '', institucion: '', anio: '' }
      ]
    })
  }

  const updateFC = (index: number, partial: Partial<FormacionItem>) => {
    const list = [...data.formacion_complementaria]

    list[index] = { ...list[index], ...partial }
    update({ formacion_complementaria: list })
  }

  const removeFC = (index: number) => {
    const list = data.formacion_complementaria.filter((_, i) => i !== index)

    update({ formacion_complementaria: list })
  }

  // Solo mostrar para PROFESOR y ADMIN
  if (rol !== 'PROFESOR' && rol !== 'ADMIN') return null

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <i className="tabler-id-badge-2" style={{ fontSize: '1.2rem', color: 'var(--mui-palette-primary-main)' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Perfil Profesional (visible en tu página de docente)
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Esta información se mostrará públicamente en tu perfil de docente.
      </Typography>

      {/* Título / Especialización */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Título / Especialización
          </Typography>
        </Stack>
        <TextField
          fullWidth
          placeholder="Ej: Especialista en marketing digital y growth con foco en Meta Ads y TikTok Ads"
          value={data.titulo}
          onChange={e => update({ titulo: e.target.value })}
          size="small"
          helperText="Aparece como subtítulo debajo de tu nombre."
        />
      </Paper>

      {/* Descripción Profesional */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ width: 6, height: 24, bgcolor: '#3b82f6', borderRadius: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Descripción Profesional
          </Typography>
        </Stack>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Escribe un breve párrafo de introducción sobre ti..."
          value={data.descripcion}
          onChange={e => update({ descripcion: e.target.value })}
          helperText="Breve resumen biográfico."
        />
      </Paper>

      {/* Formación Académica */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ width: 6, height: 24, bgcolor: '#10b981', borderRadius: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Formación Académica
          </Typography>
        </Stack>
        <TextField
          fullWidth
          multiline
          rows={5}
          placeholder="Describe tu trayectoria académica, títulos obtenidos..."
          value={data.especificaciones}
          onChange={e => update({ especificaciones: e.target.value })}
          helperText="Detalles de tu formación académica profesional."
        />
      </Paper>

      {/* Formación Complementaria */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 6, height: 24, bgcolor: '#f59e0b', borderRadius: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Formación Complementaria
            </Typography>
          </Stack>
          <Button
            size="small"
            variant="outlined"
            startIcon={<i className="tabler-plus" />}
            onClick={addFC}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Agregar
          </Button>
        </Stack>

        {data.formacion_complementaria.length === 0 && (
          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
            Aún no tienes cursos o certificaciones. Haz clic en &quot;Agregar&quot; para añadir.
          </Typography>
        )}

        <Stack spacing={2}>
          {data.formacion_complementaria.map((item, idx) => (
            <Box key={idx}>
              {idx > 0 && <Divider sx={{ mb: 2 }} />}
              <Stack direction="row" alignItems="flex-start" spacing={1}>
                <Box sx={{ flex: 1 }}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Nombre del curso / certificación *"
                      placeholder="Ej: Auditor Líder IRCA ISO 14001:2015"
                      value={item.titulo}
                      onChange={e => updateFC(idx, { titulo: e.target.value })}
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Institución"
                        placeholder="Ej: Bureau Veritas del Perú"
                        value={item.institucion}
                        onChange={e => updateFC(idx, { institucion: e.target.value })}
                      />
                      <TextField
                        size="small"
                        label="Año"
                        placeholder="2022"
                        value={item.anio}
                        onChange={e => updateFC(idx, { anio: e.target.value })}
                        sx={{ minWidth: 100 }}
                      />
                    </Stack>
                  </Stack>
                </Box>
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeFC(idx)}
                    sx={{ mt: 0.5 }}
                  >
                    <i className="tabler-trash" style={{ fontSize: '1rem' }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}
