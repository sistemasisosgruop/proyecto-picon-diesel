import prisma from "../../../prisma";

export class CaracteristicasService {
  static async createCaracteristica(data) {
    const { codigo, descripcion, abreviatura, empresaId } = data;
    const caracteristica = await prisma.caracteristica.create({
      data: {
        codigo,
        descripcion,
        abreviatura,
        empresaId,
      },
    });

    return caracteristica;
  }

  static async updateCaracteristica(id, data) {
    const { codigo, descripcion, abreviatura } = data;
    const caracteristica = prisma.caracteristica.update({
      where: {
        id,
      },
      data: {
        codigo,
        descripcion,
        abreviatura
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
      where: {
        empresaId,
      },
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
}