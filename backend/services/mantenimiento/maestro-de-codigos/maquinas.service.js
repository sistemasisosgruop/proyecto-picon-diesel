import prisma from "../../../prisma";

export class MaquinaService {
  static async createMaquina(data) {
    const { empresaId, ...props } = data;
    const maquina = await prisma.maquina.create({
      data: {
        ...props,
        empresaId,
      },
    });

    return maquina;
  }

  static async updateMaquina(id, data) {
    const maquina = prisma.maquina.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return maquina;
  }

  static async deleteMaquina(id) {
    const maquina = prisma.maquina.delete({
      where: {
        id,
      },
    });

    return maquina;
  }

  static async getMaquinas(empresaId) {
    return prisma.maquina.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getMaquina(id) {
    const maquina = await prisma.maquina.findUnique({
      where: {
        id,
      },
    });

    return maquina;
  }
}
