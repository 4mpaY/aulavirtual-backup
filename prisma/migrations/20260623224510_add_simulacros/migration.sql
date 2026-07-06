-- Recuperación idempotente (parcialmente aplicada en BD local)
DO $$ BEGIN
  CREATE TYPE "EstadoSimulacro" AS ENUM ('BORRADOR', 'PUBLICADO', 'ARCHIVADO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "NivelSimulacro" AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "detalles_pedido" DROP CONSTRAINT IF EXISTS "detalles_pedido_curso_id_fkey";

ALTER TABLE "detalles_pedido" ADD COLUMN IF NOT EXISTS "simulacro_id" TEXT;

ALTER TABLE "ebooks" ADD COLUMN IF NOT EXISTS "anio_edicion" INTEGER;
ALTER TABLE "ebooks" ADD COLUMN IF NOT EXISTS "editorial" TEXT;
ALTER TABLE "ebooks" ADD COLUMN IF NOT EXISTS "idioma" TEXT DEFAULT 'Español';
ALTER TABLE "ebooks" ADD COLUMN IF NOT EXISTS "resena" TEXT;
ALTER TABLE "ebooks" ADD COLUMN IF NOT EXISTS "saga" TEXT;

CREATE TABLE IF NOT EXISTS "ebook_annotaciones" (
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

CREATE TABLE IF NOT EXISTS "Simulacro" (
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

CREATE TABLE IF NOT EXISTS "inscripciones_simulacro" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "simulacro_id" TEXT NOT NULL,
    "estado" "EstadoInscripcion" NOT NULL DEFAULT 'ACTIVO',
    "inscrito_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "mejor_puntaje" DOUBLE PRECISION,
    CONSTRAINT "inscripciones_simulacro_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PreguntaSimulacro" (
    "id" TEXT NOT NULL,
    "simulacro_id" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "tema" TEXT,
    "fundamento" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PreguntaSimulacro_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "OpcionPreguntaSimulacro" (
    "id" TEXT NOT NULL,
    "pregunta_id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "es_correcta" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "OpcionPreguntaSimulacro_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ebook_annotaciones_usuario_id_ebook_id_idx" ON "ebook_annotaciones"("usuario_id", "ebook_id");
CREATE UNIQUE INDEX IF NOT EXISTS "Simulacro_slug_key" ON "Simulacro"("slug");
CREATE INDEX IF NOT EXISTS "Simulacro_estado_idx" ON "Simulacro"("estado");
CREATE INDEX IF NOT EXISTS "inscripciones_simulacro_usuario_id_idx" ON "inscripciones_simulacro"("usuario_id");
CREATE INDEX IF NOT EXISTS "inscripciones_simulacro_simulacro_id_idx" ON "inscripciones_simulacro"("simulacro_id");
CREATE UNIQUE INDEX IF NOT EXISTS "inscripciones_simulacro_usuario_id_simulacro_id_key" ON "inscripciones_simulacro"("usuario_id", "simulacro_id");
CREATE INDEX IF NOT EXISTS "PreguntaSimulacro_simulacro_id_idx" ON "PreguntaSimulacro"("simulacro_id");
CREATE INDEX IF NOT EXISTS "OpcionPreguntaSimulacro_pregunta_id_idx" ON "OpcionPreguntaSimulacro"("pregunta_id");
CREATE INDEX IF NOT EXISTS "detalles_pedido_simulacro_id_idx" ON "detalles_pedido"("simulacro_id");

DO $$ BEGIN
  ALTER TABLE "ebook_annotaciones" ADD CONSTRAINT "ebook_annotaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ebook_annotaciones" ADD CONSTRAINT "ebook_annotaciones_ebook_id_fkey" FOREIGN KEY ("ebook_id") REFERENCES "ebooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_simulacro_id_fkey" FOREIGN KEY ("simulacro_id") REFERENCES "Simulacro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "inscripciones_simulacro" ADD CONSTRAINT "inscripciones_simulacro_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "inscripciones_simulacro" ADD CONSTRAINT "inscripciones_simulacro_simulacro_id_fkey" FOREIGN KEY ("simulacro_id") REFERENCES "Simulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "PreguntaSimulacro" ADD CONSTRAINT "PreguntaSimulacro_simulacro_id_fkey" FOREIGN KEY ("simulacro_id") REFERENCES "Simulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "OpcionPreguntaSimulacro" ADD CONSTRAINT "OpcionPreguntaSimulacro_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "PreguntaSimulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
