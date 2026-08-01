'use client'

import { useDraggable } from '@dnd-kit/core'
import { Box } from '@mui/material'

import { CATALOGO_CAMPOS } from '../entity/catalogoCampos'
import type { CampoPlantillaPersonalizada, CampoVarianteTablaModulos } from '../entity/PlantillaCertificado'

const PAGE_W_MM = 297
const PT_TO_MM = 25.4 / 72

// Debe coincidir con DEFAULT_MAX_WIDTH_PCT en el generador de PDF
// (api/_shared/certificados/generators/personalizado.ts) para que la vista
// previa sea fiel al resultado descargado.
const DEFAULT_MAX_WIDTH_PCT = 92

// Los valores custom (montserrat, playfair, poppins, nunito, dancingscript) se
// cargan vía @font-face en certificadoFonts.css con estos mismos nombres de
// familia, y se registran con las mismas claves en el generador de PDF
// (fontRegistry.ts) para que la vista previa coincida con el PDF descargado.
const FONT_FAMILY_CSS: Record<string, string> = {
  helvetica: 'Helvetica, Arial, sans-serif',
  times: '"Times New Roman", Times, serif',
  courier: '"Courier New", Courier, monospace',
  montserrat: 'montserrat, Arial, sans-serif',
  playfair: 'playfair, Georgia, serif',
  poppins: 'poppins, Arial, sans-serif',
  nunito: 'nunito, Arial, sans-serif',
  dancingscript: 'dancingscript, cursive'
}

/** Convierte un tamaño de fuente en pt (igual a como lo usa jsPDF) a `cqw`
 *  (1cqw = 1% del ancho del contenedor lienzo), para que el tamaño mostrado
 *  en el editor sea proporcional al tamaño real que tendrá en el PDF. */
function fontSizeToCqw(fontSizePt: number): number {
  const sizeMm = fontSizePt * PT_TO_MM

  return (sizeMm / PAGE_W_MM) * 100
}

export function labelDeCampo(campo: CampoPlantillaPersonalizada): string {
  if (campo.tipo === 'texto_libre') return campo.texto?.trim() || 'Texto libre'
  if (campo.tipo === 'tabla_modulos') return 'Contenido del curso (módulos)'
  const item = CATALOGO_CAMPOS.find(c => c.key === campo.key)

  return item?.label || campo.key || 'Campo'
}

