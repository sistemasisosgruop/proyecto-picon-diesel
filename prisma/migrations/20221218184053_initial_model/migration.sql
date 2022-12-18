-- CreateEnum
CREATE TYPE "EstadoAdministrativo" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('DNI', 'RUC');

-- CreateTable
CREATE TABLE "pais" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametro_general" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "parametro_general_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agente_aduanas" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "agente_aduanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoterms" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "incoterms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_via" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "tipo_via_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gasto_importacion" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "gasto_importacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "estado" "EstadoAdministrativo" NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "personal_pkey" PRIMARY KEY ("id")
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
    "comision" DECIMAL(65,30) NOT NULL,
    "aprovacionCotizacion" BOOLEAN NOT NULL,
    "estado" "EstadoAdministrativo" NOT NULL,

    CONSTRAINT "vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "tipo_documento" "TipoDocumento" NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "estado" "EstadoAdministrativo" NOT NULL,
    "tipoClienteId" INTEGER,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "costo" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "estado" "EstadoAdministrativo" NOT NULL,

    CONSTRAINT "costo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banco" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "banco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuenta_bancaria" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "numero_cuenta" TEXT NOT NULL,
    "tipo_cuenta" TEXT NOT NULL,
    "moneda" TEXT NOT NULL,
    "estado" "EstadoAdministrativo" NOT NULL,
    "bancoId" INTEGER,

    CONSTRAINT "cuenta_bancaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_cliente" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "tipo_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CargoToPersonal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "pais_codigo_key" ON "pais"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "agente_aduanas_codigo_key" ON "agente_aduanas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "incoterms_codigo_key" ON "incoterms"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_via_codigo_key" ON "tipo_via"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "gasto_importacion_codigo_key" ON "gasto_importacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "personal_codigo_key" ON "personal"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "vendedor_codigo_key" ON "vendedor"("codigo");

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
CREATE UNIQUE INDEX "cargo_name_key" ON "cargo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CargoToPersonal_AB_unique" ON "_CargoToPersonal"("A", "B");

-- CreateIndex
CREATE INDEX "_CargoToPersonal_B_index" ON "_CargoToPersonal"("B");

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_tipoClienteId_fkey" FOREIGN KEY ("tipoClienteId") REFERENCES "tipo_cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuenta_bancaria" ADD CONSTRAINT "cuenta_bancaria_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "banco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CargoToPersonal" ADD CONSTRAINT "_CargoToPersonal_A_fkey" FOREIGN KEY ("A") REFERENCES "cargo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CargoToPersonal" ADD CONSTRAINT "_CargoToPersonal_B_fkey" FOREIGN KEY ("B") REFERENCES "personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
