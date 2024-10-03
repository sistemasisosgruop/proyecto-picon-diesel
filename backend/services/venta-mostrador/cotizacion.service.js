// import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { generateGenericCode } from "../../utils/codes";


export class CotizacionService {
  // static async create(data) {

  //   const resTransaction = await prisma.$transaction(async (PrismaClient) => {
  //     const { empresaId, materiales, ...props } = data;

  //     const cotizacion = await PrismaClient.cotizacion.create({
  //       data: {
  //         ...props,
  //         empresaId: Number(empresaId),
  //         ...(materiales && {
  //           cotizacionToMaterial: {
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
  //     return cotizacion;
  //   })

  //   // transaccion en caso hayan mas querys luego

  //   return resTransaction;
    
  // }

  static async create(data) {
    const { number, empresaId, materiales, fechaCotizacion, fechaValidez, ...props } = data;

    const inputFechaCotizacion = new Date(fechaCotizacion);
    const inputFechaValidez = new Date(fechaValidez);
    
    const newCotizacion = await prisma.cotizacion.create ({
      data: {
        ...props,
        empresaId: Number(empresaId),
        fechaCotizacion: inputFechaCotizacion,
        fechaValidez: inputFechaValidez,
        materiales: {
          create: materiales?.map(({cantidadMateriales, id}) => {
            return {
              cantidadMateriales,
              material:{
                connect: {
                  id
                }
              }
            }
          }) 
        }

      }
    });

    const cotizacionCreated = await prisma.cotizacion.update({
      where:{
        id: newCotizacion.id
      },
      data: {
        number: generateGenericCode("COT", newCotizacion.id)
      }
    })
    return cotizacionCreated;
  }

  static async update(id, data) {
    const resTransaction= await prisma.$transaction( async (PrismaClient) => {
      const { materiales, fechaCotizacion, fechaValidez,...props} = data;
      const inputFechaCotizacion = new Date(fechaCotizacion);
      const inputFechaValidez = new Date(fechaValidez);
      const cotizacion = await PrismaClient.cotizacion.update({
        where: {
          id
        },
        data: {
          ...props,
          fechaCotizacion: inputFechaCotizacion,
          fechaValidez: inputFechaValidez,
          ...(materiales?.length > 0 && {
            materiales: {
              deleteMany: {},
              createMany: {
                data: materiales?.map(({cantidadMateriales, id}) => ({
                  materialId: Number(id),
                  cantidadMateriales
                }))
              }
            }
          })
        }
      })
      return cotizacion;
    })
    return resTransaction;
    
  }

  static async delete(id) {
    const cotizacion = await prisma.cotizacion.delete({
      where: {
        id,
      },
    });

    return cotizacion;
  }

  static async get(id) {
    const cotizacion = await prisma.cotizacion.findUnique({
      where: {
        id,
      },
      include: {
        cliente: true,
        materiales: {
          include: {
            material: true
          }
        }
      }
    });

    return cotizacion;
  }

// TO-DO
// 1. getAll trayendo la info asociada del cliente (pantalla principal) 
// 2. getAll de todos las cotizaciones  con respecto a un id de cliente
// 3. getAll de una cotizacion (id) trayendo sus respectivos materiales 

  static async getAll(empresaId, userId) {
    const cotizacion = await prisma.cotizacion.findMany({
      where: {
        empresaId,
        ...(userId && {
          clienteId: userId
        })
      },
      include: {
        cliente: true,
        Maquina: {
          include: {
            fabricaMaquina: true,
            modeloMaquina: true
          }    
        },
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

    return cotizacion;
  }

  static async getAllCotizacionesByClienteId(clienteId) { // en pantalla cotaprov
    const cotizaciones = await prisma.cotizacion.findMany({
      where: {
        clienteId
      },
      include: {
        cliente: true,
        materiales: true
      }
    })

    return cotizaciones;
  }

  static async getCotizacionByIdAndMaterial(id) { // en pantalla cotaprov
    const cotizacion = await prisma.cotizacion.findUnique({
      where: {
        id
      },
      include: {
        materiales: true,
      }
    })

    return cotizacion;
  }

}


