-- AlterTable
ALTER TABLE "agente_aduanas" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "gasto_importacion" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "incoterms" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "tipo_via" ADD COLUMN     "empresaId" INTEGER;

-- CreateTable
CREATE TABLE "factor_internamiento" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "valor" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "factor_internamiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "factor_internamiento_codigo_key" ON "factor_internamiento"("codigo");

-- AddForeignKey
ALTER TABLE "agente_aduanas" ADD CONSTRAINT "agente_aduanas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incoterms" ADD CONSTRAINT "incoterms_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_via" ADD CONSTRAINT "tipo_via_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gasto_importacion" ADD CONSTRAINT "gasto_importacion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factor_internamiento" ADD CONSTRAINT "factor_internamiento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
