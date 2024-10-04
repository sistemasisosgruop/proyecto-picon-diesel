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
      caracteristicaToMaterial,
      nombreInterno,
      nombreComercial,
    } = data;
    console.log(data, "DATA PARA CREAR");
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
    let responseTransaction;
    try {
      const genCodigo = await this.generarCodigo(Number(subFamiliaId));
      const dataNewMaterial = {
        codigo: genCodigo,
        correlativo: `${familia.codigo}${subFamilia.codigo}${genCodigo}`,
        empresaId: Number(empresaId),
        familiaId: Number(familiaId),
        subfamiliaId: Number(subFamiliaId),
        nombreInterno,
        nombreComercial,
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
      };

      const crearMaterial = await prisma.material.create({
        data: dataNewMaterial,
      });

      const dataCaracteristicasToMat = [];
      if (caracteristicaToMaterial && caracteristicaToMaterial.length > 0) {
        for (const caracteristica of caracteristicaToMaterial) {
          dataCaracteristicasToMat.push({
            caracteristicaId: caracteristica.caracteristica.id,
            materialId: crearMaterial.id,
            isChecked: true,
            valor: caracteristica.valor,
          });
        }
      }

      const saveCaracteristicasToMat = prisma.caracteristicaToMaterial.createMany({
        data: dataCaracteristicasToMat,
      });

      responseTransaction = await prisma.$transaction([saveCaracteristicasToMat]);
    } catch (error) {
      console.error("Error en la transacción", error);
      throw new Error("Error en la guardar transacción");
    }
    return responseTransaction;
  }

  static async updateMaterial(id, data) {
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
    console.log(data, "DATA PARA EDITAR");
    const setMaterialSimilutud =
      materialSimilitud?.length > 0 ? materialSimilitud : Prisma.JsonNull;
    const setMaterialEquivalencia =
      materialEquivalencia?.length > 0 ? materialEquivalencia : Prisma.JsonNull;
    const setMaterialReemplazo =
      materialReemplazo?.length > 0 ? materialReemplazo : Prisma.JsonNull;
    const setAplicacionDeMaquina =
      aplicacionDeMaquina?.length > 0 ? aplicacionDeMaquina : Prisma.JsonNull;

    const currMaterial = await prisma.material.findUnique({ where: { id: Number(id) } });
    console.log(currMaterial, "CURR MATERIAL");
    let genCodigo = currMaterial.codigo;
    let genCorrelativo = currMaterial.correlativo;
    if (currMaterial.familiaId !== familiaId || currMaterial.subFamiliaId !== subFamiliaId) {
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
      console.log(familia, subFamilia, "FAMILIA Y SUBFAMILIA");
      genCodigo = await this.generarCodigo(Number(subFamiliaId));
      genCorrelativo = `${familia.codigo}${subFamilia.codigo}${genCodigo}`;
    }
    console.log(genCodigo, "GEN CODIGO");
    console.log(genCorrelativo, "GEN CORRELATIVO");
    const updateMaterial = prisma.material.update({
      data: {
        codigo: genCodigo,
        correlativo: genCorrelativo,
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
      where: { id: Number(id) },
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

    const detelteOldCarateristicasToMat = prisma.caracteristicaToMaterial.deleteMany({
      where: { materialId: Number(id) },
    });
    const saveCaracteristicasToMat = prisma.caracteristicaToMaterial.createMany({
      data: dataCaracteristicasToMat,
    });
    let responseTransaction;
    try {
      responseTransaction = await prisma.$transaction([
        updateMaterial,
        detelteOldCarateristicasToMat,
        saveCaracteristicasToMat,
      ]);
    } catch (error) {
      console.error("Error en la transacción", error);
      throw new Error("Error en la EDITAR transacción");
    }

    return responseTransaction;
    // const responseTransaction = await prisma.$transaction(async (PrismaClient) => {
    //   const {
    //     empresaId,
    //     materialSimilutud,
    //     materialEquivalencia,
    //     materialSimilitud,
    //     materialReemplazo,
    //     aplicacionDeMaquina,
    //     familiaId,
    //     subFamiliaId,
    //     caracteristicas,
    //     ...props
    //   } = data;
    //   const setMaterialSimilutud =
    //     materialSimilitud?.length > 0 ? materialSimilitud : Prisma.JsonNull;
    //   const setMaterialEquivalencia =
    //     materialEquivalencia?.length > 0 ? materialEquivalencia : Prisma.JsonNull;
    //   const setMaterialReemplazo =
    //     materialReemplazo?.length > 0 ? materialReemplazo : Prisma.JsonNull;
    //   const setAplicacionDeMaquina =
    //     aplicacionDeMaquina?.length > 0 ? aplicacionDeMaquina : Prisma.JsonNull;

    //   let correlativo;
    //   let updateFamiliaData;

    //   if (familiaId && subFamiliaId) {
    //     const familia = await PrismaClient.familia.findUnique({
    //       where: {
    //         id: Number(familiaId),
    //       },
    //     });

    //     const subFamilia = await PrismaClient.subFamilia.findUnique({
    //       where: {
    //         id: Number(subFamiliaId),
    //       },
    //     });
    //     correlativo = `${familia.codigo}${subFamilia.codigo}${generateCode(id)}`;
    //     updateFamiliaData = {
    //       familiaId: Number(familiaId),
    //       subfamiliaId: Number(subFamiliaId),
    //       correlativo,
    //     };
    //   } else {
    //     correlativo = undefined;
    //     updateFamiliaData = {
    //       familiaId: undefined,
    //       subfamiliaId: undefined,
    //       correlativo,
    //     };
    //   }

    //   const material = await PrismaClient.material.update({
    //     where: {
    //       id,
    //     },
    //     data: {
    //       ...props,
    //       ...updateFamiliaData,
    //       materialSimilitud: setMaterialSimilutud,
    //       materialEquivalencia: setMaterialEquivalencia,
    //       materialReemplazo: setMaterialReemplazo,
    //       aplicacionDeMaquina: setAplicacionDeMaquina,
    //       ...(caracteristicas?.length > 0 && {
    //         caracteristicaToMaterial: {
    //           deleteMany: {},
    //           createMany: {
    //             data: caracteristicas?.map(({ valor, isChecked, caracteristicaId }) => ({
    //               caracteristicaId: Number(caracteristicaId),
    //               isChecked,
    //               valor,
    //             })),
    //           },
    //         },
    //       }),
    //     },
    //   });

    //   return material;
    // });

    // return responseTransaction;
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

  static async getMateriales(empresaId, filterName, page, take) {
    console.log(empresaId, filterName, page, take, "PARAMETROS");
    const skipValue = page > 0 ? Number(page * take) : undefined;
    const takeValue = take > 0 ? Number(take) : undefined;
    const whereFilter = {
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
    };

    const count = prisma.material.count({
      skip: skipValue,
      take: takeValue,
      where: whereFilter,
    });
    const data = prisma.material.findMany({
      skip: skipValue,
      take: takeValue,
      where: whereFilter,
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
    const transaction = await prisma.$transaction([count, data]);
    return { rows: transaction[0], data: transaction[1] };
  }

  static async generarCodigo(subfamiliaId) {
    const lasMaterial = await prisma.material.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { subfamiliaId },
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
