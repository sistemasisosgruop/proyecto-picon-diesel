import prisma from "../../../prisma";

export class ModeloMaquinasService {
  static async createModeloMaquina(data) {
    const { codigo, modelo, empresaId } = data;
    const modeloMaquina = await prisma.modeloMaquina.create({
      data: {
        codigo,
        modelo,
        empresaId,
      },
    });

    return modeloMaquina;
  }

  static async updateModeloMaquina(id, data) {
    const { codigo, modelo } = data;
    const modeloMaquina = prisma.modeloMaquina.update({
      where: {
        id,
      },
      data: {
        codigo,
        modelo,
      },
    });

    return modeloMaquina;
  }

  static async deleteModeloMaquina(id) {
    const modeloMaquina = prisma.modeloMaquina.delete({
      where: {
        id,
      },
    });

    return modeloMaquina;
  }

  static async getModeloMaquinas(empresaId) {
    return prisma.modeloMaquina.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getModeloMaquina(id) {
    const modeloMaquina = await prisma.modeloMaquina.findUnique({
      where: {
        id,
      },
    });

    return modeloMaquina;
  }
}
