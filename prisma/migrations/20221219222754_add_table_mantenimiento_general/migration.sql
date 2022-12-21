/*
  Warnings:

  - You are about to drop the `parametro_general` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "pais" ADD COLUMN     "empresaId" INTEGER;

-- DropTable
DROP TABLE "parametro_general";

-- CreateTable
CREATE TABLE "empresa" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "web" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursal" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametro_global" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "parametro_global_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresa_codigo_key" ON "empresa"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "sucursal_codigo_key" ON "sucursal"("codigo");

-- AddForeignKey
ALTER TABLE "sucursal" ADD CONSTRAINT "sucursal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pais" ADD CONSTRAINT "pais_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parametro_global" ADD CONSTRAINT "parametro_global_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
