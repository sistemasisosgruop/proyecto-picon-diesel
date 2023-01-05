import prisma from "../../prisma";
import { generateCodePresupuestoMaterial } from "../../utils/codes";

export class MaterialPresupuestoService {
  static async create(body) {
    const { empresaId, ...data } = body;
    const material = await prisma.materialPresupuesto.create({
      data: {
        ...data,
        empresaId,
      },
    });

    return prisma.materialPresupuesto.update({
      where: {
        id: material.id,
      },
      data: {
        codigo: generateCodePresupuestoMaterial(material.id),
      },
    });
  }

  static async update(id, body) {
    const material = await prisma.materialPresupuesto.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });

    return material;
  }

  static async delete(id) {
    const material = await prisma.materialPresupuesto.delete({
      where: {
        id,
      },
    });

    return material;
  }

  static async getAll(empresaId) {
    return prisma.materialPresupuesto.findMany({
      where: {
        empresaId,
      },
      include: {
        familia: {
          select: {
            codigo: true,
          },
        },
        subFamilia: {
          select: {
            codigo: true,
          },
        },
      },
    });
  }

  static async get(codigo) {
    const material = await prisma.materialPresupuesto.findUnique({
      where: {
        codigo,
      },
    });

    return material;
  }
}
