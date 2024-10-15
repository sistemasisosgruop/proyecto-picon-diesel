import prisma from "../../prisma";
import { decrypt, encrypt, encryptPassword } from "../../utils/auth";
import { generateCode } from "../../utils/codes";

export class PersonalService {
  static async createPersonal(data) {
    const {
      nombre,
      nombreAbreviado,
      dni,
      password,
      email,
      telefono,
      direccion,
      empresaId,
      role,
      puesto,
      porcentajeComision,
    } = data;
    const bcryptPassword = await encryptPassword(password);
    const cipherPassword = encrypt(password);

    const personal = await prisma.personal.create({
      data: {
        puesto,
        nombre,
        nombreAbreviado,
        dni,
        email,
        password: bcryptPassword,
        telefono,
        direccion,
        porcentajeComision,
        passwordEncrypted: cipherPassword,
        empresa: {
          connect: {
            id: empresaId,
          },
        },
        role: {
          connect: {
            name: role ?? "Administrador",
          },
        },
      },
    });

    const result = await prisma.personal.update({
      where: {
        id: personal.id,
      },
      data: {
        codigo: generateCode(personal.id),
      },
    });

    return { ...result, password: decrypt(result?.passwordEncrypted ?? "") };
  }

  static async updatePersonal(id, data) {
    const {
      nombre,
      nombreAbreviado,
      dni,
      password,
      email,
      telefono,
      direccion,
      porcentajeComision,
    } = data;
    const bcryptPassword = await encryptPassword(password);
    const cipherPassword = encrypt(password);

    const personal = await prisma.personal.update({
      where: {
        id,
      },
      data: {
        nombre,
        nombreAbreviado,
        dni,
        email,
        password: password.length > 0 ? bcryptPassword : undefined,
        passwordEncrypted: password.length > 0 ? cipherPassword : undefined,
        telefono,
        direccion,
        porcentajeComision,
      },
    });

    return { ...personal, password: decrypt(personal?.passwordEncrypted ?? "") };
  }

  static async deletePersonal(id) {
    const personal = prisma.personal.update({
      where: {
        id,
      },
      data: {
        estado: "Inactivo",
      },
    });

    return personal;
  }

  static async getAllPersonal(empresaId) {
    const result = await prisma.personal.findMany({
      where: {
        empresa: {
          some: {
            id: empresaId,
          },
        },
        estado: "Activo",
      },
    });

    return result.map((personal) => ({
      ...personal,
      password: decrypt(personal?.passwordEncrypted ?? ""),
    }));
  }
}
