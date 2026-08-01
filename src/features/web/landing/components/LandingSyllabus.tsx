'use client'

import React, { useState } from 'react'

import { 
  Box, 
  Typography, 
  Container, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider 
} from '@mui/material'

import type { Curso } from '@/features/admin/cursos/entity/Curso'

interface Props {
  curso: Curso
}

export default function LandingSyllabus({ curso }: Props) {
  const [expanded, setExpanded] = useState<string | false>('panel-0')

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const modulos = curso.modulos || []

  if (modulos.length === 0) {
    return null
  }

  return (
    <Box sx={{ bgcolor: '#f9fafb', py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 6, sm: 8, md: 12 } }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900, 
              color: '#0B0F19', 
              mb: 1.5,
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            Temario del Curso
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#4B5563', 
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Conoce la estructura detallada paso a paso de los módulos y lecciones que desarrollarás durante este programa de formación profesional.
          </Typography>
        </Box>

        {/* Syllabus Accordions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 850, mx: 'auto' }}>
          {modulos.map((modulo, idx) => {
            const panelId = `panel-${idx}`
            const lecciones = modulo.lecciones || []
            const publicLecciones = lecciones.filter(l => (l as any).estado !== 'BORRADOR')

            return (
              <Accordion 
                key={modulo.id} 
                expanded={expanded === panelId} 
                onChange={handleChange(panelId)}
                elevation={0}
                sx={{ 
                  borderRadius: '16px !important', 
                  border: '1px solid #e5e7eb',
                  bgcolor: '#ffffff',
                  boxShadow: expanded === panelId ? '0 10px 30px rgba(11, 15, 25, 0.04)' : 'none',
                  transition: 'all 0.3s ease',
                  '&:before': { display: 'none' } 
                }}
              >
                <AccordionSummary 
                  expandIcon={<i className="tabler-chevron-down text-xl" style={{ color: '#025E44' }} />} 
                  sx={{ 
                    px: { xs: 2.5, md: 4 }, 
                    py: 1.5,
                    borderRadius: '16px'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '10px', 
                        bgcolor: expanded === panelId ? '#025E44' : 'rgba(2, 94, 68, 0.08)', 
                        color: expanded === panelId ? '#ffffff' : '#025E44', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 800, 
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: { xs: '1rem', md: '1.15rem' },
                        color: '#0B0F19',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      {modulo.titulo}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, borderTop: '1px solid #f3f4f6' }}>
                  {publicLecciones.length > 0 ? (
                    <List disablePadding>
                      {publicLecciones.map((leccion, lIdx) => (
                        <React.Fragment key={leccion.id}>
                          {lIdx > 0 && <Divider sx={{ borderColor: '#f3f4f6' }} />}
                          <ListItem sx={{ py: 2, px: { xs: 3, md: 5 } }}>
                            <ListItemIcon sx={{ minWidth: 32, color: '#9ca3af' }}>
                              <i className="tabler-player-play-filled text-sm" />
                            </ListItemIcon>
                            <ListItemText
                              primary={leccion.titulo}
                              primaryTypographyProps={{ 
                                fontSize: '0.95rem', 
                                color: '#374151',
                                fontWeight: 500,
                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                              }}
                            />
                            {leccion.duracion && (
                              <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>
                                {leccion.duracion} min
                              </Typography>
                            )}
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ py: 3, px: 4, textAlign: 'center' }}>
                      <Typography sx={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.9rem' }}>
                        No hay lecciones registradas en este módulo aún.
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}
