-- CreateTable
CREATE TABLE "almacen" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motivo_movimiento_almacen" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "motivo_movimiento_almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencia_transporte" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "tipo_documento" "TipoDocumentoEnum" NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "agencia_transporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculo" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "tipo" TEXT,
    "descripcion" TEXT,
    "color" TEXT NOT NULL,
    "tarjeta_propiedad" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chofer" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "locencia" TEXT NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "tarjeta_de_propiedad" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "chofer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_de_cambio" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "de" TEXT NOT NULL,
    "a" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "tipo_de_cambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametro_descuento" (
    "id" SERIAL NOT NULL,
    "de" TEXT NOT NULL,
    "a" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "parametro_descuento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma_de_pago_contado" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "forma_de_pago_contado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma_de_pago_credito" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "forma_de_pago_credito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento_contable" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "numero_de_serie" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "documento_contable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento_administrativo" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "documento_administrativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detraccion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" DECIMAL(65,30) NOT NULL,
    "abreviatura" TEXT,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "detraccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motivo_traslado_guia_remision" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "motivo" TEXT NOT NULL,
    "descripcion" TEXT,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "motivo_traslado_guia_remision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_presupuesto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "familiaId" INTEGER NOT NULL,
    "subFamiliaId" INTEGER NOT NULL,
    "correlativo" TEXT,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "material_presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicio" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "definicion" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trabajo_terceros" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "definicion" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "trabajo_terceros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familia" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_familia" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "familiaId" INTEGER NOT NULL,

    CONSTRAINT "sub_familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristica" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "caracteristica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelo_maquina" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "modelo_maquina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabrica_maquina" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "fabrica" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "fabrica_maquina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nombre_maquina" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "nombre_maquina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marca_motor" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "marca_motor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marca_fabrica_sistema_inyeccion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "marca_fabrica_sistema_inyeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descripcion_bomba_inyeccion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "descripcion_bomba_inyeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marca_fabrica_inyector" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "marca_fabrica_inyector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descripcion_inyector" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "descripcion_inyector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maquina_procedencia" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "maquina_procedencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maquina" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "fabricaMaquinaId" INTEGER NOT NULL,
    "modeloMaquinaId" INTEGER NOT NULL,
    "nombreMaquinaId" INTEGER NOT NULL,
    "paisId" INTEGER NOT NULL,
    "codigoOriginal" TEXT NOT NULL,
    "modeloMotor" TEXT NOT NULL,
    "marcaMotorId" INTEGER NOT NULL,
    "motorPaisId" INTEGER NOT NULL,
    "numeroCilindros" INTEGER NOT NULL,
    "codigoFabricaBombaInyeccion" TEXT NOT NULL,
    "tipoBombaInyeccion" TEXT NOT NULL,
    "marcaFabricaSistemaInyeccionId" INTEGER NOT NULL,
    "descripcionBombaInyeccionId" INTEGER NOT NULL,
    "bombaInyeccionPaisId" INTEGER NOT NULL,
    "codigoOriginalBombaInyeccion" TEXT NOT NULL,
    "codigoFabricaInyector" TEXT NOT NULL,
    "tipoFabricaInyector" TEXT NOT NULL,
    "marcaFabricaInyectorId" INTEGER NOT NULL,
    "descripcionInyectorId" INTEGER NOT NULL,
    "inyectorPaisId" INTEGER NOT NULL,
    "codigoOriginalInyector" TEXT NOT NULL,
    "codigoTobera" TEXT NOT NULL,
    "tipoTobera" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "maquina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "correlativo" TEXT,
    "familiaId" INTEGER NOT NULL,
    "subfamiliaId" INTEGER NOT NULL,
    "denominacion" TEXT NOT NULL,
    "codigoFabricante" TEXT NOT NULL,
    "tipoFabricante" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristica_to_material" (
    "id" SERIAL NOT NULL,
    "isChecked" BOOLEAN NOT NULL,
    "valor" TEXT NOT NULL,
    "materialId" INTEGER NOT NULL,
    "caracteristicaId" INTEGER NOT NULL,

    CONSTRAINT "caracteristica_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_reemplazo" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "material_reemplazo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_similitud" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "material_similitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_requivalencia" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "material_requivalencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaterialToMaterialReemplazo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MaterialToMaterialSimilitud" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MaterialToMaterialEquivalencia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "almacen_codigo_key" ON "almacen"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "motivo_movimiento_almacen_codigo_key" ON "motivo_movimiento_almacen"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "agencia_transporte_codigo_key" ON "agencia_transporte"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculo_codigo_key" ON "vehiculo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "chofer_codigo_key" ON "chofer"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_de_cambio_codigo_key" ON "tipo_de_cambio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "forma_de_pago_contado_codigo_key" ON "forma_de_pago_contado"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "forma_de_pago_credito_codigo_key" ON "forma_de_pago_credito"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "documento_contable_codigo_key" ON "documento_contable"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "documento_administrativo_codigo_key" ON "documento_administrativo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "detraccion_codigo_key" ON "detraccion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "motivo_traslado_guia_remision_codigo_key" ON "motivo_traslado_guia_remision"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "material_presupuesto_codigo_key" ON "material_presupuesto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_codigo_key" ON "servicio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "trabajo_terceros_codigo_key" ON "trabajo_terceros"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "familia_codigo_key" ON "familia"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "sub_familia_codigo_key" ON "sub_familia"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "caracteristica_codigo_key" ON "caracteristica"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "modelo_maquina_codigo_key" ON "modelo_maquina"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "fabrica_maquina_codigo_key" ON "fabrica_maquina"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "nombre_maquina_codigo_key" ON "nombre_maquina"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "marca_motor_codigo_key" ON "marca_motor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "marca_fabrica_sistema_inyeccion_codigo_key" ON "marca_fabrica_sistema_inyeccion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "descripcion_bomba_inyeccion_codigo_key" ON "descripcion_bomba_inyeccion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "marca_fabrica_inyector_codigo_key" ON "marca_fabrica_inyector"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "descripcion_inyector_codigo_key" ON "descripcion_inyector"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "maquina_codigo_key" ON "maquina"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "material_codigo_key" ON "material"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "material_correlativo_key" ON "material"("correlativo");

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToMaterialReemplazo_AB_unique" ON "_MaterialToMaterialReemplazo"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToMaterialReemplazo_B_index" ON "_MaterialToMaterialReemplazo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToMaterialSimilitud_AB_unique" ON "_MaterialToMaterialSimilitud"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToMaterialSimilitud_B_index" ON "_MaterialToMaterialSimilitud"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToMaterialEquivalencia_AB_unique" ON "_MaterialToMaterialEquivalencia"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToMaterialEquivalencia_B_index" ON "_MaterialToMaterialEquivalencia"("B");

-- AddForeignKey
ALTER TABLE "almacen" ADD CONSTRAINT "almacen_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motivo_movimiento_almacen" ADD CONSTRAINT "motivo_movimiento_almacen_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agencia_transporte" ADD CONSTRAINT "agencia_transporte_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculo" ADD CONSTRAINT "vehiculo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chofer" ADD CONSTRAINT "chofer_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_de_cambio" ADD CONSTRAINT "tipo_de_cambio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parametro_descuento" ADD CONSTRAINT "parametro_descuento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma_de_pago_contado" ADD CONSTRAINT "forma_de_pago_contado_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma_de_pago_credito" ADD CONSTRAINT "forma_de_pago_credito_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento_contable" ADD CONSTRAINT "documento_contable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento_administrativo" ADD CONSTRAINT "documento_administrativo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detraccion" ADD CONSTRAINT "detraccion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motivo_traslado_guia_remision" ADD CONSTRAINT "motivo_traslado_guia_remision_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_presupuesto" ADD CONSTRAINT "material_presupuesto_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_presupuesto" ADD CONSTRAINT "material_presupuesto_subFamiliaId_fkey" FOREIGN KEY ("subFamiliaId") REFERENCES "sub_familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trabajo_terceros" ADD CONSTRAINT "trabajo_terceros_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familia" ADD CONSTRAINT "familia_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_familia" ADD CONSTRAINT "sub_familia_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristica" ADD CONSTRAINT "caracteristica_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modelo_maquina" ADD CONSTRAINT "modelo_maquina_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fabrica_maquina" ADD CONSTRAINT "fabrica_maquina_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nombre_maquina" ADD CONSTRAINT "nombre_maquina_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marca_motor" ADD CONSTRAINT "marca_motor_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marca_fabrica_sistema_inyeccion" ADD CONSTRAINT "marca_fabrica_sistema_inyeccion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descripcion_bomba_inyeccion" ADD CONSTRAINT "descripcion_bomba_inyeccion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marca_fabrica_inyector" ADD CONSTRAINT "marca_fabrica_inyector_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descripcion_inyector" ADD CONSTRAINT "descripcion_inyector_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_fabricaMaquinaId_fkey" FOREIGN KEY ("fabricaMaquinaId") REFERENCES "fabrica_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_modeloMaquinaId_fkey" FOREIGN KEY ("modeloMaquinaId") REFERENCES "modelo_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_nombreMaquinaId_fkey" FOREIGN KEY ("nombreMaquinaId") REFERENCES "nombre_maquina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_marcaMotorId_fkey" FOREIGN KEY ("marcaMotorId") REFERENCES "marca_motor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_motorPaisId_fkey" FOREIGN KEY ("motorPaisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_marcaFabricaSistemaInyeccionId_fkey" FOREIGN KEY ("marcaFabricaSistemaInyeccionId") REFERENCES "marca_fabrica_sistema_inyeccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_descripcionBombaInyeccionId_fkey" FOREIGN KEY ("descripcionBombaInyeccionId") REFERENCES "descripcion_bomba_inyeccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_bombaInyeccionPaisId_fkey" FOREIGN KEY ("bombaInyeccionPaisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_marcaFabricaInyectorId_fkey" FOREIGN KEY ("marcaFabricaInyectorId") REFERENCES "marca_fabrica_inyector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_descripcionInyectorId_fkey" FOREIGN KEY ("descripcionInyectorId") REFERENCES "descripcion_inyector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_inyectorPaisId_fkey" FOREIGN KEY ("inyectorPaisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_subfamiliaId_fkey" FOREIGN KEY ("subfamiliaId") REFERENCES "sub_familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristica_to_material" ADD CONSTRAINT "caracteristica_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristica_to_material" ADD CONSTRAINT "caracteristica_to_material_caracteristicaId_fkey" FOREIGN KEY ("caracteristicaId") REFERENCES "caracteristica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToMaterialReemplazo" ADD CONSTRAINT "_MaterialToMaterialReemplazo_A_fkey" FOREIGN KEY ("A") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToMaterialReemplazo" ADD CONSTRAINT "_MaterialToMaterialReemplazo_B_fkey" FOREIGN KEY ("B") REFERENCES "material_reemplazo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToMaterialSimilitud" ADD CONSTRAINT "_MaterialToMaterialSimilitud_A_fkey" FOREIGN KEY ("A") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToMaterialSimilitud" ADD CONSTRAINT "_MaterialToMaterialSimilitud_B_fkey" FOREIGN KEY ("B") REFERENCES "material_similitud"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToMaterialEquivalencia" ADD CONSTRAINT "_MaterialToMaterialEquivalencia_A_fkey" FOREIGN KEY ("A") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToMaterialEquivalencia" ADD CONSTRAINT "_MaterialToMaterialEquivalencia_B_fkey" FOREIGN KEY ("B") REFERENCES "material_requivalencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
