-- CreateEnum
CREATE TYPE "EstadoEnum" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "TipoDocumentoEnum" AS ENUM ('DNI', 'RUC');

-- CreateEnum
CREATE TYPE "RolesEnum" AS ENUM ('Administrador', 'Vendedor', 'Tecnico');

-- CreateTable
CREATE TABLE "empresa" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "web" TEXT,
    "logo" TEXT,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursal" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "empresaId" INTEGER,

    CONSTRAINT "sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pais" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametro_global" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "parametro_global_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agente_aduanas" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "observaciones" TEXT,
    "empresaId" INTEGER,

    CONSTRAINT "agente_aduanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoterms" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "empresaId" INTEGER,

    CONSTRAINT "incoterms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_via" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "empresaId" INTEGER,

    CONSTRAINT "tipo_via_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gasto_importacion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "observaciones" TEXT,
    "empresaId" INTEGER,

    CONSTRAINT "gasto_importacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factor_internamiento" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "valor" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fecha" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "factor_internamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "passwordEncrypted" TEXT,
    "telefono" TEXT NOT NULL,
    "puestoId" INTEGER,
    "estado" "EstadoEnum" NOT NULL DEFAULT 'Activo',
    "direccion" TEXT NOT NULL,

    CONSTRAINT "personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puesto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Puesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submodulo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "moduloId" INTEGER NOT NULL,

    CONSTRAINT "Submodulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" SERIAL NOT NULL,
    "puestoId" INTEGER NOT NULL,
    "submoduloId" INTEGER NOT NULL,
    "crear" BOOLEAN NOT NULL,
    "leer" BOOLEAN NOT NULL,
    "actualizar" BOOLEAN NOT NULL,
    "eliminar" BOOLEAN NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendedor" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "comision" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "aprovacionCotizacion" BOOLEAN NOT NULL,
    "estado" "EstadoEnum" NOT NULL DEFAULT 'Activo',
    "empresaId" INTEGER,

    CONSTRAINT "vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "tipo_documento" "TipoDocumentoEnum" NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "estado" "EstadoEnum" NOT NULL DEFAULT 'Activo',
    "tipoClienteId" INTEGER,
    "empresaId" INTEGER,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "costo" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "estado" "EstadoEnum" NOT NULL DEFAULT 'Activo',
    "empresaId" INTEGER,

    CONSTRAINT "costo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banco" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "banco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuenta_bancaria" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "numero_cuenta" TEXT NOT NULL,
    "tipo_cuenta" TEXT NOT NULL,
    "moneda" TEXT NOT NULL,
    "estado" "EstadoEnum" NOT NULL DEFAULT 'Activo',
    "bancoId" INTEGER,
    "empresaId" INTEGER,

    CONSTRAINT "cuenta_bancaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_cliente" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "tipo" TEXT NOT NULL,
    "estado" "EstadoEnum" NOT NULL DEFAULT 'Activo',
    "empresaId" INTEGER,

    CONSTRAINT "tipo_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" "RolesEnum" NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

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
    "licencia" TEXT NOT NULL,
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
    "valor" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fecha" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "tipo_de_cambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametro_descuento" (
    "id" SERIAL NOT NULL,
    "de" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "a" DECIMAL(12,2) NOT NULL DEFAULT 0,
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
    "numero_de_dias" INTEGER NOT NULL,
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
    "definicion" TEXT NOT NULL,
    "porcentaje" DECIMAL(12,2) NOT NULL DEFAULT 0,
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
CREATE TABLE "familia_presupuesto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "descripcion" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "familia_presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_familia_presupuesto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "descripcion" TEXT NOT NULL,
    "familiaId" INTEGER NOT NULL,

    CONSTRAINT "sub_familia_presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_presupuesto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "familiaId" INTEGER NOT NULL,
    "subFamiliaId" INTEGER NOT NULL,
    "correlativo" TEXT,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "material_presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicio" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "definicion" TEXT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trabajo_terceros" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "definicion" TEXT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
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
    "fabricaMaquinaId" INTEGER,
    "modeloMaquinaId" INTEGER,
    "nombreMaquinaId" INTEGER,
    "paisId" INTEGER NOT NULL,
    "codigoOriginal" TEXT NOT NULL,
    "modeloMotor" TEXT NOT NULL,
    "marcaMotorId" INTEGER,
    "motorPaisId" INTEGER,
    "numeroCilindros" INTEGER NOT NULL,
    "codigoFabricaBombaInyeccion" TEXT NOT NULL,
    "tipoBombaInyeccion" TEXT NOT NULL,
    "marcaFabricaSistemaInyeccionId" INTEGER,
    "descripcionBombaInyeccionId" INTEGER,
    "bombaInyeccionPaisId" INTEGER,
    "codigoOriginalBombaInyeccion" TEXT NOT NULL,
    "codigoFabricaInyector" TEXT NOT NULL,
    "tipoFabricaInyector" TEXT NOT NULL,
    "marcaFabricaInyectorId" INTEGER,
    "descripcionInyectorId" INTEGER,
    "inyectorPaisId" INTEGER,
    "codigoOriginalInyector" TEXT NOT NULL,
    "codigoTobera" TEXT NOT NULL,
    "tipoTobera" TEXT NOT NULL,
    "codigoOriginalTobera" TEXT,
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
    "codigoFabricante" TEXT,
    "tipoFabricante" TEXT,
    "nombreInterno" TEXT,
    "nombreComercial" TEXT,
    "marca" TEXT,
    "materialReemplazo" JSONB,
    "materialSimilitud" JSONB,
    "materialEquivalencia" JSONB,
    "aplicacionDeMaquina" JSONB,
    "empresaId" INTEGER NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "codigoMotorOriginal" TEXT,
    "codigoBombaInyeccion" TEXT,
    "ventaUnidad" DECIMAL(12,2) DEFAULT 0,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristica_to_material" (
    "id" SERIAL NOT NULL,
    "isChecked" BOOLEAN NOT NULL,
    "valor" TEXT,
    "materialId" INTEGER NOT NULL,
    "caracteristicaId" INTEGER NOT NULL,

    CONSTRAINT "caracteristica_to_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizacion" (
    "id" SERIAL NOT NULL,
    "number" TEXT,
    "fechaCotizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaValidez" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diasValidez" INTEGER NOT NULL,
    "referencia" TEXT,
    "nota" TEXT,
    "maquina" TEXT,
    "estadoDelDocumento" TEXT,
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
    "sucursalId" INTEGER NOT NULL,
    "maquinaId" INTEGER,

    CONSTRAINT "cotizacion_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "aprovacion_cotizacion" (
    "id" SERIAL NOT NULL,
    "number" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNeto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSoles" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fechaAprobacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoDelDocumento" TEXT,
    "moneda" TEXT,
    "maquina" TEXT,
    "clienteId" INTEGER,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,

    CONSTRAINT "aprovacion_cotizacion_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "aprovacion_pedido" (
    "id" SERIAL NOT NULL,
    "number" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotalValorNeto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSoles" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fechaAprobacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moneda" TEXT,
    "maquina" TEXT,
    "estado" TEXT,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,
    "clienteId" INTEGER,

    CONSTRAINT "aprovacion_pedido_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "guia_de_remision" (
    "id" SERIAL NOT NULL,
    "tipoDeGuia" TEXT,
    "NumeroGuiaDeRemision" TEXT,
    "serie" TEXT,
    "fechaDeCotizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDeValidez" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diasDeValidez" INTEGER NOT NULL,
    "moneda" TEXT,
    "estado" TEXT,
    "numeroDeOrden" TEXT,
    "puntoDePartida" TEXT,
    "puntoDeLlegada" TEXT,
    "motivoDeTrasladoId" INTEGER,
    "referencia" TEXT,
    "nota" TEXT,
    "aprovacionPedidoId" INTEGER,
    "clienteId" INTEGER,
    "maquina" TEXT NOT NULL,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,
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
CREATE TABLE "factura" (
    "id" SERIAL NOT NULL,
    "numeroDeFactura" TEXT,
    "tipoDeDocumentoId" INTEGER,
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
    "observaciones" TEXT,
    "clienteId" INTEGER,
    "maquina" TEXT,
    "vendedorId" INTEGER,
    "personalId" INTEGER,
    "ordenDeCompra" TEXT,
    "empresaId" INTEGER NOT NULL,
    "sucursalId" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "_EmpresaToPersonal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonalToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleToVendedor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "empresa_codigo_key" ON "empresa"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_ruc_key" ON "empresa"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "sucursal_codigo_key" ON "sucursal"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "pais_codigo_empresaId_key" ON "pais"("codigo", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "parametro_global_nombre_key" ON "parametro_global"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "parametro_global_nombre_empresaId_key" ON "parametro_global"("nombre", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "agente_aduanas_codigo_key" ON "agente_aduanas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "incoterms_codigo_key" ON "incoterms"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_via_codigo_key" ON "tipo_via"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "gasto_importacion_codigo_key" ON "gasto_importacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "factor_internamiento_codigo_key" ON "factor_internamiento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "personal_codigo_key" ON "personal"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "personal_email_key" ON "personal"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendedor_codigo_key" ON "vendedor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "vendedor_email_key" ON "vendedor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_codigo_key" ON "cliente"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "costo_codigo_key" ON "costo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "banco_codigo_key" ON "banco"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cuenta_bancaria_codigo_key" ON "cuenta_bancaria"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_cliente_codigo_key" ON "tipo_cliente"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_cliente_tipo_key" ON "tipo_cliente"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

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
CREATE UNIQUE INDEX "familia_presupuesto_codigo_key" ON "familia_presupuesto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "sub_familia_presupuesto_codigo_key" ON "sub_familia_presupuesto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "material_presupuesto_codigo_key" ON "material_presupuesto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_codigo_key" ON "servicio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "trabajo_terceros_codigo_key" ON "trabajo_terceros"("codigo");

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
CREATE UNIQUE INDEX "cotizacion_number_key" ON "cotizacion"("number");

-- CreateIndex
CREATE UNIQUE INDEX "aprovacion_cotizacion_number_key" ON "aprovacion_cotizacion"("number");

-- CreateIndex
CREATE UNIQUE INDEX "aprovacion_pedido_number_key" ON "aprovacion_pedido"("number");

-- CreateIndex
CREATE UNIQUE INDEX "guia_de_remision_aprovacionPedidoId_key" ON "guia_de_remision"("aprovacionPedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "factura_numeroDeFactura_key" ON "factura"("numeroDeFactura");

-- CreateIndex
CREATE UNIQUE INDEX "factura_guiaDeRemisionId_key" ON "factura"("guiaDeRemisionId");

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
CREATE UNIQUE INDEX "_EmpresaToPersonal_AB_unique" ON "_EmpresaToPersonal"("A", "B");

-- CreateIndex
CREATE INDEX "_EmpresaToPersonal_B_index" ON "_EmpresaToPersonal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonalToRole_AB_unique" ON "_PersonalToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonalToRole_B_index" ON "_PersonalToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToVendedor_AB_unique" ON "_RoleToVendedor"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToVendedor_B_index" ON "_RoleToVendedor"("B");

-- AddForeignKey
ALTER TABLE "sucursal" ADD CONSTRAINT "sucursal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pais" ADD CONSTRAINT "pais_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parametro_global" ADD CONSTRAINT "parametro_global_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agente_aduanas" ADD CONSTRAINT "agente_aduanas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incoterms" ADD CONSTRAINT "incoterms_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_via" ADD CONSTRAINT "tipo_via_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gasto_importacion" ADD CONSTRAINT "gasto_importacion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factor_internamiento" ADD CONSTRAINT "factor_internamiento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal" ADD CONSTRAINT "personal_puestoId_fkey" FOREIGN KEY ("puestoId") REFERENCES "Puesto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submodulo" ADD CONSTRAINT "Submodulo_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_puestoId_fkey" FOREIGN KEY ("puestoId") REFERENCES "Puesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_submoduloId_fkey" FOREIGN KEY ("submoduloId") REFERENCES "Submodulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendedor" ADD CONSTRAINT "vendedor_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_tipoClienteId_fkey" FOREIGN KEY ("tipoClienteId") REFERENCES "tipo_cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "costo" ADD CONSTRAINT "costo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banco" ADD CONSTRAINT "banco_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuenta_bancaria" ADD CONSTRAINT "cuenta_bancaria_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "banco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuenta_bancaria" ADD CONSTRAINT "cuenta_bancaria_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_cliente" ADD CONSTRAINT "tipo_cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "familia_presupuesto" ADD CONSTRAINT "familia_presupuesto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_familia_presupuesto" ADD CONSTRAINT "sub_familia_presupuesto_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia_presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_presupuesto" ADD CONSTRAINT "material_presupuesto_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia_presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_presupuesto" ADD CONSTRAINT "material_presupuesto_subFamiliaId_fkey" FOREIGN KEY ("subFamiliaId") REFERENCES "sub_familia_presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_presupuesto" ADD CONSTRAINT "material_presupuesto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_fabricaMaquinaId_fkey" FOREIGN KEY ("fabricaMaquinaId") REFERENCES "fabrica_maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_modeloMaquinaId_fkey" FOREIGN KEY ("modeloMaquinaId") REFERENCES "modelo_maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_nombreMaquinaId_fkey" FOREIGN KEY ("nombreMaquinaId") REFERENCES "nombre_maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "maquina" ADD CONSTRAINT "maquina_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_subfamiliaId_fkey" FOREIGN KEY ("subfamiliaId") REFERENCES "sub_familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristica_to_material" ADD CONSTRAINT "caracteristica_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristica_to_material" ADD CONSTRAINT "caracteristica_to_material_caracteristicaId_fkey" FOREIGN KEY ("caracteristicaId") REFERENCES "caracteristica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "maquina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_material" ADD CONSTRAINT "cotizacion_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_material" ADD CONSTRAINT "cotizacion_to_material_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_aprovacion_cotizacion" ADD CONSTRAINT "cotizacion_to_aprovacion_cotizacion_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_to_aprovacion_cotizacion" ADD CONSTRAINT "cotizacion_to_aprovacion_cotizacion_aprovacionCotizacionId_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion" ADD CONSTRAINT "aprovacion_cotizacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion" ADD CONSTRAINT "aprovacion_cotizacion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion" ADD CONSTRAINT "aprovacion_cotizacion_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_material" ADD CONSTRAINT "aprovacion_cotizacion_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_material" ADD CONSTRAINT "aprovacion_cotizacion_to_material_aprovacionCotizacionId_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_aprovacion_pedido" ADD CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_aprovacionCotiz_fkey" FOREIGN KEY ("aprovacionCotizacionId") REFERENCES "aprovacion_cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_cotizacion_to_aprovacion_pedido" ADD CONSTRAINT "aprovacion_cotizacion_to_aprovacion_pedido_aprovacionPedid_fkey" FOREIGN KEY ("aprovacionPedidoId") REFERENCES "aprovacion_pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido" ADD CONSTRAINT "aprovacion_pedido_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido" ADD CONSTRAINT "aprovacion_pedido_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido" ADD CONSTRAINT "aprovacion_pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido_to_material" ADD CONSTRAINT "aprovacion_pedido_to_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprovacion_pedido_to_material" ADD CONSTRAINT "aprovacion_pedido_to_material_aprovacionPedidonId_fkey" FOREIGN KEY ("aprovacionPedidonId") REFERENCES "aprovacion_pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_motivoDeTrasladoId_fkey" FOREIGN KEY ("motivoDeTrasladoId") REFERENCES "motivo_traslado_guia_remision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_aprovacionPedidoId_fkey" FOREIGN KEY ("aprovacionPedidoId") REFERENCES "aprovacion_pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "agencia_transporte"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guia_de_remision" ADD CONSTRAINT "guia_de_remision_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "chofer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_tipoDeDocumentoId_fkey" FOREIGN KEY ("tipoDeDocumentoId") REFERENCES "documento_contable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "factura" ADD CONSTRAINT "factura_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_EmpresaToPersonal" ADD CONSTRAINT "_EmpresaToPersonal_A_fkey" FOREIGN KEY ("A") REFERENCES "empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmpresaToPersonal" ADD CONSTRAINT "_EmpresaToPersonal_B_fkey" FOREIGN KEY ("B") REFERENCES "personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalToRole" ADD CONSTRAINT "_PersonalToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalToRole" ADD CONSTRAINT "_PersonalToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToVendedor" ADD CONSTRAINT "_RoleToVendedor_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToVendedor" ADD CONSTRAINT "_RoleToVendedor_B_fkey" FOREIGN KEY ("B") REFERENCES "vendedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
