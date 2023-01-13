import prisma from "../../prisma";
import { generateCodeTipoCambio } from "../../utils/codes";

export class TipoCambioService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const tipoDeCambio = await prisma.tipoDeCambio.create({
      data: {
        ...props,
        empresaId,
      },
    });

    const result = await prisma.tipoDeCambio.update({
      where: {
        id: tipoDeCambio.id,
      },
      data: {
        codigo: generateCodeTipoCambio(tipoDeCambio.id),
      },
    });
    return result;
  }

  static async update(id, data) {
    const tipoDeCambio = await prisma.tipoDeCambio.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return tipoDeCambio;
  }

  static async delete(id) {
    const tipoDeCambio = await prisma.tipoDeCambio.delete({
      where: {
        id,
      },
    });

    return tipoDeCambio;
  }

  static async get(id) {
    const tipoDeCambio = await prisma.tipoDeCambio.findUnique({
      where: {
        id,
      },
    });

    return tipoDeCambio;
  }

  static async getAll(empresaId) {
    const tipoDeCambios = await prisma.tipoDeCambio.findMany({
      where: {
        empresaId,
      },
    });

    return tipoDeCambios;
  }
}
