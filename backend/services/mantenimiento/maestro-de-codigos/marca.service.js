import prisma from '../../../prisma';

export class MarcaService {
  static async createMarca(data) {
    const { marca, empresaId } = data;
    const newMarca = await prisma.marca.create({
      data: {
        codigo: await this.generarCodigoByEmpresa(empresaId),
        marca,
        empresaId,
      },
    });

    return newMarca;
  }

  static async updateMarca(id, data) {
    const { marca } = data;
    const updateMarca = prisma.marca.update({
      where: {
        id,
      },
      data: {
        // codigo,
        marca,
      },
    });

    return updateMarca;
  }

  static async deleteMarca(id) {
    const marca = prisma.marca.delete({
      where: {
        id,
      },
    });

    return marca;
  }

  static async getMarcas(empresaId) {
    return prisma.marca.findMany({
      orderBy: {
        codigo: 'desc',
      },
      where: {
        empresaId,
      },
    });
  }

  static async getMarca(id) {
    const marca = await prisma.marca.findUnique({
      where: {
        id,
      },
    });

    return marca;
  }

  static async generarCodigoByEmpresa(empresaId) {
    const lastFamilia = await prisma.marca.findFirst({
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
