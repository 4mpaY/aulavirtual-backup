-- CreateTable
CREATE TABLE "rutas_aprendizaje" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "miniatura" TEXT,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rutas_aprendizaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos_en_ruta" (
    "id" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "ruta_id" TEXT NOT NULL,
    "curso_id" TEXT NOT NULL,

    CONSTRAINT "cursos_en_ruta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rutas_aprendizaje_slug_key" ON "rutas_aprendizaje"("slug");

-- CreateIndex
CREATE INDEX "cursos_en_ruta_ruta_id_idx" ON "cursos_en_ruta"("ruta_id");

-- CreateIndex
CREATE INDEX "cursos_en_ruta_curso_id_idx" ON "cursos_en_ruta"("curso_id");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_en_ruta_ruta_id_curso_id_key" ON "cursos_en_ruta"("ruta_id", "curso_id");

-- AddForeignKey
ALTER TABLE "cursos_en_ruta" ADD CONSTRAINT "cursos_en_ruta_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "rutas_aprendizaje"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos_en_ruta" ADD CONSTRAINT "cursos_en_ruta_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
