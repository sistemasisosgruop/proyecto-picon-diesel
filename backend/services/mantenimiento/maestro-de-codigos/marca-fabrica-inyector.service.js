import prisma from "../../../prisma";

export class MarcaFabricaInyectorService {
  static async createMarcaFabricaInyector(data) {
    const { marca } = data;
    const marcaFabricaInyector = await prisma.marcaFabricaInyector.create({
      data: {
        codigo: await this.generarCodigo(),
        marca,
        // empresaId,
      },
    });

    return marcaFabricaInyector;
  }

  static async updateMarcaFabricaInyector(id, data) {
    const { marca } = data;
    const marcaFabricaInyector = prisma.marcaFabricaInyector.update({
      where: {
        id,
      },
      data: {
        // codigo,
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
      orderBy: {
        codigo: "desc",
      },
      // where: {
      //   empresaId,
      // },
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

  static async generarCodigo() {
    const lastFamilia = await prisma.marcaFabricaInyector.findFirst({
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
