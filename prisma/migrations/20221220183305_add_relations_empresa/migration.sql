/*
  Warnings:

  - You are about to drop the `_CargoToPersonal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cargo` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `tipo_documento` on the `cliente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `cliente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `costo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `cuenta_bancaria` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `personal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `vendedor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EstadoEnum" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "TipoDocumentoEnum" AS ENUM ('DNI', 'RUC');

-- CreateEnum
CREATE TYPE "RolesEnum" AS ENUM ('Administrador', 'Vendedor', 'Tecnico');

-- DropForeignKey
ALTER TABLE "_CargoToPersonal" DROP CONSTRAINT "_CargoToPersonal_A_fkey";

-- DropForeignKey
ALTER TABLE "_CargoToPersonal" DROP CONSTRAINT "_CargoToPersonal_B_fkey";

-- AlterTable
ALTER TABLE "banco" ADD COLUMN     "empresaId" INTEGER;

-- AlterTable
ALTER TABLE "cliente" ADD COLUMN     "empresaId" INTEGER,
DROP COLUMN "tipo_documento",
ADD COLUMN     "tipo_documento" "TipoDocumentoEnum" NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoEnum" NOT NULL;

-- AlterTable
ALTER TABLE "costo" ADD COLUMN     "empresaId" INTEGER,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoEnum" NOT NULL;

-- AlterTable
ALTER TABLE "cuenta_bancaria" ADD COLUMN     "empresaId" INTEGER,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoEnum" NOT NULL;

-- AlterTable
ALTER TABLE "personal" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoEnum" NOT NULL;

-- AlterTable
ALTER TABLE "tipo_cliente" ADD COLUMN     "empresaId" INTEGER,
ADD COLUMN     "estado" "EstadoEnum" NOT NULL DEFAULT 'Activo';

-- AlterTable
ALTER TABLE "vendedor" ADD COLUMN     "empresaId" INTEGER,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoEnum" NOT NULL;

-- DropTable
DROP TABLE "_CargoToPersonal";

-- DropTable
DROP TABLE "cargo";

-- DropEnum
DROP TYPE "EstadoAdministrativo";

-- DropEnum
DROP TYPE "TipoDocumento";

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" "RolesEnum" NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmpresaToPersonal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonalToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleToVendedor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EmpresaToPersonal_AB_unique" ON "_EmpresaToPersonal"("A", "B");

-- CreateIndex
CREATE INDEX "_EmpresaToPersonal_B_index" ON "_EmpresaToPersonal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonalToRole_AB_unique" ON "_PersonalToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonalToRole_B_index" ON "_PersonalToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToVendedor_AB_unique" ON "_RoleToVendedor"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToVendedor_B_index" ON "_RoleToVendedor"("B");

-- AddForeignKey
ALTER TABLE "vendedor" ADD CONSTRAINT "vendedor_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "costo" ADD CONSTRAINT "costo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banco" ADD CONSTRAINT "banco_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuenta_bancaria" ADD CONSTRAINT "cuenta_bancaria_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_cliente" ADD CONSTRAINT "tipo_cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmpresaToPersonal" ADD CONSTRAINT "_EmpresaToPersonal_A_fkey" FOREIGN KEY ("A") REFERENCES "empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmpresaToPersonal" ADD CONSTRAINT "_EmpresaToPersonal_B_fkey" FOREIGN KEY ("B") REFERENCES "personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalToRole" ADD CONSTRAINT "_PersonalToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalToRole" ADD CONSTRAINT "_PersonalToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToVendedor" ADD CONSTRAINT "_RoleToVendedor_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToVendedor" ADD CONSTRAINT "_RoleToVendedor_B_fkey" FOREIGN KEY ("B") REFERENCES "vendedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
