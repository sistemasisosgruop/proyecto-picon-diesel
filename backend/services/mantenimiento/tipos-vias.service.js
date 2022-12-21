import prisma from "../../prisma";
import { generateCodeTipoVia } from "../../utils/codes";

export class TiposViasService {
  static async createTipoVia(data) {
    const { nombre, descripcion, empresaId } = data;
    const tipoVia = prisma.tipoVia.create({
      data: {
        nombre,
        descripcion,
        empresaId,
      },
    });

    const result = prisma.tipoVia.update({
      where: {
        id: tipoVia.id,
      },
      data: {
        codigo: generateCodeTipoVia(tipoVia.id),
      },
    });

    return result;
  }

  static async updateTipoVia(id, data) {
    const { nombre, descripcion } = data;
    const tipoVia = prisma.tipoVia.update({
      where: {
        id,
      },
      data: {
        nombre,
        descripcion,
      },
    });

    return tipoVia;
  }

  static async deleteTipoVia(id) {
    const tipoVia = prisma.tipoVia.delete({
      where: {
        id,
      },
    });

    return tipoVia;
  }

  static async getAllTiposVias(body) {
    const { empresaId } = body;
    return prisma.tipoVia.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getTipoVia(id) {
    const tipoVia = await prisma.tipoVia.findUnique({
      where: {
        id,
      },
    });

    return tipoVia;
  }
}
