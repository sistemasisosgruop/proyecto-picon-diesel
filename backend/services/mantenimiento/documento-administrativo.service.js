import prisma from "../../prisma";

export class DocumentoAdministrativoService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const documentoAdministrativo = await prisma.documentoAdministrativo.create(
      {
        data: {
          ...props,
          empresaId,
        },
      }
    );

    return documentoAdministrativo;
  }

  static async update(id, data) {
    const documentoAdministrativo = await prisma.documentoAdministrativo.update(
      {
        where: {
          id,
        },
        data: {
          ...data,
        },
      }
    );

    return documentoAdministrativo;
  }

  static async delete(id) {
    const documentoAdministrativo = await prisma.documentoAdministrativo.delete(
      {
        where: {
          id,
        },
      }
    );

    return documentoAdministrativo;
  }

  static async get(id) {
    const documentoAdministrativo =
      await prisma.documentoAdministrativo.findUnique({
        where: {
          id,
        },
      });

    return documentoAdministrativo;
  }

  static async getAll(empresaId) {
    const documentosAdministrativos =
      await prisma.documentoAdministrativo.findMany({
        where: {
          empresaId,
        },
        orderBy: {
          codigo: "asc",
        },
      });

    return documentosAdministrativos;
  }
}
