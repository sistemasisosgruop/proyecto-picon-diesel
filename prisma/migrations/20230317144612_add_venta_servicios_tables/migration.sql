/*
  Warnings:

  - You are about to drop the column `tipoDeDocumento` on the `factura` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numeroDeFactura]` on the table `factura` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sucursalId` to the `factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sucursalId` to the `guia_de_remision` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "aprovacion_cotizacion_to_aprovacion_pedido" DROP CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_aprovacionCotiz_fkey";

-- DropForeignKey
ALTER TABLE "aprovacion_cotizacion_to_aprovacion_pedido" DROP CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_aprovacionPedid_fkey";

-- DropForeignKey
ALTER TABLE "aprovacion_cotizacion_to_material" DROP CONSTRAINT "aprovacion_cotizacion_to_material_aprovacionCotizacionId_fkey";

-- DropForeignKey
ALTER TABLE "aprovacion_cotizacion_to_material" DROP CONSTRAINT "aprovacion_cotizacion_to_material_materialId_fkey";

-- DropForeignKey
ALTER TABLE "aprovacion_pedido_to_material" DROP CONSTRAINT "aprovacion_pedido_to_material_aprovacionPedidonId_fkey";

-- DropForeignKey
ALTER TABLE "aprovacion_pedido_to_material" DROP CONSTRAINT "aprovacion_pedido_to_material_materialId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion_to_aprovacion_cotizacion" DROP CONSTRAINT "cotizacion_to_aprovacion_cotizacion_aprovacionCotizacionId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion_to_aprovacion_cotizacion" DROP CONSTRAINT "cotizacion_to_aprovacion_cotizacion_cotizacionId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion_to_material" DROP CONSTRAINT "cotizacion_to_material_cotizacionId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion_to_material" DROP CONSTRAINT "cotizacion_to_material_materialId_fkey";

-- AlterTable
ALTER TABLE "factura" DROP COLUMN "tipoDeDocumento",
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "sucursalId" INTEGER NOT NULL,
ADD COLUMN     "tipoDeDocumentoId" INTEGER;

-- AlterTable
ALTER TABLE "guia_de_remision" ADD COLUMN     "sucursalId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "hoja_recepcion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "denominacion" TEXT NOT NULL,
    "tipoReparacion" TEXT NOT NULL,
    "clienteId" INTEGER,
    "fabricaMaquinaId" INTEGER NOT NULL,
    "modeloMaquinaId" INTEGER NOT NULL,
    "nombreMaquinaId" INTEGER NOT NULL,
    "paisId" INTEGER NOT NULL,
    "codigoMotorOriginal" TEXT NOT NULL,
    "serieMotor" TEXT NOT NULL,
    "serieChasis" TEXT NOT NULL,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "codigoBombaInyeccionOriginal" TEXT NOT NULL,
    "codigoBombaInyeccionFabricante" TEXT NOT NULL,
    "tipoBombaInyeccionFabricante" TEXT NOT NULL,
    "marcaFabricaSistemaInyeccionId" INTEGER NOT NULL,
    "codigoOriginalBombaInyeccion" TEXT NOT NULL,
    "nombreBombaInyeccion" TEXT NOT NULL,
    "serieBombaInyeccion" TEXT NOT NULL,
    "codigoInyectorOriginal" TEXT NOT NULL,
    "codigoInyectorFabricante" TEXT NOT NULL,
    "tipoFabricanteInyector" TEXT NOT NULL,
    "codigoOriginalInyector" TEXT NOT NULL,
    "informacionCliente" TEXT NOT NULL,
    "conclusiones" TEXT NOT NULL,
    "bombaInyeccionJSON" JSONB,
    "inyectorElectronicoJSON" JSONB,
    "inyectorConvencionalJSON" JSONB,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,

    CONSTRAINT "hoja_recepcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hoja_recepcion_to_materiales" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "hojaRecepcionId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "hoja_recepcion_to_materiales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hoja_recepcion_to_servicio" (
    "id" SERIAL NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "hojaRecepcionId" INTEGER NOT NULL,

    CONSTRAINT "hoja_recepcion_to_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuesto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "hojaRecepcionId" INTEGER,
    "denominacion" TEXT NOT NULL,
    "tipoReparacion" TEXT NOT NULL,
    "clienteId" INTEGER,
    "fabricaMaquinaId" INTEGER NOT NULL,
    "modeloMaquinaId" INTEGER NOT NULL,
    "nombreMaquinaId" INTEGER NOT NULL,
    "paisId" INTEGER NOT NULL,
    "codigoMotorOriginal" TEXT NOT NULL,
    "serieMotor" TEXT NOT NULL,
    "serieChasis" TEXT NOT NULL,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "codigoBombaInyeccionOriginal" TEXT NOT NULL,
    "codigoBombaInyeccionFabricante" TEXT NOT NULL,
    "tipoBombaInyeccionFabricante" TEXT NOT NULL,
    "marcaFabricaSistemaInyeccionId" INTEGER NOT NULL,
    "codigoOriginalBombaInyeccion" TEXT NOT NULL,
    "nombreBombaInyeccion" TEXT NOT NULL,
    "serieBombaInyeccion" TEXT NOT NULL,
    "codigoInyectorOriginal" TEXT NOT NULL,
    "codigoInyectorFabricante" TEXT NOT NULL,
    "tipoFabricanteInyector" TEXT NOT NULL,
    "codigoOriginalInyector" TEXT NOT NULL,
    "codigoInyectorOriginalOrden1" TEXT NOT NULL,
    "codigoInyectorOriginalOrden2" TEXT NOT NULL,
    "codigoInyectorOriginalOrden3" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaIngreso" TIMESTAMP(3) NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaSalida" TIMESTAMP(3) NOT NULL,
    "estadoOrdenTrabajo" TEXT,
    "subtotalValorServicio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalRepuestos" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalMateriales" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalTrabajoTerceros" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPresupuesto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,

    CONSTRAINT "presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuesto_to_servicio" (
    "id" SERIAL NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "presupuesto_to_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuesto_to_repuesto" (
    "id" SERIAL NOT NULL,
    "repuestoId" INTEGER NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "presupuesto_to_repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuesto_to_material" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "presupuesto_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuesto_to_trabajo_terceros" (
    "id" SERIAL NOT NULL,
    "trabajoTerceroId" INTEGER NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "presupuesto_to_trabajo_terceros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuesto_to_orden_trabajo" (
    "id" SERIAL NOT NULL,
    "presupuestoId" INTEGER NOT NULL,
    "ordenTrabajoId" INTEGER NOT NULL,

    CONSTRAINT "presupuesto_to_orden_trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_trabajo" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "clienteId" INTEGER,
    "subtotalValorServicio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalRepuestos" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalMateriales" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalTrabajoTerceros" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPresupuesto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,

    CONSTRAINT "orden_trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_trabajo_to_servicio" (
    "id" SERIAL NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "ordenTrabajoId" INTEGER NOT NULL,
    "diagnostico" TEXT,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "orden_trabajo_to_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_trabajo_to_repuesto" (
    "id" SERIAL NOT NULL,
    "repuestoId" INTEGER NOT NULL,
    "ordenTrabajoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "diagnostico" TEXT,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "orden_trabajo_to_repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_trabajo_to_material" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "ordenTrabajoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "orden_trabajo_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_trabajo_to_trabajo_terceros" (
    "id" SERIAL NOT NULL,
    "trabajoTerceroId" INTEGER NOT NULL,
    "ordenTrabajoId" INTEGER NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "comentarios" TEXT,

    CONSTRAINT "orden_trabajo_to_trabajo_terceros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guia_remision_servicios" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "ordenTrabajoId" INTEGER,
    "tipoGuia" TEXT NOT NULL,
    "nroGuiaRemision" TEXT NOT NULL,
    "fechaGuia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diasValidez" INTEGER NOT NULL,
    "fechaValidez" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moneda" TEXT NOT NULL,
    "formaPagoContadoId" INTEGER,
    "formaPagoCreditoId" INTEGER,
    "tipoDeCambioId" INTEGER,
    "estado" TEXT,
    "clienteId" INTEGER,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "maquinaId" INTEGER,
    "nroOrdenCompra" TEXT NOT NULL,
    "puntoPartida" TEXT NOT NULL,
    "puntoLlegada" TEXT NOT NULL,
    "motivoTraslada" TEXT,
    "agenciaId" INTEGER,
    "vehiculoId" INTEGER,
    "choferId" INTEGER,
    "referencia" TEXT,
    "nota" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNeto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSoles" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,

    CONSTRAINT "guia_remision_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guia_remision_servicio_to_material" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "guiaRemisionServicioId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "guia_remision_servicio_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factura_servicios" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nroFactura" TEXT,
    "tipoDeDocumentoId" INTEGER,
    "guiaRemisionId" INTEGER,
    "serie" TEXT NOT NULL,
    "fechaFactura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diasValidez" INTEGER NOT NULL,
    "fechaValidez" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moneda" TEXT NOT NULL,
    "formaPagoContadoId" INTEGER,
    "formaPagoCreditoId" INTEGER,
    "tipoDeCambioId" INTEGER,
    "estado" TEXT,
    "clienteId" INTEGER,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "maquinaId" INTEGER,
    "nroOrdenCompra" TEXT NOT NULL,
    "referencia" TEXT,
    "nota" TEXT,
    "tipoFactura" TEXT NOT NULL,
    "subtotalMateriales" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuentoMateriales" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNetoMateriales" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igvMateriales" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "detraccionMaterialId" INTEGER,
    "icbper" BOOLEAN NOT NULL,
    "totalSolesMateriales" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalServicios" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuentoServicios" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNetoServicios" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igvServicios" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSolesServicios" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "detraccionServiciosId" INTEGER,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,

    CONSTRAINT "factura_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factura_servicio_to_material" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "facturaServicioId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "factura_servicio_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factura_servicio_to_servicio" (
    "id" SERIAL NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "facturaServiciosId" INTEGER NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "factura_servicio_to_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hoja_recepcion_codigo_key" ON "hoja_recepcion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "presupuesto_hojaRecepcionId_key" ON "presupuesto"("hojaRecepcionId");

-- CreateIndex
CREATE UNIQUE INDEX "guia_remision_servicios_ordenTrabajoId_key" ON "guia_remision_servicios"("ordenTrabajoId");

-- CreateIndex
CREATE UNIQUE INDEX "factura_servicios_nroFactura_key" ON "factura_servicios"("nroFactura");

-- CreateIndex
CREATE UNIQUE INDEX "factura_servicios_guiaRemisionId_key" ON "factura_servicios"("guiaRemisionId");

-- CreateIndex
CREATE UNIQUE INDEX "factura_numeroDeFactura_key" ON "factura"("numeroDeFactura");

-- AddForeignKey
ALTER TABLE "cotizacion_to_material" ADD CONSTRAINT "cotizacion_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_material" ADD CONSTRAINT "cotizacion_to_material_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_aprovacion_cotizacion" ADD CONSTRAINT "cotizacion_to_aprovacion_cotizacion_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_aprovacion_cotizacion" ADD CONSTRAINT "cotizacion_to_aprovacion_cotizacion_aprovacionCotizacionId_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_material" ADD CONSTRAINT "aprovacion_cotizacion_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_material" ADD CONSTRAINT "aprovacion_cotizacion_to_material_aprovacionCotizacionId_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_aprovacion_pedido" ADD CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_aprovacionCotiz_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_aprovacion_pedido" ADD CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_aprovacionPedid_fkey" FOREIGN KEY ("aprovacionPedidoId") REFERENCES "aprovacion_pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido_to_material" ADD CONSTRAINT "aprovacion_pedido_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido_to_material" ADD CONSTRAINT "aprovacion_pedido_to_material_aprovacionPedidonId_fkey" FOREIGN KEY ("aprovacionPedidonId") REFERENCES "aprovacion_pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_tipoDeDocumentoId_fkey" FOREIGN KEY ("tipoDeDocumentoId") REFERENCES "documento_contable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_fabricaMaquinaId_fkey" FOREIGN KEY ("fabricaMaquinaId") REFERENCES "fabrica_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_modeloMaquinaId_fkey" FOREIGN KEY ("modeloMaquinaId") REFERENCES "modelo_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_nombreMaquinaId_fkey" FOREIGN KEY ("nombreMaquinaId") REFERENCES "nombre_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_marcaFabricaSistemaInyeccionId_fkey" FOREIGN KEY ("marcaFabricaSistemaInyeccionId") REFERENCES "marca_fabrica_sistema_inyeccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion" ADD CONSTRAINT "hoja_recepcion_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion_to_materiales" ADD CONSTRAINT "hoja_recepcion_to_materiales_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion_to_materiales" ADD CONSTRAINT "hoja_recepcion_to_materiales_hojaRecepcionId_fkey" FOREIGN KEY ("hojaRecepcionId") REFERENCES "hoja_recepcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion_to_servicio" ADD CONSTRAINT "hoja_recepcion_to_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_recepcion_to_servicio" ADD CONSTRAINT "hoja_recepcion_to_servicio_hojaRecepcionId_fkey" FOREIGN KEY ("hojaRecepcionId") REFERENCES "hoja_recepcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_hojaRecepcionId_fkey" FOREIGN KEY ("hojaRecepcionId") REFERENCES "hoja_recepcion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_fabricaMaquinaId_fkey" FOREIGN KEY ("fabricaMaquinaId") REFERENCES "fabrica_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_modeloMaquinaId_fkey" FOREIGN KEY ("modeloMaquinaId") REFERENCES "modelo_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_nombreMaquinaId_fkey" FOREIGN KEY ("nombreMaquinaId") REFERENCES "nombre_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_marcaFabricaSistemaInyeccionId_fkey" FOREIGN KEY ("marcaFabricaSistemaInyeccionId") REFERENCES "marca_fabrica_sistema_inyeccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto" ADD CONSTRAINT "presupuesto_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_servicio" ADD CONSTRAINT "presupuesto_to_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_servicio" ADD CONSTRAINT "presupuesto_to_servicio_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_repuesto" ADD CONSTRAINT "presupuesto_to_repuesto_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_repuesto" ADD CONSTRAINT "presupuesto_to_repuesto_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_material" ADD CONSTRAINT "presupuesto_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_material" ADD CONSTRAINT "presupuesto_to_material_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_trabajo_terceros" ADD CONSTRAINT "presupuesto_to_trabajo_terceros_trabajoTerceroId_fkey" FOREIGN KEY ("trabajoTerceroId") REFERENCES "trabajo_terceros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_trabajo_terceros" ADD CONSTRAINT "presupuesto_to_trabajo_terceros_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_orden_trabajo" ADD CONSTRAINT "presupuesto_to_orden_trabajo_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuesto_to_orden_trabajo" ADD CONSTRAINT "presupuesto_to_orden_trabajo_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "orden_trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo" ADD CONSTRAINT "orden_trabajo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo" ADD CONSTRAINT "orden_trabajo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo" ADD CONSTRAINT "orden_trabajo_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo_to_servicio" ADD CONSTRAINT "orden_trabajo_to_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo_to_servicio" ADD CONSTRAINT "orden_trabajo_to_servicio_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "orden_trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo_to_repuesto" ADD CONSTRAINT "orden_trabajo_to_repuesto_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo_to_repuesto" ADD CONSTRAINT "orden_trabajo_to_repuesto_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "orden_trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo_to_material" ADD CONSTRAINT "orden_trabajo_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo_to_material" ADD CONSTRAINT "orden_trabajo_to_material_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "orden_trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo_to_trabajo_terceros" ADD CONSTRAINT "orden_trabajo_to_trabajo_terceros_trabajoTerceroId_fkey" FOREIGN KEY ("trabajoTerceroId") REFERENCES "trabajo_terceros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_trabajo_to_trabajo_terceros" ADD CONSTRAINT "orden_trabajo_to_trabajo_terceros_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "orden_trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "orden_trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_formaPagoContadoId_fkey" FOREIGN KEY ("formaPagoContadoId") REFERENCES "forma_de_pago_contado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_formaPagoCreditoId_fkey" FOREIGN KEY ("formaPagoCreditoId") REFERENCES "forma_de_pago_credito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_tipoDeCambioId_fkey" FOREIGN KEY ("tipoDeCambioId") REFERENCES "tipo_de_cambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "agencia_transporte"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "chofer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicios" ADD CONSTRAINT "guia_remision_servicios_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicio_to_material" ADD CONSTRAINT "guia_remision_servicio_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_remision_servicio_to_material" ADD CONSTRAINT "guia_remision_servicio_to_material_guiaRemisionServicioId_fkey" FOREIGN KEY ("guiaRemisionServicioId") REFERENCES "guia_remision_servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_tipoDeDocumentoId_fkey" FOREIGN KEY ("tipoDeDocumentoId") REFERENCES "documento_contable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_guiaRemisionId_fkey" FOREIGN KEY ("guiaRemisionId") REFERENCES "guia_remision_servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_formaPagoContadoId_fkey" FOREIGN KEY ("formaPagoContadoId") REFERENCES "forma_de_pago_contado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_formaPagoCreditoId_fkey" FOREIGN KEY ("formaPagoCreditoId") REFERENCES "forma_de_pago_credito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_tipoDeCambioId_fkey" FOREIGN KEY ("tipoDeCambioId") REFERENCES "tipo_de_cambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_detraccionMaterialId_fkey" FOREIGN KEY ("detraccionMaterialId") REFERENCES "detraccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_detraccionServiciosId_fkey" FOREIGN KEY ("detraccionServiciosId") REFERENCES "detraccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicios" ADD CONSTRAINT "factura_servicios_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicio_to_material" ADD CONSTRAINT "factura_servicio_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicio_to_material" ADD CONSTRAINT "factura_servicio_to_material_facturaServicioId_fkey" FOREIGN KEY ("facturaServicioId") REFERENCES "factura_servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicio_to_servicio" ADD CONSTRAINT "factura_servicio_to_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_servicio_to_servicio" ADD CONSTRAINT "factura_servicio_to_servicio_facturaServiciosId_fkey" FOREIGN KEY ("facturaServiciosId") REFERENCES "factura_servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
