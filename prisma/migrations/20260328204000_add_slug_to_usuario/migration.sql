-- AlterTable: Agregar columna slug si no existe (idempotente)
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "slug" TEXT;

-- CreateIndex: solo si no existe
CREATE UNIQUE INDEX IF NOT EXISTS "usuarios_slug_key" ON "usuarios"("slug");
