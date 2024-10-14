import prisma from '../../prisma';
import { generateCode } from '../../utils/codes';

export class EmpresasService {
  static async createEmpresa(data) {
    const { nombre, ruc, direccion, telefono, email, web, logo, adminId } = data;
    const empresa = await prisma.empresa.create({
      data: {
        nombre,
        ruc,
        direccion,
        telefono,
        email,
        web,
        logo,
        personal: {
          connect: {
            id: Number(adminId),
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
    const { nombre, ruc, direccion, telefono, email, web, logo } = data;
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
        logo,
      },
    });

    return empresa;
  }

  static async deleteEmpresa(id) {
    const empresa = await prisma.empresa.delete({
      where: {
        id,
      },
    });

    return empresa;
  }

  static async getAllEmpresas(adminId) {
    const empresas = await prisma.empresa.findMany({
      where: { personal: { some: { id: adminId } } },
    });

    return empresas.map(({ logo, ...data }) => ({ ...data, logo: logo ?? '' }));
  }

  static async getEmpresa(id) {
    const empresa = await prisma.empresa.findUnique({
      where: {
        id,
      },
    });

    return empresa;
  }

  static async getEmpresaWithInfo(id) {
    const result = await prisma.empresa.findUnique({
      where: {
        id,
      },
      include: {
        fabricaMaquina: true,
        modeloMaquina: true,
        nombreMaquina: true,
        paises: true,
        marcaMotor: true,
        marca: true,
        descripcionBombaInyeccion: true,
        marcaFabricaInyector: true,
        descripcionInyector: true,
      },
    });

    return result;
  }

  static async getInfoForMaterial(id) {
    const result = await prisma.empresa.findUnique({
      where: {
        id,
      },
      include: {
        familia: true,
        caracteristica: true,
      },
    });

    return result;
  }
}
