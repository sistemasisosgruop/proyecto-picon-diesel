import prisma from "../../prisma";

export class DocumentoContableService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const documentoContable = await prisma.documentoContable.create({
      data: {
        ...props,
        empresaId,
      },
    });

    return documentoContable;
  }

  static async update(id, data) {
    const documentoContable = await prisma.documentoContable.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return documentoContable;
  }

  static async delete(id) {
    const documentoContable = await prisma.documentoContable.delete({
      where: {
        id,
      },
    });

    return documentoContable;
  }

  static async get(id) {
    const documentoContable = await prisma.documentoContable.findUnique({
      where: {
        id,
      },
    });

    return documentoContable;
  }

  static async getAll(empresaId) {
    const documentosContables = await prisma.documentoContable.findMany({
      where: {
        empresaId,
      },
      orderBy: {
        codigo: "asc",
      },
    });

    return documentosContables;
  }
}
