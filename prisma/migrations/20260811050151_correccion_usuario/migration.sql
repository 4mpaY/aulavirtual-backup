/*
  Warnings:

  - You are about to drop the column `codigo` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_fin` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `precio_falso` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `vigencia_meses` on the `cursos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuario_id,ruta_id]` on the table `certificados` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Rol" ADD VALUE 'SUPERVISOR';

-- DropIndex
DROP INDEX "cursos_codigo_key";

-- DropIndex
DROP INDEX "cursos_tipo_idx";

-- AlterTable
ALTER TABLE "certificados" ADD COLUMN     "ruta_id" TEXT,
ALTER COLUMN "curso_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "cursos" DROP COLUMN "codigo",
DROP COLUMN "fecha_fin",
DROP COLUMN "precio_falso",
DROP COLUMN "tipo",
DROP COLUMN "vigencia_meses";

-- AlterTable
ALTER TABLE "examenes" ADD COLUMN     "nota_maxima" INTEGER NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "rutas_aprendizaje" ADD COLUMN     "escuela_id" TEXT;

-- CreateTable
CREATE TABLE "escuelas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'DISPONIBLE',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escuelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asistencias" (
    "id" TEXT NOT NULL,
    "leccion_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "asistio" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervisores_alumnos" (
    "supervisor_id" TEXT NOT NULL,
    "alumno_id" TEXT NOT NULL,

    CONSTRAINT "supervisores_alumnos_pkey" PRIMARY KEY ("supervisor_id","alumno_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "escuelas_nombre_key" ON "escuelas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "escuelas_slug_key" ON "escuelas"("slug");

-- CreateIndex
CREATE INDEX "asistencias_leccion_id_idx" ON "asistencias"("leccion_id");

-- CreateIndex
CREATE INDEX "asistencias_usuario_id_idx" ON "asistencias"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "asistencias_leccion_id_usuario_id_key" ON "asistencias"("leccion_id", "usuario_id");

-- CreateIndex
CREATE INDEX "supervisores_alumnos_alumno_id_idx" ON "supervisores_alumnos"("alumno_id");

-- CreateIndex
CREATE INDEX "supervisores_alumnos_supervisor_id_idx" ON "supervisores_alumnos"("supervisor_id");

-- CreateIndex
CREATE INDEX "certificados_ruta_id_idx" ON "certificados"("ruta_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_usuario_id_ruta_id_key" ON "certificados"("usuario_id", "ruta_id");

-- CreateIndex
CREATE INDEX "cursos_tipo_emision_idx" ON "cursos"("tipo_emision");

-- CreateIndex
CREATE INDEX "rutas_aprendizaje_escuela_id_idx" ON "rutas_aprendizaje"("escuela_id");

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "rutas_aprendizaje"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutas_aprendizaje" ADD CONSTRAINT "rutas_aprendizaje_escuela_id_fkey" FOREIGN KEY ("escuela_id") REFERENCES "escuelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_leccion_id_fkey" FOREIGN KEY ("leccion_id") REFERENCES "lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisores_alumnos" ADD CONSTRAINT "supervisores_alumnos_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisores_alumnos" ADD CONSTRAINT "supervisores_alumnos_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
