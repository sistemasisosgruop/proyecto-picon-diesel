import prisma from "../../../prisma";
// import { generateCodeFormaDePago } from "../../utils/codes";

export class FormaDePagoService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const pagoCredito = await prisma.formaDePago.create({
      data: {
        ...props,
        codigo: await this.generarCodigo(empresaId),
        empresaId,
      },
    });

    return pagoCredito;
  }

  static async update(id, data) {
    const pagoCredito = await prisma.formaDePago.update({
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
    const pagoCredito = await prisma.formaDePago.delete({
      where: {
        id,
      },
    });

    return pagoCredito;
  }

  static async get(id) {
    const pagoCredito = await prisma.formaDePago.findUnique({
      where: {
        id,
      },
    });

    return pagoCredito;
  }

  static async getAll(empresaId) {
    const pagoCreditos = await prisma.formaDePago.findMany({
      where: {
        empresaId,
      },
    });

    return pagoCreditos;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "FDP";
    let codigo;

    const lastRow = await prisma.formaDePago.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { empresaId },
    });

    const ultimosTresDigitos = lastRow?.codigo?.slice(-3);
    if (lastRow && Number(ultimosTresDigitos)) {
      const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
      codigo = String(nextCodigo).padStart(3, "0");
    } else {
      const totalRows = await prisma.formaDePago.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
