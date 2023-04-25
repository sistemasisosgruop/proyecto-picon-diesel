import prisma from "../../prisma";
import { generateCodeAlmacen } from "../../utils/codes";

export class AlmacenService {
  static async create(data) {
    const { direccion, nombre, telefono, empresaId } = data;
    const almacen = await prisma.almacen.create({
      data: {
        direccion,
        nombre,
        telefono,
        empresaId,
      },
    });

    const result = await prisma.almacen.update({
      where: {
        id: almacen.id,
      },
      data: {
        codigo: generateCodeAlmacen(almacen.id),
      },
    });
    return result;
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
}
