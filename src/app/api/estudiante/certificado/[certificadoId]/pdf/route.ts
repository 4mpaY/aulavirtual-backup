export const dynamic = 'force-dynamic'

import { readFile } from 'fs/promises'
import { join } from 'path'

import { NextResponse } from 'next/server'

import * as QRCode from 'qrcode'
import sharp from 'sharp'

import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { getConfigs } from '@/utils/libs/config'

/** Convierte un color hex (#RRGGBB) a rgb [r, g, b] */
function hexToRgb(hex: string): [number, number, number] {
  try {
    const clean = hex.replace('#', '')
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)

    return [isNaN(r) ? 30 : r, isNaN(g) ? 120 : g, isNaN(b) ? 70 : b]
  } catch {
    return [30, 120, 70]
  }
}

/** Intenta cargar una imagen (local o remota) y devuelve Buffer */
async function fetchImageBuffer(url: string | null): Promise<Buffer | null> {
  try {
    if (!url) return null

    if (url.startsWith('/')) {
      const cleanUrl = url.replace(/\/+/g, '/')
      const filePath = join(process.cwd(), 'public', cleanUrl)

      return await readFile(filePath)
    }

    const response = await fetch(url)

    if (!response.ok) return null

    return Buffer.from(await response.arrayBuffer())
  } catch {
    return null
  }
}

/**
 * GET /api/estudiante/certificado/[certificadoId]/pdf
 * Genera y descarga el PDF del certificado (Estudiante)
 */
