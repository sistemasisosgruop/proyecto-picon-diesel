-- DropForeignKey
ALTER TABLE "caracteristica_to_material" DROP CONSTRAINT "caracteristica_to_material_caracteristicaId_fkey";

-- DropForeignKey
ALTER TABLE "caracteristica_to_material" DROP CONSTRAINT "caracteristica_to_material_materialId_fkey";

-- AddForeignKey
ALTER TABLE "caracteristica_to_material" ADD CONSTRAINT "caracteristica_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristica_to_material" ADD CONSTRAINT "caracteristica_to_material_caracteristicaId_fkey" FOREIGN KEY ("caracteristicaId") REFERENCES "caracteristica"("id") ON DELETE CASCADE ON UPDATE CASCADE;
