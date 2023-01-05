import prisma from "../../prisma";

export class PresupuestoFamiliaService {
  static async create(body) {
    const { empresaId, ...data } = body;
    const familia = await prisma.familiaPresupuesto.create({
      data: {
        ...data,
        empresaId,
      },
    });

    return familia;
  }

  static async update(id, data) {
    const { codigo, descripcion } = data;
    const familia = await prisma.familiaPresupuesto.update({
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
    const familia = await prisma.familiaPresupuesto.delete({
      where: {
        id,
      },
    });

    return familia;
  }

  static async getAll(empresaId) {
    return prisma.familiaPresupuesto.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async get(codigo) {
    const familia = await prisma.familiaPresupuesto.findUnique({
      where: {
        codigo,
      },
    });

    return familia;
  }
}
