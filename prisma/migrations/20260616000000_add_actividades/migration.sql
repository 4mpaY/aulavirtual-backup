-- CreateEnum
CREATE TYPE "TipoActividad" AS ENUM ('ARCHIVO', 'FORMULARIO');

-- CreateTable
CREATE TABLE "actividades" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "instrucciones" TEXT,
    "tipo" "TipoActividad" NOT NULL DEFAULT 'ARCHIVO',
    "orden" INTEGER,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "puntaje_maximo" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "esta_publicado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "curso_id" TEXT NOT NULL,
    "modulo_id" TEXT,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas_actividad" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" "TipoPregunta" NOT NULL DEFAULT 'OPCION_MULTIPLE',
    "puntos" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "orden" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "actividad_id" TEXT NOT NULL,

    CONSTRAINT "preguntas_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opciones_pregunta_actividad" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "es_correcta" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL,
    "pregunta_id" TEXT NOT NULL,

    CONSTRAINT "opciones_pregunta_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entregas_actividad" (
    "id" TEXT NOT NULL,
    "archivo_url" TEXT,
    "archivo_nombre" TEXT,
    "comentario_estudiante" TEXT,
    "respuestas" JSONB,
    "nota" DOUBLE PRECISION,
    "comentario_docente" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "actividad_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,

    CONSTRAINT "entregas_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "actividades_curso_id_idx" ON "actividades"("curso_id");

-- CreateIndex
CREATE INDEX "actividades_modulo_id_idx" ON "actividades"("modulo_id");

-- CreateIndex
CREATE INDEX "preguntas_actividad_actividad_id_idx" ON "preguntas_actividad"("actividad_id");

-- CreateIndex
CREATE INDEX "opciones_pregunta_actividad_pregunta_id_idx" ON "opciones_pregunta_actividad"("pregunta_id");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_actividad_actividad_id_usuario_id_key" ON "entregas_actividad"("actividad_id", "usuario_id");

-- CreateIndex
CREATE INDEX "entregas_actividad_actividad_id_idx" ON "entregas_actividad"("actividad_id");

-- CreateIndex
CREATE INDEX "entregas_actividad_usuario_id_idx" ON "entregas_actividad"("usuario_id");

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preguntas_actividad" ADD CONSTRAINT "preguntas_actividad_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opciones_pregunta_actividad" ADD CONSTRAINT "opciones_pregunta_actividad_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "preguntas_actividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas_actividad" ADD CONSTRAINT "entregas_actividad_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas_actividad" ADD CONSTRAINT "entregas_actividad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
