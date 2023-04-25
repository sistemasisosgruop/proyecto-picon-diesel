import prisma from "../../../prisma";

export class FabricaMaquinaService {
  static async createFabricaMaquina(data) {
    const { codigo, fabrica, empresaId } = data;
    const fabricaMaquina = await prisma.fabricaMaquina.create({
      data: {
        codigo,
        fabrica,
        empresaId,
      },
    });

    return fabricaMaquina;
  }

  static async updatefabricaMaquina(id, data) {
    const { codigo, fabrica } = data;
    const fabricaMaquina = prisma.fabricaMaquina.update({
      where: {
        id,
      },
      data: {
        codigo,
        fabrica,
      },
    });

    return fabricaMaquina;
  }

  static async deletefabricaMaquina(id) {
    const fabricaMaquina = prisma.fabricaMaquina.delete({
      where: {
        id,
      },
    });

    return fabricaMaquina;
  }

  static async getfabricaMaquinas(empresaId) {
    return prisma.fabricaMaquina.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getfabricaMaquina(id) {
    const fabricaMaquina = await prisma.fabricaMaquina.findUnique({
      where: {
        id,
      },
    });

    return fabricaMaquina;
  }
}
