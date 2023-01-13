import prisma from "../../prisma";
import { generateCodeVehiculo } from "../../utils/codes";

export class VehiculoService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const vehiculo = await prisma.vehiculo.create({
      data: {
        ...props,
        empresaId,
      },
    });

    const result = await prisma.vehiculo.update({
      where: {
        id: vehiculo.id,
      },
      data: {
        codigo: generateCodeVehiculo(vehiculo.id),
      },
    });
    return result;
  }

  static async update(id, data) {
    const vehiculo = await prisma.vehiculo.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return vehiculo;
  }

  static async delete(id) {
    const vehiculo = await prisma.vehiculo.delete({
      where: {
        id,
      },
    });

    return vehiculo;
  }

  static async get(id) {
    const vehiculo = await prisma.vehiculo.findUnique({
      where: {
        id,
      },
    });

    return vehiculo;
  }

  static async getAll(empresaId) {
    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        empresaId,
      },
    });

    return vehiculos;
  }
}
