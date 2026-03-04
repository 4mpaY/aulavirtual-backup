-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "dominio" TEXT NOT NULL,
    "logo_url" TEXT,
    "favicon_url" TEXT,
    "color_primario" TEXT NOT NULL DEFAULT '#2e7d32',
    "color_secundario" TEXT NOT NULL DEFAULT '#0284c7',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_dominio_key" ON "tenants"("dominio");
