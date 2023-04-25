
import prisma from "../../prisma";

export class GuiaRemisionService {

    static async create (data) {
        const { empresaId, fechaDeCotizacion, fechaDeValidez, materiales, ...props } = data;
        const inputFechaGuia = new Date(fechaDeCotizacion);
        const inputFechaValidez = new Date(fechaDeValidez);

        const newGuia = await prisma.guiaDeRemision.create ({
            data: {
                ...props,
                empresaId: Number(empresaId),
                fechaDeCotizacion: inputFechaGuia,
                fechaDeValidez: inputFechaValidez
            }
        })
        const guiaCreated = await prisma.guiaDeRemision.update({
            where: {
                id: newGuia.id
            },
            data: {
                NumeroGuiaDeRemision: `guia-${newGuia.id}`
            }
        })
        return guiaCreated;
    }

    static async update (id, data) {
        const resTransaction = await prisma.$transaction( async (PrismaClient) => {
            const { fechaDeCotizacion, fechaDeValidez, materiales, ...props } = data;
            const inputFechaGuia = new Date(fechaDeCotizacion);
            const inputFechaValidez = new Date(fechaDeValidez);

            const guiaUpdated = await prisma.guiaDeRemision.update ({
                where: {
                    id
                },
                data: {
                    ...props,
                    fechaDeCotizacion: inputFechaGuia,
                    fechaDeValidez: inputFechaValidez
                }
            });
            return guiaUpdated;
        })
        return resTransaction;
    }

    static async delete (id) {
        const guiaDeleted = await prisma.guiaDeRemision.delete ({
            where: {
                id
            }
        });
        return guiaDeleted;
    }

    static async getAll (empresaId, filterName) {
        const guias = await prisma.guiaDeRemision.findMany({
            where: {
                empresaId,
                ...(filterName && {
                    OR: [
                        {
                            NumeroGuiaDeRemision: {
                                contains: filterName
                            }
                        },
                        {
                            cliente: {
                              nombre: {
                                contains: filterName
                              }
                            }
                        },
                        {
                            cliente: {
                              codigo: {
                                contains: filterName
                              }
                            }
                        }
                    ]
                })
            },
            include: {
                cliente: true,
                aprovacionPedido: {
                    include: {
                        cliente: true,
                        materiales: {
                            include: {
                                material: {
                                    include: {
                                        familia: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        return guias;
    }

    static async get (id) {

    }
}


// TO-DO
// 1. getAll trayendo la info asociada del cliente (pantalla principal)
// 2. get de una guia (id) trayendo la info del cliente y los materiales asociados

