-- CreateEnum
CREATE TYPE "EstadoSimulacro" AS ENUM ('BORRADOR', 'PUBLICADO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "NivelSimulacro" AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO');

-- DropForeignKey
ALTER TABLE "detalles_pedido" DROP CONSTRAINT "detalles_pedido_curso_id_fkey";

-- AlterTable
ALTER TABLE "detalles_pedido" ADD COLUMN     "simulacro_id" TEXT;

-- AlterTable
ALTER TABLE "ebooks" ADD COLUMN     "anio_edicion" INTEGER,
ADD COLUMN     "editorial" TEXT,
ADD COLUMN     "idioma" TEXT DEFAULT 'Español',
ADD COLUMN     "resena" TEXT,
ADD COLUMN     "saga" TEXT;

-- CreateTable
CREATE TABLE "ebook_annotaciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "ebook_id" TEXT NOT NULL,
    "pagina" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "texto" TEXT,
    "color" TEXT NOT NULL DEFAULT '#fbbf24',
    "posicion" JSONB NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ebook_annotaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulacro" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "miniatura" TEXT,
    "estado" "EstadoSimulacro" NOT NULL DEFAULT 'BORRADOR',
    "nivel" "NivelSimulacro" NOT NULL DEFAULT 'BASICO',
    "duracion" TEXT,
    "numero_preguntas" INTEGER NOT NULL DEFAULT 0,
    "area_tematica" TEXT,
    "es_gratis" BOOLEAN NOT NULL DEFAULT false,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Simulacro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones_simulacro" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "simulacro_id" TEXT NOT NULL,
    "estado" "EstadoInscripcion" NOT NULL DEFAULT 'ACTIVO',
    "inscrito_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "mejor_puntaje" DOUBLE PRECISION,

    CONSTRAINT "inscripciones_simulacro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreguntaSimulacro" (
    "id" TEXT NOT NULL,
    "simulacro_id" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "tema" TEXT,
    "fundamento" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreguntaSimulacro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpcionPreguntaSimulacro" (
    "id" TEXT NOT NULL,
    "pregunta_id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "es_correcta" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OpcionPreguntaSimulacro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ebook_annotaciones_usuario_id_ebook_id_idx" ON "ebook_annotaciones"("usuario_id", "ebook_id");

-- CreateIndex
CREATE UNIQUE INDEX "Simulacro_slug_key" ON "Simulacro"("slug");

-- CreateIndex
CREATE INDEX "Simulacro_estado_idx" ON "Simulacro"("estado");

-- CreateIndex
CREATE INDEX "inscripciones_simulacro_usuario_id_idx" ON "inscripciones_simulacro"("usuario_id");

-- CreateIndex
CREATE INDEX "inscripciones_simulacro_simulacro_id_idx" ON "inscripciones_simulacro"("simulacro_id");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_simulacro_usuario_id_simulacro_id_key" ON "inscripciones_simulacro"("usuario_id", "simulacro_id");

-- CreateIndex
CREATE INDEX "PreguntaSimulacro_simulacro_id_idx" ON "PreguntaSimulacro"("simulacro_id");

-- CreateIndex
CREATE INDEX "OpcionPreguntaSimulacro_pregunta_id_idx" ON "OpcionPreguntaSimulacro"("pregunta_id");

-- CreateIndex
CREATE INDEX "detalles_pedido_simulacro_id_idx" ON "detalles_pedido"("simulacro_id");

-- AddForeignKey
ALTER TABLE "ebook_annotaciones" ADD CONSTRAINT "ebook_annotaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ebook_annotaciones" ADD CONSTRAINT "ebook_annotaciones_ebook_id_fkey" FOREIGN KEY ("ebook_id") REFERENCES "ebooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_simulacro_id_fkey" FOREIGN KEY ("simulacro_id") REFERENCES "Simulacro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_simulacro" ADD CONSTRAINT "inscripciones_simulacro_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_simulacro" ADD CONSTRAINT "inscripciones_simulacro_simulacro_id_fkey" FOREIGN KEY ("simulacro_id") REFERENCES "Simulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreguntaSimulacro" ADD CONSTRAINT "PreguntaSimulacro_simulacro_id_fkey" FOREIGN KEY ("simulacro_id") REFERENCES "Simulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpcionPreguntaSimulacro" ADD CONSTRAINT "OpcionPreguntaSimulacro_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "PreguntaSimulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
