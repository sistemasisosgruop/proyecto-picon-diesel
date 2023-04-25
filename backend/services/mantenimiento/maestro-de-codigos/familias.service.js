import prisma from "../../../prisma";

export class FamiliaService {
  static async createFamilia(data) {
    const { codigo, descripcion, empresaId } = data;
    const familia = await prisma.familia.create({
      data: {
        codigo,
        descripcion,
        empresaId,
      },
    });

    return familia;
  }

  static async updateFamilia(id, data) {
    const { codigo, descripcion } = data;
    const familia = prisma.familia.update({
      where: {
        id,
      },
      data: {
        codigo,
        descripcion
      },
    });

    return familia;
  }

  static async deleteFamilia(id) {
    const familia = prisma.familia.delete({
      where: {
        id,
      },
    });

    return familia;
  }

  static async getFamilias(empresaId) {
    return prisma.familia.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getFamilia(codigo) {
    const familia = await prisma.familia.findUnique({
      where: {
        codigo,
      },
    });

    return familia;
  }
}