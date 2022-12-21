import prisma from "../../prisma";
import { generateCodigo } from "../../utils/codes";
import { EnumRole } from "../../utils/enums";

export class VendedoresService {
  static async createVendedor(data) {
    const {
      nombre,
      email,
      comision,
      password,
      aprovacionCotizacion,
      direccion,
      telefono,
      empresaId,
    } = data;
    const vendedor = await prisma.vendedor.create({
      data: {
        nombre,
        email,
        comision,
        password,
        direccion,
        telefono,
        aprovacionCotizacion,
        empresa: {
          connect: {
            empresaId,
          },
        },
        role: {
          connect: {
            name: EnumRole.Vendedor,
          },
        },
      },
    });
    const result = prisma.vendedor.update({
      where: {
        id: vendedor.id,
      },
      data: {
        codigo: generateCodigo(vendedor.id),
      },
    });

    return result;
  }

  static async updateVendedor(id, data) {
    const {
      nombre,
      email,
      comision,
      password,
      direccion,
      aprovacionCotizacion,
      telefono,
    } = data;
    const vendedor = prisma.vendedor.update({
      where: {
        id,
      },
      data: {
        nombre,
        email,
        comision,
        password,
        direccion,
        telefono,
        aprovacionCotizacion,
      },
    });

    return vendedor;
  }

  static async deleteVendedor(id) {
    const vendedor = prisma.vendedor.delete({
      where: {
        id,
      },
    });

    return vendedor;
  }

  static async getAllVendedores(body) {
    const { empresaId } = body;
    return prisma.vendedor.findMany({
      where: {
        empresaId,
      },
    });
  }
}
