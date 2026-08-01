-- CreateEnum
CREATE TYPE "EstadoEbook" AS ENUM ('BORRADOR', 'PUBLICADO', 'ARCHIVADO');

-- CreateTable
CREATE TABLE "ebooks" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "autor" TEXT,
    "miniatura" TEXT,
    "archivo_pdf" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precio_falso" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "estado" "EstadoEbook" NOT NULL DEFAULT 'BORRADOR',
    "es_gratis" BOOLEAN NOT NULL DEFAULT false,
    "paginas" INTEGER,
    "categoria_id" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ebooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ebook_accesos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "ebook_id" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ebook_accesos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ebooks_slug_key" ON "ebooks"("slug");

-- CreateIndex
CREATE INDEX "ebooks_categoria_id_idx" ON "ebooks"("categoria_id");

-- CreateIndex
CREATE INDEX "ebooks_estado_idx" ON "ebooks"("estado");

-- CreateIndex
CREATE INDEX "ebook_accesos_usuario_id_idx" ON "ebook_accesos"("usuario_id");

-- CreateIndex
CREATE INDEX "ebook_accesos_ebook_id_idx" ON "ebook_accesos"("ebook_id");

-- CreateIndex
CREATE UNIQUE INDEX "ebook_accesos_usuario_id_ebook_id_key" ON "ebook_accesos"("usuario_id", "ebook_id");

-- AddForeignKey
ALTER TABLE "ebooks" ADD CONSTRAINT "ebooks_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ebook_accesos" ADD CONSTRAINT "ebook_accesos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ebook_accesos" ADD CONSTRAINT "ebook_accesos_ebook_id_fkey" FOREIGN KEY ("ebook_id") REFERENCES "ebooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
