-- AlterEnum
ALTER TYPE "Rol" ADD VALUE 'SUPERVISOR';

-- DropIndex
DROP INDEX "certificados_usuario_id_curso_id_key";

-- AlterTable
ALTER TABLE "certificados" ALTER COLUMN "usuario_id" DROP NOT NULL,
ALTER COLUMN "curso_id" DROP NOT NULL;

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
CREATE INDEX "asistencias_leccion_id_idx" ON "asistencias"("leccion_id");

-- CreateIndex
CREATE INDEX "asistencias_usuario_id_idx" ON "asistencias"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "asistencias_leccion_id_usuario_id_key" ON "asistencias"("leccion_id", "usuario_id");

-- CreateIndex
CREATE INDEX "supervisores_alumnos_supervisor_id_idx" ON "supervisores_alumnos"("supervisor_id");

-- CreateIndex
CREATE INDEX "supervisores_alumnos_alumno_id_idx" ON "supervisores_alumnos"("alumno_id");

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_leccion_id_fkey" FOREIGN KEY ("leccion_id") REFERENCES "lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisores_alumnos" ADD CONSTRAINT "supervisores_alumnos_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisores_alumnos" ADD CONSTRAINT "supervisores_alumnos_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
