export const pedidosAprobados = [
    {
        number: "PA01",
        subtotal: 5650.00,
        descuento: 2.5,
        subtotalValorNeto: 5100.00,
        igv: 18.00,
        totalSoles: 5400,
        fechaAprobacion: "2023-01-01T00:00:00.000Z",
        moneda: "Soles",
        maquina: "Inyector de bujias 1",
        estado: "Activo",
        clienteId: 1,
        empresaId: 1,
        sucursalId: 1
    },
    {
        number: "PA02",
        subtotal: 5650.00,
        descuento: 2.5,
        subtotalValorNeto: 5100.00,
        igv: 18.00,
        totalSoles: 5400,
        fechaAprobacion: "2023-01-01T00:00:00.000Z",
        moneda: "Soles",
        maquina: "Inyector de bujias 2",
        estado: "Activo",
        clienteId: 1,
        empresaId: 1,
        sucursalId: 1
    },
    {
        number: "PA03",
        subtotal: 5650.00,
        descuento: 2.5,
        subtotalValorNeto: 5100.00,
        igv: 18.00,
        totalSoles: 5400,
        fechaAprobacion: "2023-01-01T00:00:00.000Z",
        moneda: "Soles",
        maquina: "Inyector de bujias 1",
        estado: "Activo",
        clienteId: 1,
        empresaId: 1,
        sucursalId: 1
    }
]

export const pedidosAprobadosToMateriales = [
    {
        aprovacionPedidonId: 1,
        materialId: 11,
        cantidad: 10
    },
    {
        aprovacionPedidonId: 1,
        materialId: 12,
        cantidad: 3
    },
    {
        aprovacionPedidonId: 1,
        materialId: 15,
        cantidad: 4
    },
    {
        aprovacionPedidonId: 2,
        materialId: 13,
        cantidad: 13
    },
    {
        aprovacionPedidonId: 2,
        materialId: 17,
        cantidad: 6
    },
    {
        aprovacionPedidonId: 2,
        materialId: 19,
        cantidad: 2
    },
    {
        aprovacionPedidonId: 3,
        materialId: 17,
        cantidad: 17
    },
    {
        aprovacionPedidonId: 3,
        materialId: 15,
        cantidad: 6
    },
    {
        aprovacionPedidonId: 3,
        materialId: 19,
        cantidad: 8
    }

]

export const cotizacionesAprobadasToPedidoAprobado = [
    {
        aprovacionCotizacionId: 1,
        aprovacionPedidoId: 1
    },
    {
        aprovacionCotizacionId: 3,
        aprovacionPedidoId: 1
    },
    {
        aprovacionCotizacionId: 2,
        aprovacionPedidoId: 2
    },
    {
        aprovacionCotizacionId: 3,
        aprovacionPedidoId: 2
    },
    {
        aprovacionCotizacionId: 1,
        aprovacionPedidoId: 3
    },
    {
        aprovacionCotizacionId: 2,
        aprovacionPedidoId: 3
    }
    
]