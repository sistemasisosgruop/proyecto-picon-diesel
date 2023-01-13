import prisma from "../../../prisma";

export class MarcaFabricaInyectorService {
  static async createMarcaFabricaInyector(data) {
    const { codigo, marca, empresaId } = data;
    const marcaFabricaInyector = await prisma.marcaFabricaInyector.create({
      data: {
        codigo,
        marca,
        empresaId,
      },
    });

    return marcaFabricaInyector;
  }

  static async updateMarcaFabricaInyector(id, data) {
    const { codigo, marca } = data;
    const marcaFabricaInyector = prisma.marcaFabricaInyector.update({
      where: {
        id,
      },
      data: {
        codigo,
        marca,
      },
    });

    return marcaFabricaInyector;
  }

  static async deleteMarcaFabricaInyector(id) {
    const marcaFabricaInyector = prisma.marcaFabricaInyector.delete({
      where: {
        id,
      },
    });

    return marcaFabricaInyector;
  }

  static async getMarcaFabricaInyectores(empresaId) {
    return prisma.marcaFabricaInyector.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getMarcaFabricaInyector(id) {
    const marcaFabricaInyector = await prisma.marcaFabricaInyector.findUnique({
      where: {
        id,
      },
    });

    return marcaFabricaInyector;
  }
}
