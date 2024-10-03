import prisma from "../../../prisma";

export class FamiliaService {
  static async createFamilia(data) {
    const { descripcion, empresaId } = data;

    const lastFamilia = await prisma.familia.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
    });

    let codigo;
    if (lastFamilia) {
      const nextCodigo = parseInt(lastFamilia.codigo, 10) + 1;
      codigo = String(nextCodigo).padStart(2, "0");
    } else {
      codigo = "01";
    }

    const familia = await prisma.familia.create({
      data: {
        codigo,
        descripcion,
        empresaId,
      },
    });

    return familia;
  }

  static async updateFamilia(id, data) {
    const { descripcion } = data;
    const familia = prisma.familia.update({
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

  static async deleteFamilia(id) {
    const familia = prisma.familia.delete({
      where: {
        id,
      },
    });

    return familia;
  }

  static async getFamilias(empresaId) {
    return prisma.familia.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getFamilia(codigo) {
    const familia = await prisma.familia.findUnique({
      where: {
        codigo,
      },
    });

    return familia;
  }
}
