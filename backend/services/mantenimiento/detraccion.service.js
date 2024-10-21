import prisma from "../../prisma";

export class DetraccionService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const detraccion = await prisma.detraccion.create({
      data: {
        ...props,
        codigo: await this.generarCodigo(empresaId),
        empresaId,
      },
    });

    return detraccion;
  }

  static async update(id, data) {
    const detraccion = await prisma.detraccion.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return detraccion;
  }

  static async delete(id) {
    const detraccion = await prisma.detraccion.delete({
      where: {
        id,
      },
    });

    return detraccion;
  }

  static async get(id) {
    const detraccion = await prisma.detraccion.findUnique({
      where: {
        id,
      },
    });

    return detraccion;
  }

  static async getAll(empresaId) {
    const detracciones = await prisma.detraccion.findMany({
      where: {
        empresaId,
      },
      orderBy: {
        codigo: "asc",
      },
    });

    return detracciones;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "DET";
    let codigo;

    const lastRow = await prisma.detraccion.findFirst({
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
      const totalRows = await prisma.detraccion.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
