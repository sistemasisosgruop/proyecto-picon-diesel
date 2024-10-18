import prisma from "../../prisma";
// import { generateCodeAlmacen } from "../../utils/codes";

export class AlmacenService {
  static async create(data) {
    const { direccion, nombre, telefono, empresaId } = data;
    const almacen = await prisma.almacen.create({
      data: {
        codigo: await this.generarCodigo(empresaId),
        direccion,
        nombre,
        telefono,
        empresaId,
      },
    });

    return almacen;
  }

  static async update(id, data) {
    const { direccion, nombre, telefono } = data;
    const almacen = await prisma.almacen.update({
      where: {
        id,
      },
      data: {
        direccion,
        nombre,

        telefono,
      },
    });

    return almacen;
  }

  static async delete(id) {
    const almacen = await prisma.almacen.delete({
      where: {
        id,
      },
    });

    return almacen;
  }

  static async get(id) {
    const almacen = await prisma.almacen.findUnique({
      where: {
        id,
      },
    });

    return almacen;
  }

  static async getAll(empresaId) {
    const almacen = await prisma.almacen.findMany({ where: { empresaId } });

    return almacen;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "ALM";
    let codigo;

    const lastRow = await prisma.almacen.findFirst({
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
      const totalRows = await prisma.almacen.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
