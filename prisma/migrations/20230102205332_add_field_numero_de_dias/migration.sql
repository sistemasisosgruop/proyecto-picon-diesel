/*
  Warnings:

  - Added the required column `numero_de_dias` to the `forma_de_pago_credito` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forma_de_pago_credito" ADD COLUMN     "numero_de_dias" INTEGER NOT NULL;
