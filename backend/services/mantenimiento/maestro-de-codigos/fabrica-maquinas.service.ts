import prisma from '../../../prisma';

export class FabricaMaquinaService {
  static async createFabricaMaquina(data) {
    const { fabrica, empresaId } = data;
    const fabricaMaquina = await prisma.fabricaMaquina.create({
      data: {
        codigo: await this.generarCodigoByEmpresa(empresaId),
        fabrica,
        empresaId,
      },
    });

    return fabricaMaquina;
  }

  static async updatefabricaMaquina(id, data) {
    const { fabrica } = data;
    const fabricaMaquina = prisma.fabricaMaquina.update({
      where: {
        id,
      },
      data: {
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

  static async generarCodigoByEmpresa(empresaId) {
    const lastFamilia = await prisma.fabricaMaquina.findFirst({
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
