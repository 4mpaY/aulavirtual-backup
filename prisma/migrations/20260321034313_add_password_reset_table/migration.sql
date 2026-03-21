-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "expira_en" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "password_resets_correo_idx" ON "password_resets"("correo");

-- CreateIndex
CREATE INDEX "password_resets_codigo_idx" ON "password_resets"("codigo");
