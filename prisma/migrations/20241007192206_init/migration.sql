/*
  Warnings:

  - The `aplicacionDeMaquina` column on the `material` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `materialEquivalencia` column on the `material` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `materialReemplazo` column on the `material` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `materialSimilitud` column on the `material` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "material" DROP COLUMN "aplicacionDeMaquina",
ADD COLUMN     "aplicacionDeMaquina" JSONB[],
DROP COLUMN "materialEquivalencia",
ADD COLUMN     "materialEquivalencia" JSONB[],
DROP COLUMN "materialReemplazo",
ADD COLUMN     "materialReemplazo" JSONB[],
DROP COLUMN "materialSimilitud",
ADD COLUMN     "materialSimilitud" JSONB[];
