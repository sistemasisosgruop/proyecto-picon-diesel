import prisma from "../../../prisma";

export class MonedaService {
  static async createMoneda(data) {
    const { codigoIso, nombre, simbolo } = data;
    const findUnique = await prisma.moneda.findFirst({
      where: {
        nombre: nombre.toUpperCase(),
      },
    });

    if (findUnique) {
      throw new Error("El nombre ya existe");
    }

    const newMoneda = await prisma.moneda.create({
      data: {
        codigoIso,
        nombre: nombre.toUpperCase(),
        simbolo,
      },
    });

    return newMoneda;
  }

  static async updateMoneda(id, data) {
    const { codigoIso, nombre, simbolo } = data;
    const findUnique = await prisma.moneda.findFirst({
      where: {
        nombre: nombre.toUpperCase(),
        id: { not: id },
      },
    });

    if (findUnique) {
      throw new Error("El nombre ya existe");
    }

    const updateMoneda = prisma.moneda.update({
      where: {
        id,
      },
      data: {
        codigoIso,
        nombre: nombre.toUpperCase(),
        simbolo,
      },
    });

    return updateMoneda;
  }

  static async deleteMoneda(id) {
    const moneda = prisma.moneda.delete({
      where: {
        id,
      },
    });

    return moneda;
  }

  static async getMonedas() {
    return prisma.moneda.findMany({
      orderBy: {
        nombre: "desc",
      },
    });
  }

  static async getMoneda(id) {
    const moneda = await prisma.moneda.findUnique({
      where: {
        id,
      },
    });

    return moneda;
  }
}
