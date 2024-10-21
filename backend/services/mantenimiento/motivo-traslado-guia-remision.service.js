import prisma from "../../prisma";

export class MotivoTrasladoGuiaRemisionService {
  static async create(data) {
    const { empresaId, ...props } = data;
    const motivoTrasladoGuiaRemision = await prisma.motivoTrasladoGuiaRemision.create({
      data: {
        ...props,
        codigo: await this.generarCodigo(empresaId),
        empresaId,
      },
    });

    // const result = await prisma.motivoTrasladoGuiaRemision.update({
    //   where: {
    //     id: motivoTrasladoGuiaRemision.id,
    //   },
    //   data: {
    //     codigo: generateCodeTrasladoGuiaRemision(motivoTrasladoGuiaRemision.id),
    //   },
    // });
    return motivoTrasladoGuiaRemision;
  }

  static async update(id, data) {
    const motivoTrasladoGuiaRemision = await prisma.motivoTrasladoGuiaRemision.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return motivoTrasladoGuiaRemision;
  }

  static async delete(id) {
    const motivoTrasladoGuiaRemision = await prisma.motivoTrasladoGuiaRemision.delete({
      where: {
        id,
      },
    });

    return motivoTrasladoGuiaRemision;
  }

  static async get(id) {
    const motivoTrasladoGuiaRemision = await prisma.motivoTrasladoGuiaRemision.findUnique({
      where: {
        id,
      },
    });

    return motivoTrasladoGuiaRemision;
  }

  static async getAll(empresaId) {
    const motivosTrasladoGuiaRemision = await prisma.motivoTrasladoGuiaRemision.findMany({
      where: {
        empresaId,
      },
      orderBy: {
        codigo: "asc",
      },
    });

    return motivosTrasladoGuiaRemision;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "TGR";
    let codigo;

    const lastRow = await prisma.motivoTrasladoGuiaRemision.findFirst({
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
      const totalRows = await prisma.motivoTrasladoGuiaRemision.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
