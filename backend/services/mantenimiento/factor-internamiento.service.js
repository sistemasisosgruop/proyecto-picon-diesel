import prisma from "../../prisma";
import { generateFactorInternamiento } from "../../utils/codes";
import { formatAmount } from "../../utils/format-amount";

export class FactorInternamiento {
  static async createFactorInternamiento(data) {
    const { valor, fecha, empresaId } = data;

    const factor = await prisma.factorInternamiento.create({
      data: {
        valor: formatAmount(valor).toUnit(),
        fecha,
        empresaId,
      },
    });

    return prisma.factorInternamiento.update({
      where: {
        id: factor.id,
      },
      data: {
        codigo: generateFactorInternamiento(factor.id),
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
        valor: formatAmount(valor).toUnit(),
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
