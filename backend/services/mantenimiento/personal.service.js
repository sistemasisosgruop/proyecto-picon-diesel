import prisma from "../../prisma";
import { encryptPassword } from "../../utils/auth";
import { generateCode } from "../../utils/codes";

export class PersonalService {
  static async createPersonal(data) {
    const {
      nombre,
      password,
      email,
      telefono,
      direccion,
      empresaId,
      role,
      area,
    } = data;
    const passwordEncripted = await encryptPassword(password);

    const personal = await prisma.personal.create({
      data: {
        area,
        nombre,
        email,
        password: passwordEncripted,
        telefono,
        direccion,
        empresa: {
          connect: {
            id: empresaId,
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
        codigo: generateCode(personal.id),
      },
    });

    return result;
  }

  static async updatePersonal(id, data) {
    const { nombre, password, email, telefono, direccion, role } = data;
    const passwordEncripted = await encryptPassword(password);

    const personal = prisma.personal.update({
      where: {
        id,
      },
      data: {
        nombre,
        email,
        password: passwordEncripted,
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

  static async getAllPersonal(empresaId) {
    return prisma.personal.findMany({
      where: {
        empresa: {
          some: {
            id: empresaId,
          },
        },
      },
    });
  }
}
