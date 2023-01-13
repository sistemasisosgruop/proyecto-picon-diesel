import prisma from "../../prisma";

export class ServicioService {
  static async create(body) {
    const { empresaId, ...data } = body;
    const servicio = await prisma.servicio.create({
      data: {
        ...data,
        empresaId,
      },
    });

    return servicio;
  }

  static async update(id, body) {
    const { empresaId, ...data } = body;
    const servicio = await prisma.servicio.update({
      where: {
        id,
      },
      data: {
        ...data,
        empresaId,
      },
    });

    return servicio;
  }

  static async delete(id) {
    const servicio = await prisma.servicio.delete({
      where: {
        id,
      },
    });

    return servicio;
  }

  static async getAll(empresaId) {
    return prisma.servicio.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async get(id) {
    const servicio = await prisma.servicio.findUnique({
      where: {
        id: Number(id),
      },
    });

    return servicio;
  }
}
