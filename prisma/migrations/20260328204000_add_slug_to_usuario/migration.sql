-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_slug_key" ON "usuarios"("slug");
