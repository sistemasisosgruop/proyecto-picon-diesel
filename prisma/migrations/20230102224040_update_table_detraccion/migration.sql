/*
  Warnings:

  - You are about to drop the column `abreviatura` on the `detraccion` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `detraccion` table. All the data in the column will be lost.
  - Added the required column `definicion` to the `detraccion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detraccion" DROP COLUMN "abreviatura",
DROP COLUMN "nombre",
ADD COLUMN     "definicion" TEXT NOT NULL;
