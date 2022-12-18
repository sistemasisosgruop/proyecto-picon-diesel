import prisma from "../../prisma";

export class PaisesService {
  static async createCountry(req) {
    const { nombre, codigo } = req.body;
    const country = prisma.pais.create({
      data: {
        nombre,
        codigo,
      },
    });
    return country;
  }

  static async updateCountry(id, body) {
    const { nombre, codigo } = body;
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

  static async getAllCountries() {
    return prisma.pais.findMany();
  }
}
