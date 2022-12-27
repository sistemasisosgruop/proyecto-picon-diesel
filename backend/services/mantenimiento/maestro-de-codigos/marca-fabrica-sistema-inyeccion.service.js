import prisma from "../../../prisma";

export class MarvaFabricaSistemaInyeccionService {
  static async createMarcaFabricaSistemaInyeccion(data) {
    const { codigo, marca, empresaId } = data;
    const marcaFabricaSistemaInyeccion = await prisma.marcaFabricaSistemaInyeccion.create({
      data: {
        codigo,
        marca,
        empresaId,
      },
    });

    return marcaFabricaSistemaInyeccion;
  }

  static async updateMarcaFabricaSistemaInyeccion(id, data) {
    const { codigo, marca } = data;
    const marcaFabricaSistemaInyeccion = prisma.marcaFabricaSistemaInyeccion.update({
      where: {
        id,
      },
      data: {
        codigo,
        marca
      },
    });

    return marcaFabricaSistemaInyeccion;
  }

  static async deleteMarcaFabricaSistemaInyeccion(id) {
    const marcaFabricaSistemaInyeccion = prisma.marcaFabricaSistemaInyeccion.delete({
      where: {
        id,
      },
    });

    return marcaFabricaSistemaInyeccion;
  }

  static async getMarcaFabricaSistemaInyecciones(empresaId) {
    return prisma.marcaFabricaSistemaInyeccion.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getMarcaFabricaSistemaInyeccion(id) {
    const marcaFabricaSistemaInyeccion = await prisma.marcaFabricaSistemaInyeccion.findUnique({
      where: {
        id,
      },
    });

    return marcaFabricaSistemaInyeccion;
  }
}