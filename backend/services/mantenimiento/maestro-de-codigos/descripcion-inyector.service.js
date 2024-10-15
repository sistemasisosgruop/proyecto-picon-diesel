import prisma from "../../../prisma";

export class DescripcionInyectorService {
  static async createDescripcionInyector(data) {
    const transaction = await prisma.$transaction(async (prismaClient) => {
      const { descripcion, empresaId } = data;
      const descripcionInyector = await prismaClient.descripcionInyector.create({
        data: {
          codigo: await this.generarCodigoByEmpresa(empresaId),
          descripcion,
          // empresaId,
        },
      });

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
      orderBy: {
        codigo: "desc",
      },
      // where: {
      //   empresaId,
      // },
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

  static async generarCodigoByEmpresa(empresaId) {
    const lastFamilia = await prisma.descripcionInyector.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      // where: { empresaId },
    });

    let codigo;
    if (lastFamilia) {
      const nextCodigo = parseInt(lastFamilia.codigo, 10) + 1;
      codigo = String(nextCodigo).padStart(2, "0");
    } else {
      codigo = "01";
    }
    return codigo;
  }
}
