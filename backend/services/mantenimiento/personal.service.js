import prisma from "../../prisma";
import { generateCodigo } from "../../utils/codes";

export class PersonalService {
  static async createPersonal(data) {
    const { nombre, password, email, telefono, direccion, empresaId, role } =
      data;
    const personal = await prisma.personal.create({
      data: {
        nombre,
        email,
        password,
        telefono,
        direccion,
        empresa: {
          connect: {
            empresaId,
          },
        },
        role: {
          connect: {
            name: role,
          },
        },
      },
    });

    const result = prisma.personal.update({
      where: {
        id: personal.id,
      },
      data: {
        codigo: generateCodigo(personal.id),
      },
    });
    
    return result;
  }

  static async updatePersonal(id, data) {
    const { nombre, password, email, telefono, direccion, role } = data;
    const personal = prisma.personal.update({
      where: {
        id,
      },
      data: {
        nombre,
        email,
        password,
        telefono,
        direccion,
        role: {
          set: [],
          connect: {
            name: role,
          },
        },
      },
    });

    return personal;
  }

  static async deletePersonal(id) {
    const personal = prisma.personal.delete({
      where: {
        id,
      },
    });

    return personal;
  }

  static async getAllPersonal(body) {
    const { empresaId } = body;
    return prisma.personal.findMany({
      where: {
        empresaId,
      }
    });
  }
}
