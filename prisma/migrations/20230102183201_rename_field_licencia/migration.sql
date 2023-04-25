/*
  Warnings:

  - You are about to drop the column `locencia` on the `chofer` table. All the data in the column will be lost.
  - Added the required column `licencia` to the `chofer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chofer" DROP COLUMN "locencia",
ADD COLUMN     "licencia" TEXT NOT NULL;
