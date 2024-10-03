/*
  Warnings:

  - You are about to drop the column `aprovacionPedidoId` on the `aprovacion_cotizacion` table. All the data in the column will be lost.
  - You are about to drop the column `aprovacionCotizacionId` on the `cotizacion` table. All the data in the column will be lost.
  - You are about to drop the column `cotizacionId` on the `material` table. All the data in the column will be lost.
  - You are about to drop the `Factura` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[number]` on the table `aprovacion_cotizacion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `aprovacion_pedido` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aprovacionPedidoId]` on the table `guia_de_remision` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empresaId` to the `aprovacion_cotizacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sucursalId` to the `aprovacion_cotizacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `aprovacion_pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sucursalId` to the `aprovacion_pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sucursalId` to the `cotizacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_detraccionId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_formaPagoContadoId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_formaPagoCreditoId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_guiaDeRemisionId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_personalId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_tipoDeCambioId_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_vendedorId_fkey";

-- DropForeignKey
ALTER TABLE "aprovacion_cotizacion" DROP CONSTRAINT "aprovacion_cotizacion_aprovacionPedidoId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion" DROP CONSTRAINT "cotizacion_aprovacionCotizacionId_fkey";

-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_cotizacionId_fkey";

-- AlterTable
ALTER TABLE "aprovacion_cotizacion" DROP COLUMN "aprovacionPedidoId",
ADD COLUMN     "clienteId" INTEGER,
ADD COLUMN     "empresaId" INTEGER NOT NULL,
ADD COLUMN     "estadoDelDocumento" TEXT,
ADD COLUMN     "fechaAprobacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maquina" TEXT,
ADD COLUMN     "moneda" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "sucursalId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "aprovacion_pedido" ADD COLUMN     "clienteId" INTEGER,
ADD COLUMN     "empresaId" INTEGER NOT NULL,
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "fechaAprobacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maquina" TEXT,
ADD COLUMN     "moneda" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "sucursalId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "cotizacion" DROP COLUMN "aprovacionCotizacionId",
ADD COLUMN     "estadoDelDocumento" TEXT,
ADD COLUMN     "sucursalId" INTEGER NOT NULL,
ALTER COLUMN "fechaCotizacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "fechaValidez" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "guia_de_remision" ALTER COLUMN "fechaDeCotizacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "fechaDeValidez" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material" DROP COLUMN "cotizacionId",
ADD COLUMN     "ventaUnidad" DECIMAL(12,2) DEFAULT 0;

-- DropTable
DROP TABLE "Factura";

-- CreateTable
CREATE TABLE "cotizacion_to_material" (
    "id" SERIAL NOT NULL,
    "cantidadMateriales" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "cotizacionId" INTEGER NOT NULL,

    CONSTRAINT "cotizacion_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizacion_to_aprovacion_cotizacion" (
    "id" SERIAL NOT NULL,
    "cotizacionId" INTEGER NOT NULL,
    "aprovacionCotizacionId" INTEGER NOT NULL,

    CONSTRAINT "cotizacion_to_aprovacion_cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aprovacion_cotizacion_to_material" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "aprovacionCotizacionId" INTEGER NOT NULL,

    CONSTRAINT "aprovacion_cotizacion_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aprovacion_cotizacion_to_aprovacion_pedido" (
    "id" SERIAL NOT NULL,
    "aprovacionCotizacionId" INTEGER NOT NULL,
    "aprovacionPedidoId" INTEGER NOT NULL,

    CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aprovacion_pedido_to_material" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "aprovacionPedidonId" INTEGER NOT NULL,

    CONSTRAINT "aprovacion_pedido_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factura" (
    "id" SERIAL NOT NULL,
    "numeroDeFactura" TEXT,
    "tipoDeDocumento" "TipoDocumentoEnum" NOT NULL,
    "serie" TEXT,
    "fechaDeFactura" TIMESTAMP(3) NOT NULL,
    "fechaDeValidez" TIMESTAMP(3) NOT NULL,
    "diasDeValidez" INTEGER NOT NULL,
    "moneda" TEXT,
    "formaPagoContadoId" INTEGER,
    "formaPagoCreditoId" INTEGER,
    "tipoDeCambioId" INTEGER,
    "estado" TEXT,
    "guiaDeRemisionId" INTEGER,
    "clienteId" INTEGER,
    "maquina" TEXT,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "ordenDeCompra" TEXT,
    "empresaId" INTEGER NOT NULL,
    "referencia" TEXT,
    "nota" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNeto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSoles" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "icbper" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "haveIcbper" BOOLEAN NOT NULL DEFAULT false,
    "detraccionId" INTEGER,

    CONSTRAINT "factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporte_ventas" (
    "id" SERIAL NOT NULL,
    "nroReporte" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlPdf" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "reporte_ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporte_record_clientes" (
    "id" SERIAL NOT NULL,
    "nroReporte" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlPdf" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "reporte_record_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporte_record_proveedores" (
    "id" SERIAL NOT NULL,
    "nroReporte" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlPdf" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "reporte_record_proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporte_stock_minimo" (
    "id" SERIAL NOT NULL,
    "nroReporte" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlPdf" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "reporte_stock_minimo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporte_mensual_ventas" (
    "id" SERIAL NOT NULL,
    "nroReporte" INTEGER NOT NULL,
    "mes" TEXT NOT NULL,
    "anio" TEXT NOT NULL,
    "urlPdf" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "reporte_mensual_ventas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "factura_guiaDeRemisionId_key" ON "factura"("guiaDeRemisionId");

-- CreateIndex
CREATE UNIQUE INDEX "aprovacion_cotizacion_number_key" ON "aprovacion_cotizacion"("number");

-- CreateIndex
CREATE UNIQUE INDEX "aprovacion_pedido_number_key" ON "aprovacion_pedido"("number");

-- CreateIndex
CREATE UNIQUE INDEX "guia_de_remision_aprovacionPedidoId_key" ON "guia_de_remision"("aprovacionPedidoId");

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_material" ADD CONSTRAINT "cotizacion_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_material" ADD CONSTRAINT "cotizacion_to_material_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_aprovacion_cotizacion" ADD CONSTRAINT "cotizacion_to_aprovacion_cotizacion_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_aprovacion_cotizacion" ADD CONSTRAINT "cotizacion_to_aprovacion_cotizacion_aprovacionCotizacionId_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion" ADD CONSTRAINT "aprovacion_cotizacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion" ADD CONSTRAINT "aprovacion_cotizacion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion" ADD CONSTRAINT "aprovacion_cotizacion_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_material" ADD CONSTRAINT "aprovacion_cotizacion_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_material" ADD CONSTRAINT "aprovacion_cotizacion_to_material_aprovacionCotizacionId_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_aprovacion_pedido" ADD CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_aprovacionCotiz_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_aprovacion_pedido" ADD CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_aprovacionPedid_fkey" FOREIGN KEY ("aprovacionPedidoId") REFERENCES "aprovacion_pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido" ADD CONSTRAINT "aprovacion_pedido_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido" ADD CONSTRAINT "aprovacion_pedido_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido" ADD CONSTRAINT "aprovacion_pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido_to_material" ADD CONSTRAINT "aprovacion_pedido_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido_to_material" ADD CONSTRAINT "aprovacion_pedido_to_material_aprovacionPedidonId_fkey" FOREIGN KEY ("aprovacionPedidonId") REFERENCES "aprovacion_pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_formaPagoContadoId_fkey" FOREIGN KEY ("formaPagoContadoId") REFERENCES "forma_de_pago_contado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_formaPagoCreditoId_fkey" FOREIGN KEY ("formaPagoCreditoId") REFERENCES "forma_de_pago_credito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_tipoDeCambioId_fkey" FOREIGN KEY ("tipoDeCambioId") REFERENCES "tipo_de_cambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_guiaDeRemisionId_fkey" FOREIGN KEY ("guiaDeRemisionId") REFERENCES "guia_de_remision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_detraccionId_fkey" FOREIGN KEY ("detraccionId") REFERENCES "detraccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporte_ventas" ADD CONSTRAINT "reporte_ventas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporte_record_clientes" ADD CONSTRAINT "reporte_record_clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporte_record_proveedores" ADD CONSTRAINT "reporte_record_proveedores_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporte_stock_minimo" ADD CONSTRAINT "reporte_stock_minimo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporte_mensual_ventas" ADD CONSTRAINT "reporte_mensual_ventas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
