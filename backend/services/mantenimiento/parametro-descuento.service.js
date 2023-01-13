import prisma from "../../prisma";

export class ParametroDescuentoService {
  static async update(body) {
    const { empresaId, ...data } = body;
    const currentParam = await prisma.parametroDescuento.findFirst({
      where: {
        empresaId,
      },
    });

    if (!currentParam) {
      return prisma.parametroDescuento.create({
        data: {
          ...data,
          empresaId,
        },
      });
    }
    const parametroDescuento = await prisma.parametroDescuento.update({
      where: {
        id: currentParam.id,
      },
      data: {
        ...data,
      },
    });

    return parametroDescuento;
  }

  static async get(empresaId) {
    const parametroDescuento = await prisma.parametroDescuento.findFirst({
      where: {
        empresaId,
      },
    });

    return parametroDescuento;
  }
}
