import prisma from "../../prisma";
import { generateCodeGastoImportacion } from "../../utils/codes";

export class GastosImportacionService {
  static async createGastoImportacion(data) {
    const { nombre, descripcion, empresaId } = data;
    const gasto = await prisma.gastosImportacion.create({
      data: {
        nombre,
        descripcion,
        empresaId,
      },
    });

    const result = await prisma.gastosImportacion.update({
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
    const result = prisma.gastosImportacion.update({
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
    const result = prisma.gastosImportacion.delete({
      where: {
        id,
      },
    });

    return result;
  }

  static async getGastoImportacion(id) {
    const result = prisma.gastosImportacion.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  static async getGastosImportacion(body) {
    const { empresaId } = body;
    const result = prisma.gastosImportacion.findMany({
      where: {
        empresaId,
      },
    });

    return result;
  }
}
