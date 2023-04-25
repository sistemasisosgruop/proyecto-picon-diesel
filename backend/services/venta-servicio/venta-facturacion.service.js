import prisma from "../../prisma";
import { generateGenericCode } from "../../utils/codes";

export class VentaFacturacionServiciosService {
    static async create(data) {
        const { empresaId, materiales, servicios, fechaFactura, fechaValidez, ...props } = data;
        const inputFechaFactura = new Date(fechaFactura);
        const inputFechaValidez = new Date(fechaValidez);

        const newFactura = await prisma.facturaServicios.create ({
            data: {
                ...props,
                empresaId: Number(empresaId),
                fechaFactura: inputFechaFactura,
                fechaValidez: inputFechaValidez,
                materiales: {
                    create: materiales?.map(({cantidad, precio, id}) => {
                        return {
                            cantidad,
                            precio,
                            material:{
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                },
                servicios: {
                    create: servicios?.map(({precio, id}) => {
                        return {
                            precio,
                            servicio: {
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                }
            }
        });

        const facturaCreated = await prisma.facturaServicios.update({
            where:{
                id: newFactura.id
            },
            data: {
                codigo: generateGenericCode("FAC", newFactura.id),
                nroFactura: `${newFactura.serie}-${newFactura.id}`
            }
        })
        return facturaCreated
    }

    static async getAll(empresaId) {
        const facturas = await prisma.facturaServicios.findMany ({
            where: {
                empresaId
            },
            include: {
                cliente: true,
                materiales: {
                    include:{
                        material:{
                            include:{
                                familia: true
                            }
                        }
                    }
                },
                servicios: {
                    include: {
                        servicio: true
                    }
                }

            }
        })
        return facturas;
    }

    static async update(id, data) {
        
        const resTransaction = await prisma.$transaction( async (PrismaClient) => {
            const { materiales, servicios, fechaFactura, fechaValidez, ...props } = data;
            const inputFechaFactura = new Date(fechaFactura);
            const inputFechaValidez = new Date(fechaValidez);

            const facturaUpdated = await prisma.facturaServicios.update ({
                where: {
                    id
                },
                data: {
                    ...props,
                    fechaFactura: inputFechaFactura,
                    fechaValidez: inputFechaValidez,
                    ...(materiales?.length > 0 && {
                        materiales: {
                          deleteMany: {},
                          createMany: {
                            data: materiales?.map(({cantidad, precio, id}) => ({
                                materialId: Number(id),
                                cantidad,
                                precio
                            }))
                          }
                        }
                    }),
                    ...(servicios?.length > 0 && {
                        servicios: {
                          deleteMany: {},
                          createMany: {
                            data: servicios?.map(({precio, id}) => ({
                                servicioId: Number(id),
                                precio
                            }))
                          }
                        }
                    }) 
                }
            })
            return facturaUpdated;
        })
        return resTransaction;

    }

    static async delete(id) {
        const facturaDeleted = await prisma.facturaServicios.delete({
            where: {
                id
            }
        });
        return facturaDeleted;
    }
}