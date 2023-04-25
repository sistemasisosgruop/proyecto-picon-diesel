import prisma from "../../prisma";
import { generateGenericCode } from "../../utils/codes";

export class GuiaRemisionServiciosService {
    static async create(data) {
        const { empresaId, fechaGuia, fechaValidez, materiales, ...props } = data;
        const inputFechaGuia = new Date(fechaGuia);
        const inputFechaValidez = new Date(fechaValidez);

        const newGuia = await prisma.guiaRemisionServicios.create ({
            data: {
                ...props,
                empresaId: Number(empresaId),
                fechaGuia: inputFechaGuia,
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
            }
        });

        const guiaCreated = await prisma.guiaRemisionServicios.update({
            where:{
                id: newGuia.id
            },
            data: {
                codigo: generateGenericCode("GUIA", newGuia.id),
                nroGuiaRemision: `guia-${newGuia.id}`
            }
        })

        return guiaCreated;
    }

    static async getAll(empresaId, filterName){
        const guias = await prisma.guiaRemisionServicios.findMany({
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
                personal: true,
                vendedor: true,
                Maquina: {
                    include: {
                        fabricaMaquina: true,
                        modeloMaquina: true
                    }
                },
                ordenTrabajo: {
                    include: {
                        cliente: true,
                        servicios: {
                            include: {
                                servicio: true
                            }
                        }
                    }
                },
                materiales: {
                    include:{
                        material:{
                            include:{
                                familia: true
                            }
                        }
                    }
                }
            }
        });
        return guias;
    }

    static async update(id,data) {
        const resTransaction = await prisma.$transaction( async (PrismaClient) => {
            const { fechaGuia, fechaValidez, materiales, ...props } = data;
            const inputFechaGuia = new Date(fechaGuia);
            const inputFechaValidez = new Date(fechaValidez);

            const guiaUpdated = await prisma.guiaRemisionServicios.update ({
                where: {
                    id
                },
                data: {
                    ...props,
                    fechaGuia: inputFechaGuia,
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
                    })
                }
            });
            return guiaUpdated;
        })
        return resTransaction;

    }

    static async delete(id) {
        const guiaDeleted = await prisma.guiaRemisionServicios.delete({
            where: {
                id
            }
        });
        return guiaDeleted;
    }
}