import prisma from "../../prisma";
import { generateCode } from "../../utils/codes";
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
            id: empresaId,
          },
        },
        role: {
          connect: {
            name: EnumRole[EnumRole.Vendedor],
          },
        },
      },
    });
    const result = prisma.vendedor.update({
      where: {
        id: vendedor.id,
      },
      data: {
        codigo: generateCode(vendedor.id),
      },
    });

    return result;
  }

  static async updateVendedor(id, data) {
    const { nombre, email, comision, password, direccion, aprovacionCotizacion, telefono } = data;
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
    const vendedor = prisma.vendedor.update({
      where: {
        id,
      },
      data: {
        estado: "Inactivo",
      },
    });

    return vendedor;
  }

  static async getAllVendedores(empresaId) {
    return prisma.vendedor.findMany({
      where: {
        empresaId,
        estado: "Activo",
      },
    });
  }
}
