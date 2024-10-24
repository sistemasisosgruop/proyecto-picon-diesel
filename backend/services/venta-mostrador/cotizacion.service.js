// import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../../prisma";
import { generarNumeracionCorrelativoGeneric } from "backend/helpers/helper";
// import { generateGenericCode } from "../../utils/codes";

export class CotizacionService {
  // static async create(data) {

  //   const resTransaction = await prisma.$transaction(async (PrismaClient) => {
  //     const { empresaId, materiales, ...props } = data;

  //     const cotizacion = await PrismaClient.cotizacion.create({
  //       data: {
  //         ...props,
  //         empresaId: Number(empresaId),
  //         ...(materiales && {
  //           cotizacionToMaterial: {
  //             createMany: {
  //               data: materiales?.map(({cantidad, materialId}) => ({
  //                 materialId: Number(materialId),
  //                 cantidad
  //               }))
  //             }
  //           }
  //         })
  //       }
  //     })
  //     return cotizacion;
  //   })

  //   // transaccion en caso hayan mas querys luego

  //   return resTransaction;

  // }

  static async create(data) {
    const {
      estado,
      fechaCotizacion,
      fechaValidez,
      diasValidez,
      monedaIdDe,
      monedaIdA,
      valorCompra,
      valorVenta,
      referencia,
      nota,
      referenciaMaquina,
      formaDePagoId,
      tipoDeCambioId,
      clienteId,
      contactoCliente,
      personalId,
      empresaId,
      sucursalId,
      maquinaId,
      // subtotal,
      // aplicacion,
      // descuento,
      // subtotalValorNeto,
      // igv,
      // total,
      materiales,
    } = data;

    const decimales = 2;
    try {
      // Crear los materiales relacionados con el ID de la cotización
      const newMaterials = [];
      if (materiales && materiales.length > 0) {
        for (const material of materiales) {
          const montoAplicacionUndTmp = new Decimal(material.valorVentaUnd).mul(
            new Decimal(material.aplicacion).div(100).toDecimalPlaces(decimales)
          );
          const valorVentaUndNetoTmp = montoAplicacionUndTmp.plus(
            new Decimal(material.valorVentaUnd).toDecimalPlaces(decimales)
          );
          const igvTmp = valorVentaUndNetoTmp.mul(0.18);
          const precioUndTmp = valorVentaUndNetoTmp.plus(igvTmp).toDecimalPlaces(decimales);
          const precioTotalTmp = precioUndTmp
            .mul(new Decimal(material.cantidadMaterial))
            .toDecimalPlaces(decimales);

          console.log(montoAplicacionUndTmp, "montoAplicacionUndTmp");
          console.log(valorVentaUndNetoTmp, "valorVentaUndNetoTmp");
          console.log(igvTmp, "igvTmp");
          console.log(precioUndTmp, "precioUndTmp");
          console.log(precioTotalTmp, "precioTotalTmp");
          newMaterials.push({
            posicion: material.posicion,
            cotizacionId: null,
            materialId: material.materialId,
            codigoMaterial: material.codigoMaterial,
            codigoFabricaMaterial: material.codigoFabricaMaterial,
            marcaMaterial: material.marcaMaterial,
            nombreMaterial: material.nombreMaterial,
            comentario: material.comentario,

            cantidadMaterial: material.cantidadMaterial,
            cantidadStock: material.cantidadStock,
            valorVentaUnd: material.valorVentaUnd,
            aplicacion: material.aplicacion,
            montoAplicacionUnd: montoAplicacionUndTmp,
            valorVentaUndNeto: valorVentaUndNetoTmp,
            igv: igvTmp,
            precioUnd: precioUndTmp,
            precioTotal: precioTotalTmp,
          });
        }
      }
      console.log(newMaterials, "newMaterials");
      const subtotalTmp = newMaterials
        .reduce(
          (acc, mat) => acc.plus(new Decimal(mat.cantidadMaterial).mul(mat.valorVentaUnd)),
          new Decimal(0)
        )
        .toDecimalPlaces(decimales);
      const aplicacionTmp = newMaterials
        .reduce(
          (acc, mat) => acc.plus(new Decimal(mat.cantidadMaterial).mul(mat.montoAplicacionUnd)),
          new Decimal(0)
        )
        .toDecimalPlaces(decimales);

      const igvTmp = newMaterials
        .reduce(
          (acc, mat) => acc.plus(new Decimal(mat.cantidadMaterial).mul(mat.igv)),
          new Decimal(0)
        )
        .toDecimalPlaces(decimales);

      const newCotizacion = prisma.cotizacion.create({
        data: {
          estado,
          numero: await generarNumeracionCorrelativoGeneric("cotizacion", "", { sucursalId }),
          fechaCotizacion,
          fechaValidez,
          diasValidez,
          monedaIdDe,
          monedaIdA,
          valorCompra,
          valorVenta,
          referencia,
          nota,
          referenciaMaquina,
          formaDePagoId,
          tipoDeCambioId,
          clienteId,
          contactoCliente,
          personalId,
          empresaId,
          sucursalId,
          maquinaId,
          subtotal: subtotalTmp,
          aplicacion: aplicacionTmp,
          descuento: subtotalTmp.plus(aplicacionTmp).toDecimalPlaces(decimales),
          subtotalValorNeto: subtotalTmp.plus(aplicacionTmp).toDecimalPlaces(decimales),
          igv: igvTmp,
          total: subtotalTmp.plus(aplicacionTmp).plus(igvTmp).toDecimalPlaces(decimales),
        },
      });

      const transaction = await prisma.$transaction(async (prisma) => {
        // Crear la cotización
        const cotizacion = await newCotizacion;

        newMaterials.forEach((m) => (m.cotizacionId = cotizacion.id));
        console.log(newMaterials, "MATERIALES");
        const createMaterials = await prisma.cotizacionToMaterial.createMany({
          data: newMaterials,
        });
        return { cotizacion, createMaterials };
      });
      // console.log(transaction);
      return transaction;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  static async update(id, data) {
    const resTransaction = await prisma.$transaction(async (PrismaClient) => {
      const { materiales, fechaCotizacion, fechaValidez, ...props } = data;
      const inputFechaCotizacion = new Date(fechaCotizacion);
      const inputFechaValidez = new Date(fechaValidez);
      const cotizacion = await PrismaClient.cotizacion.update({
        where: {
          id,
        },
        data: {
          ...props,
          fechaCotizacion: inputFechaCotizacion,
          fechaValidez: inputFechaValidez,
          ...(materiales?.length > 0 && {
            materiales: {
              deleteMany: {},
              createMany: {
                data: materiales?.map(({ cantidadMateriales, id }) => ({
                  materialId: Number(id),
                  cantidadMateriales,
                })),
              },
            },
          }),
        },
      });
      return cotizacion;
    });
    return resTransaction;
  }

  static async delete(id) {
    const cotizacion = await prisma.cotizacion.delete({
      where: {
        id,
      },
    });

    return cotizacion;
  }

  static async get(id) {
    const cotizacion = await prisma.cotizacion.findUnique({
      where: {
        id,
      },
      include: {
        cliente: true,
        materiales: {
          include: {
            material: true,
          },
        },
      },
    });

    return cotizacion;
  }

  // TO-DO
  // 1. getAll trayendo la info asociada del cliente (pantalla principal)
  // 2. getAll de todos las cotizaciones  con respecto a un id de cliente
  // 3. getAll de una cotizacion (id) trayendo sus respectivos materiales

  static async getAll(empresaId, userId) {
    const cotizacion = await prisma.cotizacion.findMany({
      where: {
        empresaId,
        ...(userId && {
          clienteId: userId,
        }),
      },
      // include: {
      //   cliente: true,
      //   Maquina: {
      //     include: {
      //       fabricaMaquina: true,
      //       modeloMaquina: true,
      //     },
      //   },
      //   materiales: {
      //     include: {
      //       material: {
      //         include: {
      //           familia: true,
      //         },
      //       },
      //     },
      //   },
      // },
    });

    return cotizacion;
  }

  static async getAllCotizacionesByClienteId(clienteId) {
    // en pantalla cotaprov
    const cotizaciones = await prisma.cotizacion.findMany({
      where: {
        clienteId,
      },
      include: {
        cliente: true,
        materiales: true,
      },
    });

    return cotizaciones;
  }

  static async getCotizacionByIdAndMaterial(id) {
    // en pantalla cotaprov
    const cotizacion = await prisma.cotizacion.findUnique({
      where: {
        id,
      },
      include: {
        materiales: true,
      },
    });

    return cotizacion;
  }
}
