// import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { generateGenericCode } from "../../utils/codes";


export class AprobacionPedidoService {

  static async create (data) {
    const { empresaId, materiales, aprovacionCotizacion, ...props } = data;
    
    const newPedidoAprob = await prisma.aprovacionPedido.create ({
      data: {
        ...props,
        empresaId: Number(empresaId),
        materiales: {
          create: materiales?.map(({cantidad, id}) => {
            return {
              cantidad,
              material:{
                connect: {
                  id
                }
              }
            }
          }) 
        },
        aprovacionCotizacion: {
          create: aprovacionCotizacion?.map(({ id }) => {
            return {
              aprovacionCotizacion: {
                connect: {
                  id
                }
              }
            }
          })
        }
      }
    });

    const pedidoCreated = await prisma.aprovacionPedido.update({
      where:{
        id: newPedidoAprob.id
      },
      data: {
        number: generateGenericCode("PA", newPedidoAprob.id)
      }
    })
    return pedidoCreated;
  }

  static async update(id, data) {
    const { materiales, aprovacionCotizacion, ...props } = data;
    const updatedPedido = await prisma.aprovacionPedido.update ({
      where: {
        id
      },
      data: {
        ...props,
        ...(materiales?.length > 0 && {
          materiales: {
            deleteMany: {},
            createMany: {
              data: materiales?.map(({cantidad, id}) => ({
                materialId: Number(id),
                cantidad
              }))
            }
          }
        }),
        aprovacionCotizacion: {
          set: aprovacionCotizacion?.map( ({idCot}) => {
            return {
              id: idCot
            }
          })
        }
      }
    })
    return updatedPedido;
  }

  static async delete(id) {
    const deletedPedido = await prisma.aprovacionPedido.delete({
      where: {
        id,
      },
    });

    return deletedPedido;
  }

  static async get(id) {
    const pedido = await prisma.aprovacionPedido.findUnique({
      where: {
        id,
      },
      include: {
        cliente: true,
        // materiales: true
      }
    });

    return pedido;
  }

// TO-DO
// 1. getAll trayendo la info asociada de cada cliente respectivo (para la vista principal)
// 2. get de un pedido aprobado (id) trayendo la info del cliente y los materiales

  static async getAll(empresaId, filterName) {
    const pedidos = await prisma.aprovacionPedido.findMany({
      where: {
        empresaId,
        ...(filterName && {
          OR: [
            {
              number: {
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

    return pedidos;
  }

  static async getAllCotizacionesByClienteId(clienteId) {
    const pedidos = await prisma.aprovacionPedido.findMany({
      where: {
        clienteId
      },
      include: {
        cliente: true,
        materiales: true
      }
    })

    return pedidos;
  }

  static async getCotizacionByIdAndMaterial(id) {
    const pedidos = await prisma.aprovacionPedido.findUnique({
      where: {
        id
      },
      include: {
        materiales: true,
      }
    })

    return pedidos;
  }

}


