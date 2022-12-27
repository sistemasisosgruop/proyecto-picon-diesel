import prisma from "../../../prisma";

export class MarcaMotorService {
  static async createMarcaMotor(data) {
    const { codigo, marca, empresaId } = data;
    const marcaMotor = await prisma.marcaMotor.create({
      data: {
        codigo,
        marca,
        empresaId,
      },
    });

    return marcaMotor;
  }

  static async updateMarcaMotor(id, data) {
    const { codigo, marca } = data;
    const marcaMotor = prisma.marcaMotor.update({
      where: {
        id,
      },
      data: {
        codigo,
        marca
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
      where: {
        empresaId,
      },
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
}