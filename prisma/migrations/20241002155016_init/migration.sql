/*
  Warnings:

  - You are about to drop the column `formaPagoContadoId` on the `guia_de_remision` table. All the data in the column will be lost.
  - You are about to drop the column `formaPagoCreditoId` on the `guia_de_remision` table. All the data in the column will be lost.
  - You are about to drop the column `motivoDeTraslado` on the `guia_de_remision` table. All the data in the column will be lost.
  - You are about to drop the column `tipoDeCambioId` on the `guia_de_remision` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "guia_de_remision" DROP CONSTRAINT "guia_de_remision_formaPagoContadoId_fkey";

-- DropForeignKey
ALTER TABLE "guia_de_remision" DROP CONSTRAINT "guia_de_remision_formaPagoCreditoId_fkey";

-- DropForeignKey
ALTER TABLE "guia_de_remision" DROP CONSTRAINT "guia_de_remision_tipoDeCambioId_fkey";

-- AlterTable
ALTER TABLE "guia_de_remision" DROP COLUMN "formaPagoContadoId",
DROP COLUMN "formaPagoCreditoId",
DROP COLUMN "motivoDeTraslado",
DROP COLUMN "tipoDeCambioId",
ADD COLUMN     "motivoDeTrasladoId" INTEGER;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_motivoDeTrasladoId_fkey" FOREIGN KEY ("motivoDeTrasladoId") REFERENCES "motivo_traslado_guia_remision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
