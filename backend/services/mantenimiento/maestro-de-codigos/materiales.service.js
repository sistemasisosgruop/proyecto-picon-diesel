import prisma from "../../../prisma";
import { generateCode } from "../../../utils/codes";

export class MatrialesService {
  static async createMaterial(data) {
    const responseTransaction = await prisma.$transaction(async (PrismaClient) => {
      const {
        materialSimilitud,
        materialEquivalencia,
        materialReemplazo,
        aplicacionDeMaquina,
        empresaId,
        familiaId,
        subFamiliaId,
        caracteristicas,
        ...props
      } = data;

      const setMaterialSimilutud = materialSimilitud.length > 0 ? materialSimilitud : undefined;
      const setMaterialEquivalencia =
        materialEquivalencia.length > 0 ? materialEquivalencia : undefined;
      const setMaterialReemplazo = materialReemplazo.length > 0 ? materialReemplazo : undefined;
      const setAplicacionDeMaquina =
        aplicacionDeMaquina.length > 0 ? aplicacionDeMaquina : undefined;

      const material = await PrismaClient.material.create({
        data: {
          ...props,
          empresaId: Number(empresaId),
          familiaId: Number(familiaId),
          subfamiliaId: Number(subFamiliaId),
          materialSimilitud: setMaterialSimilutud,
          materialEquivalencia: setMaterialEquivalencia,
          materialReemplazo: setMaterialReemplazo,
          aplicacionDeMaquina: setAplicacionDeMaquina,
          ...(caracteristicas && {
            caracteristicaToMaterial: {
              createMany: {
                data: caracteristicas?.map(({ valor, isChecked, caracteristicaId }) => ({
                  caracteristicaId: Number(caracteristicaId),
                  isChecked,
                  valor,
                })),
              },
            },
          }),
        },
      });

      const familia = await PrismaClient.familia.findUnique({
        where: {
          id: Number(familiaId),
        },
      });

      const subFamilia = await PrismaClient.subFamilia.findUnique({
        where: {
          id: Number(subFamiliaId),
        },
      });

      const codigo = generateCode(material.id);

      const correlativo = `${familia.codigo}${subFamilia.codigo}${codigo}`;

      const result = await PrismaClient.material.update({
        where: {
          id: material.id,
        },
        data: {
          codigo,
          correlativo,
        },
      });

      return result;
    });

    return responseTransaction;
  }

  static async updateMaterial(id, data) {
    const responseTransaction = await prisma.$transaction(async (PrismaClient) => {
      const {
        empresaId,
        materialSimilutud,
        materialEquivalencia,
        materialSimilitud,
        materialReemplazo,
        aplicacionDeMaquina,
        familiaId,
        subFamiliaId,
        caracteristicas,
        ...props
      } = data;
      const setMaterialSimilutud = materialSimilitud.length > 0 ? materialSimilitud : undefined;
      const setMaterialEquivalencia =
        materialEquivalencia.length > 0 ? materialEquivalencia : undefined;
      const setMaterialReemplazo = materialReemplazo.length > 0 ? materialReemplazo : undefined;
      const setAplicacionDeMaquina =
        aplicacionDeMaquina.length > 0 ? aplicacionDeMaquina : undefined;
      let correlativo;
      let updateFamiliaData;

      if (familiaId && subFamiliaId) {
        const familia = await PrismaClient.familia.findUnique({
          where: {
            id: Number(familiaId),
          },
        });

        const subFamilia = await PrismaClient.subFamilia.findUnique({
          where: {
            id: Number(subFamiliaId),
          },
        });
        correlativo = `${familia.codigo}${subFamilia.codigo}${generateCode(id)}`;
        updateFamiliaData = {
          familiaId: Number(familiaId),
          subfamiliaId: Number(subFamiliaId),
          correlativo,
        };
      } else {
        correlativo = undefined;
        updateFamiliaData = {
          familiaId: undefined,
          subfamiliaId: undefined,
          correlativo,
        };
      }

      const material = await PrismaClient.material.update({
        where: {
          id,
        },
        data: {
          ...props,
          ...updateFamiliaData,
          materialSimilitud: setMaterialSimilutud,
          materialEquivalencia: setMaterialEquivalencia,
          materialReemplazo: setMaterialReemplazo,
          aplicacionDeMaquina: setAplicacionDeMaquina,
          ...(caracteristicas?.length > 0 && {
            caracteristicaToMaterial: {
              deleteMany: {},
              createMany: {
                data: caracteristicas?.map(({ valor, isChecked, caracteristicaId }) => ({
                  caracteristicaId: Number(caracteristicaId),
                  isChecked,
                  valor,
                })),
              },
            },
          }),
        },
      });

      return material;
    });

    return responseTransaction;
  }

  static async deleteMaterial(id) {
    const material = await prisma.material.deleteMany({
      where: {
        id,
        stock: {
          equals: 0,
        },
      },
    });

    if (material.count === 0) {
      throw new Error("No se puede eliminar el material porque tiene stock");
    }

    return material;
  }

  static async getMaterial(id) {
    const material = await prisma.material.findUnique({
      where: {
        id,
      },
    });

    return material;
  }

  static async getMateriales(empresaId, filterName) {
    const response = await prisma.material.findMany({
      where: {
        empresaId,
        ...(filterName && {
          OR: [
            {
              codigo: {
                contains: filterName,
              },
            },
            {
              denominacion: {
                contains: filterName,
              },
            },
            {
              familia: {
                codigo: {
                  contains: filterName,
                },
              },
            },
            {
              subfamilia: {
                codigo: {
                  contains: filterName,
                },
              },
            },
          ],
        }),
      },
      include: {
        familia: {
          select: {
            codigo: true,
          },
        },
        subfamilia: {
          select: {
            codigo: true,
          },
        },
        caracteristicaToMaterial: {
          where: {
            isChecked: true,
          },
          select: {
            valor: true,
            isChecked: true,
            caracteristica: {
              select: {
                descripcion: true,
                id: true,
              },
            },
          },
        },
      },
    });

    return response;
  }
}
