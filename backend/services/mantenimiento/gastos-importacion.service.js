import prisma from "../../prisma";
// import { generateCodeGastoImportacion } from "../../utils/codes";

export class GastosImportacionService {
  static async createGastoImportacion(data) {
    const { nombre, descripcion, empresaId } = data;
    const gasto = await prisma.gastoImportacion.create({
      data: {
        codigo: await this.generarCodigo(empresaId),
        nombre,
        descripcion,
        empresaId,
      },
    });

    return gasto;
  }

  static async updateGastoImportacion(id, data) {
    const { nombre, descripcion } = data;
    const result = prisma.gastoImportacion.update({
      where: {
        id,
      },
      data: {
        nombre,
        descripcion,
      },
    });

    return result;
  }

  static async deleteGastoImportacion(id) {
    const result = prisma.gastoImportacion.delete({
      where: {
        id,
      },
    });

    return result;
  }

  static async getGastoImportacion(id) {
    const result = prisma.gastoImportacion.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  static async getGastosImportacion(body) {
    const { empresaId } = body;
    const result = prisma.gastoImportacion.findMany({
      where: {
        empresaId,
      },
    });

    return result;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "GAS";
    let codigo;

    const lastRow = await prisma.gastoImportacion.findFirst({
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
      const totalRows = await prisma.gastoImportacion.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
