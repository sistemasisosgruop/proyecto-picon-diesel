import prisma from "../../prisma";
import { generateCodeGastoImportacion } from "../../utils/codes";

export class GastosImportacionService {
  static async createGastoImportacion(data) {
    const { nombre, descripcion, empresaId } = data;
    const gasto = await prisma.gastoImportacion.create({
      data: {
        nombre,
        descripcion,
        empresaId,
      },
    });

    const result = await prisma.gastoImportacion.update({
      where: {
        id: gasto.id,
      },
      data: {
        codigo: generateCodeGastoImportacion(gasto.id),
      },
    });

    return result;
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
}
