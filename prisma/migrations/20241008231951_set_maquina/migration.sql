-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_bombaInyeccionPaisId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_descripcionBombaInyeccionId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_descripcionInyectorId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_fabricaMaquinaId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_inyectorPaisId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_marcaFabricaInyectorId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_marcaFabricaSistemaInyeccionId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_marcaMotorId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_modeloMaquinaId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_motorPaisId_fkey";

-- DropForeignKey
ALTER TABLE "maquina" DROP CONSTRAINT "maquina_nombreMaquinaId_fkey";

-- AlterTable
ALTER TABLE "maquina" ADD COLUMN     "codigoOriginalTobera" TEXT,
ALTER COLUMN "fabricaMaquinaId" DROP NOT NULL,
ALTER COLUMN "modeloMaquinaId" DROP NOT NULL,
ALTER COLUMN "nombreMaquinaId" DROP NOT NULL,
ALTER COLUMN "marcaMotorId" DROP NOT NULL,
ALTER COLUMN "motorPaisId" DROP NOT NULL,
ALTER COLUMN "marcaFabricaSistemaInyeccionId" DROP NOT NULL,
ALTER COLUMN "descripcionBombaInyeccionId" DROP NOT NULL,
ALTER COLUMN "bombaInyeccionPaisId" DROP NOT NULL,
ALTER COLUMN "marcaFabricaInyectorId" DROP NOT NULL,
ALTER COLUMN "descripcionInyectorId" DROP NOT NULL,
ALTER COLUMN "inyectorPaisId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_fabricaMaquinaId_fkey" FOREIGN KEY ("fabricaMaquinaId") REFERENCES "fabrica_maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_modeloMaquinaId_fkey" FOREIGN KEY ("modeloMaquinaId") REFERENCES "modelo_maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_nombreMaquinaId_fkey" FOREIGN KEY ("nombreMaquinaId") REFERENCES "nombre_maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_marcaMotorId_fkey" FOREIGN KEY ("marcaMotorId") REFERENCES "marca_motor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_motorPaisId_fkey" FOREIGN KEY ("motorPaisId") REFERENCES "pais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_marcaFabricaSistemaInyeccionId_fkey" FOREIGN KEY ("marcaFabricaSistemaInyeccionId") REFERENCES "marca_fabrica_sistema_inyeccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_descripcionBombaInyeccionId_fkey" FOREIGN KEY ("descripcionBombaInyeccionId") REFERENCES "descripcion_bomba_inyeccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_bombaInyeccionPaisId_fkey" FOREIGN KEY ("bombaInyeccionPaisId") REFERENCES "pais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_marcaFabricaInyectorId_fkey" FOREIGN KEY ("marcaFabricaInyectorId") REFERENCES "marca_fabrica_inyector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_descripcionInyectorId_fkey" FOREIGN KEY ("descripcionInyectorId") REFERENCES "descripcion_inyector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_inyectorPaisId_fkey" FOREIGN KEY ("inyectorPaisId") REFERENCES "pais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
