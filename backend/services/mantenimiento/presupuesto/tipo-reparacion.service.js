import prisma from "../../../prisma";
// import { generateCodeTipoReparacion } from "../../utils/codes";

export class TipoReparacionService {
  static async create(data) {
    const { nombre, empresaId } = data;

    const findUnique = await prisma.tipoReparacion.findFirst({
      where: {
        nombre,
        empresaId,
      },
    });

    if (findUnique) {
      throw new Error("El nombre ya existe.");
    }

    const tipoReparacion = await prisma.tipoReparacion.create({
      data: {
        codigo: await this.generarCodigo(empresaId),
        nombre,
        empresaId,
      },
    });

    return tipoReparacion;
  }

  static async update(id, data) {
    const { nombre, empresaId } = data;
    const findUnique = await prisma.tipoReparacion.findFirst({
      where: {
        nombre,
        empresaId,
        id: { not: id },
      },
    });

    if (findUnique) {
      throw new Error("El nombre ya existe.");
    }
    const tipoReparacion = await prisma.tipoReparacion.update({
      where: {
        id,
      },
      data: {
        nombre,
      },
    });

    return tipoReparacion;
  }

  static async delete(id) {
    const tipoReparacion = await prisma.tipoReparacion.delete({
      where: {
        id,
      },
    });

    return tipoReparacion;
  }

  static async get(id) {
    const tipoReparacion = await prisma.tipoReparacion.findUnique({
      where: {
        id,
      },
    });

    return tipoReparacion;
  }

  static async getAll(empresaId) {
    const tipoReparacion = await prisma.tipoReparacion.findMany({
      where: { empresaId },
      orderBy: { nombre: "asc" },
    });

    return tipoReparacion;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "TR";
    let codigo;

    const lastRow = await prisma.tipoReparacion.findFirst({
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
      const totalRows = await prisma.tipoReparacion.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
