import prisma from '../../../prisma';

export class ModeloMaquinasService {
  static async createModeloMaquina(data) {
    const { modelo, empresaId } = data;

    const modeloMaquina = await prisma.modeloMaquina.create({
      data: {
        codigo: await this.generarCodigoByEmpresa(empresaId),
        modelo,
        empresaId,
      },
    });

    return modeloMaquina;
  }

  static async updateModeloMaquina(id, data) {
    const { modelo } = data;
    const modeloMaquina = prisma.modeloMaquina.update({
      where: {
        id,
      },
      data: {
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

  static async generarCodigoByEmpresa(empresaId) {
    const lastFamilia = await prisma.modeloMaquina.findFirst({
      orderBy: {
        codigo: 'desc',
      },
      select: {
        codigo: true,
      },
      where: { empresaId },
    });

    let codigo;
    if (lastFamilia) {
      const nextCodigo = parseInt(lastFamilia.codigo, 10) + 1;
      codigo = String(nextCodigo).padStart(2, '0');
    } else {
      codigo = '01';
    }
    return codigo;
  }
}
