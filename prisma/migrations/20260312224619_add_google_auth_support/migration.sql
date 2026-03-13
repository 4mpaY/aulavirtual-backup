/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "google_id" TEXT,
ALTER COLUMN "contrasena" DROP NOT NULL,
ALTER COLUMN "numero_documento" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_google_id_key" ON "usuarios"("google_id");
