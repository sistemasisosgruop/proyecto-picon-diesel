import prisma from "../../prisma";
import { generateGenericCode } from "../../utils/codes";

export class OrdenTrabajoService {
    static async create(data) {
        const { empresaId, presupuestos, servicios, repuestos, materiales, trabajosTerceros, ...props } = data;

        const newOrden = await prisma.ordenTrabajo.create({
            data: {
                ...props,
                empresaId: Number(empresaId),
                materiales: {
                    create: materiales?.map(({cantidad, precio, comentarios, id}) => {
                        return {
                            cantidad,
                            precio,
                            comentarios,
                            material:{
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                },
                servicios: {
                    create: servicios?.map(({diagnostico, precio, comentarios, id}) => {
                        return {
                            diagnostico,
                            precio,
                            comentarios,
                            servicio:{
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                },
                repuestos: {
                    create: repuestos?.map(({cantidad, diagnostico, precio, comentarios, id}) => {
                        return {
                            cantidad,
                            diagnostico,
                            precio,
                            comentarios,
                            repuesto:{
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                },
                trabajosTerceros: {
                    create: trabajosTerceros?.map(({ precio, comentarios, id}) => {
                        return {
                            precio,
                            comentarios,
                            trabajoTercero:{
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                },
                presupuestos: {
                    create: presupuestos?.map(({id}) => {
                        return {
                            presupuesto: {
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                }
            }
        })
        const ordenCreated = await prisma.ordenTrabajo.update({
            where: {
                id: newOrden.id
            },
            data: {
                codigo: generateGenericCode("ORDT", newOrden.id)
            }
        })
        return ordenCreated;
    }

    static async getAll(empresaId, filterName) {
        const ordenes = await prisma.ordenTrabajo.findMany({
            where: {
                empresaId,
                ...(filterName && {
                    OR: [
                        {
                            codigo: {
                                contains: filterName,
                            },
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
                    ],
                })
            },
            include: {
                cliente: true,
                presupuestos: true,
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
                },
                repuestos: {
                    include:{
                        repuesto:{
                            include:{
                                familia: true
                            }
                        }
                    }
                },
                trabajosTerceros: {
                    include: {
                        trabajoTercero: true
                    }
                }
            }
        });
        return ordenes;
    }

    static async update(id, data) {
        const resTransaction = await prisma.$transaction( async (PrismaClient) => {
            const { presupuestos, servicios, repuestos, materiales, trabajosTerceros, ...props } = data;

            const ordenUpdated = await PrismaClient.ordenTrabajo.update({
                where: {
                    id
                },
                data: {
                    ...props,
                    ...(presupuestos?.length > 0 && {
                        presupuestos: {
                            deleteMany: {},
                            createMany: {
                                data: presupuestos?.map(({id}) => ({
                                    presupuestoId: Number(id)
                                }))
                            }
                        }
                    }),
                    ...(materiales?.length > 0 && {
                        materiales: {
                          deleteMany: {},
                          createMany: {
                            data: materiales?.map(({cantidad, precio, comentarios, id}) => ({
                                materialId: Number(id),
                                cantidad,
                                precio,
                                comentarios
                            }))
                          }
                        }
                    }),
                    ...(servicios?.length > 0 && {
                        servicios: {
                          deleteMany: {},
                          createMany: {
                            data: servicios?.map(({id, diagnostico, precio, comentarios}) => ({
                                servicioId: Number(id),
                                diagnostico,
                                precio,
                                comentarios
                            }))
                          }
                        }
                    }),
                    ...(repuestos?.length > 0 && {
                        repuestos: {
                          deleteMany: {},
                          createMany: {
                            data: repuestos?.map(({id, cantidad, diagnostico, precio, comentarios}) => ({
                                repuestoId: Number(id),
                                cantidad,
                                diagnostico,
                                precio,
                                comentarios
                            }))
                          }
                        }
                    }),
                    ...(trabajosTerceros?.length > 0 && {
                        trabajosTerceros: {
                          deleteMany: {},
                          createMany: {
                            data: trabajosTerceros?.map(({id, precio, comentarios}) => ({
                                trabajoTerceroId: Number(id),
                                precio,
                                comentarios
                            }))
                          }
                        }
                    })
                }
            })
            return ordenUpdated;

        });
        return resTransaction;
    }

    static async delete(id) {
        const ordenDeleted = await prisma.ordenTrabajo.delete({
            where: {
                id
            }
        });
        return ordenDeleted;
    }
}