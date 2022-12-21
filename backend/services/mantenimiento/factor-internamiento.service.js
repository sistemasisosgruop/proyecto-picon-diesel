import prisma from "../../prisma";
import dinero from "dinero.js";

export class FactorInternamiento {
  static async createFactorInternamiento(data) {
    const { valor, fecha, empresaId } = data;
    return prisma.factorInternamiento.create({
      data: {
        valor: dinero({ amount: valor }).toUnit(),
        fecha,
        empresaId,
      },
    });
  }

  static async updateFactorInternamiento(id, data) {
    const { valor, fecha } = data;
    const result = prisma.factorInternamiento.update({
      where: {
        id,
      },
      data: {
        valor: dinero({ amount: valor }).toUnit(),
        fecha,
      },
    });

    return result;
  }

  static async deleteFactorInternamiento(id) {
    const result = prisma.factorInternamiento.delete({
      where: {
        id,
      },
    });

    return result;
  }

  static async getFactorInternamiento(id) {
    const result = prisma.factorInternamiento.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  static async getFactorInternamientos(body) {
    const { empresaId } = body;
    const result = prisma.factorInternamiento.findMany({
      where: {
        empresaId,
      },
    });

    return result;
  }
}
