import prisma from '../../../prisma';

export class MarcaFabricaSistemaInyeccionService {
  static async createMarcaFabricaSistemaInyeccion(data) {
    const { marca, empresaId } = data;
    const marcaFabricaSistemaInyeccion = await prisma.marcaFabricaSistemaInyeccion.create({
      data: {
        codigo: await this.generarCodigoByEmpresa(empresaId),
        marca,
        empresaId,
      },
    });

    return marcaFabricaSistemaInyeccion;
  }

  static async updateMarcaFabricaSistemaInyeccion(id, data) {
    const { marca } = data;
    const marcaFabricaSistemaInyeccion = prisma.marcaFabricaSistemaInyeccion.update({
      where: {
        id,
      },
      data: {
        // codigo,
        marca,
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
      orderBy: {
        codigo: 'desc',
      },
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

  static async generarCodigoByEmpresa(empresaId) {
    const lastFamilia = await prisma.marcaFabricaSistemaInyeccion.findFirst({
      orderBy: {
        codigo: 'desc',
      },
      select: {
        codigo: true,
      },
      where: { empresaId },
    });

    let codigo;
    if (lastFamilia) {
      const nextCodigo = parseInt(lastFamilia.codigo, 10) + 1;
      codigo = String(nextCodigo).padStart(2, '0');
    } else {
      codigo = '01';
    }
    return codigo;
  }
}
