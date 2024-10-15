import prisma from "../../../prisma";

export class CaracteristicasService {
  static async createCaracteristica(data) {
    const { descripcion, abreviatura, empresaId } = data;
    const caracteristica = await prisma.caracteristica.create({
      data: {
        codigo: await this.generarCodigoByEmpresa(empresaId),
        descripcion,
        abreviatura,
        // empresaId,
      },
    });

    return caracteristica;
  }

  static async updateCaracteristica(id, data) {
    const { descripcion, abreviatura } = data;
    const caracteristica = prisma.caracteristica.update({
      where: {
        id,
      },
      data: {
        // codigo,
        descripcion,
        abreviatura,
      },
    });

    return caracteristica;
  }

  static async deleteCaracteristica(id) {
    const caracteristica = prisma.caracteristica.delete({
      where: {
        id,
      },
    });

    return caracteristica;
  }

  static async getCaracteristicas(empresaId) {
    return prisma.caracteristica.findMany({
      // where: {
      //   empresaId,
      // },
    });
  }

  static async getCaracteristica(id) {
    const caracteristica = await prisma.caracteristica.findUnique({
      where: {
        id,
      },
    });

    return caracteristica;
  }

  static async generarCodigoByEmpresa(empresaId) {
    const lastFamilia = await prisma.caracteristica.findFirst({
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
