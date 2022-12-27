import prisma from "../../../prisma";

export class MatrialesService {
  static async createMaterial(data) {
    const {
      empresaId,
      materialSimilutud,
      materialEquivalencia,
      materialReemplazo,
      ...props
    } = data;

    const setMaterialSimilutud = materialSimilutud
      ? Object.create(materialSimilutud)
      : undefined;
    const setMaterialEquivalencia = materialEquivalencia
      ? Object.create(materialEquivalencia)
      : undefined;
    const setMaterialReemplazo = materialReemplazo
      ? Object.create(materialReemplazo)
      : undefined;
    const material = await prisma.material.create({
      data: {
        ...props,
        empresaId,
        materialSimilutud: setMaterialSimilutud,
        materialEquivalencia: setMaterialEquivalencia,
        materialReemplazo: setMaterialReemplazo,
      },
    });

    return material;
  }

  static async updateMaterial(id, data) {
    const {
      empresaId,
      materialSimilutud,
      materialEquivalencia,
      materialReemplazo,
      ...props
    } = data;
    const setMaterialSimilutud = materialSimilutud
      ? Object.create(materialSimilutud)
      : undefined;
    const setMaterialEquivalencia = materialEquivalencia
      ? Object.create(materialEquivalencia)
      : undefined;
    const setMaterialReemplazo = materialReemplazo
      ? Object.create(materialReemplazo)
      : undefined;
    const material = prisma.material.update({
      where: {
        id,
      },
      data: {
        ...props,
        materialSimilutud: setMaterialSimilutud,
        materialEquivalencia: setMaterialEquivalencia,
        materialReemplazo: setMaterialReemplazo,
      },
    });

    return material;
  }

  static async deleteMaterial(id) {
    const material = prisma.material.delete({
      where: {
        id,
      },
    });

    return material;
  }

  static async getMateriales(empresaId) {
    return prisma.material.findMany({
      where: {
        empresaId,
      },
    });
  }

  static async getMaterial(id) {
    const material = await prisma.material.findUnique({
      where: {
        id,
      },
    });

    return material;
  }
}
