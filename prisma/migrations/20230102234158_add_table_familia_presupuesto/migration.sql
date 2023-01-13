/*
  Warnings:

  - Added the required column `empresaId` to the `material_presupuesto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "material_presupuesto" DROP CONSTRAINT "material_presupuesto_familiaId_fkey";

-- DropForeignKey
ALTER TABLE "material_presupuesto" DROP CONSTRAINT "material_presupuesto_subFamiliaId_fkey";

-- AlterTable
ALTER TABLE "material_presupuesto" ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "familia_presupuesto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "familia_presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_familia_presupuesto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "familiaId" INTEGER NOT NULL,

    CONSTRAINT "sub_familia_presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "familia_presupuesto_codigo_key" ON "familia_presupuesto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "sub_familia_presupuesto_codigo_key" ON "sub_familia_presupuesto"("codigo");

-- AddForeignKey
ALTER TABLE "familia_presupuesto" ADD CONSTRAINT "familia_presupuesto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_familia_presupuesto" ADD CONSTRAINT "sub_familia_presupuesto_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia_presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_presupuesto" ADD CONSTRAINT "material_presupuesto_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia_presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_presupuesto" ADD CONSTRAINT "material_presupuesto_subFamiliaId_fkey" FOREIGN KEY ("subFamiliaId") REFERENCES "sub_familia_presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_presupuesto" ADD CONSTRAINT "material_presupuesto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
