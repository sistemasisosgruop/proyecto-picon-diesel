/*
  Warnings:

  - A unique constraint covering the columns `[tipo]` on the table `tipo_cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tipo_cliente_tipo_key" ON "tipo_cliente"("tipo");
