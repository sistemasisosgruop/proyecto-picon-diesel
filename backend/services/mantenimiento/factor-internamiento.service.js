import prisma from "../../prisma";
// import { generateFactorInternamiento } from "../../utils/codes";
import { formatAmount } from "../../utils/format-amount";

export class FactorInternamiento {
  static async createFactorInternamiento(data) {
    const { concepto, valor, fecha, empresaId } = data;

    const factor = await prisma.factorInternamiento.create({
      data: {
        concepto,
        codigo: await this.generarCodigo(empresaId),
        valor: formatAmount(valor).toUnit(),
        fecha,
        empresaId,
      },
    });

    return factor;
  }

  static async updateFactorInternamiento(id, data) {
    const { concepto, valor, fecha } = data;
    const result = prisma.factorInternamiento.update({
      where: {
        id,
      },
      data: {
        concepto,
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

  static async generarCodigo(empresaId) {
    const prefijo = "FI";
    let codigo;

    const lastRow = await prisma.factorInternamiento.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { empresaId },
    });

    const ultimosTresDigitos = lastRow?.codigo?.slice(-3);
    if (lastRow && Number(ultimosTresDigitos)) {
      const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
      codigo = String(nextCodigo).padStart(3, "0");
    } else {
      const totalRows = await prisma.factorInternamiento.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
