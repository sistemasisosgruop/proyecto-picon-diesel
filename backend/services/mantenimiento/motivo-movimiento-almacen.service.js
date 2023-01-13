import prisma from "../../prisma";
import { generateCodeMotivoMovimientoAlmacen } from "../../utils/codes";

export class MotivoMovimientoAlmacenService {
  static async create(data) {
    const { nombre, empresaId } = data;
    const motivoMovimientoAlmacen = await prisma.motivoMovimientoAlmacen.create(
      {
        data: {
          nombre,
          empresaId,
        },
      }
    );

    const result = await prisma.motivoMovimientoAlmacen.update({
      where: {
        id: motivoMovimientoAlmacen.id,
      },
      data: {
        codigo: generateCodeMotivoMovimientoAlmacen(motivoMovimientoAlmacen.id),
      },
    });
    return result;
  }

  static async update(id, data) {
    const { nombre } = data;
    const motivoMovimientoAlmacen = await prisma.motivoMovimientoAlmacen.update(
      {
        where: {
          id,
        },
        data: {
          nombre,
        },
      }
    );

    return motivoMovimientoAlmacen;
  }

  static async delete(id) {
    const motivoMovimientoAlmacen = await prisma.motivoMovimientoAlmacen.delete(
      {
        where: {
          id,
        },
      }
    );

    return motivoMovimientoAlmacen;
  }

  static async get(id) {
    const motivoMovimientoAlmacen =
      await prisma.motivoMovimientoAlmacen.findUnique({
        where: {
          id,
        },
      });

    return motivoMovimientoAlmacen;
  }

  static async getAll(empresaId) {
    const motivoMovimientoAlmacen =
      await prisma.motivoMovimientoAlmacen.findMany({
        where: {
          empresaId,
        },
      });

    return motivoMovimientoAlmacen;
  }
}
