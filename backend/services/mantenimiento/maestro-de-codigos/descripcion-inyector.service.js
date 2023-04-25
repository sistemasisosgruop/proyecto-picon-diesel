import prisma from "../../../prisma";

export class DescripcionInyectorService {
  static async createDescripcionInyector(data) {
    const transaction = await prisma.$transaction(async (prismaClient) => {
      const { codigo, descripcion, empresaId } = data;
      const descripcionInyector = await prismaClient.descripcionInyector.create(
        {
          data: {
            codigo,
            descripcion,
            empresaId,
          },
        }
      );

      return descripcionInyector;
    });
    return transaction;
  }

  static async updateDescripcionInyector(id, data) {
    const { codigo, descripcion } = data;
    const descripcionInyector = prisma.descripcionInyector.update({
      where: {
        id,
      },
      data: {
        codigo,
        descripcion,
      },
    });

    return descripcionInyector;
  }

  static async deleteDescripcionInyector(id) {
    const descripcionInyector = prisma.descripcionInyector.delete({
      where: {
        id,
      },
    });

    return descripcionInyector;
  }

  static async getDescripcionInyectores(empresaId) {
    return prisma.descripcionInyector.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getDescripcionInyector(id) {
    const descripcionInyector = await prisma.descripcionInyector.findUnique({
      where: {
        id,
      },
    });

    return descripcionInyector;
  }
}
