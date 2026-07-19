'use client'

import { useDraggable } from '@dnd-kit/core'
import { Box } from '@mui/material'

import { CATALOGO_CAMPOS } from '../entity/catalogoCampos'
import type { CampoPlantillaPersonalizada } from '../entity/PlantillaCertificado'

const PAGE_W_MM = 297
const PT_TO_MM = 25.4 / 72

/** Convierte un tamaño de fuente en pt (igual a como lo usa jsPDF) a `cqw`
 *  (1cqw = 1% del ancho del contenedor lienzo), para que el tamaño mostrado
 *  en el editor sea proporcional al tamaño real que tendrá en el PDF. */
function fontSizeToCqw(fontSizePt: number): number {
  const sizeMm = fontSizePt * PT_TO_MM

  return (sizeMm / PAGE_W_MM) * 100
}

export function labelDeCampo(campo: CampoPlantillaPersonalizada): string {
  if (campo.tipo === 'texto_libre') return campo.texto?.trim() || 'Texto libre'
  const item = CATALOGO_CAMPOS.find(c => c.key === campo.key)

  return item?.label || campo.key || 'Campo'
}

/** Patrón visual de código QR (no es un QR real/escaneable, solo referencia visual). */
function QrPlaceholder() {
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
      <rect width={18} height={18} fill='#000' />
      <rect x={2.5} y={2.5} width={13} height={13} fill='#fff' />
      <rect x={5} y={5} width={8} height={8} fill='#000' />
    </g>
  )

  return (
    <svg viewBox='0 0 100 100' width='100%' height='100%' style={{ display: 'block' }}>
      <rect width={100} height={100} fill='#fff' />
      {modules.map((row, ry) =>
        row.map((cell, rx) =>
          cell ? <rect key={`${rx}-${ry}`} x={36 + rx * 8} y={36 + ry * 8} width={8} height={8} fill='#000' /> : null
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

interface Props {
  campo: CampoPlantillaPersonalizada
  selected: boolean
  onSelect: () => void
}

export default function CampoChip({ campo, selected, onSelect }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: campo.id })

  const dragTransform = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : ''
  const esTexto = campo.tipo === 'texto' || campo.tipo === 'texto_libre'

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
          whiteSpace: 'nowrap',
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
      {campo.tipo === 'qr' || campo.key === 'qr' ? <QrPlaceholder /> : <ImagePlaceholder />}
    </Box>
  )
}
