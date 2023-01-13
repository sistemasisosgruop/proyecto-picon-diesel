-- AlterTable
ALTER TABLE "vendedor" ALTER COLUMN "comision" DROP NOT NULL,
ALTER COLUMN "comision" SET DEFAULT 0.0;
