import prisma from "../../../prisma";

export class MarcaMotorService {
  static async createMarcaMotor(data) {
    const { marca } = data;
    const marcaMotor = await prisma.marcaMotor.create({
      data: {
        codigo: await this.generarCodigo(),
        marca,
        // empresaId,
      },
    });

    return marcaMotor;
  }

  static async updateMarcaMotor(id, data) {
    const { marca } = data;
    const marcaMotor = prisma.marcaMotor.update({
      where: {
        id,
      },
      data: {
        // codigo,
        marca,
      },
    });

    return marcaMotor;
  }

  static async deleteMarcaMotor(id) {
    const marcaMotor = prisma.marcaMotor.delete({
      where: {
        id,
      },
    });

    return marcaMotor;
  }

  static async getMarcaMotores(empresaId) {
    return prisma.marcaMotor.findMany({
      orderBy: {
        codigo: "desc",
      },
      // where: {
      //   empresaId,
      // },
    });
  }

  static async getMarcaMotor(id) {
    const marcaMotor = await prisma.marcaMotor.findUnique({
      where: {
        id,
      },
    });

    return marcaMotor;
  }

  static async generarCodigo() {
    const lastFamilia = await prisma.marcaMotor.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      // where: { empresaId },
    });

    let codigo;
    if (lastFamilia) {
      const nextCodigo = parseInt(lastFamilia.codigo, 10) + 1;
      codigo = String(nextCodigo).padStart(2, "0");
    } else {
      codigo = "01";
    }
    return codigo;
  }
}
