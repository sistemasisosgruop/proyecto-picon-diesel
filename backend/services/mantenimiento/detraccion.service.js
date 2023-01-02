import prisma from "../../prisma";

export class DetraccionService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const detraccion = await prisma.detraccion.create({
      data: {
        ...props,
        empresaId,
      },
    });

    return detraccion;
  }

  static async update(id, data) {
    const detraccion = await prisma.detraccion.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return detraccion;
  }

  static async delete(id) {
    const detraccion = await prisma.detraccion.delete({
      where: {
        id,
      },
    });

    return detraccion;
  }

  static async get(id) {
    const detraccion = await prisma.detraccion.findUnique({
      where: {
        id,
      },
    });

    return detraccion;
  }

  static async getAll(empresaId) {
    const detracciones = await prisma.detraccion.findMany({
      where: {
        empresaId,
      },
      orderBy: {
        codigo: "asc",
      },
    });

    return detracciones;
  }
}
