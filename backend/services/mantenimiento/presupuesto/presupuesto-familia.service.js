import { generarCodigoGeneric } from "backend/helpers/helper";
import prisma from "../../../prisma";

export class PresupuestoFamiliaService {
  static async create(body) {
    const { empresaId, ...data } = body;
    const familia = await prisma.familiaPresupuesto.create({
      data: {
        codigo: await generarCodigoGeneric("familiaPresupuesto", empresaId, ""),
        ...data,
        empresaId,
      },
    });

    return familia;
  }

  static async update(id, data) {
    const { descripcion } = data;
    const familia = await prisma.familiaPresupuesto.update({
      where: {
        id,
      },
      data: {
        // codigo,
        descripcion,
      },
    });

    return familia;
  }

  static async delete(id) {
    const familia = await prisma.familiaPresupuesto.delete({
      where: {
        id,
      },
    });

    return familia;
  }

  static async getAll(empresaId) {
    return prisma.familiaPresupuesto.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async get(id) {
    const familia = await prisma.familiaPresupuesto.findUnique({
      where: {
        id,
      },
    });

    return familia;
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
