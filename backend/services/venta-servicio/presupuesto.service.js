import prisma from "../../prisma";
import { generateGenericCode } from "../../utils/codes";
import { convertHoursToSave } from "../../utils/fechasHoras";

export class PresupuestoServicioService {
    static async create(data) {
        const { empresaId, fechaIngreso, horaIngreso, fechaSalida, horaSalida, materiales, servicios, repuestos, trabajosTerceros, ...props } = data;
        const inputFechaIngreso = new Date(fechaIngreso);
        const inputFechaSalida = new Date(fechaSalida);
        const dateHoras = convertHoursToSave(horaIngreso);
        const dateHoraSalidas = convertHoursToSave(horaSalida);
        // const inputHora = dateHoras.toLocaleTimeString('es-ES', {hour12: false});

        const newPresupuesto = await prisma.presupuesto.create ({
            data: {
                ...props,
                empresaId: Number(empresaId),
                fechaIngreso: inputFechaIngreso,
                fechaSalida: inputFechaSalida,
                horaIngreso: dateHoras,
                horaSalida: dateHoraSalidas,
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
                }
            }
        });

        const presupuestoCreated = await prisma.presupuesto. update({
            where: {
                id: newPresupuesto.id
            },
            data: {
                codigo: generateGenericCode("PRTO", newPresupuesto.id)
            }
        });
        return presupuestoCreated;
    }

    static async getAll(empresaId, userId) {
        const presupuestos = await prisma.presupuesto.findMany({
            where: {
                empresaId,
                ...(userId && {
                    clienteId: userId
                })
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
        return presupuestos;
    }

    static async update(id, data) {
        const resTransaction = await prisma.$transaction( async (PrismaClient) => {
            const { fechaIngreso, horaIngreso, fechaSalida, horaSalida, materiales, servicios, repuestos, trabajosTerceros, ...props } = data;
            
            const inputFechaIngreso = new Date(fechaIngreso);
            const inputFechaSalida = new Date(fechaSalida);
            const dateHoras = convertHoursToSave(horaIngreso);
            const dateHoraSalidas = convertHoursToSave(horaSalida);

            const presupuestoUpdated = await PrismaClient.presupuesto.update({
                where: {
                    id
                },
                data: {
                    ...props,
                    fechaIngreso: inputFechaIngreso,
                    fechaSalida: inputFechaSalida,
                    horaIngreso: dateHoras,
                    horaSalida: dateHoraSalidas,
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
                    }),
                }
            })
            return presupuestoUpdated;
        })
        return resTransaction;
    }

    static async delete(id) {
        const presupuestoDeleted = await prisma.presupuesto.delete({
            where: {
                id
            }
        });
        return presupuestoDeleted;
    }
}