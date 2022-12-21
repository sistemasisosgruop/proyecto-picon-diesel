import prisma from "../../prisma";

export class ParametrosGlobalesService {
  static async createCountry(data) {
    const { nombre, codigo, empresaId } = data;
    const country = prisma.pais.create({
      data: {
        nombre,
        codigo,
        empresaId,
      },
    });
    return country;
  }

  static async updateCountry(id, data) {
    const { nombre, codigo } = data;
    const country = prisma.pais.update({
      where: {
        id,
      },
      data: {
        nombre,
        codigo,
      },
    });

    return country;
  }

  static async deleteCountry(id) {
    const country = prisma.pais.delete({
      where: {
        id,
      },
    });

    return country;
  }

  static async getAllCountries(body) {
    const { empresaId } = body;
    return prisma.pais.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getCountry(id) {
    const country = await prisma.pais.findUnique({
      where: {
        id,
      },
    });

    return country;
  }

  static async getGlobalParam(id) {
    const globalParam = await prisma.parametroGlobal.findUnique({
      where: {
        id,
      },
    });

    return globalParam;
  }

  static async getGlobalParams(body) {
    const { empresaId } = body;
    const globalParams = await prisma.parametroGlobal.findMany({
      where: {
        empresaId,
      },
    });

    return globalParams;
  }

  static async updateGlobalParam(id, data) {
    const { nombre, valor } = data;
    const globalParam = prisma.parametroGlobal.update({
      where: {
        id,
      },
      data: {
        nombre,
        valor,
      },
    });

    return globalParam;
  }

  static async deleteGlobalParam(id) {
    const globalParam = prisma.parametroGlobal.delete({
      where: {
        id,
      },
    });

    return globalParam;
  }

  static async createGlobalParam(data) {
    const { nombre, valor, empresaId } = data;
    const globalParam = prisma.parametroGlobal.create({
      data: {
        nombre,
        valor,
        empresa: {
          connect: {
            empresaId,
          },
        },
      },
    });
    return globalParam;
  }
}
