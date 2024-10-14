import prisma from '../../prisma.js';

export class SubmoduloService {
  static async createSubmodulo(data) {
    const { nombre, moduloId } = data;
    console.log(data, 'data create submodulo');

    const validarModuloId = await prisma.modulo.findUnique({ where: { id: moduloId } });
    if (!validarModuloId) {
      throw new Error('El moduloId no existe.');
    }
    const validarNombre = await prisma.submodulo.findFirst({
      where: { nombre: nombre.toUpperCase(), id: moduloId },
    });
    if (validarNombre) {
      throw new Error('El nombre ya existe. Intenta con otro.');
    }

    const newSubsubmodulo = await prisma.submodulo.create({
      data: { nombre: nombre.toUpperCase(), moduloId },
    });

    return newSubsubmodulo;
  }

  static async updateSubmodulo(submoduloId, submodulo) {
    const { nombre, moduloId } = submodulo;
    const validarNombre = await prisma.submodulo.findFirst({
      where: { nombre: nombre.toUpperCase(), id: { not: submoduloId } },
    });

    if (validarNombre) {
      throw new Error('El nombre ya existe. Intenta con otro.');
    }
    const validarModuloId = await prisma.modulo.findUnique({ where: { id: moduloId } });
    if (validarModuloId) {
      throw new Error('El moduloId no existe.');
    }
    return await prisma.submodulo.update({
      data: { nombre: nombre.toUpperCase(), moduloId },
      where: {
        id: submoduloId,
      },
    });
  }

  static async getSubmodulos(queryFilter) {
    const { moduloId } = queryFilter;
    const data = await prisma.submodulo.findMany({ where: { moduloId } });
    return data;
  }

  static async deleteSubmodulo(submoduloId) {
    return await prisma.submodulo.delete({
      where: {
        id: submoduloId,
      },
    });
  }
}
