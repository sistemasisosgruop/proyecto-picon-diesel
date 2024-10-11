import prisma from '../../prisma.js';

export class ModuloService {
  static async createModulo(data) {
    const { nombre } = data;
    const validarNombre = await prisma.modulo.findFirst({
      where: { nombre: nombre.toUpperCase() },
    });
    if (validarNombre) {
      throw new Error('El nombre ya existe. Intenta con otro.');
    }
    const newModulo = await prisma.modulo.create({ data: { nombre: nombre.toUpperCase() } });

    return newModulo;
  }

  static async updateModulo(moduloId, modulo) {
    const { nombre } = modulo;
    const validarNombre = await prisma.modulo.findFirst({
      where: { nombre: nombre.toUpperCase(), id: { not: moduloId } },
    });

    if (validarNombre) {
      throw new Error('El nombre ya existe. Intenta con otro.');
    }

    return await prisma.modulo.update({
      data: { nombre: nombre.toUpperCase() },
      where: {
        id: moduloId,
      },
    });
  }

  static async getModulos(queryParams) {
    // const { empresaId } = queryParams;
    const data = await prisma.modulo.findMany();
    return data;
  }

  static async deleteModulo(moduloId) {
    return await prisma.modulo.delete({
      where: {
        id: moduloId,
      },
    });
  }
}
