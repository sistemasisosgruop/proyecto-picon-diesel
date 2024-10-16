import prisma from "../../prisma";
// import { generateCodeMotivoMovimientoAlmacen } from "../../utils/codes";

export class MotivoMovimientoAlmacenService {
  static async create(data) {
    const { nombre, empresaId } = data;
    const motivoMovimientoAlmacen = await prisma.motivoMovimientoAlmacen.create({
      data: {
        codigo: await this.generarCodigo(empresaId),
        nombre,
        empresaId,
      },
    });

    return motivoMovimientoAlmacen;
  }

  static async update(id, data) {
    const { nombre } = data;
    const motivoMovimientoAlmacen = await prisma.motivoMovimientoAlmacen.update({
      where: {
        id,
      },
      data: {
        nombre,
      },
    });

    return motivoMovimientoAlmacen;
  }

  static async delete(id) {
    const motivoMovimientoAlmacen = await prisma.motivoMovimientoAlmacen.delete({
      where: {
        id,
      },
    });

    return motivoMovimientoAlmacen;
  }

  static async get(id) {
    const motivoMovimientoAlmacen = await prisma.motivoMovimientoAlmacen.findUnique({
      where: {
        id,
      },
    });

    return motivoMovimientoAlmacen;
  }

  static async getAll(empresaId) {
    const motivoMovimientoAlmacen = await prisma.motivoMovimientoAlmacen.findMany({
      where: {
        empresaId,
      },
    });

    return motivoMovimientoAlmacen;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "MMA";
    let codigo;

    const lastRow = await prisma.almacen.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { empresaId },
    });

    const ultimosTresDigitos = lastRow?.codigo?.slice(-3);
    if (lastRow && Number(ultimosTresDigitos)) {
      const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
      codigo = String(nextCodigo).padStart(3, "0");
    } else {
      const totalRows = await prisma.almacen.count({
        where: { empresaId },
      });
      codigo = "00" + (totalRows + 1);
    }
    return prefijo + codigo;
  }
}
