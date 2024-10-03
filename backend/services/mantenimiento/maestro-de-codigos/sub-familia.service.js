import prisma from "../../../prisma";

export class SubFamiliaService {
  static async createSubFamilia(data) {
    const { descripcion, familiaId } = data;

    const codigo = await this.generarCodigoSubFamilia(familiaId);
    const subFamilia = await prisma.subFamilia.create({
      data: {
        codigo,
        descripcion,
        familiaId,
      },
    });

    return subFamilia;
  }

  static async updateSubFamilia(id, data) {
    const { codigo, descripcion } = data;
    const subFamilia = prisma.subFamilia.update({
      where: {
        id,
      },
      data: {
        codigo,
        descripcion,
      },
    });

    return subFamilia;
  }

  static async deleteSubFamilia(id) {
    const subFamilia = prisma.subFamilia.delete({
      where: {
        id,
      },
    });

    return subFamilia;
  }

  static async getSubFamilias(familiaId) {
    return prisma.subFamilia.findMany({
      where: {
        familiaId,
      },
    });
  }

  static async getSubFamilia(id) {
    const subFamilia = await prisma.subFamilia.findUnique({
      where: {
        id,
      },
    });

    return subFamilia;
  }

  static async generarCodigoSubFamilia(familiaId) {
    const familia = await prisma.familia.findUnique({
      where: { id: familiaId },
      select: { codigo: true },
    });

    if (!familia) {
      throw new Error("Familia no encontrada");
    }

    const lastSubFamilia = await prisma.subFamilia.findFirst({
      where: { familiaId },
      orderBy: { codigo: "desc" },
      select: { codigo: true },
    });

    let newSubFamiliaCodigo;

    if (lastSubFamilia) {
      const currentCorrelative =
        parseInt(lastSubFamilia.codigo.slice(familia.codigo.length), 10) + 1;
      if (!Number(currentCorrelative)) {
        throw new Error("Verificar correlativo anterior");
      }
      newSubFamiliaCodigo = String(currentCorrelative).padStart(4, "0");
    } else {
      newSubFamiliaCodigo = "0001";
    }

    return newSubFamiliaCodigo;
  }
}
