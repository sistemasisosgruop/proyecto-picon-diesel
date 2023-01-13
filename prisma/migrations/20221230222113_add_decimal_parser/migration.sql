/*
  Warnings:

  - You are about to drop the column `porcentaje` on the `detraccion` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `factor_internamiento` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `material_presupuesto` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `servicio` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `tipo_de_cambio` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `trabajo_terceros` table. All the data in the column will be lost.
  - You are about to drop the column `comision` on the `vendedor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "detraccion" DROP COLUMN "porcentaje",
ADD COLUMN     "st_sub_total" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "factor_internamiento" DROP COLUMN "valor",
ADD COLUMN     "st_sub_total" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "material_presupuesto" DROP COLUMN "precio",
ADD COLUMN     "st_sub_total" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "servicio" DROP COLUMN "precio",
ADD COLUMN     "st_sub_total" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tipo_de_cambio" DROP COLUMN "valor",
ADD COLUMN     "st_sub_total" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "trabajo_terceros" DROP COLUMN "precio",
ADD COLUMN     "st_sub_total" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "vendedor" DROP COLUMN "comision",
ADD COLUMN     "st_sub_total" DECIMAL(12,2) NOT NULL DEFAULT 0;
