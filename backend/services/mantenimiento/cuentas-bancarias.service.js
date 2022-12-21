import prisma from "../../prisma";
import { generateCodeCuentaBancaria } from "../../utils/codes";

export class CuentasBancarias {
  static async createCuentaBancaria(data) {
    const { bancoId, moneda, empresaId, tipoCuenta, numeroCuenta } = data;
    const cuentaBancaria = await prisma.cuentaBancaria.create({
      data: {
        tipoCuenta,
        moneda,
        bancoId,
        numeroCuenta,
        empresa: {
          connect: {
            id: empresaId,
          },
        },
      },
    });

    const result = prisma.cuentaBancaria.update({
      where: {
        id: cuentaBancaria.id,
      },
      data: {
        codigo: generateCodeCuentaBancaria(cuentaBancaria.id),
      },
    });
    return result;
  }

  static async updateCuentaBancaria(id, data) {
    const { bancoId, moneda, tipoCuenta, numeroCuenta } = data;
    const cuentaBancaria = prisma.cuentaBancaria.update({
      where: {
        id,
      },
      data: {
        bancoId,
        moneda,
        tipoCuenta,
        numeroCuenta,
      },
    });

    return cuentaBancaria;
  }

  static async deleteCuentaBancaria(id) {
    const cuentaBancaria = prisma.cuentaBancaria.delete({
      where: {
        id,
      },
    });

    return cuentaBancaria;
  }

  static async getCuentaBancaria(id) {
    const cuentaBancaria = await prisma.cuentaBancaria.findUnique({
      where: {
        id,
      },
    });

    return cuentaBancaria;
  }

  static async getAllCuentasBancarias(body) {
    const { empresaId } = body;

    return prisma.cuentaBancaria.findMany({ where: { empresaId } });
  }
}
