import prisma from "../../prisma";
import { generateGenericCode } from "../../utils/codes";


export class RecepcionEvaluacionService {
    static async create(data) {
        const { empresaId, materiales, servicios, bombaInyeccionJSON, inyectorElectronicoJSON, inyectorConvencionalJSON, ...props} = data;

        // const setBombaInyeccionJSON = JSON.stringify(bombaInyeccionJSON);
        // const setInyectorElectronicoJSON = JSON.stringify(inyectorElectronicoJSON);
        // const setInyectorConvencionalJSON = JSON.stringify(inyectorConvencionalJSON);

        const newHoja = await prisma.hojaRecepcion.create ({
            data: {
                ...props,
                empresaId: Number(empresaId),
                bombaInyeccionJSON,
                inyectorElectronicoJSON,
                inyectorConvencionalJSON,
                materiales: {
                    create: materiales?.map(({cantidad, diagnostico, observaciones, id}) => {
                        return {
                            cantidad,
                            diagnostico,
                            observaciones,
                            material:{
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                },
                servicios: {
                    create: servicios?.map(({id}) => {
                        return {
                            servicio: {
                                connect: {
                                    id
                                }
                            }
                        }
                    })
                }
            }
        })

        const hoja = await prisma.hojaRecepcion.update({
            where:{
                id: newHoja.id
            },
            data: {
                codigo: generateGenericCode("HOJ", newHoja.id)
            }
        })
        // generateGenericCode
        return hoja;
    }

    static async getAll(empresaId) {
        const hojas = await prisma.hojaRecepcion.findMany({
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
        return hojas
    }

    static async update(id, data) {
        // const hojaUpdated = await prisma.hojaRecepcion.findMany({

        // })
        const resTransaction = await prisma.$transaction( async (PrismaClient) => {
            const {materiales, servicios, bombaInyeccionJSON, inyectorElectronicoJSON, inyectorConvencionalJSON, ...props } = data;
            
            const hojaUpdated = await PrismaClient.hojaRecepcion.update({
                where: {
                    id
                },
                data: {
                    ...props,
                    bombaInyeccionJSON,
                    inyectorElectronicoJSON,
                    inyectorConvencionalJSON,
                    ...(materiales?.length > 0 && {
                        materiales: {
                          deleteMany: {},
                          createMany: {
                            data: materiales?.map(({cantidad, diagnostico, observaciones, id}) => ({
                                materialId: Number(id),
                                cantidad,
                                diagnostico,
                                observaciones
                            }))
                          }
                        }
                    }),
                    ...(servicios?.length > 0 && {
                        servicios: {
                          deleteMany: {},
                          createMany: {
                            data: servicios?.map(({id}) => ({
                                servicioId: Number(id)
                            }))
                          }
                        }
                    }) 
                }
            })
            return hojaUpdated;
        });
        return resTransaction;
    }

    static async delete(id){
        const hojaDeleted = await prisma.hojaRecepcion.delete({
            where: {
                id
            }
        });
        return hojaDeleted;
    }
}