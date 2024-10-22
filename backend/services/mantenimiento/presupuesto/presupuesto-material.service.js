// import { select } from "@material-tailwind/react";
import prisma from "../../../prisma";
// import { generateCodePresupuestoMaterial } from "../../../utils/codes";

export class MaterialPresupuestoService {
  static async create(body) {
    const { subFamiliaId, ...data } = body;
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

    const codigoGen = await this.generarCodigo(subFamilia.id);
    const material = await prisma.materialPresupuesto.create({
      data: {
        codigo: codigoGen,
        correlativo: `${familia.codigo}${subFamilia.codigo}${codigoGen}`,
        empresaId: Number(familia.empresaId),
        familiaId: Number(familia.id),
        subFamiliaId: Number(subFamiliaId),
        ...data,
      },
    });
    return material;
    //   const codigo = generateCodePresupuestoMaterial(material.id);
    //   const correlativo = `${familia.codigo}${subFamilia.codigo}${codigo}`;

    //   return prisma.materialPresupuesto.update({
    //     where: {
    //       id: material.id,
    //     },
    //     data: {
    //       codigo,
    //       correlativo,
    //     },
    //   });
  }

  static async update(id, body) {
    const { subFamiliaId, nombre, precio, valorVenta, igv } = body;

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

    const currMaterial = await prisma.materialPresupuesto.findUnique({ where: { id } });
    if (!currMaterial) {
      throw new Error("No existe Material.");
    }
    // const familia = await prisma.familiaPresupuesto.findUnique({
    //   where: {
    //     id: Number(familia.id),
    //   },
    // });

    // const subFamilia = await prisma.subFamiliaPresupuesto.findUnique({
    //   where: {
    //     id: Number(subFamiliaId),
    //   },
    // });
    // correlativo = `${familia.codigo}${subFamilia.codigo}${generateCodePresupuestoMaterial(id)}`;
    // updateFamiliaData = {
    //   familiaId: Number(familiaId),
    //   subFamiliaId: Number(subFamiliaId),
    //   correlativo,
    // };

    const material = await prisma.materialPresupuesto.update({
      where: {
        id,
      },
      data: {
        // codigo: codigoGen,
        correlativo: `${familia.codigo}${subFamilia.codigo}${currMaterial.codigo}`,
        nombre,
        precio,
        valorVenta,
        igv,
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

  static async generarCodigo(subFamiliaId) {
    const prefijo = "";
    let codigo;

    const lastRow = await prisma.materialPresupuesto.findFirst({
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
      const totalRows = await prisma.materialPresupuesto.count({
        where: { subFamiliaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
