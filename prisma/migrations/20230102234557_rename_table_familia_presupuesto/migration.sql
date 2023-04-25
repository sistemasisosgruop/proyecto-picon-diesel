/*
  Warnings:

  - You are about to drop the column `nombre` on the `familia_presupuesto` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `sub_familia_presupuesto` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `familia_presupuesto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `sub_familia_presupuesto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "familia_presupuesto" DROP COLUMN "nombre",
ADD COLUMN     "descripcion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sub_familia_presupuesto" DROP COLUMN "nombre",
ADD COLUMN     "descripcion" TEXT NOT NULL;
