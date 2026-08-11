import fs from 'fs'
import path from 'path'

const FONTS_DIR = path.join(process.cwd(), 'public', 'fonts', 'certificados')

interface FontDef {
  family: string
  regularFile: string
  boldFile: string
}

// Debe coincidir con las claves de CampoFontFamily (types.ts) y con los nombres
// de familia declarados en certificadoFonts.css (vista previa del editor).
const CUSTOM_FONTS: FontDef[] = [
  { family: 'montserrat', regularFile: 'Montserrat-Regular.ttf', boldFile: 'Montserrat-Bold.ttf' },
  { family: 'playfair', regularFile: 'PlayfairDisplay-Regular.ttf', boldFile: 'PlayfairDisplay-Bold.ttf' },
  { family: 'poppins', regularFile: 'Poppins-Regular.ttf', boldFile: 'Poppins-Bold.ttf' },
  { family: 'nunito', regularFile: 'Nunito-Regular.ttf', boldFile: 'Nunito-Bold.ttf' },
  { family: 'dancingscript', regularFile: 'DancingScript-Regular.ttf', boldFile: 'DancingScript-Bold.ttf' }
]

const base64Cache = new Map<string, string>()

function readFontBase64(fileName: string): string {
  const cached = base64Cache.get(fileName)

  if (cached) return cached

  const base64 = fs.readFileSync(path.join(FONTS_DIR, fileName)).toString('base64')

  base64Cache.set(fileName, base64)

  return base64
}

/**
 * Registra en la instancia de jsPDF las tipografías personalizadas (Montserrat,
 * Playfair Display, Poppins, Nunito, Dancing Script) para que queden disponibles
 * vía doc.setFont(<family>, 'normal' | 'bold'). No incluyen una variante itálica
 * real: se alía al regular para evitar que jsPDF sustituya por Times al pedir
 * un estilo no registrado.
 */
export function registrarFuentesPersonalizadas(doc: any): void {
  for (const font of CUSTOM_FONTS) {
    try {
      const regularBase64 = readFontBase64(font.regularFile)

      doc.addFileToVFS(font.regularFile, regularBase64)
      doc.addFont(font.regularFile, font.family, 'normal')
      doc.addFont(font.regularFile, font.family, 'italic')

      const boldBase64 = readFontBase64(font.boldFile)

      doc.addFileToVFS(font.boldFile, boldBase64)
      doc.addFont(font.boldFile, font.family, 'bold')
    } catch {
      /* si falta el archivo de la fuente, jsPDF hace fallback a Times al usarla */
    }
  }
}
