'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'

import { useSearchParams, usePathname } from 'next/navigation'

import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Chip,
  Fade,
  IconButton,
  Tooltip,
  Divider,
  Badge,
  Fab,
} from '@mui/material'

import CourseList from './CourseList'
import { CatalogFilterSelect } from './CatalogFilterSelect'
import { useCart } from '../../cart/context/CartContext'
import type { TipoPrograma } from '@/utils/configs/tipoPrograma'
import { getTipoProgramaConfig } from '@/utils/configs/tipoPrograma'
import {
  getCategoriaFilterIds,
  getCategoriaSlugFromSelection,
  resolveCategoriaSelectionBySlug,
} from '@/features/admin/categorias/utils/categoriaJerarquia'

interface CategoryNode {
  id: string
  nombre: string
  slug: string
  hijos?: CategoryNode[]
}

interface CourseCatalogProps {
  courses: any[]
  categories: CategoryNode[]
  tipo?: TipoPrograma
}

const CourseCatalog = ({ courses, categories, tipo = 'CURSO' }: CourseCatalogProps) => {
  const config = getTipoProgramaConfig(tipo)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaPadreId, setCategoriaPadreId] = useState('')
  const [subcategoriaId, setSubcategoriaId] = useState('')
  const [subSubcategoriaId, setSubSubcategoriaId] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [selectedModality, setSelectedModality] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const { itemCount, setIsCartDrawerOpen } = useCart()

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const didInitFromUrl = useRef(false)
  const skipUrlSync = useRef(true)
  const initialSlugRef = useRef(searchParams.get('categoria'))

  const syncCategoriaUrl = useCallback(
    (padreId: string, subId: string, subSubId: string) => {
      if (typeof window === 'undefined') return

      const slug = getCategoriaSlugFromSelection(categories, { padreId, subId, subSubId })
      const params = new URLSearchParams(window.location.search)

      if (slug) {
        params.set('categoria', slug)
      } else {
        params.delete('categoria')
      }

      const query = params.toString()
      const nextUrl = query ? `${pathname}?${query}` : pathname

      window.history.replaceState(window.history.state, '', nextUrl)
    },
    [categories, pathname]
  )

  useEffect(() => {
    if (didInitFromUrl.current || categories.length === 0) return

    didInitFromUrl.current = true
    const selection = resolveCategoriaSelectionBySlug(initialSlugRef.current, categories)

    setCategoriaPadreId(selection.padreId)
    setSubcategoriaId(selection.subId)
    setSubSubcategoriaId(selection.subSubId)
  }, [categories])

  useEffect(() => {
    if (!didInitFromUrl.current) return

    if (skipUrlSync.current) {
      skipUrlSync.current = false
      
return
    }

    syncCategoriaUrl(categoriaPadreId, subcategoriaId, subSubcategoriaId)
  }, [categoriaPadreId, subcategoriaId, subSubcategoriaId, syncCategoriaUrl])

  useEffect(() => {
    const onPopState = () => {
      skipUrlSync.current = true
      const slug = new URLSearchParams(window.location.search).get('categoria')
      const selection = resolveCategoriaSelectionBySlug(slug, categories)

      setCategoriaPadreId(selection.padreId)
      setSubcategoriaId(selection.subId)
      setSubSubcategoriaId(selection.subSubId)
    }

    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [categories])

  const subcategorias = useMemo(() => {
    const padre = categories.find(c => c.id === categoriaPadreId)

    return padre?.hijos ?? []
  }, [categories, categoriaPadreId])

  const subSubcategorias = useMemo(() => {
    const sub = subcategorias.find(s => s.id === subcategoriaId)

    return sub?.hijos ?? []
  }, [subcategorias, subcategoriaId])

  const categoriaOptions = useMemo(
    () => [
      { value: '', label: 'Todas categorías' },
      ...categories.map(cat => ({ value: cat.id, label: cat.nombre })),
    ],
    [categories]
  )

  const subcategoriaOptions = useMemo(() => {
    if (!categoriaPadreId) {
      return [{ value: '', label: 'Selecciona una categoría primero', disabled: true }]
    }

    if (subcategorias.length === 0) {
      return [{ value: '', label: 'Sin subcategorías', disabled: true }]
    }

    return [
      { value: '', label: 'Todas subcategorías' },
      ...subcategorias.map(sub => ({ value: sub.id, label: sub.nombre })),
    ]
  }, [categoriaPadreId, subcategorias])

  const subSubcategoriaOptions = useMemo(() => {
    if (!subcategoriaId) {
      return [{ value: '', label: 'Selecciona una subcategoría primero', disabled: true }]
    }

    if (subSubcategorias.length === 0) {
      return [{ value: '', label: 'Sin sub-subcategorías', disabled: true }]
    }

    return [
      { value: '', label: 'Todas sub-subcategorías' },
      ...subSubcategorias.map(subSub => ({ value: subSub.id, label: subSub.nombre })),
    ]
  }, [subcategoriaId, subSubcategorias])

  const categoriaFilterIds = useMemo(
    () =>
      getCategoriaFilterIds(categories as any, {
        padreId: categoriaPadreId,
        subId: subcategoriaId,
        subSubId: subSubcategoriaId,
      }),
    [categories, categoriaPadreId, subcategoriaId, subSubcategoriaId]
  )

  const handlePadreChange = (padreId: string) => {
    setCategoriaPadreId(padreId)
    setSubcategoriaId('')
    setSubSubcategoriaId('')
  }

  const handleSubChange = (subId: string) => {
    setSubcategoriaId(subId)
    setSubSubcategoriaId('')
  }

  const handleSubSubChange = (subSubId: string) => {
    setSubSubcategoriaId(subSubId)
  }

  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.descripcion && course.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory =
        categoriaFilterIds.length === 0 ||
        (course.categoria?.id && categoriaFilterIds.includes(course.categoria.id))

      const matchesPrice = selectedPrice === 'all' ||
        (selectedPrice === 'free' ? course.es_gratis : !course.es_gratis)

      const matchesModality = selectedModality === 'all' || course.tipo_emision === selectedModality

      return matchesSearch && matchesCategory && matchesPrice && matchesModality
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === 'default') {
        return (a.orden || 0) - (b.orden || 0)
      } else if (sortBy === 'recent') {
        return new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime()
      } else if (sortBy === 'alphabetical') {
        return a.titulo.localeCompare(b.titulo)
      }

      return 0
    })
  }, [courses, searchTerm, categoriaFilterIds, selectedPrice, selectedModality, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedPrice('all')
    setSelectedModality('all')
    setSortBy('default')
    setCategoriaPadreId('')
    setSubcategoriaId('')
    setSubSubcategoriaId('')
  }

  const hasFilters = searchTerm !== '' ||
    categoriaPadreId !== '' ||
    subcategoriaId !== '' ||
    subSubcategoriaId !== '' ||
    selectedPrice !== 'all' ||
    selectedModality !== 'all' ||
    sortBy !== 'default'

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth={false} sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4, md: 8, lg: 12 } }}>
        <Stack spacing={5}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, color: '#1e293b', letterSpacing: '-0.03em' }}>
              {config.catalogSectionTitle}
            </Typography>
            <Typography variant="h6" sx={{ color: '#475569', fontWeight: 500, maxWidth: 600, mx: 'auto' }}>
              {config.catalogSectionSubtitle}
            </Typography>
          </Box>

          <Stack spacing={4} alignItems="center">
            <TextField
              fullWidth
              placeholder={config.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ maxWidth: 800 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="tabler-search" style={{ fontSize: '1.5rem', color: 'var(--mui-palette-primary-main)' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <i className="tabler-x" style={{ fontSize: '1.2rem' }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '24px',
                  bgcolor: 'white',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  '&:hover': { borderColor: 'var(--mui-palette-primary-main)' },
                  '&.Mui-focused': {
                    borderColor: 'var(--mui-palette-primary-main)',
                    boxShadow: '0 0 0 4px rgb(var(--mui-palette-primary-mainChannel) / 0.1)',
                  },
                  transition: 'all 0.3s ease',
                  '& fieldset': { border: 'none' },
                  px: 2,
                  height: 64,
                  fontSize: '1.1rem'
                }
              }}
            />

            <Box sx={{
              position: 'relative',
              width: { xs: '100vw', md: '100%' },
              ml: { xs: 'calc(50% - 50vw)', md: 0 },
              overflow: 'visible',
            }}>
              <Box sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                overflow: 'visible',
                gap: { xs: 2, md: 1.5 },
                justifyContent: { xs: 'flex-start', md: 'center' },
                alignItems: 'center',
                px: { xs: 2, sm: 4, md: 2 },
                py: 2,
                bgcolor: 'white',
                borderRadius: { xs: 0, md: '28px' },
                boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9',
                borderInline: { xs: 'none', md: '1px solid #f1f5f9' },
                scrollPaddingLeft: { xs: '16px', sm: '32px', md: 0 },
                MsOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
              }}>
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  gap: 1.5,
                  flexShrink: 0,
                  alignItems: 'center',
                  borderRight: { xs: 'none', md: '1px solid #e2e8f0' },
                  pr: { xs: 0, md: 1.5 },
                  mr: { xs: 0, md: 0.5 },
                }}>
                  <CatalogFilterSelect
                    value={categoriaPadreId}
                    onChange={handlePadreChange}
                    placeholder="Categoría"
                    active={Boolean(categoriaPadreId)}
                    iconClass="tabler-category"
                    getLabel={(id) => categories.find(c => c.id === id)?.nombre ?? 'Categoría'}
                    options={categoriaOptions}
                  />

                  <CatalogFilterSelect
                    value={subcategoriaId}
                    onChange={handleSubChange}
                    disabled={!categoriaPadreId}
                    placeholder="Subcategoría"
                    active={Boolean(subcategoriaId)}
                    iconClass="tabler-tags"
                    getLabel={(id) => subcategorias.find(s => s.id === id)?.nombre ?? 'Subcategoría'}
                    options={subcategoriaOptions}
                  />

                  <CatalogFilterSelect
                    value={subSubcategoriaId}
                    onChange={handleSubSubChange}
                    disabled={!subcategoriaId}
                    placeholder="Sub-subcategoría"
                    active={Boolean(subSubcategoriaId)}
                    iconClass="tabler-tag"
                    minWidth={175}
                    getLabel={(id) => subSubcategorias.find(s => s.id === id)?.nombre ?? 'Sub-subcategoría'}
                    options={subSubcategoriaOptions}
                  />
                </Box>

                <CatalogFilterSelect
                  value={selectedPrice}
                  onChange={setSelectedPrice}
                  placeholder="Tipo / Precio"
                  active={selectedPrice !== 'all'}
                  iconClass="tabler-coin"
                  minWidth={130}
                  getLabel={(v) => (v === 'free' ? 'Gratuito' : v === 'premium' ? 'Premium' : 'Tipo / Precio')}
                  options={[
                    { value: 'all', label: 'Tipo / Precio' },
                    { value: 'free', label: 'Gratuito' },
                    { value: 'premium', label: 'Premium' },
                  ]}
                />

                <CatalogFilterSelect
                  value={selectedModality}
                  onChange={setSelectedModality}
                  placeholder="Cualquier Modalidad"
                  active={selectedModality !== 'all'}
                  iconClass="tabler-device-laptop"
                  minWidth={160}
                  getLabel={(v) => {
                    if (v === 'ASINCRONO') return 'Asincrónico'
                    if (v === 'SINCRONO') return 'En Vivo'
                    if (v === 'MIXTO') return 'Mixto'
                    
return 'Cualquier Modalidad'
                  }}
                  options={[
                    { value: 'all', label: 'Cualquier Modalidad' },
                    { value: 'ASINCRONO', label: 'Asincrónico' },
                    { value: 'SINCRONO', label: 'En Vivo' },
                    { value: 'MIXTO', label: 'Mixto' },
                  ]}
                />

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: 'none', md: 'block' } }} />

                <CatalogFilterSelect
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Orden Sugerido"
                  active
                  iconClass="tabler-sort-ascending"
                  minWidth={170}
                  variant="sort"
                  getLabel={(v) => {
                    if (v === 'alphabetical') return 'A - Z'
                    if (v === 'recent') return 'Recientes primero'
                    
return 'Orden Sugerido'
                  }}
                  options={[
                    { value: 'default', label: 'Orden Sugerido' },
                    { value: 'recent', label: 'Recientes primero' },
                    { value: 'alphabetical', label: 'A - Z' },
                  ]}
                />

                {hasFilters && (
                  <Tooltip title="Limpiar todos los filtros">
                    <IconButton
                      onClick={clearFilters}
                      sx={{
                        bgcolor: 'error.50',
                        color: 'error.main',
                        '&:hover': { bgcolor: 'error.100' },
                        flexShrink: 0,
                        width: 40,
                        height: 40
                      }}
                    >
                      <i className="tabler-refresh" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Box sx={{
                display: { xs: 'block', md: 'none' },
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: 48,
                background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 90%)',
                pointerEvents: 'none',
                zIndex: 2
              }} />
            </Box>
          </Stack>

          <Fade in timeout={1000}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 3, px: 1 }}>
                <Chip
                  label={`${filteredAndSortedCourses.length} capacitaciones disponibles`}
                  size="small"
                  sx={{ bgcolor: 'white', fontWeight: 700, color: 'text.secondary', border: '1px solid #e2e8f0', px: 1 }}
                />
              </Stack>
              <CourseList courses={filteredAndSortedCourses} emptySearchMessage={config.catalogEmptySearch} />
            </Box>
          </Fade>
        </Stack>
      </Container>

      <Fab
        color="primary"
        aria-label="cart"
        onClick={() => setIsCartDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          boxShadow: '0 8px 32px rgba(var(--mui-palette-primary-mainChannel) / 0.4)',
          height: 70,
          width: 70,
          '&:hover': { transform: 'scale(1.1)' },
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <Badge badgeContent={itemCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.9rem', height: 24, minWidth: 24, borderRadius: 12, fontWeight: 800 } }}>
          <i className="tabler-shopping-cart" style={{ fontSize: '2rem' }} />
        </Badge>
      </Fab>
    </Box>
  )
}

export default CourseCatalog
