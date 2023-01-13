import prisma from "../../prisma";
import { generateCodeTrasladoGuiaRemision } from "../../utils/codes";

export class MotivoTrasladoGuiaRemisionService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const motivoTrasladoGuiaRemision =
      await prisma.motivoTrasladoGuiaRemision.create({
        data: {
          ...props,
          empresaId,
        },
      });

    const result = await prisma.motivoTrasladoGuiaRemision.update({
      where: {
        id: motivoTrasladoGuiaRemision.id,
      },
      data: {
        codigo: generateCodeTrasladoGuiaRemision(motivoTrasladoGuiaRemision.id),
      },
    });
    return result;
  }

  static async update(id, data) {
    const motivoTrasladoGuiaRemision =
      await prisma.motivoTrasladoGuiaRemision.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });

    return motivoTrasladoGuiaRemision;
  }

  static async delete(id) {
    const motivoTrasladoGuiaRemision =
      await prisma.motivoTrasladoGuiaRemision.delete({
        where: {
          id,
        },
      });

    return motivoTrasladoGuiaRemision;
  }

  static async get(id) {
    const motivoTrasladoGuiaRemision =
      await prisma.motivoTrasladoGuiaRemision.findUnique({
        where: {
          id,
        },
      });

    return motivoTrasladoGuiaRemision;
  }

  static async getAll(empresaId) {
    const motivosTrasladoGuiaRemision =
      await prisma.motivoTrasladoGuiaRemision.findMany({
        where: {
          empresaId,
        },
        orderBy: {
          codigo: "asc",
        },
      });

    return motivosTrasladoGuiaRemision;
  }
}
