import prisma from "../../prisma";

export class CotizacionService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const cotizacion = await prisma.cotizacion.create({
      data: {
        ...props,
        empresaId,
      },
    });

    return cotizacion;
  }

  static async update(id, data) {
    const cotizacion = await prisma.cotizacion.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return cotizacion;
  }

  static async delete(id) {
    const cotizacion = await prisma.cotizacion.delete({
      where: {
        id,
      },
    });

    return cotizacion;
  }

  static async get(id) {
    const cotizacion = await prisma.cotizacion.findUnique({
      where: {
        id,
      },
    });

    return cotizacion;
  }

  static async getAll(empresaId) {
    const cotizacion = await prisma.cotizacion.findMany({
      where: {
        empresaId,
      },
    });

    return cotizacion;
  }
}
