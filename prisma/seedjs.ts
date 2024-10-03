import { PrismaClient } from "@prisma/client";

import { vehiculos } from '../data/vehiculos';
import { agenciaDeTransporte } from "../data/agencia-de-transporte";
import { choferes } from "../data/choferes";
import { detracciones } from '../data/detracciones';
import { fabricasMaquinas } from '../data/maquina-fabrica';
import { modelosMaquina } from '../data/maquina-modelo';
import { nombresMaquina } from '../data/maquina-nombres';
import { paisesData } from "../data/paises";
import { marcasMotor } from '../data/marcas-motor';
import { marcasFabricaSistemaInyeccion } from "../data/marcasFabricaSistemaInyeccion"
import { descripcionBombasInyeccion } from "../data/descripcionBombasInyeccion";
import { marcasFabricaInyector } from "../data/marcas-fabrica-inyector";
import { descripcionInyector } from "../data/descripcionInyector";
import { maquinas } from "../data/maquinas";

import { caracteristicas } from "../data/caracteristicas";
import { familias } from "../data/familias";
import { subfamilias } from "../data/subfamilias";
import { materialesData } from "../data/materiales-data";
import { tiposDeClientes } from "../data/tipos-de-clientes";
import { clientes } from "../data/clientes";
import { tipoDeCambios } from "../data/tipo-de-cambios";
import { formaPagoContado } from "../data/forma-pago-contado";
import { formaPagoCredito } from '../data/forma-pago-credito';
import { cotizaciones, cotizacionesToMateriales } from '../data/cotizaciones';
import { cotizacionesAprobadas,cotizacionesAprobadasToCotizacion, cotizacionesAprobadasToMateriales } from "../data/cotizaciones-aprobadas";
import { pedidosAprobados, cotizacionesAprobadasToPedidoAprobado, pedidosAprobadosToMateriales } from '../data/pedidos-aprobados';
import { guiasRemision } from "../data/guia-remision";
import { facturas } from "../data/factura";
import { ReportesVentas } from "../data/reporteVentas";
import { ReportesRecordClientes } from '../data/reportesRecordClientes';
import { ReportesRecordProveedores } from "../data/reportesRecordProveedores";
import { ReportesStockMinimo } from '../data/reportesStockMinimo';
import { reportesMensualesVentas } from '../data/reportesMensualesVentas';

const prisma = new PrismaClient();

const main = async () : Promise<void> => {
    try {
        await prisma.agenciaTransporte.createMany({
            data: agenciaDeTransporte
        })

        await prisma.chofer.createMany({
            data: choferes
        })

        await prisma.vehiculo.createMany({
            data: vehiculos
        })

        await prisma.detraccion.createMany({
            data: detracciones
        })

        await prisma.fabricaMaquina.createMany({
            data: fabricasMaquinas
        })

        await prisma.modeloMaquina.createMany({
            data: modelosMaquina
        })

        await prisma.nombreMaquina.createMany({
            data: nombresMaquina
        })

        await prisma.pais.createMany({
            data: paisesData
        })

        await prisma.marcaMotor.createMany({
            data: marcasMotor
        })

        await prisma.marcaFabricaSistemaInyeccion.createMany({
            data: marcasFabricaSistemaInyeccion
        })

        await prisma.descripcionBombaInyeccion.createMany({
            data: descripcionBombasInyeccion
        })

        await prisma.marcaFabricaInyector.createMany({
            data: marcasFabricaInyector
        })

        await prisma.descripcionInyector.createMany({
            data: descripcionInyector
        })

        await prisma.maquina.createMany({
            data: maquinas
        })

        await prisma.familia.createMany({
            data: familias
        })

        await prisma.subFamilia.createMany({
            data: subfamilias
        })

        await prisma.caracteristica.createMany({
            data: caracteristicas
        })

        await prisma.material.createMany({
            data:materialesData
        })

        await prisma.tipoCliente.createMany({
            data: tiposDeClientes
        })

        await prisma.cliente.createMany({
            data: clientes
        })

        await prisma.tipoDeCambio.createMany({
            data: tipoDeCambios
        })

        await prisma.formaDePagoContado.createMany({
            data: formaPagoContado
        })

        await prisma.formaDePagoCredito.createMany({
            data: formaPagoCredito
        })
        
        await prisma.cotizacion.createMany({
            data: cotizaciones
        })

        await prisma.cotizacionToMaterial.createMany({
            data: cotizacionesToMateriales
        })

        await prisma.aprovacionCotizacion.createMany({
            data: cotizacionesAprobadas
        })

        await prisma.aprovacionCotizacionToMaterial.createMany({
            data: cotizacionesAprobadasToMateriales
        })

        await prisma.cotizacionToAprovacionCotizacion.createMany({
            data: cotizacionesAprobadasToCotizacion
        })

        await prisma.aprovacionPedido.createMany({
            data: pedidosAprobados
        })

        await prisma.aprovacionPedidoToMaterial.createMany({
            data: pedidosAprobadosToMateriales
        })

        await prisma.aprovacionCotizacionToAprovacionPedido.createMany({
            data: cotizacionesAprobadasToPedidoAprobado
        })

        await prisma.guiaDeRemision.createMany({
            data: guiasRemision
        })

        // await prisma.factura.createMany({
        //     data: facturas
        // })

        // await prisma.reporteVentas.createMany ({
        //     data: ReportesVentas
        // })

        // await prisma.reporteRecordClientes.createMany ({
        //     data: ReportesRecordClientes
        // })

        // await prisma.reporteRecordProveedores.createMany ({
        //     data: ReportesRecordProveedores
        // })

        // await prisma.reporteStockMinimo.createMany ({
        //     data: ReportesStockMinimo
        // })

        // await prisma.reporteMensualVentas.createMany ({
        //     data: reportesMensualesVentas
        // })                
    } catch (error) {
        console.log(error);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();    
});