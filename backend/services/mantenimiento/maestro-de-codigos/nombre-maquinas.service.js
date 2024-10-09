import prisma from '../../../prisma';

export class NombreMaquinaService {
  static async createNombreMaquina(data) {
    const { nombre, empresaId } = data;
    const nombreMaquina = await prisma.nombreMaquina.create({
      data: {
        codigo: await this.generarCodigoByEmpresa(empresaId),
        nombre,
        empresaId,
      },
    });

    return nombreMaquina;
  }

  static async updateNombreMaquina(id, data) {
    const { nombre } = data;
    const nombreMaquina = prisma.nombreMaquina.update({
      where: {
        id,
      },
      data: {
        // codigo,
        nombre,
      },
    });

    return nombreMaquina;
  }

  static async deleteNombreMaquina(id) {
    const nombreMaquina = prisma.nombreMaquina.delete({
      where: {
        id,
      },
    });

    return nombreMaquina;
  }

  static async getNombreMaquinas(empresaId) {
    return prisma.nombreMaquina.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getNombreMaquina(id) {
    const nombreMaquina = await prisma.nombreMaquina.findUnique({
      where: {
        id,
      },
    });

    return nombreMaquina;
  }

  static async generarCodigoByEmpresa(empresaId) {
    const lastFamilia = await prisma.nombreMaquina.findFirst({
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
