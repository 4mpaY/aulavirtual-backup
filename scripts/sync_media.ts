import { PrismaClient } from '@prisma/client'
import { readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'cursos')
  if (!existsSync(uploadDir)) {
    console.log('Upload directory does not exist')
    return
  }

  try {
    const files = readdirSync(uploadDir)
    console.log(`Found ${files.length} files in ${uploadDir}`)

    for (const file of files) {
      if (file === '.gitkeep') continue

      // Use the filename minus extension as ID if it's a UUID, otherwise generate one
      const parts = file.split('.')
      const id = parts.length > 1 ? parts[0] : file
      const url = `/uploads/cursos/${file}`
      const stats = statSync(join(uploadDir, file))

      const existing: any[] = await prisma.$queryRaw`SELECT id FROM "media" WHERE url = ${url}`

      if (existing.length === 0) {
        console.log(`Syncing file to DB: ${file}`)
        const tipo = 'IMAGEN'
        const mimetype = 'image/jpeg'
        const ahora = new Date()

        // Attempt to insert with raw SQL to bypass Prisma Client model check
        await prisma.$executeRaw`
          INSERT INTO "media" ("id", "nombre", "url", "tipo", "mimetype", "peso", "creado_en", "actualizado_en")
          VALUES (${id}, ${file}, ${url}, ${tipo}, ${mimetype}, ${stats.size}, ${ahora}, ${ahora})
        `
      } else {
        console.log(`File already in DB: ${file}`)
      }
    }
    console.log('Sync complete')
  } catch (e) {
    console.error('Error syncing media:', e)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
