import prisma from "../../../prisma";

export class SubFamiliaService {
  static async createSubFamilia(data) {
    const { codigo, descripcion, familiaId } = data;
    const subFamilia = await prisma.subFamilia.create({
      data: {
        codigo,
        descripcion,
        familiaId,
      },
    });

    return subFamilia;
  }

  static async updateSubFamilia(id, data) {
    const { codigo, descripcion } = data;
    const subFamilia = prisma.subFamilia.update({
      where: {
        id,
      },
      data: {
        codigo,
        descripcion
      },
    });

    return subFamilia;
  }

  static async deleteSubFamilia(id) {
    const subFamilia = prisma.subFamilia.delete({
      where: {
        id,
      },
    });

    return subFamilia;
  }

  static async getSubFamilias(familiaId) {
    return prisma.subFamilia.findMany({
      where: {
        familiaId,
      },
    });
  }

  static async getSubFamilia(id) {
    const subFamilia = await prisma.subFamilia.findUnique({
      where: {
        id,
      },
    });

    return subFamilia;
  }
}