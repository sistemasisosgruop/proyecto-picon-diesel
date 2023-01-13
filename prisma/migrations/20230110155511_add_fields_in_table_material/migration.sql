-- AlterTable
ALTER TABLE "material" ADD COLUMN     "codigoBombaInyeccion" TEXT,
ADD COLUMN     "codigoMotorOriginal" TEXT,
ADD COLUMN     "stock" INTEGER DEFAULT 0,
ALTER COLUMN "codigoFabricante" DROP NOT NULL,
ALTER COLUMN "tipoFabricante" DROP NOT NULL;
