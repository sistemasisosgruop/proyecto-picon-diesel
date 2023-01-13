/*
  Warnings:

  - You are about to drop the column `st_sub_total` on the `detraccion` table. All the data in the column will be lost.
  - You are about to drop the column `st_sub_total` on the `factor_internamiento` table. All the data in the column will be lost.
  - You are about to drop the column `st_sub_total` on the `material_presupuesto` table. All the data in the column will be lost.
  - You are about to drop the column `st_sub_total` on the `servicio` table. All the data in the column will be lost.
  - You are about to drop the column `st_sub_total` on the `tipo_de_cambio` table. All the data in the column will be lost.
  - You are about to drop the column `st_sub_total` on the `trabajo_terceros` table. All the data in the column will be lost.
  - You are about to drop the column `st_sub_total` on the `vendedor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "detraccion" DROP COLUMN "st_sub_total",
ADD COLUMN     "porcentaje" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "factor_internamiento" DROP COLUMN "st_sub_total",
ADD COLUMN     "valor" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "material_presupuesto" DROP COLUMN "st_sub_total",
ADD COLUMN     "precio" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "servicio" DROP COLUMN "st_sub_total",
ADD COLUMN     "precio" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tipo_de_cambio" DROP COLUMN "st_sub_total",
ADD COLUMN     "valor" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "trabajo_terceros" DROP COLUMN "st_sub_total",
ADD COLUMN     "precio" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "vendedor" DROP COLUMN "st_sub_total",
ADD COLUMN     "comision" DECIMAL(12,2) NOT NULL DEFAULT 0;
