import prisma from "../../prisma";
import { generateCodeCostos } from "../../utils/codes";

export class CostosService {
  static async createCosto(data) {
    const { responsable, nombre, empresaId, referencia } = data;
    const costo = await prisma.costo.create({
      data: {
        responsable,
        nombre,
        empresaId,
        referencia,
      },
    });

    const result = prisma.costo.update({
      where: {
        id: costo.id,
      },
      data: {
        codigo: generateCodeCostos(costo.id),
      },
    });
    return result;
  }

  static async updateCosto(id, data) {
    const { responsable, nombre, referencia } = data;
    const costo = prisma.costo.update({
      where: {
        id,
      },
      data: {
        responsable,
        nombre,
        referencia,
      },
    });

    return costo;
  }

  static async deleteCosto(id) {
    const costo = prisma.costo.delete({
      where: {
        id,
      },
    });

    return costo;
  }

  static async getCosto(id) {
    const costos = await prisma.costo.findUnique({
      where: {
        id,
      },
    });

    return costos;
  }

  static async getCostos(empresaId) {
    const costos = await prisma.costo.findMany({ where: { empresaId } });

    return costos;
  }
}
