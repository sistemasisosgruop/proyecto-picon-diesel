import prisma from "../../prisma";
import { generateCode } from "../../utils/codes";

export class EmpresasService {
  static async createEmpresa(data) {
    const { nombre, ruc, direccion, telefono, email, web, adminId } = data;
    const empresa = await prisma.empresa.create({
      data: {
        nombre,
        ruc,
        direccion,
        telefono,
        email,
        web,
        personal: {
          connect: {
            id: adminId,
          },
        },
      },
    });

    const result = prisma.empresa.update({
      where: {
        id: empresa.id,
      },
      data: {
        codigo: generateCode(empresa.id),
      },
    });
    return result;
  }

  static async updateEmpresa(id, data) {
    const { nombre, ruc, direccion, telefono, email, web } = data;
    const empresa = prisma.empresa.update({
      where: {
        id,
      },
      data: {
        nombre,
        ruc,
        direccion,
        telefono,
        email,
        web,
      },
    });

    return empresa;
  }

  static async deleteEmpresa(id) {
    const empresa = prisma.empresa.delete({
      where: {
        id,
      },
    });

    return empresa;
  }

  static async getAllEmpresas(adminId) {
    return prisma.empresa.findMany({
      where: { personal: { some: { id: adminId } } },
    });
  }

  static async getEmpresa(id) {
    const empresa = await prisma.empresa.findUnique({
      where: {
        id,
      },
    });

    return empresa;
  }
}
