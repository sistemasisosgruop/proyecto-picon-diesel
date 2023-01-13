/*
  Warnings:

  - The `de` column on the `parametro_descuento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `a` column on the `parametro_descuento` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "parametro_descuento" DROP COLUMN "de",
ADD COLUMN     "de" DECIMAL(12,2) NOT NULL DEFAULT 0,
DROP COLUMN "a",
ADD COLUMN     "a" DECIMAL(12,2) NOT NULL DEFAULT 0;
