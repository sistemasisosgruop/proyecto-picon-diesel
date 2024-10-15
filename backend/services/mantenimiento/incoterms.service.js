import prisma from "../../prisma";

export class IncotermsService {
  static async createIncoterm(data) {
    const { nombre, descripcion, empresaId } = data;
    return prisma.incoterms.create({
      data: {
        codigo: await this.generarCodigo(empresaId),
        nombre,
        descripcion,
        empresaId,
      },
    });
  }

  static async updateIncoterm(id, data) {
    const { nombre, descripcion } = data;
    const result = prisma.incoterms.update({
      where: {
        id,
      },
      data: {
        nombre,
        descripcion,
      },
    });

    return result;
  }

  static async deleteIncoterm(id) {
    const result = prisma.incoterms.delete({
      where: {
        id,
      },
    });

    return result;
  }

  static async getIncoterm(id) {
    const result = prisma.incoterms.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  static async getIncoterms(body) {
    const { empresaId } = body;
    const result = prisma.incoterms.findMany({
      where: {
        empresaId,
      },
    });

    return result;
  }

  static async generarCodigo(empresaId) {
    // const prefijo = "INC";
    let codigo;

    const lastRow = await prisma.incoterms.findFirst({
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
      const totalRows = await prisma.incoterms.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return codigo;
  }
}
