import prisma from "../../../prisma";

export class NombreMaquinaService {
  static async createNombreMaquina(data) {
    const { codigo, nombre, empresaId } = data;
    const nombreMaquina = await prisma.nombreMaquina.create({
      data: {
        codigo,
        nombre,
        empresaId,
      },
    });

    return nombreMaquina;
  }

  static async updateNombreMaquina(id, data) {
    const { codigo, nombre } = data;
    const nombreMaquina = prisma.nombreMaquina.update({
      where: {
        id,
      },
      data: {
        codigo,
        nombre
      },
    });

    return nombreMaquina;
  }

  static async deleteNombreMaquina(id) {
    const nombreMaquina = prisma.nombreMaquina.delete({
      where: {
        id,
      },
    });

    return nombreMaquina;
  }

  static async getNombreMaquinas(empresaId) {
    return prisma.nombreMaquina.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getNombreMaquina(id) {
    const nombreMaquina = await prisma.nombreMaquina.findUnique({
      where: {
        id,
      },
    });

    return nombreMaquina;
  }
}