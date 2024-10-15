import prisma from "../../../prisma";

export class DescripcionBombaInyeccionService {
  static async createDescripcionBombaInyeccion(data) {
    const { descripcion, empresaId } = data;
    const descripcionBombaInyeccion = await prisma.descripcionBombaInyeccion.create({
      data: {
        codigo: await this.generarCodigoByEmpresa(empresaId),
        descripcion,
        // empresaId,
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
        descripcion,
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
      orderBy: {
        codigo: "desc",
      },
      // where: {
      //   empresaId,
      // },
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

  static async generarCodigoByEmpresa(empresaId) {
    const lastFamilia = await prisma.descripcionBombaInyeccion.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      // where: { empresaId },
    });

    let codigo;
    if (lastFamilia) {
      const nextCodigo = parseInt(lastFamilia.codigo, 10) + 1;
      codigo = String(nextCodigo).padStart(2, "0");
    } else {
      codigo = "01";
    }
    return codigo;
  }
}
