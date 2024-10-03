import prisma from "../../prisma";

export class TrabajoTercerosService {
  static async create(body) {
    const { empresaId, ...data } = body;
    const trabajo = await prisma.trabajoTerceros.create({
      data: {
        ...data,
        empresaId,
      },
    });

    return trabajo;
  }

  static async update(id, body) {
    const { empresaId, ...data } = body;
    const trabajo = await prisma.trabajoTerceros.update({
      where: {
        id,
      },
      data: {
        ...data,
        empresaId,
      },
    });

    return trabajo;
  }

  static async delete(id) {
    const trabajo = await prisma.trabajoTerceros.delete({
      where: {
        id,
      },
    });

    return trabajo;
  }

  static async getAll(empresaId, filterName) {
    return prisma.trabajoTerceros.findMany({
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
              definicion: {
                contains: filterName,
              },
            }
          ]
        })
      },
    });
  }

  static async get(id) {
    const trabajo = await prisma.trabajoTerceros.findUnique({
      where: {
        id: Number(id),
        
      },
    });

    return trabajo;
  }
}
