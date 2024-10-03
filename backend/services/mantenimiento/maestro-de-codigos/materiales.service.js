import { Prisma } from "@prisma/client";
import prisma from "../../../prisma";
import { generateCode } from "../../../utils/codes";

export class MatrialesService {
  static async createMaterial(data) {
    const {
      materialSimilitud,
      materialEquivalencia,
      materialReemplazo,
      aplicacionDeMaquina,
      empresaId,
      familiaId,
      subFamiliaId,
      caracteristicas,
    } = data;

    const setMaterialSimilutud =
      materialSimilitud?.length > 0 ? materialSimilitud : Prisma.JsonNull;
    const setMaterialEquivalencia =
      materialEquivalencia?.length > 0 ? materialEquivalencia : Prisma.JsonNull;
    const setMaterialReemplazo =
      materialReemplazo?.length > 0 ? materialReemplazo : Prisma.JsonNull;
    const setAplicacionDeMaquina =
      aplicacionDeMaquina?.length > 0 ? aplicacionDeMaquina : Prisma.JsonNull;

    const familia = await prisma.familia.findUnique({
      where: {
        id: Number(familiaId),
      },
    });

    const subFamilia = await prisma.subFamilia.findUnique({
      where: {
        id: Number(subFamiliaId),
      },
    });

    const genCodigo = await this.generarCodigo(familiaId);
    const crearMaterial = prisma.material.create({
      data: {
        codigo: genCodigo,
        correlativo: `${familia.codigo}${subFamilia.codigo}${genCodigo}`,
        empresaId: Number(empresaId),
        familiaId: Number(familiaId),
        subfamiliaId: Number(subFamiliaId),
        denominacion: data.denominacion,
        codigoBombaInyeccion: data.codigoBombaInyeccion,
        codigoMotorOriginal: data.codigoMotorOriginal,
        codigoFabricante: data.codigoFabricante,
        tipoFabricante: data.tipoFabricante,
        materialSimilitud: setMaterialSimilutud,
        materialEquivalencia: setMaterialEquivalencia,
        materialReemplazo: setMaterialReemplazo,
        aplicacionDeMaquina: setAplicacionDeMaquina,
        stock: 0,
        ventaUnidad: 0,
      },
    });

    const dataCaracteristicasToMat = [];
    if (caracteristicas && caracteristicas.length > 0) {
      for (const caracteristica of caracteristicas) {
        dataCaracteristicasToMat.push({
          caracteristicaId: caracteristica.caracteristicaId,
          isChecked: true,
          valor: caracteristica.valor,
        });
      }
    }

    const saveCaracteristicasToMat = prisma.caracteristicaToMaterial.createMany({
      data: dataCaracteristicasToMat,
    });

    let responseTransaction;
    try {
      responseTransaction = await prisma.$transaction([crearMaterial, saveCaracteristicasToMat]);
    } catch (error) {
      console.error("Error en la transacción", error);
      throw new Error("Error en la guardar transacción");
    }

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
      const setMaterialSimilutud =
        materialSimilitud?.length > 0 ? materialSimilitud : Prisma.JsonNull;
      const setMaterialEquivalencia =
        materialEquivalencia?.length > 0 ? materialEquivalencia : Prisma.JsonNull;
      const setMaterialReemplazo =
        materialReemplazo?.length > 0 ? materialReemplazo : Prisma.JsonNull;
      const setAplicacionDeMaquina =
        aplicacionDeMaquina?.length > 0 ? aplicacionDeMaquina : Prisma.JsonNull;

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
              codigoFabricante: {
                contains: filterName,
              },
            },
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

  static async generarCodigo(familiaId) {
    const lasMaterial = await prisma.material.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { familiaId },
    });

    let codigo;
    if (lasMaterial) {
      const nextCodigo = parseInt(lasMaterial.codigo, 10) + 1;
      codigo = String(nextCodigo).padStart(4, "0");
    } else {
      codigo = "01";
    }
    return codigo;
  }
}
