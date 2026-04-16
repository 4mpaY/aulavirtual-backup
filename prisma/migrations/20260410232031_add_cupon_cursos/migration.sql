-- CreateTable
CREATE TABLE "cupon_cursos" (
    "cupon_id" TEXT NOT NULL,
    "curso_id" TEXT NOT NULL,

    CONSTRAINT "cupon_cursos_pkey" PRIMARY KEY ("cupon_id","curso_id")
);

-- AddForeignKey
ALTER TABLE "cupon_cursos" ADD CONSTRAINT "cupon_cursos_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupon_cursos" ADD CONSTRAINT "cupon_cursos_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
