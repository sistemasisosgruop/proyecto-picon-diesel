/*
  Warnings:

  - You are about to drop the `_MaterialToMaterialEquivalencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MaterialToMaterialReemplazo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MaterialToMaterialSimilitud` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `material_reemplazo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `material_requivalencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `material_similitud` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MaterialToMaterialEquivalencia" DROP CONSTRAINT "_MaterialToMaterialEquivalencia_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToMaterialEquivalencia" DROP CONSTRAINT "_MaterialToMaterialEquivalencia_B_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToMaterialReemplazo" DROP CONSTRAINT "_MaterialToMaterialReemplazo_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToMaterialReemplazo" DROP CONSTRAINT "_MaterialToMaterialReemplazo_B_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToMaterialSimilitud" DROP CONSTRAINT "_MaterialToMaterialSimilitud_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToMaterialSimilitud" DROP CONSTRAINT "_MaterialToMaterialSimilitud_B_fkey";

-- AlterTable
ALTER TABLE "material" ADD COLUMN     "aplicacionDeMaquina" JSONB[],
ADD COLUMN     "materialEquivalencia" JSONB[],
ADD COLUMN     "materialReemplazo" JSONB[],
ADD COLUMN     "materialSimilitud" JSONB[];

-- DropTable
DROP TABLE "_MaterialToMaterialEquivalencia";

-- DropTable
DROP TABLE "_MaterialToMaterialReemplazo";

-- DropTable
DROP TABLE "_MaterialToMaterialSimilitud";

-- DropTable
DROP TABLE "material_reemplazo";

-- DropTable
DROP TABLE "material_requivalencia";

-- DropTable
DROP TABLE "material_similitud";