/** Patrón visual de código QR (no es un QR real/escaneable, solo referencia visual). */
function QrPlaceholder({ color = '#000000' }: { color?: string }) {
  const modules = [
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 1, 0, 1, 1],
    [0, 1, 0, 0, 1, 0, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [0, 0, 1, 0, 1, 0, 0],
    [1, 0, 1, 0, 1, 0, 1]
  ]

  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`} transform={`translate(${x}, ${y})`}>
      <rect width={18} height={18} fill={color} />
      <rect x={2.5} y={2.5} width={13} height={13} fill='#fff' />
      <rect x={5} y={5} width={8} height={8} fill={color} />
    </g>
  )

  return (
    <svg viewBox='0 0 100 100' width='100%' height='100%' style={{ display: 'block' }}>
      <rect width={100} height={100} fill='#fff' />
      {modules.map((row, ry) =>
        row.map((cell, rx) =>
          cell ? <rect key={`${rx}-${ry}`} x={36 + rx * 8} y={36 + ry * 8} width={8} height={8} fill={color} /> : null
        )
      )}
      {finder(4, 4)}
      {finder(78, 4)}
      {finder(4, 78)}
    </svg>
  )
}

function ImagePlaceholder() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <i className='tabler-photo' style={{ fontSize: '60%', opacity: 0.55, filter: 'drop-shadow(0 0 2px #fff)' }} />
    </Box>
  )
}

const PREVIEW_ACCENT = '#1976d2'
const PREVIEW_ACCENT_BG = 'rgba(25,118,210,0.07)'
const PREVIEW_ACCENT_BORDER = 'rgba(25,118,210,0.35)'

/** Círculo numerado usado por los estilos 'compacta' y 'tarjetas' (aproximación del badge del PDF). */
function NumeroBadge({ n, fontSize }: { n: number; fontSize: string }) {
  return (
    <Box
      sx={{
        width: '1.9em',
        height: '1.9em',
        minWidth: '1.9em',
        borderRadius: '50%',
        bgcolor: PREVIEW_ACCENT,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 700,
        flexShrink: 0,
        lineHeight: 1
      }}
    >
      {n}
    </Box>
  )
}

/** Pastilla de color usada para el promedio en 'compacta', 'tarjetas' y 'tabla'. */
function PromedioPill({ texto, fontSize }: { texto: string; fontSize: string }) {
  return (
    <Box
      component='span'
      sx={{
        display: 'inline-block',
        bgcolor: PREVIEW_ACCENT,
        color: '#fff',
        borderRadius: 999,
        px: 0.9,
        py: 0.2,
        fontSize,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        lineHeight: 1.5
      }}
    >
      {texto}
    </Box>
  )
}

/**
 * Aproximación visual (no exacta) de cada estilo de diseño disponible para el
 * bloque "Contenido del curso (módulos)". El render real se resuelve en el PDF
 * por `dibujarTablaModulos*` (api/_shared/certificados/generators/personalizado.ts),
 * que además reduce la fuente dinámicamente, usa el color primario del certificado
 * (no disponible aquí) para las insignias y omite el promedio cuando el módulo no
 * tiene exámenes rendidos.
 */
function TablaModulosPreview({ variante, fontSize }: { variante: CampoVarianteTablaModulos; fontSize: number }) {
  const fsTitulo = `${fontSizeToCqw(fontSize + 1)}cqw`
  const fsTexto = `${fontSizeToCqw(fontSize)}cqw`

  const modulosEjemplo = [
    {
      n: 1,
      titulo: 'MÓDULO DE EJEMPLO',
      promedio: '18.00/20',
      lecciones: '1.1 Lección de ejemplo · 1.2 Lección de ejemplo',
      leccionesArr: ['1.1 Lección de ejemplo', '1.2 Lección de ejemplo']
    },
    {
      n: 2,
      titulo: 'SEGUNDO MÓDULO',
      promedio: null as string | null,
      lecciones: '2.1 Lección de ejemplo',
      leccionesArr: ['2.1 Lección de ejemplo']
    }
  ]

  if (variante === 'compacta') {
    return (
      <>
        {modulosEjemplo.map((m, i) => (
          <Box
            key={m.n}
            sx={{
              pb: 0.6,
              mb: 0.6,
              borderBottom: i < modulosEjemplo.length - 1 ? '1px solid rgba(0,0,0,0.12)' : 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <NumeroBadge n={m.n} fontSize={fsTexto} />
              <Box sx={{ flex: 1, fontSize: fsTitulo, fontWeight: 700 }}>{m.titulo}</Box>
              {m.promedio && <PromedioPill texto={m.promedio} fontSize={fsTexto} />}
            </Box>
            {m.leccionesArr.map(leccion => (
              <Box key={leccion} sx={{ fontSize: fsTexto, opacity: 0.75, pl: 'calc(1.9em + 0.6em)', mt: 0.2 }}>
                {leccion}
              </Box>
            ))}
          </Box>
        ))}
      </>
    )
  }

  if (variante === 'tarjetas') {
    return (
      <>
        {modulosEjemplo.map(m => (
          <Box
            key={m.n}
            sx={{
              position: 'relative',
              mb: 1,
              borderRadius: 1.5,
              bgcolor: PREVIEW_ACCENT_BG,
              border: '1px solid',
              borderColor: PREVIEW_ACCENT_BORDER,
              boxShadow: '0 2px 5px rgba(0,0,0,0.18)',
              p: 0.9,
              pr: m.promedio ? 5.5 : 0.9
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <NumeroBadge n={m.n} fontSize={fsTexto} />
              <Box sx={{ fontSize: fsTitulo, fontWeight: 700 }}>{m.titulo}</Box>
            </Box>
            <Box sx={{ fontSize: fsTexto, opacity: 0.75, pl: 'calc(1.9em + 0.6em)', mt: 0.3 }}>{m.lecciones}</Box>
            {m.promedio && (
              <Box sx={{ position: 'absolute', top: 6, right: 6 }}>
                <PromedioPill texto={m.promedio} fontSize={fsTexto} />
              </Box>
            )}
          </Box>
        ))}
      </>
    )
  }

  if (variante === 'tabla') {
    const cols = '2fr 3fr 1fr'

    return (
      <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: PREVIEW_ACCENT_BORDER }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 0.5,
            fontSize: fsTexto,
            fontWeight: 700,
            color: '#fff',
            bgcolor: PREVIEW_ACCENT,
            px: 0.7,
            py: 0.4
          }}
        >
          <span>MÓDULO</span>
          <span>LECCIONES</span>
          <span style={{ textAlign: 'right' }}>PROM.</span>
        </Box>
        {modulosEjemplo.map((m, i) => (
          <Box
            key={m.n}
            sx={{
              display: 'grid',
              gridTemplateColumns: cols,
              gap: 0.5,
              alignItems: 'center',
              fontSize: fsTexto,
              px: 0.7,
              py: 0.35,
              bgcolor: i % 2 === 1 ? PREVIEW_ACCENT_BG : 'transparent'
            }}
          >
            <span>
              {m.n}. {m.titulo}
            </span>
            <span style={{ opacity: 0.8 }}>{m.lecciones}</span>
            <Box sx={{ textAlign: 'right' }}>{m.promedio && <PromedioPill texto={m.promedio} fontSize={fsTexto} />}</Box>
          </Box>
        ))}
      </Box>
    )
  }

  // 'lista' (por defecto)
  return (
    <>
      <Box sx={{ fontSize: fsTitulo, fontWeight: 700, mb: 0.5 }}>1. MÓDULO DE EJEMPLO</Box>
      <Box sx={{ fontSize: fsTexto, pl: 1 }}>1.1 Lección de ejemplo</Box>
      <Box sx={{ fontSize: fsTexto, pl: 1, mb: 0.5 }}>1.2 Lección de ejemplo</Box>
      <Box sx={{ fontSize: fsTexto, pl: 1, fontStyle: 'italic', opacity: 0.7 }}>Promedio: 18.00/20</Box>
    </>
  )
}

interface Props {
  campo: CampoPlantillaPersonalizada
  selected: boolean
  onSelect: () => void
}

export default function CampoChip({ campo, selected, onSelect }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: campo.id })

  const dragTransform = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : ''
  const esTexto = campo.tipo === 'texto' || campo.tipo === 'texto_libre'

  // Bloque de módulos: se ancla por su esquina superior izquierda y ocupa un
  // rectángulo (a diferencia del resto, que se ancla por un punto). El contenido
  // mostrado aquí es solo una aproximación visual: el PDF real reduce la fuente
  // dinámicamente según la cantidad de módulos/lecciones del curso.
  if (campo.tipo === 'tabla_modulos') {
    const fontSize = campo.fontSize ?? 10
    const color = campo.color ?? '#000000'
    const variante = campo.variante ?? 'lista'

    return (
      <Box
        ref={setNodeRef}
        onClick={onSelect}
        {...listeners}
        {...attributes}
        sx={{
          position: 'absolute',
          left: `${campo.xPct}%`,
          top: `${campo.yPct}%`,
          width: `${campo.widthPct ?? 90}%`,
          height: `${campo.heightPct ?? 90}%`,
          transform: dragTransform || undefined,
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
          overflow: 'hidden',
          p: 1,
          fontFamily: FONT_FAMILY_CSS[campo.fontFamily ?? 'helvetica'],
          color,
          outline: selected ? '2px solid' : '1px dashed',
          outlineColor: selected ? 'primary.main' : 'rgba(0,0,0,0.35)',
          outlineOffset: 2,
          bgcolor: selected ? 'rgba(25,118,210,0.08)' : 'transparent',
          zIndex: isDragging ? 30 : selected ? 20 : 10
        }}
      >
        <TablaModulosPreview variante={variante} fontSize={fontSize} />
      </Box>
    )
  }

  // jsPDF interpreta xPct/yPct como el punto de anclaje según `align` (izquierda/centro/derecha),
  // así que el chip debe desplazarse visualmente para coincidir con ese anclaje.
  const anchorOffset = esTexto
    ? campo.align === 'center'
      ? 'translate(-50%, 0)'
      : campo.align === 'right'
        ? 'translate(-100%, 0)'
        : 'translate(0, 0)'
    : ''

  if (esTexto) {
    const maxWidthPct = campo.maxWidthPct ?? DEFAULT_MAX_WIDTH_PCT

    return (
      <Box
        ref={setNodeRef}
        onClick={onSelect}
        {...listeners}
        {...attributes}
        sx={{
          position: 'absolute',
          left: `${campo.xPct}%`,
          top: `${campo.yPct}%`,
          transform: [anchorOffset, dragTransform].filter(Boolean).join(' '),
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
          px: 0.5,
          width: `${maxWidthPct}%`,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          textAlign: campo.align ?? 'center',
          fontFamily: FONT_FAMILY_CSS[campo.fontFamily ?? 'helvetica'],
          fontSize: `${fontSizeToCqw(campo.fontSize ?? 14)}cqw`,
          fontWeight: campo.bold ? 700 : 400,
          fontStyle: campo.italic ? 'italic' : 'normal',
          color: campo.color ?? '#000000',
          lineHeight: 1.15,
          outline: selected ? '2px solid' : '1px dashed',
          outlineColor: selected ? 'primary.main' : 'rgba(0,0,0,0.35)',
          outlineOffset: 2,
          bgcolor: selected ? 'rgba(25,118,210,0.08)' : 'transparent',
          zIndex: isDragging ? 30 : selected ? 20 : 10
        }}
      >
        {labelDeCampo(campo)}
      </Box>
    )
  }

  const sizePct = campo.widthPct ?? 15

  // Las imágenes siempre se centran horizontalmente sobre su punto de posición;
  // verticalmente se anclan según vAlign (arriba/al medio/abajo).
  const vAlign = campo.vAlign ?? 'top'
  const imgAnchorOffset = `translate(-50%, ${vAlign === 'middle' ? '-50%' : vAlign === 'bottom' ? '-100%' : '0'})`

  return (
    <Box
      ref={setNodeRef}
      onClick={onSelect}
      {...listeners}
      {...attributes}
      sx={{
        position: 'absolute',
        left: `${campo.xPct}%`,
        top: `${campo.yPct}%`,
        width: `${sizePct}%`,
        aspectRatio: '1',
        transform: [imgAnchorOffset, dragTransform].filter(Boolean).join(' '),
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        overflow: 'hidden',
        borderRadius: 0.5,
        border: selected ? '2px solid' : '1.5px dashed',
        borderColor: selected ? 'primary.main' : 'rgba(0,0,0,0.35)',
        boxShadow: 2,
        zIndex: isDragging ? 30 : selected ? 20 : 10
      }}
      title={labelDeCampo(campo)}
    >
      {campo.tipo === 'qr' || campo.key === 'qr' ? <QrPlaceholder color={campo.color} /> : <ImagePlaceholder />}
    </Box>
  )
}
