import prisma from "../../../prisma";

export class DescripcionBombaInyeccion {
  static async createDescripcionBombaInyeccion(data) {
    const { codigo, descripcion, empresaId } = data;
    const descripcionBombaInyeccion = await prisma.descripcionBombaInyeccion.create({
      data: {
        codigo,
        descripcion,
        empresaId,
      },
    });

    return descripcionBombaInyeccion;
  }

  static async updateDescripcionBombaInyeccion(id, data) {
    const { codigo, descripcion } = data;
    const descripcionBombaInyeccion = prisma.descripcionBombaInyeccion.update({
      where: {
        id,
      },
      data: {
        codigo,
        descripcion
      },
    });

    return descripcionBombaInyeccion;
  }

  static async deleteDescripcionBombaInyeccion(id) {
    const descripcionBombaInyeccion = prisma.descripcionBombaInyeccion.delete({
      where: {
        id,
      },
    });

    return descripcionBombaInyeccion;
  }

  static async getDescripcionBombaInyecciones(empresaId) {
    return prisma.descripcionBombaInyeccion.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getDescripcionBombaInyeccion(id) {
    const descripcionBombaInyeccion = await prisma.descripcionBombaInyeccion.findUnique({
      where: {
        id,
      },
    });

    return descripcionBombaInyeccion;
  }
}