-- Hacer curso_id opcional en DetallePedido para soportar items tipo EBOOK
ALTER TABLE "detalles_pedido" ALTER COLUMN "curso_id" DROP NOT NULL;

-- Agregar columna ebook_id (FK a ebooks)
ALTER TABLE "detalles_pedido" ADD COLUMN "ebook_id" TEXT;

-- Agregar columna tipo_item con valor por defecto CURSO para registros existentes
ALTER TABLE "detalles_pedido" ADD COLUMN "tipo_item" TEXT NOT NULL DEFAULT 'CURSO';

-- FK constraint para ebook_id
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_ebook_id_fkey"
  FOREIGN KEY ("ebook_id") REFERENCES "ebooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Índice para ebook_id
CREATE INDEX "detalles_pedido_ebook_id_idx" ON "detalles_pedido"("ebook_id");
