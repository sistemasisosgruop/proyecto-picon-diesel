import { Prisma } from "@prisma/client";
import prisma from "../../../prisma";
// import { generateCode } from "../../../utils/codes";

export class MatrialesService {
  static async createMaterial(data) {
    const {
      materialSimilitud,
      materialEquivalencia,
      materialReemplazo,
      aplicacionDeMaquina,
      // empresaId,
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
    if (!familia || !subFamilia) {
      throw new Error("Familia y SubFamilia debe existir.");
    }

    let responseTransaction;
    try {
      const genCodigo = await this.generarCodigo(Number(subFamiliaId));
      console.log(genCodigo, "CODIGO");
      const dataNewMaterial = {
        codigo: genCodigo,
        correlativo: `${familia.codigo}${subFamilia.codigo}${genCodigo}`,
        // empresaId: Number(empresaId),
        familiaId: Number(familiaId),
        subfamiliaId: Number(subFamiliaId),
        nombreInterno,
        nombreComercial,
        marcaId: data.marcaId,
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
      console.log(dataNewMaterial, "POR CREAR");
      console.log(caracteristicaToMaterial, "CATARACTERISTICAS");
      const crearMaterial = await prisma.material.create({
        data: dataNewMaterial,
      });

      const dataCaracteristicasToMat = [];
      if (caracteristicaToMaterial && caracteristicaToMaterial.length > 0) {
        for (const caracteristica of caracteristicaToMaterial) {
          dataCaracteristicasToMat.push({
            caracteristicaId: caracteristica.caracteristica.id,
            materialId: crearMaterial.id,
            isChecked: caracteristica.isChecked, //! SE CAMBIO, ESTABA EN TRUE siempre
            valor: caracteristica.valor,
          });
        }
      }
      console.log(dataCaracteristicasToMat, "** dataCaracteristicasToMat **");
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
      familiaId,
      subFamiliaId,
      caracteristicaToMaterial,
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
    if (
      currMaterial.familiaId !== Number(familiaId) ||
      currMaterial.subfamiliaId !== Number(subFamiliaId)
    ) {
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
      genCodigo = await this.generarCodigo(Number(subFamiliaId));
      genCorrelativo = `${familia.codigo}${subFamilia.codigo}${genCodigo}`;
    }
    const updateMaterial = prisma.material.update({
      data: {
        codigo: genCodigo,
        correlativo: genCorrelativo,
        // empresaId: Number(empresaId),
        familiaId: Number(familiaId),
        subfamiliaId: Number(subFamiliaId),
        marcaId: data.marcaId,
        nombreInterno: data.nombreInterno, //! SE AGREGÓ
        nombreComercial: data.nombreComercial, //! SE AGREGÓ
        // marca: data.marca,                          //! SE AGREGÓ
        denominacion: data.denominacion,
        codigoBombaInyeccion: data.codigoBombaInyeccion,
        codigoMotorOriginal: data.codigoMotorOriginal,
        codigoFabricante: data.codigoFabricante,
        tipoFabricante: data.tipoFabricante,
        materialSimilitud: setMaterialSimilutud,
        materialEquivalencia: setMaterialEquivalencia,
        materialReemplazo: setMaterialReemplazo,
        aplicacionDeMaquina: setAplicacionDeMaquina,
        // stock: 0,
        // ventaUnidad: 0,
      },
      where: { id: Number(id) },
    });

    const dataCaracteristicasToMat = [];
    if (caracteristicaToMaterial && caracteristicaToMaterial.length > 0) {
      for (const caracteristica of caracteristicaToMaterial) {
        dataCaracteristicasToMat.push({
          materialId: Number(id),
          caracteristicaId: caracteristica.caracteristica.id,
          isChecked: caracteristica.isChecked, //! SE CAMBIO, ESTABA EN TRUE
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

  static async getMateriales(queryParams) {
    const {
      // empresaId,
      filterName,
      page,
      take,
      marca,
      codigoReferencia,
      nombreInterno,
      nombreComercial,
    } = queryParams;
    console.log(queryParams, "PARAMETROS");

    const skipValue = page > 0 ? Number(page * take) : undefined;
    const takeValue = take > 0 ? Number(take) : undefined;
    const whereFilter = {
      // empresaId,
      ...(marca && { marca }),
      ...(codigoReferencia && { codigoReferencia }),
      ...(nombreComercial && { nombreComercial }),
      ...(nombreInterno && { nombreInterno }),
      ...(filterName && {
        OR: [
          {
            codigoFabricante: {
              contains: filterName,
              mode: "insensitive",
            },
          },
          {
            codigo: {
              contains: filterName,
              mode: "insensitive",
            },
          },
          {
            correlativo: {
              contains: filterName,
              mode: "insensitive",
            },
          },
          {
            denominacion: {
              contains: filterName,
              mode: "insensitive",
            },
          },
          {
            familia: {
              codigo: {
                contains: filterName,
                mode: "insensitive",
              },
            },
          },
          {
            subfamilia: {
              codigo: {
                contains: filterName,
                mode: "insensitive",
              },
            },
          },
          {
            materialReemplazo: {
              array_contains: [{ correlativo: filterName }],
            },
          },

          {
            materialSimilitud: {
              array_contains: [{ correlativo: filterName }],
            },
          },
          {
            materialEquivalencia: {
              array_contains: [{ correlativo: filterName }],
            },
          },
        ],
      }),
    };

    const count = prisma.material.count({
      where: whereFilter,
      skip: skipValue,
      take: takeValue,
    });
    const data = prisma.material.findMany({
      where: whereFilter,
      skip: skipValue,
      take: takeValue,

      include: {
        marca: {
          select: {
            id: true,
            codigo: true,
            marca: true,
          },
        },
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
    console.log(lasMaterial, "LAST MATERIAL");
    let codigo;
    if (lasMaterial) {
      const nextCodigo = parseInt(lasMaterial.codigo, 10) + 1;
      codigo = String(nextCodigo).padStart(4, "0");
    } else {
      codigo = "0001";
    }
    return codigo;
  }
}
