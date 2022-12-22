/*
  Warnings:

  - A unique constraint covering the columns `[ruc]` on the table `empresa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "empresa_ruc_key" ON "empresa"("ruc");
