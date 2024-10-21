import prisma from "../../prisma";

export class DocumentoContableService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const documentoContable = await prisma.documentoContable.create({
      data: {
        ...props,
        codigo: await this.generarCodigo(empresaId),
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

  static async generarCodigo(empresaId) {
    const prefijo = "DC";
    let codigo;

    const lastRow = await prisma.documentoContable.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { empresaId },
    });

    const ultimosTresDigitos = lastRow?.codigo?.slice(-3);
    if (lastRow && Number(ultimosTresDigitos)) {
      const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
      codigo = String(nextCodigo).padStart(3, "0");
    } else {
      const totalRows = await prisma.documentoContable.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
