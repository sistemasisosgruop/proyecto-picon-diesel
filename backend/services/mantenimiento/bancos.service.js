import prisma from "../../prisma";
import { generateCodeBanco } from "../../utils/codes";

export class BancoService {
  static async createBanco(data) {
    const { nombre, empresaId } = data;
    const banco = await prisma.banco.create({
      data: {
        nombre,
        empresaId,
      },
    });

    const result = prisma.banco.update({
      where: {
        id: banco.id,
      },
      data: {
        codigo: generateCodeBanco(banco.id),
      },
    });

    return result;
  }

  static async updateBanco(id, data) {
    const { nombre } = data;
    const banco = prisma.banco.update({
      where: {
        id,
      },
      data: {
        nombre,
      },
    });

    return banco;
  }

  static async deleteBanco(id) {
    const banco = prisma.banco.delete({
      where: {
        id,
      },
    });

    return banco;
  }

  static async getAllBancos(body) {
    const { empresaId } = body;
    return prisma.banco.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getBanco(id) {
    const banco = await prisma.banco.findUnique({
      where: {
        id,
      },
    });

    return banco;
  }
}
