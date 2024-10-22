import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../../../prisma";

export class ServicioService {
  static async create(body) {
    const { subFamiliaId, definicion, precioHora, tiempoHora } = body;

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

    const codigoGen = await this.generarCodigo(familia.id);
    const servicio = await prisma.servicio.create({
      data: {
        codigo: codigoGen + "-" + tiempoHora + "-" + precioHora,
        definicion,
        precioHora,
        tiempoHora,
        precioTotal: new Decimal(precioHora).mul(new Decimal(tiempoHora)),
        subFamiliaId: subFamilia.id,
        empresaId: familia.empresaId,
      },
    });

    return servicio;
  }

  static async update(id, body) {
    const { subFamiliaId, definicion, precioHora, tiempoHora } = body;

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
    const currService = await prisma.servicio.findUnique({ where: { id } });
    if (!currService) {
      throw new Error("No existe Servicio.");
    }
    const servicio = await prisma.servicio.update({
      where: {
        id,
      },
      data: {
        codigo: currService.codigo.split("-")[0] + "-" + tiempoHora + "-" + precioHora,
        definicion,
        precioHora,
        tiempoHora,
        precioTotal: new Decimal(precioHora).mul(new Decimal(tiempoHora)),
        subFamiliaId: subFamilia.id,
        empresaId: familia.empresaId,
      },
    });

    return servicio;
  }

  static async delete(id) {
    const servicio = await prisma.servicio.delete({
      where: {
        id,
      },
    });

    return servicio;
  }

  static async getAll(empresaId, filterName) {
    return prisma.servicio.findMany({
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
    const servicio = await prisma.servicio.findUnique({
      where: {
        id: Number(id),
      },
    });

    return servicio;
  }

  static async generarCodigo(subFamiliaId) {
    const prefijo = "S";
    let codigo;

    const lastRow = await prisma.servicio.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { subFamiliaId },
    });

    const ultimosTresDigitos = lastRow?.codigo?.slice(-3);
    if (lastRow && Number(ultimosTresDigitos)) {
      const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
      codigo = String(nextCodigo).padStart(3, "0");
    } else {
      const totalRows = await prisma.servicio.count({
        where: { subFamiliaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
