import prisma from "../../prisma";
import { generateCodeFormaDePago } from "../../utils/codes";

export class PagoCreditoService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const pagoCredito = await prisma.formaDePagoCredito.create({
      data: {
        ...props,
        empresaId,
      },
    });

    const result = await prisma.formaDePagoCredito.update({
      where: {
        id: pagoCredito.id,
      },
      data: {
        codigo: generateCodeFormaDePago(pagoCredito.id),
      },
    });
    return result;
  }

  static async update(id, data) {
    const pagoCredito = await prisma.formaDePagoCredito.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return pagoCredito;
  }

  static async delete(id) {
    const pagoCredito = await prisma.formaDePagoCredito.delete({
      where: {
        id,
      },
    });

    return pagoCredito;
  }

  static async get(id) {
    const pagoCredito = await prisma.formaDePagoCredito.findUnique({
      where: {
        id,
      },
    });

    return pagoCredito;
  }

  static async getAll(empresaId) {
    const pagoCreditos = await prisma.formaDePagoCredito.findMany({
      where: {
        empresaId,
      },
    });

    return pagoCreditos;
  }
}