export async function GET(request: Request, { params }: { params: { certificadoId: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { certificadoId } = params

    const reqUrl = new URL(request.url)

    // Cargar en paralelo
    const [certificado, configs] = await Promise.all([
      prisma.certificado.findUnique({
        where: { id: certificadoId },
        include: {
          curso: {
            select: {
              titulo: true,
              duracion: true,
              nivel: true,
              fecha_inicio: true,
              tipo_emision: true,
              profesor: {
                select: {
                  nombre: true,
                  apellido: true,
                  cargo: true,
                  firma: true
                }
              },
              modulos: {
                orderBy: { orden: 'asc' },
                select: {
                  id: true,
                  titulo: true,
                  orden: true,
                  lecciones: {
                    orderBy: { orden: 'asc' },
                    select: { id: true, titulo: true, orden: true, duracion: true }
                  }
                }
              }
            }
          },
          usuario: { select: { nombre: true, apellido: true } }
        }
      }),
      getConfigs()
    ])

    if (!certificado) {
      return NextResponse.json({ error: 'Certificado no encontrado' }, { status: 404 })
    }

    const [inscripcion, usuarioCompleto, intentosExamen] = await Promise.all([
      prisma.inscripcion.findUnique({
        where: {
          usuario_id_curso_id: {
            usuario_id: certificado.usuario_id,
            curso_id: certificado.curso_id
          }
        },
        select: { completado_en: true, inscrito_en: true, nota_final: true }
      }),
      prisma.usuario.findUnique({
        where: { id: certificado.usuario_id },
        select: { avatar: true }
      }),
      prisma.intentoExamen.findMany({
        where: {
          usuario_id: certificado.usuario_id,
          esta_aprobado: true,
          examen: { curso_id: certificado.curso_id, modulo_id: { not: null } }
        },
        select: { puntaje: true, examen: { select: { modulo_id: true, peso: true } } },
        orderBy: { enviado_en: 'desc' }
      })
    ])

    if (certificado.usuario_id !== auth.user.id && auth.user.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // fecha_fin del curso (campo nuevo — query raw hasta que se regenere el cliente Prisma)
    const [cursoFechaFinRow] = await prisma.$queryRaw<Array<{ fecha_fin: Date | null }>>`
      SELECT fecha_fin FROM cursos WHERE id = ${certificado.curso_id}
    `

    const cursoFechaFin = cursoFechaFinRow?.fecha_fin ?? null

    // Branding (Priorizar llaves específicas de certificado)
    const colorPrimario = configs.PRIMARY_COLOR_MAIN ?? '#131FF2'

    const logoUrl = configs.TEMPLATE_LOGO || '/images/logo.png'
    const nombreInstitucion = configs.CERTIFICADO_INSTITUTION_NAME || configs.TEMPLATE_NAME || 'Aula Virtual'
    const slogan = configs.CERTIFICADO_SLOGAN || configs.TEMPLATE_SLOGAN || 'Capacitación Especializada'
    
    // OBTENCIÓN AUTOMÁTICA DEL DOMINIO: Priorizamos config manual, luego host actual

    const [pr, pg, pb] = hexToRgb(colorPrimario)

    const appUrl = `${reqUrl.protocol}//${reqUrl.host}`
    const verifyUrl = `${appUrl}/verificar-certificado/${certificado.codigo_verificacion}`

    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 120,
      margin: 1,
      color: { dark: colorPrimario, light: '#ffffff' }
    })

    const logoBuffer = logoUrl ? await fetchImageBuffer(logoUrl) : null

    // Gerente General
    const gerenteGeneralId = configs.CERTIFICADO_GERENTE_GENERAL_ID

    const gerenteGeneral = gerenteGeneralId
      ? await prisma.usuario.findUnique({
          where: { id: gerenteGeneralId },
          select: { nombre: true, apellido: true, cargo: true, firma: true }
        })
      : null

    // ================================================================
    const { jsPDF } = await import('jspdf')

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // ── DATOS DEL CERTIFICADO (snapshot) ──
    const snapshot = certificado.datos as any

    const nombreCompleto = (snapshot?.usuario?.nombre && snapshot?.usuario?.apellido)
      ? `${snapshot.usuario.nombre} ${snapshot.usuario.apellido}`
      : `${certificado.usuario.nombre} ${certificado.usuario.apellido}`

    const cursoTitulo = snapshot?.curso?.titulo || certificado.curso.titulo
    const cursoModalidad = snapshot?.curso?.tipo_emision || certificado.curso.tipo_emision
    const cursoDuracion = snapshot?.curso?.duracion || certificado.curso.duracion

    const formatDate = (date: Date | string | null | undefined) => {
      if (!date) return '---'

      return new Date(date).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' })
    }

    const fechaEmisionVal = snapshot?.fechas?.emision || certificado.emitido_en
    const esSincrono = certificado.curso.tipo_emision === 'SINCRONO'

    const fechaInicioVal = snapshot?.fechas?.inicio_curso
      || (esSincrono
        ? certificado.curso.fecha_inicio
        : (inscripcion?.inscrito_en || certificado.emitido_en))

    const fechaFinVal = snapshot?.fechas?.culminacion
      || (esSincrono
        ? (cursoFechaFin || certificado.emitido_en)
        : (inscripcion?.completado_en || certificado.emitido_en))

    const profesorSnapshot = snapshot?.profesor || certificado.curso.profesor

    const formatDateLong = (date: Date | string | null | undefined) => {
      if (!date) return '---'

      return new Date(date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    // Base64 del logo (precomputado)
    let base64Logo: string | null = null

    if (logoBuffer) {
      try {
        const ext = logoUrl.split('.').pop()?.split('?')[0]?.toUpperCase() ?? 'PNG'

        base64Logo = `data:image/${ext.toLowerCase()};base64,${logoBuffer.toString('base64')}`
      } catch { /* skip */ }
    }

    // Variante oscura del color primario (para el gradiente del panel)
    const dpR = Math.round(pr * 0.52)
    const dpG = Math.round(pg * 0.52)
    const dpB = Math.round(pb * 0.52)

    // ── FUNCIÓN: bloque de firma ──
    const addSignatureBlock = async (x: number, lineY: number, user: any) => {
      if (!user) return

      // Imagen de firma — 34×34mm cuadrado, 1mm sobre la línea
      if (user.firma) {
        try {
          const signatureBuffer = await fetchImageBuffer(user.firma)

          if (signatureBuffer) {
            const sigExt = user.firma.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'png'

            doc.addImage(signatureBuffer, sigExt.toUpperCase(), x - 17, lineY - 34, 34, 34)
          }
        } catch { /* skip */ }
      }

      // Línea horizontal
      doc.setDrawColor(50, 50, 50)
      doc.setLineWidth(0.5)
      doc.line(x - 36, lineY, x + 36, lineY)

      // Nombre completo
      const nombreFirmante = `${user.nombre || ''} ${user.apellido || ''}`.trim()

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(25, 25, 25)
      doc.text(nombreFirmante, x, lineY + 7, { align: 'center' })

      // Cargo (si existe)
      if (user.cargo) {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        doc.text(user.cargo, x, lineY + 13, { align: 'center' })
      }
    }

    // ── PÁGINA 1 ─────────────────────────────────────────────────────────
    const panelW = 72
    const contentW = pageWidth - panelW   // ~225mm
    const cx = contentW / 2              // ~112.5mm

    // ── PANEL LATERAL DERECHO ──

    // 1. Fondo blanco completo
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // 2. Gradiente del panel: saturado arriba (primary + 12% blanco) → muy oscuro abajo
    const gradStrips = 70

    for (let i = 0; i < gradStrips; i++) {
      const t = i / (gradStrips - 1)
      const r = Math.round(pr + (255 - pr) * 0.12 - (pr + (255 - pr) * 0.12 - dpR) * t)
      const g = Math.round(pg + (255 - pg) * 0.12 - (pg + (255 - pg) * 0.12 - dpG) * t)
      const b = Math.round(pb + (255 - pb) * 0.12 - (pb + (255 - pb) * 0.12 - dpB) * t)

      doc.setFillColor(
        Math.max(0, Math.min(255, r)),
        Math.max(0, Math.min(255, g)),
        Math.max(0, Math.min(255, b))
      )

      const sy = (i / gradStrips) * pageHeight

      doc.rect(contentW, sy, panelW, pageHeight / gradStrips + 0.5, 'F')
    }

    // 3. Ribbons diagonales rellenos (paths bezier cerrados — sin trazos, sin artefactos)
    const ribR1 = Math.round(pr + (255 - pr) * 0.28)
    const ribG1 = Math.round(pg + (255 - pg) * 0.28)
    const ribB1 = Math.round(pb + (255 - pb) * 0.28)

    doc.setFillColor(ribR1, ribG1, ribB1)
    doc.lines(
      [[21, 22, 41, 68, 60, 96], [0, 24], [-19, -12, -39, -48, -60, -96], [0, -24]],
      237, 0, [1, 1], 'F', true
    )

    const ribR2 = Math.round(pr + (255 - pr) * 0.14)
    const ribG2 = Math.round(pg + (255 - pg) * 0.14)
    const ribB2 = Math.round(pb + (255 - pb) * 0.14)

    doc.setFillColor(ribR2, ribG2, ribB2)
    doc.lines(
      [[20, 18, 41, 62, 60, 88], [0, 32], [-19, -4, -39, -42, -60, -98], [0, -22]],
      237, 90, [1, 1], 'F', true
    )

    // 4. QR esquina inferior del panel
    const qrSz = 30
    const qrX0 = contentW + (panelW - qrSz) / 2
    const qrY0 = pageHeight - qrSz - 24

    doc.setFillColor(255, 255, 255)
    doc.roundedRect(qrX0 - 3, qrY0 - 3, qrSz + 6, qrSz + 6, 2, 2, 'F')
    doc.addImage(qrDataUrl, 'PNG', qrX0, qrY0, qrSz, qrSz)
    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'normal')
    doc.text('Escanea para verificar', contentW + panelW / 2, pageHeight - 16, { align: 'center' })

    // 5. Repisar el área de contenido izquierda en blanco (cubre posibles desbordes)
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, contentW, pageHeight, 'F')

    // 6. Texto "CERTIFICADO" rotado vertical — se dibuja DESPUÉS del rect blanco
    //    align:'center' con angle:90 desplaza el texto por textWidth/2 en el eje incorrecto,
    //    por eso calculamos y manualmente usando getTextWidth y no usamos align.
    doc.setFontSize(55)
    doc.setTextColor(Math.round(pr * 0.55), Math.round(pg * 0.55), Math.round(pb * 0.55))
    doc.setFont('helvetica', 'bold')

    /* angle:90: x=baseline horizontal del texto, y=extremo inferior del texto */
    /* QR empieza en pageHeight-42 (~168mm) → margen de 8mm: y=160 */
    /* x centrado en el panel: contentW + panelW/2 */
    doc.text('CERTIFICADO', contentW + panelW / 2 + 8, 148, { angle: 90 })

    // ── ÁREA DE CONTENIDO ──────────────────────────────────────────────

    // ── ENCABEZADO: solo logo centrado, proporciones reales ──
    let y = 10
    const maxLogoH = 22   // altura máxima en mm
    const maxLogoW = 60   // ancho máximo en mm
    let logoDisplayW = maxLogoH
    let logoDisplayH = maxLogoH

    if (logoBuffer) {
      try {
        const meta = await sharp(logoBuffer).metadata()

        if (meta.width && meta.height) {
          const ratio = meta.width / meta.height

          logoDisplayH = maxLogoH
          logoDisplayW = Math.min(logoDisplayH * ratio, maxLogoW)

          /* Si es más ancho que alto, ajustar por ancho */
          if (logoDisplayW === maxLogoW) logoDisplayH = maxLogoW / ratio
        }
      } catch { /* usar tamaño por defecto */ }
    }

    if (base64Logo) {
      try {
        const ext = logoUrl.split('.').pop()?.split('?')[0]?.toUpperCase() ?? 'PNG'

        doc.addImage(base64Logo, ext, cx - logoDisplayW / 2, y, logoDisplayW, logoDisplayH)
      } catch { /* skip */ }
    }

    y += logoDisplayH + 14

    // ── CERTIFICADO ──
    doc.setFontSize(26)
    doc.setTextColor(18, 18, 18)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICADO', cx, y, { align: 'center' })
    y += 11

    // "Otorgado a:"
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text('Otorgado a:', cx, y, { align: 'center' })
    y += 11

    // ── Nombre del alumno ── grande, color primario
    doc.setFontSize(26)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')

    const nameStr = nombreCompleto.toUpperCase()

    doc.text(nameStr, cx, y, { align: 'center' })
    y += 11

    // "Por haber concluido..."
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text('Por haber concluido y aprobado con éxito el curso de especialización de:', cx, y, { align: 'center' })
    y += 10

    // ── Título del curso — negro bold ──
    doc.setFontSize(26)
    doc.setTextColor(15, 15, 15)
    doc.setFont('helvetica', 'bold')

    const cursoLines = doc.splitTextToSize(cursoTitulo, contentW - 34)

    doc.text(cursoLines, cx, y, { align: 'center' })
    y += cursoLines.length * 7 + 6

    // ── Párrafo descriptivo ──
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)

    const fechaInicioLarga = formatDateLong(fechaInicioVal)
    const fechaFinLarga = formatDateLong(fechaFinVal)
    const descripcionTxt = `Emitido por ${nombreInstitucion}, con una duración de ${cursoDuracion || '---'}, realizado desde el ${fechaInicioLarga} hasta el ${fechaFinLarga}.`
    const descripcionLines = doc.splitTextToSize(descripcionTxt, contentW - 40)

    doc.text(descripcionLines, cx, y, { align: 'center' })
    y += descripcionLines.length * 6 + 4

    // "Por cuanto..."
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)

    const porcuantoTxt = 'Por cuanto: Para que conste y sea reconocido, se otorga el presente diploma en calidad de:'
    const porcuantoLines = doc.splitTextToSize(porcuantoTxt, contentW - 40)

    doc.text(porcuantoLines, cx, y, { align: 'center' })
    y += porcuantoLines.length * 6 + 5

    // ── APROBADO — destacado, con líneas decorativas a los lados ──
    doc.setFontSize(14)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    doc.text('APROBADO', cx, y, { align: 'center' })

    const aprobadoW = doc.getTextWidth('APROBADO')

    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(0.4)
    doc.line(cx - aprobadoW / 2 - 10, y - 1.5, cx - aprobadoW / 2 - 2, y - 1.5)
    doc.line(cx + aprobadoW / 2 + 2, y - 1.5, cx + aprobadoW / 2 + 10, y - 1.5)
    y += 8

    // "Firmado, el..."
    const fechaFirmadaTxt = new Date(fechaEmisionVal).toLocaleDateString('es-PE', {
      day: 'numeric', month: 'long', year: 'numeric'
    })

    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(`Firmado, el ${fechaFirmadaTxt}.`, cx, y, { align: 'center' })
    y += 12

    // ── Bloques de firma ── centrado si uno solo, simétrico si dos
    const hasGerente = gerenteGeneral !== null
    const mostrarFirmaDocente = configs.CERTIFICADO_MOSTRAR_FIRMA_DOCENTE !== 'false'

    /* Con docente: principal izquierda, docente derecha */
    /* Sin docente: solo principal centrado (o solo docente centrado si no hay principal) */
    if (hasGerente && mostrarFirmaDocente) {
      await addSignatureBlock(cx - 54, y + 20, gerenteGeneral)
      await addSignatureBlock(cx + 54, y + 20, profesorSnapshot)
    } else if (hasGerente) {
      await addSignatureBlock(cx, y + 20, gerenteGeneral)
    } else if (mostrarFirmaDocente) {
      await addSignatureBlock(cx, y + 20, profesorSnapshot)
    }

    // ── Footer: Certificado ID + Fecha apilados en esquina inferior izquierda ──
    const footerY1 = pageHeight - 12
    const footerY2 = pageHeight - 7

    doc.setFontSize(10)
    doc.setTextColor(90, 90, 90)
    doc.setFont('helvetica', 'normal')
    doc.text(`Código de Registro: ${certificado.codigo_verificacion}`, 16, footerY1)
    doc.text(`Fecha de Emisión: ${fechaFirmadaTxt}`, 16, footerY2)

    const previewFlag = reqUrl.searchParams.get('preview') === 'true'

    // Evitar warning de variable no usada
    void previewFlag
    void cursoModalidad
    void formatDate

    // ── PÁGINA 2: PERFIL + RENDIMIENTO + CONTENIDO ──────────────────────
    doc.addPage()
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Tipografías estándar de la página 2
    const T = {
      sectionTitle: 9,   // encabezados de sección
      label:        8,   // etiquetas
      body:         8,   // cuerpo de texto
      small:        7,   // notas al pie
      score:        22,  // número de nota grande
    }

    const margin = 12

    // ── BAND SUPERIOR con color primario ─────────────────────────────────
    doc.setFillColor(pr, pg, pb)
    doc.rect(0, 0, pageWidth, 18, 'F')

    // Logo en la banda con proporciones reales, capped al alto del band
    const bandH = 20
    const maxLogoHP2 = bandH - 8   // logo más pequeño
    const maxLogoWP2 = 40
    let logoP2W = maxLogoHP2
    let logoP2H = maxLogoHP2

    if (logoBuffer) {
      try {
        const meta = await sharp(logoBuffer).metadata()

        if (meta.width && meta.height) {
          const ratio = meta.width / meta.height

          logoP2H = maxLogoHP2
          logoP2W = Math.min(logoP2H * ratio, maxLogoWP2)

          if (logoP2W === maxLogoWP2) logoP2H = maxLogoWP2 / ratio

          /* Asegurar que nunca supere el alto del band */
          if (logoP2H > maxLogoHP2) { logoP2H = maxLogoHP2; logoP2W = logoP2H * ratio }
        }
      } catch { /* usar tamaño por defecto */ }
    }

    if (base64Logo) {
      try {
        const ext = logoUrl.split('.').pop()?.split('?')[0]?.toUpperCase() ?? 'PNG'

        doc.addImage(base64Logo, ext, margin, (bandH - logoP2H) / 2, logoP2W, logoP2H)
      } catch { /* skip */ }
    }

    const logoRightEdge = margin + logoP2W + 4

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(nombreInstitucion.toUpperCase(), logoRightEdge, 10)
    doc.setFontSize(T.body)
    doc.setFont('helvetica', 'normal')
    doc.text(slogan, logoRightEdge, 16)

    // Código y fecha más grandes alineados a la derecha
    doc.setFontSize(T.label)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(`Código: ${certificado.codigo_verificacion}`, pageWidth - margin, 9, { align: 'right' })
    doc.setFontSize(T.label)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha de emisión: ${fechaFirmadaTxt}`, pageWidth - margin, 15, { align: 'right' })

    // ── ZONA A: FOTO + DATOS DEL GRADUADO ────────────────────────────────
    const zoneAY = 24
    const avatarSize = 22
    const avatarX = margin
    const avatarY = zoneAY

    // Foto del estudiante (círculo)
    const avatarBuffer = usuarioCompleto?.avatar ? await fetchImageBuffer(usuarioCompleto.avatar) : null

    if (avatarBuffer) {
      try {
        // Máscara circular: clip manual con círculo blanco de fondo
        doc.setFillColor(240, 240, 240)
        doc.circle(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 'F')
        doc.addImage(avatarBuffer, 'JPEG', avatarX, avatarY, avatarSize, avatarSize)
      } catch { /* skip */ }
    } else {
      // Placeholder avatar
      doc.setFillColor(pr, pg, pb)
      doc.circle(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 'F')
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)

      const initials = nombreCompleto.split(' ').slice(0, 2).map((w: string) => w[0]).join('')

      doc.text(initials, avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 2.5, { align: 'center' })
    }

    // Nombre y curso del graduado
    const textX = avatarX + avatarSize + 5

    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(25, 25, 25)
    doc.text(nombreCompleto, textX, zoneAY + 8)

    doc.setFontSize(T.body)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text('Certificado de Finalización', textX, zoneAY + 14)

    const cursoTituloP2Lines = doc.splitTextToSize(cursoTitulo, pageWidth - textX - margin - 80)

    doc.setFontSize(T.body)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(60, 60, 60)
    doc.text(cursoTituloP2Lines, textX, zoneAY + 20)

    // Separador
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(margin, zoneAY + avatarSize + 5, pageWidth - margin, zoneAY + avatarSize + 5)

    // ── ZONA B: DOS COLUMNAS ─────────────────────────────────────────────
    const zoneB_Y = zoneAY + avatarSize + 10
    const colGap = 6
    const colW = (pageWidth - margin * 2 - colGap) / 2
    const colLeft = margin
    const colRight = margin + colW + colGap

    // ── COLUMNA IZQUIERDA: Rendimiento académico ─────────────────────────

    // Header sección izquierda
    doc.setFillColor(pr, pg, pb)
    doc.roundedRect(colLeft, zoneB_Y, colW, 8, 1, 1, 'F')
    doc.setFontSize(T.sectionTitle)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('RENDIMIENTO ACADÉMICO', colLeft + colW / 2, zoneB_Y + 5.5, { align: 'center' })

    let yLeft = zoneB_Y + 13

    // Promedio ponderado — se calcula desde los intentos aprobados por módulo (escala 0-20)
    // Si no hay intentos por módulo, cae a inscripcion.nota_final normalizado
    const notasPorModulo: Record<string, { puntaje: number; count: number }> = {}

    for (const intento of intentosExamen) {
      const mid = intento.examen.modulo_id!

      if (!notasPorModulo[mid]) notasPorModulo[mid] = { puntaje: 0, count: 0 }

      notasPorModulo[mid].puntaje += intento.puntaje ?? 0
      notasPorModulo[mid].count += 1
    }

    const promediosPorModulo = Object.values(notasPorModulo).map(e => {
      const raw = e.puntaje / e.count

      return raw > 20 ? raw / 5 : raw
    })

    const notaMax = 20

    const notaFinal = promediosPorModulo.length > 0
      ? promediosPorModulo.reduce((a, b) => a + b, 0) / promediosPorModulo.length
      : (() => {
          const raw = inscripcion?.nota_final ?? null

          return raw !== null ? (raw > 20 ? raw / 5 : raw) : null
        })()

    const notaDisplay = notaFinal !== null ? notaFinal.toFixed(2) : '---'
    const porcentaje = notaFinal !== null ? Math.min(notaFinal / notaMax, 1) : 0

    // Número grande de nota
    doc.setFontSize(T.score)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(pr, pg, pb)
    doc.text(notaDisplay, colLeft + colW / 2, yLeft + 10, { align: 'center' })
    doc.setFontSize(T.small)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(`/ ${notaMax}.00`, colLeft + colW / 2 + 8, yLeft + 10)
    doc.setFontSize(T.label)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text('Promedio Ponderado Final', colLeft + colW / 2, yLeft + 16, { align: 'center' })

    yLeft += 22

    // Barra de progreso
    const barW = colW - 16
    const barH = 4
    const barX = colLeft + 8

    doc.setFillColor(230, 230, 230)
    doc.roundedRect(barX, yLeft, barW, barH, 2, 2, 'F')
    doc.setFillColor(pr, pg, pb)
    doc.roundedRect(barX, yLeft, barW * porcentaje, barH, 2, 2, 'F')
    doc.setFontSize(T.small)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(pr, pg, pb)
    doc.text(`${Math.round(porcentaje * 100)}%`, barX + barW + 2, yLeft + 3.5)

    yLeft += 10

    // Notas por módulo (reutiliza notasPorModulo ya calculado arriba)
    const modulosConNota = certificado.curso.modulos.filter(m => notasPorModulo[m.id])

    if (modulosConNota.length > 0) {
      // Subheader
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.2)
      doc.line(colLeft + 4, yLeft, colLeft + colW - 4, yLeft)
      yLeft += 5
      doc.setFontSize(T.label)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(80, 80, 80)
      doc.text('Calificaciones por Módulo', colLeft + 4, yLeft)
      yLeft += 6

      for (const mod of modulosConNota) {
        if (yLeft > 168) break
        const entry = notasPorModulo[mod.id]
        const rawMod = entry.puntaje / entry.count
        const promMod = (rawMod > 20 ? rawMod / 5 : rawMod).toFixed(1)
        const tituloMod = doc.splitTextToSize(mod.titulo, colW - 22)

        doc.setFontSize(T.body)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 60)
        doc.text(tituloMod, colLeft + 4, yLeft)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(pr, pg, pb)
        doc.text(promMod, colLeft + colW - 4, yLeft, { align: 'right' })

        // Línea punteada
        doc.setDrawColor(210, 210, 210)
        doc.setLineWidth(0.15)

        const dotY = yLeft + 0.5

        doc.line(colLeft + 4 + doc.getTextWidth(tituloMod[0]) + 2, dotY, colLeft + colW - 10, dotY)

        yLeft += tituloMod.length * 4.5 + 2
      }
    }

    // ── COLUMNA DERECHA: Contenido del programa ──────────────────────────

    // Header sección derecha
    doc.setFillColor(pr, pg, pb)
    doc.roundedRect(colRight, zoneB_Y, colW, 8, 1, 1, 'F')
    doc.setFontSize(T.sectionTitle)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('CONTENIDO DEL PROGRAMA', colRight + colW / 2, zoneB_Y + 5.5, { align: 'center' })

    let yRight = zoneB_Y + 13
    const modulos = certificado.curso.modulos ?? []
    const contentBottomLimit = pageHeight - 22
    let onExtraPage = false

    const startNewModulosPage = () => {
      doc.addPage()
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, pageWidth, pageHeight, 'F')
      doc.setFillColor(pr, pg, pb)
      doc.rect(0, 0, pageWidth, 8, 'F')
      doc.setFontSize(T.small)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('CONTENIDO DEL PROGRAMA ACADÉMICO (continuación)', margin, 5.5)
      onExtraPage = true

      return 14
    }

    for (const modulo of modulos) {
      const modTxt = `${modulo.orden}. ${modulo.titulo}`.toUpperCase()
      const modLines = doc.splitTextToSize(modTxt, colW - 8)
      const modH = modLines.length * 4.5 + 4

      // Nueva página si no cabe el módulo
      if (yRight + modH > contentBottomLimit) {
        yRight = startNewModulosPage()
      }

      // Título del módulo
      doc.setFillColor(Math.round(pr * 0.12 + 255 * 0.88), Math.round(pg * 0.12 + 255 * 0.88), Math.round(pb * 0.12 + 255 * 0.88))
      const modX = onExtraPage ? margin : colRight
      const modWd = onExtraPage ? pageWidth - margin * 2 : colW

      doc.roundedRect(modX, yRight, modWd, modH, 1, 1, 'F')
      doc.setFontSize(T.sectionTitle)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(pr, pg, pb)
      doc.text(modLines, modX + 4, yRight + 4.5)
      yRight += modH + 2

      // Lecciones
      for (const leccion of modulo.lecciones) {
        const lecTxt = `${modulo.orden}.${leccion.orden}  ${leccion.titulo}`
        const lecLines = doc.splitTextToSize(lecTxt, modWd - 14)
        const lecH = lecLines.length * 4 + 1.5

        if (yRight + lecH > contentBottomLimit) {
          yRight = startNewModulosPage()
        }

        doc.setFillColor(pr, pg, pb)
        doc.circle(modX + 4, yRight + 1.5, 0.9, 'F')
        doc.setFontSize(T.body)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 60)
        doc.text(lecLines, modX + 7, yRight + 2.5)
        yRight += lecH
      }

      yRight += 3
    }

    // ── PIE DE PÁGINA 2 ───────────────────────────────────────────────────
    const footerTopY = pageHeight - 20

    doc.setFillColor(245, 245, 245)
    doc.rect(0, footerTopY, pageWidth, 20, 'F')
    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(0.4)
    doc.line(0, footerTopY, pageWidth, footerTopY)

    const disclaimer = configs.CERTIFICADO_DISCLAIMER || ''
    const institutionUrl = configs.CERTIFICADO_INSTITUTION_URL || ''

    if (disclaimer) {
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2 - 60)

      doc.setFontSize(T.small)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120, 120, 120)
      doc.text(disclaimerLines, margin, footerTopY + 5)
    }

    if (institutionUrl) {
      doc.setFontSize(T.small)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(pr, pg, pb)
      doc.text(institutionUrl, pageWidth - margin, footerTopY + 5, { align: 'right' })
    }

    const pdfArrayBuffer = doc.output('arraybuffer')

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${previewFlag ? 'inline' : 'attachment'}; filename="certificado-${certificado.codigo_verificacion}.pdf"`,
        'Content-Length': pdfArrayBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
