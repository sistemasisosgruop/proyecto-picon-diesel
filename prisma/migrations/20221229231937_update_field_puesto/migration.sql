/*
  Warnings:

  - You are about to drop the column `area` on the `personal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "personal" DROP COLUMN "area",
ADD COLUMN     "puesto" TEXT;
