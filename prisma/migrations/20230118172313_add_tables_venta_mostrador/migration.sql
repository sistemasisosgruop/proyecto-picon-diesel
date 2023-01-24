/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `parametro_global` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre,empresaId]` on the table `parametro_global` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "material" ADD COLUMN     "cotizacionId" INTEGER;

-- CreateTable
CREATE TABLE "cotizacion" (
    "id" SERIAL NOT NULL,
    "number" TEXT,
    "fechaCotizacion" TIMESTAMP(3) NOT NULL,
    "fechaValidez" TIMESTAMP(3) NOT NULL,
    "diasValidez" INTEGER NOT NULL,
    "referencia" TEXT,
    "nota" TEXT,
    "maquina" TEXT,
    "moneda" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNeto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSoles" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "formaPagoContadoId" INTEGER,
    "formaPagoCreditoId" INTEGER,
    "tipoDeCambioId" INTEGER,
    "clienteId" INTEGER,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "empresaId" INTEGER NOT NULL,
    "maquinaId" INTEGER,
    "aprovacionCotizacionId" INTEGER,

    CONSTRAINT "cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aprovacion_cotizacion" (
    "id" SERIAL NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNeto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSoles" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "aprovacionPedidoId" INTEGER,

    CONSTRAINT "aprovacion_cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aprovacion_pedido" (
    "id" SERIAL NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNeto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSoles" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "aprovacion_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guia_de_remision" (
    "id" SERIAL NOT NULL,
    "tipoDeGuia" TEXT,
    "NumeroGuiaDeRemision" TEXT,
    "serie" TEXT,
    "fechaDeCotizacion" TIMESTAMP(3) NOT NULL,
    "fechaDeValidez" TIMESTAMP(3) NOT NULL,
    "diasDeValidez" INTEGER NOT NULL,
    "moneda" TEXT,
    "estado" TEXT,
    "numeroDeOrden" TEXT,
    "puntoDePartida" TEXT,
    "puntoDeLlegada" TEXT,
    "motivoDeTraslado" TEXT,
    "referencia" TEXT,
    "nota" TEXT,
    "aprovacionPedidoId" INTEGER,
    "formaPagoContadoId" INTEGER,
    "formaPagoCreditoId" INTEGER,
    "tipoDeCambioId" INTEGER,
    "clienteId" INTEGER,
    "maquina" TEXT NOT NULL,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "empresaId" INTEGER NOT NULL,
    "agenciaId" INTEGER,
    "vehiculoId" INTEGER,
    "choferId" INTEGER,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNeto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSoles" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "guia_de_remision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
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

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cotizacion_number_key" ON "cotizacion"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_guiaDeRemisionId_key" ON "Factura"("guiaDeRemisionId");

-- CreateIndex
CREATE UNIQUE INDEX "parametro_global_nombre_key" ON "parametro_global"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "parametro_global_nombre_empresaId_key" ON "parametro_global"("nombre", "empresaId");

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_formaPagoContadoId_fkey" FOREIGN KEY ("formaPagoContadoId") REFERENCES "forma_de_pago_contado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_formaPagoCreditoId_fkey" FOREIGN KEY ("formaPagoCreditoId") REFERENCES "forma_de_pago_credito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_tipoDeCambioId_fkey" FOREIGN KEY ("tipoDeCambioId") REFERENCES "tipo_de_cambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_aprovacionCotizacionId_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion" ADD CONSTRAINT "aprovacion_cotizacion_aprovacionPedidoId_fkey" FOREIGN KEY ("aprovacionPedidoId") REFERENCES "aprovacion_pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_aprovacionPedidoId_fkey" FOREIGN KEY ("aprovacionPedidoId") REFERENCES "aprovacion_pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_formaPagoContadoId_fkey" FOREIGN KEY ("formaPagoContadoId") REFERENCES "forma_de_pago_contado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_formaPagoCreditoId_fkey" FOREIGN KEY ("formaPagoCreditoId") REFERENCES "forma_de_pago_credito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_tipoDeCambioId_fkey" FOREIGN KEY ("tipoDeCambioId") REFERENCES "tipo_de_cambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "agencia_transporte"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "chofer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_formaPagoContadoId_fkey" FOREIGN KEY ("formaPagoContadoId") REFERENCES "forma_de_pago_contado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_formaPagoCreditoId_fkey" FOREIGN KEY ("formaPagoCreditoId") REFERENCES "forma_de_pago_credito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_tipoDeCambioId_fkey" FOREIGN KEY ("tipoDeCambioId") REFERENCES "tipo_de_cambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_guiaDeRemisionId_fkey" FOREIGN KEY ("guiaDeRemisionId") REFERENCES "guia_de_remision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_detraccionId_fkey" FOREIGN KEY ("detraccionId") REFERENCES "detraccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
