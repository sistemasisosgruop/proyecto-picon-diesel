/*
  Warnings:

  - A unique constraint covering the columns `[codigo,empresaId]` on the table `pais` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "pais_codigo_key";

-- CreateIndex
CREATE UNIQUE INDEX "pais_codigo_empresaId_key" ON "pais"("codigo", "empresaId");
