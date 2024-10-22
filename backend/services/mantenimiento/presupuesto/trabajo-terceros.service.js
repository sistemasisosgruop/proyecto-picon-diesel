import { generarCodigoGeneric } from "backend/helpers/helper";
import prisma from "../../../prisma";
import { Decimal } from "@prisma/client/runtime/library";

export class TrabajoTercerosService {
  static async create(body) {
    const { definicion, tiempoHora, precioHora, subFamiliaId } = body;
    const valUnique = await prisma.trabajoTerceros.findFirst({
      where: {
        definicion,
      },
    });
    if (valUnique) {
      throw new Error("El nombre ya existe.");
    }
    const subFamilia = await prisma.subFamiliaPresupuesto.findUnique({
      where: {
        id: Number(subFamiliaId),
      },
    });

    if (!subFamilia) {
      throw new Error("No existe codigo Sub Familia.");
    }
    const familia = await prisma.familiaPresupuesto.findUnique({
      where: {
        id: Number(subFamilia.familiaId),
      },
    });
    if (!familia) {
      throw new Error("No existe codigo Familia.");
    }
    const trabajo = await prisma.trabajoTerceros.create({
      data: {
        codigo: await generarCodigoGeneric("trabajoTerceros", "TT", { subFamiliaId }),
        definicion,
        tiempoHora,
        precioHora,
        precioTotal: new Decimal(tiempoHora).mul(new Decimal(precioHora)),
        subFamiliaId: subFamilia.id,
        empresaId: familia.empresaId,
      },
    });

    return trabajo;
  }

  static async update(id, body) {
    const { definicion, tiempoHora, precioHora, subFamiliaId } = body;

    const valUnique = await prisma.trabajoTerceros.findFirst({
      where: {
        definicion,
        id: { not: id },
      },
    });
    if (valUnique) {
      throw new Error("El nombre ya existe.");
    }
    const subFamilia = await prisma.subFamiliaPresupuesto.findUnique({
      where: {
        id: Number(subFamiliaId),
      },
    });

    if (!subFamilia) {
      throw new Error("No existe codigo Sub Familia.");
    }
    const familia = await prisma.familiaPresupuesto.findUnique({
      where: {
        id: Number(subFamilia.familiaId),
      },
    });
    if (!familia) {
      throw new Error("No existe codigo Familia.");
    }

    const trabajo = await prisma.trabajoTerceros.update({
      where: {
        id,
      },
      data: {
        definicion,
        tiempoHora,
        precioHora,
        precioTotal: new Decimal(tiempoHora).mul(new Decimal(precioHora)),
        subFamiliaId: subFamilia.id,
        empresaId: familia.empresaId,
      },
    });

    return trabajo;
  }

  static async delete(id) {
    const trabajo = await prisma.trabajoTerceros.delete({
      where: {
        id,
      },
    });

    return trabajo;
  }

  static async getAll(empresaId, filterName) {
    return prisma.trabajoTerceros.findMany({
      include: {
        subFamilia: {
          include: {
            familia: true,
          },
        },
      },
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
              definicion: {
                contains: filterName,
              },
            },
          ],
        }),
      },
    });
  }

  static async get(id) {
    const trabajo = await prisma.trabajoTerceros.findUnique({
      where: {
        id: Number(id),
      },
    });

    return trabajo;
  }
}
