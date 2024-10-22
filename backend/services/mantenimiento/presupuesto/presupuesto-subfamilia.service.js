import prisma from "../../../prisma";

export class PresupuestoSubFamiliaService {
  static async create(body) {
    const { familiaId, ...data } = body;
    console.log(body, "DATA CERATE");
    const familia = await prisma.subFamiliaPresupuesto.create({
      data: {
        ...data,
        codigo: await this.generarCodigo(familiaId),
        familiaId,
      },
    });

    return familia;
  }

  static async update(id, data) {
    const { descripcion } = data;
    const familia = await prisma.subFamiliaPresupuesto.update({
      where: {
        id,
      },
      data: {
        // codigo,
        descripcion,
      },
    });

    return familia;
  }

  static async delete(id) {
    const familia = await prisma.subFamiliaPresupuesto.delete({
      where: {
        id,
      },
    });

    return familia;
  }

  static async getAll(familiaId) {
    return prisma.subFamiliaPresupuesto.findMany({
      where: {
        familiaId,
      },
    });
  }

  static async get(id) {
    const subFamilia = await prisma.subFamiliaPresupuesto.findUnique({
      where: {
        id,
      },
    });

    return subFamilia;
  }

  static async generarCodigo(familiaId) {
    const prefijo = "";
    let codigo;

    const lastRow = await prisma.subFamiliaPresupuesto.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { familiaId },
    });

    const ultimosTresDigitos = lastRow?.codigo?.slice(-3);
    if (lastRow && Number(ultimosTresDigitos)) {
      const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
      codigo = String(nextCodigo).padStart(3, "0");
    } else {
      const totalRows = await prisma.subFamiliaPresupuesto.count({
        where: { familiaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
