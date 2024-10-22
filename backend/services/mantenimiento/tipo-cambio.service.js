import prisma from "../../prisma";
// import { generateCodeTipoCambio } from "../../utils/codes";

export class TipoCambioService {
  static async create(data) {
    console.log(data, "DATA CREAR TIPO DE CAMB IO");
    const { empresaId, fecha, ...props } = data;
    const fechaCompleta = new Date(fecha);
    const fechaFormat = new Date(
      fechaCompleta.getFullYear(),
      fechaCompleta.getMonth(),
      fechaCompleta.getDay()
    );
    console.log(fechaFormat, "fechaFormat");
    const findUnique = await prisma.tipoDeCambio.findFirst({
      where: {
        fecha: fechaFormat,
        monedaOrigenId: data.momonedaOrigenId,
        monedaDestinoId: data.monedaOrigenId,
      },
    });

    if (findUnique) {
      throw new Error("El registro de monedas y fecha ya existen");
    }

    const tipoDeCambio = await prisma.tipoDeCambio.create({
      data: {
        fecha: fechaFormat,
        ...props,
        // empresaId,
      },
    });

    return tipoDeCambio;
  }

  static async update(id, data) {
    const fechaCompleta = new Date(data.fecha);
    const fechaFormat = new Date(
      fechaCompleta.getFullYear(),
      fechaCompleta.getMonth(),
      fechaCompleta.getDay()
    );

    const findUnique = await prisma.tipoDeCambio.findFirst({
      where: {
        fecha: fechaFormat,
        monedaOrigenId: data.monedaOrigenId,
        monedaDestinoId: data.monedaDestinoId,
        id: { not: id },
      },
    });

    if (findUnique) {
      throw new Error("El registro de monedas y fecha ya existen");
    }

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

  static async getAll() {
    const tipoDeCambios = await prisma.tipoDeCambio.findMany({
      include: {
        monedaOrigen: true,
        monedaDestino: true,
      },
      orderBy: [
        {
          monedaOrigenId: "asc",
        },
        {
          monedaDestinoId: "asc",
        },
        {
          fecha: "desc",
        },
      ],
    });

    return tipoDeCambios;
  }
}
