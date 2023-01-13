import prisma from "../../prisma";
import { generateCodeAgenciaTransportes } from "../../utils/codes";

export class AgenciaTransporteService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const agenciaTransporte = await prisma.agenciaTransporte.create({
      data: {
        ...props,
        empresaId,
      },
    });

    const result = await prisma.agenciaTransporte.update({
      where: {
        id: agenciaTransporte.id,
      },
      data: {
        codigo: generateCodeAgenciaTransportes(agenciaTransporte.id),
      },
    });
    return result;
  }

  static async update(id, data) {
    const agenciaTransporte = await prisma.agenciaTransporte.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return agenciaTransporte;
  }

  static async delete(id) {
    const agenciaTransporte = await prisma.agenciaTransporte.delete({
      where: {
        id,
      },
    });

    return agenciaTransporte;
  }

  static async get(id) {
    const agenciaTransporte = await prisma.agenciaTransporte.findUnique({
      where: {
        id,
      },
    });

    return agenciaTransporte;
  }

  static async getAll(empresaId) {
    const agenciaTransportes = await prisma.agenciaTransporte.findMany({
      where: {
        empresaId,
      },
    });

    return agenciaTransportes;
  }
}
