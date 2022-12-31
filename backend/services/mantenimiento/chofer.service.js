import prisma from "../../prisma";
import { generateCodeChofer } from "../../utils/codes";

export class ChoferService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const chofer = await prisma.chofer.create({
      data: {
        ...props,
        empresaId,
      },
    });

    const result = await prisma.chofer.update({
      where: {
        id: chofer.id,
      },
      data: {
        codigo: generateCodeChofer(chofer.id),
      },
    });
    return result;
  }

  static async update(id, data) {
    const chofer = await prisma.chofer.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return chofer;
  }

  static async delete(id) {
    const chofer = await prisma.chofer.delete({
      where: {
        id,
      },
    });

    return chofer;
  }

  static async get(id) {
    const chofer = await prisma.chofer.findUnique({
      where: {
        id,
      },
    });

    return chofer;
  }

  static async getAll(empresaId) {
    const choferes = await prisma.chofer.findMany({
      where: {
        empresaId,
      },
    });

    return choferes;
  }
}
