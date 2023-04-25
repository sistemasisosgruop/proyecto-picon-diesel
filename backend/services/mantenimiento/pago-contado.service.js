import prisma from "../../prisma";
import { generateCodeFormaDePago } from "../../utils/codes";

export class PagoContadoService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const pagoContado = await prisma.formaDePagoContado.create({
      data: {
        ...props,
        empresaId,
      },
    });

    const result = await prisma.formaDePagoContado.update({
      where: {
        id: pagoContado.id,
      },
      data: {
        codigo: generateCodeFormaDePago(pagoContado.id),
      },
    });
    return result;
  }

  static async update(id, data) {
    const pagoContado = await prisma.formaDePagoContado.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return pagoContado;
  }

  static async delete(id) {
    const pagoContado = await prisma.formaDePagoContado.delete({
      where: {
        id,
      },
    });

    return pagoContado;
  }

  static async get(id) {
    const pagoContado = await prisma.formaDePagoContado.findUnique({
      where: {
        id,
      },
    });

    return pagoContado;
  }

  static async getAll(empresaId) {
    const pagoContados = await prisma.formaDePagoContado.findMany({
      where: {
        empresaId,
      },
    });

    return pagoContados;
  }
}
