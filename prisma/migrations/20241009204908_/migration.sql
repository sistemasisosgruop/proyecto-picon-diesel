/*
  Warnings:

  - You are about to drop the column `puesto` on the `personal` table. All the data in the column will be lost.
  - Added the required column `puestoId` to the `personal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "personal" DROP COLUMN "puesto",
ADD COLUMN     "puestoId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Puesto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Puesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submodulo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "moduloId" INTEGER NOT NULL,

    CONSTRAINT "Submodulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" SERIAL NOT NULL,
    "puestoId" INTEGER NOT NULL,
    "submoduloId" INTEGER NOT NULL,
    "crear" BOOLEAN NOT NULL,
    "leer" BOOLEAN NOT NULL,
    "actualizar" BOOLEAN NOT NULL,
    "eliminar" BOOLEAN NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "personal" ADD CONSTRAINT "personal_puestoId_fkey" FOREIGN KEY ("puestoId") REFERENCES "Puesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submodulo" ADD CONSTRAINT "Submodulo_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_puestoId_fkey" FOREIGN KEY ("puestoId") REFERENCES "Puesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_submoduloId_fkey" FOREIGN KEY ("submoduloId") REFERENCES "Submodulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
