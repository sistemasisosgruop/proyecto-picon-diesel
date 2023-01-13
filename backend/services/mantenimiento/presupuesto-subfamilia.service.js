import prisma from "../../prisma";

export class PresupuestoSubFamiliaService {
  static async create(body) {
    const { familiaId, ...data } = body;
    const familia = await prisma.subFamiliaPresupuesto.create({
      data: {
        ...data,
        familiaId,
      },
    });

    return familia;
  }

  static async update(id, data) {
    const { codigo, descripcion } = data;
    const familia = await prisma.subFamiliaPresupuesto.update({
      where: {
        id,
      },
      data: {
        codigo,
        descripcion,
      },
    });

    return familia;
  }

  static async delete(id) {
    const familia = await prisma.subFamiliaPresupuesto.delete({
      where: {
        id,
      },
    });

    return familia;
  }

  static async getAll(familiaId) {
    return prisma.subFamiliaPresupuesto.findMany({
      where: {
        familiaId,
      },
    });
  }

  static async get(id) {
    const subFamilia = await prisma.subFamiliaPresupuesto.findUnique({
      where: {
        id,
      },
    });

    return subFamilia;
  }
}
