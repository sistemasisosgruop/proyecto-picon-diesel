/*
  Warnings:

  - You are about to drop the column `descripcion` on the `tipo_cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `tipo_cliente` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `tipo_cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tipo_cliente" DROP COLUMN "descripcion",
DROP COLUMN "nombre",
ADD COLUMN     "tipo" TEXT NOT NULL;
