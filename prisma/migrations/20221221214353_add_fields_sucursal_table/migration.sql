-- AlterTable
ALTER TABLE "empresa" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "web" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sucursal" ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "telefono" TEXT;
