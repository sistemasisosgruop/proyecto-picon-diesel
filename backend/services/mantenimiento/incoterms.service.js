import prisma from "../../prisma";

export class IncotermsService {
  static async createIncoterm(data) {
    const { codigo, nombre, descripcion, empresaId } = data;
    return prisma.incoterms.create({
      data: {
        codigo,
        nombre,
        descripcion,
        empresaId,
      },
    });
  }

  static async updateIncoterm(id, data) {
    const { nombre, observaciones } = data;
    const result = prisma.incoterms.update({
      where: {
        id,
      },
      data: {
        nombre,
        observaciones,
      },
    });

    return result;
  }

  static async deleteIncoterm(id) {
    const result = prisma.incoterms.delete({
      where: {
        id,
      },
    });

    return result;
  }

  static async getIncoterm(id) {
    const result = prisma.incoterms.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  static async getIncoterms(body) {
    const { empresaId } = body;
    const result = prisma.incoterms.findMany({
      where: {
        empresaId,
      },
    });

    return result;
  }
}
