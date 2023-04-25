/*
  Warnings:

  - Changed the type of `valor` on the `factor_internamiento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "factor_internamiento" DROP COLUMN "valor",
ADD COLUMN     "valor" DECIMAL(65,30) NOT NULL;
