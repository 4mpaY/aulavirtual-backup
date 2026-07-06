-- Migración recuperada: la columna ya existía en BD al fallar el deploy original.
ALTER TABLE "cursos" ADD COLUMN IF NOT EXISTS "orden" INTEGER NOT NULL DEFAULT 0;
