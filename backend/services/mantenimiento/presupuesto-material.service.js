import prisma from "../../prisma";
import { generateCodePresupuestoMaterial } from "../../utils/codes";

export class MaterialPresupuestoService {
  static async create(body) {
    const { empresaId, familiaId, subFamiliaId, ...data } = body;
    const familia = await prisma.familiaPresupuesto.findUnique({
      where: {
        id: Number(familiaId),
      },
    });

    const subFamilia = await prisma.subFamiliaPresupuesto.findUnique({
      where: {
        id: Number(subFamiliaId),
      },
    });

    const material = await prisma.materialPresupuesto.create({
      data: {
        empresaId: Number(empresaId),
        familiaId: Number(familiaId),
        subFamiliaId: Number(subFamiliaId),
        ...data,
      },
    });

    const codigo = generateCodePresupuestoMaterial(material.id);
    const correlativo = `${familia.codigo}${subFamilia.codigo}${codigo}`;

    return prisma.materialPresupuesto.update({
      where: {
        id: material.id,
      },
      data: {
        codigo,
        correlativo,
      },
    });
  }

  static async update(id, body) {
    const { familiaId, subFamiliaId, ...data } = body;
    let correlativo;
    let updateFamiliaData;

    if (familiaId && subFamiliaId) {
      const familia = await prisma.familiaPresupuesto.findUnique({
        where: {
          id: Number(familiaId),
        },
      });

      const subFamilia = await prisma.subFamiliaPresupuesto.findUnique({
        where: {
          id: Number(subFamiliaId),
        },
      });
      correlativo = `${familia.codigo}${subFamilia.codigo}${generateCodePresupuestoMaterial(id)}`;
      updateFamiliaData = {
        familiaId: Number(familiaId),
        subFamiliaId: Number(subFamiliaId),
        correlativo,
      };
    } else {
      correlativo = undefined;
      updateFamiliaData = {
        familiaId: undefined,
        subFamiliaId: undefined,
        correlativo,
      };
    }
    const material = await prisma.materialPresupuesto.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...updateFamiliaData,
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

  static async get(id) {
    const material = await prisma.materialPresupuesto.findUnique({
      where: {
        id,
      },
    });

    return material;
  }
}
