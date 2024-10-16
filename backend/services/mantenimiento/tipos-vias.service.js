import prisma from "../../prisma";
// import { generateCodeTipoVia } from "../../utils/codes";

export class TiposViasService {
  static async createTipoVia(data) {
    const { nombre, descripcion, empresaId } = data;

    const tipoVia = await prisma.tipoVia.create({
      data: {
        codigo: await this.generarCodigo(empresaId),
        nombre,
        descripcion,
        empresaId,
      },
    });

    return tipoVia;
  }

  static async updateTipoVia(id, data) {
    const { nombre, descripcion } = data;
    const tipoVia = prisma.tipoVia.update({
      where: {
        id,
      },
      data: {
        nombre,
        descripcion,
      },
    });

    return tipoVia;
  }

  static async deleteTipoVia(id) {
    const tipoVia = prisma.tipoVia.delete({
      where: {
        id,
      },
    });

    return tipoVia;
  }

  static async getAllTiposVias(body) {
    const { empresaId } = body;
    return prisma.tipoVia.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getTipoVia(id) {
    const tipoVia = await prisma.tipoVia.findUnique({
      where: {
        id,
      },
    });

    return tipoVia;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "VIA";
    let codigo;

    const lastRow = await prisma.tipoVia.findFirst({
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
      const totalRows = await prisma.tipoVia.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
