import prisma from "../../prisma";

export class FacturaService {

    static async create (data) {
        const { empresaId, fechaDeFactura, fechaDeValidez, ...props } = data;
        const inputFechaFactura = new Date(fechaDeFactura);
        const inputFechaValidez = new Date(fechaDeValidez);
        const newFactura = await prisma.factura.create ({
            data: {
                ...props,
                fechaDeFactura: inputFechaFactura,
                fechaDeValidez: inputFechaValidez,
                empresaId: Number(empresaId)
            }
        })

        const facturaCreated = await prisma.factura.update({
            where: {
                id: newFactura.id
            },
            data: {
                numeroDeFactura: `${newFactura.numeroDeFactura}-${newFactura.id}`
            }
        }) 
        return facturaCreated;
    }

    static async update (id, data) {
        const resTransaction = await prisma.$transaction( async (PrismaClient) => {
            const { fechaDeFactura, fechaDeValidez, ...props } = data;
            const inputFechaFactura = new Date(fechaDeFactura);
            const inputFechaValidez = new Date(fechaDeValidez);

            const facturaUpdated = await prisma.factura.update ({
                where: {
                    id
                },
                data: {
                    ...props,
                    fechaDeFactura: inputFechaFactura,
                    fechaDeValidez: inputFechaValidez
                }
            });
            return facturaUpdated;
        })
        return resTransaction;
    }

    static async delete (id) {
        const facturaDeleted = await prisma.factura.delete ({
            where: {
                id
            }
        });
        return facturaDeleted;
    }

    static async getAll (empresaId) {
        const facturas = await prisma.factura.findMany({
            where: {
                empresaId
            },
            include: {
                cliente: true
            }
        })
        return facturas;
    }

    static async get (id) {

    }
}