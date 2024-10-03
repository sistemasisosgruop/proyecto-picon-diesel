import prisma from "../../prisma";

export class AprobacionCotizacionService {
      // static async create(data) {

      //   const resTransaction = await prisma.$transaction(async (PrismaClient) => {
      //     const { empresaId, materiales, ...props } = data;

      //     const cotizacionAprobada = await PrismaClient.aprovacionCotizacion.create({
      //       data: {
      //         ...props,
      //         empresaId: Number(empresaId),
      //         ...(materiales && {
      //           aprovacionCotizacionToMaterial: {
      //             createMany: {
      //               data: materiales?.map(({cantidad, materialId}) => ({
      //                 materialId: Number(materialId),
      //                 cantidad
      //               }))
      //             }
      //           }
      //         })
      //       }
      //     })
      //     return cotizacionAprobada;
      //   })

      //   // transaccion en caso hayan mas querys luego

      //   return resTransaction;
        
      // }

      static async create (data) {
        const { empresaId, materiales, cotizaciones, ...props} = data;
        const newCotizacionAprob = await prisma.aprovacionCotizacion.create ({
          data: {
            ...props,
            empresaId: Number(empresaId),
            materiales: {
              create: materiales?.map(({cantidadMateriales, id}) => {
                return {
                  cantidad: cantidadMateriales,
                  material:{
                    connect: {
                      id
                    }
                  }
                }
              }) 
            },
            cotizaciones: {
              create: cotizaciones?.map(({id}) => {
                return {
                  cotizacion:{
                    connect: {
                      id
                    }
                  }
                }
              }) 
            }
          }
        })
        const cotizacionAprob = await prisma.aprovacionCotizacion.update ({
          where: {
            id: newCotizacionAprob.id
          },
          data: {
            number: `COA-${newCotizacionAprob.id.toString()}`
          }
        })
        return cotizacionAprob;
      }

       // {
            //   connect: cotizaciones?.map(({ id }) => {
            //     return {
            //       id
            //     }
            //   })
            // }

      static async update(id, data) {
        const resTransaction= await prisma.$transaction( async (PrismaClient) => {
          const { materiales, cotizaciones, cliente, Maquina, ...props} = data;
          const cotizacionAprobada = await PrismaClient.aprovacionCotizacion.update({
            where: {
              id
            },
            data: {
              ...props,
              ...(materiales?.length > 0 && {
                materiales: {
                  deleteMany: {},
                  createMany: {
                    data: materiales?.map(({cantidadMateriales, id}) => ({
                      materialId: Number(id),
                      cantidad: cantidadMateriales
                    }))
                  }
                },
              }),
              cotizaciones: {
                deleteMany: {},
                createMany: {
                  data: cotizaciones?.map(({id}) => ({
                    cotizacionId: Number(id)
                  }))
                }
                // create: cotizaciones?.map(({id}) => {
                //   return {
                //     cotizacion:{
                //       connect: {
                //         id
                //       }
                //     }
                //   }
                // }) 
              }
            }
          })
          return cotizacionAprobada;
        })
        return resTransaction;
      }

      // static async update(id, data) {
      //   const { materiales, cotizaciones, ...props} = data;
      //   const updatedCotAprob = await prisma.aprovacionCotizacion.update ({
      //     where: {
      //       id
      //     },
      //     data: {
      //       ...props,
      //       ...(materiales?.length > 0 && {
      //         materiales: {
      //           deleteMany: {},
      //           createMany: {
      //             data: materiales?.map(({cantidadMateriales, id}) => ({
      //               materialId: Number(id),
      //               cantidad: cantidadMateriales
      //             }))
      //           }
      //         }
      //       }),
      //       cotizaciones: {
      //         set: cotizaciones?.map( ({idCot}) => {
      //           return {
      //             id: idCot
      //           }
      //         })
      //       }
      //     }
      //   })
      //   return updatedCotAprob;
      // }
      
    
      static async delete(id) {
        const aprovacionCotizacion = await prisma.aprovacionCotizacion.delete({
          where: {
            id,
          },
        });
    
        return aprovacionCotizacion;
      }
    
      static async get(id) {
        const aprovacionCotizacion = await prisma.aprovacionCotizacion.findUnique({
          where: {
            id,
          },
        });
    
        return aprovacionCotizacion;
      }

// TO-DO
// 1. getAll trayendo la info asociada de cada cliente respectivo
// 2. getAll de todos las cotizaciones aprobadas con respecto a un id de cliente
// 2. getAll de una cotizacion aprobada (id) trayendo sus respectivos materiales

      static async getAll(empresaId, userId) {
        const cotizacionesAprobadas = await prisma.aprovacionCotizacion.findMany({
          where: {
            empresaId,
            ...(userId && {
              clienteId: parseInt(userId)
            })
          },
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
        });
    
        return cotizacionesAprobadas;
      }

      static async getAllCotizacionesByClienteId(clienteId) {
        const cotizacionesAprobadas = await prisma.aprovacionCotizacion.findMany({
          where: {
            clienteId
          },
          include: {
            cliente: true,
            materiales: true
          }
        })
    
        return cotizacionesAprobadas;
      }

      static async getCotizacionByIdAndMaterial(id) {
        const cotizacionAprobada = await prisma.aprovacionCotizacion.findUnique({
          where: {
            id
          },
          include: {
            materiales: true,
          }
        })
    
        return cotizacionAprobada;
      }
}


