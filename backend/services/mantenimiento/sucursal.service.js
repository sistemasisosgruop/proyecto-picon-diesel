import prisma from "../../prisma";
import { generateCode } from "../../utils/codes";

export class SucursalService {
  static async createSucursal(data) {
    const { nombre, empresaId } = data;
    const sucursal = await prisma.sucursal.create({
      data: {
        nombre,
        empresaId,
      },
    });

    const result = prisma.sucursal.update({
      where: {
        id: sucursal.id,
      },
      data: {
        codigo: generateCode(sucursal.id),
      },
    });
    return result;
  }

  static async updateSucursal(id, data) {
    const { nombre, direccion, email, telefono } = data;
    const sucursal = prisma.sucursal.update({
      where: {
        id,
      },
      data: {
        email,
        nombre,
        direccion,
        telefono,
      },
    });

    return sucursal;
  }

  static async deleteSucursal(id) {
    const sucursal = prisma.sucursal.delete({
      where: {
        id,
      },
    });

    return sucursal;
  }

  static async getSucursal(id) {
    const sucursal = prisma.sucursal.findUnique({
      where: {
        id,
      },
    });

    return sucursal;
  }

  static async getSucursales(empresaId) {
    const sucursales = prisma.sucursal.findMany({
      where: {
        empresa:{
          id: empresaId
        },
      },
    });

    return sucursales;
  }
}
