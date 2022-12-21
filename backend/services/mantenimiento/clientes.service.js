import prisma from "../../prisma";
import { generateCodeCliente, generateTipoCliente } from "../../utils/codes";

export class ClienteService {
  static async createTipoCliente(data) {
    const { tipo } = data;
    const tipoCliente = await prisma.tipoCliente.create({
      data: {
        tipo,
      },
    });

    const result = prisma.tipoCliente.update({
      where: {
        id: tipoCliente.id,
      },
      data: {
        codigo: generateTipoCliente(tipoCliente.id),
      },
    });

    return result;
  }

  static async updateTipoCliente(id, data) {
    const { tipo } = data;
    const tipoCliente = prisma.tipoCliente.update({
      where: {
        id,
      },
      data: {
        tipo,
      },
    });

    return tipoCliente;
  }

  static async deleteTipoCliente(id) {
    const tipoCliente = prisma.tipoCliente.delete({
      where: {
        id,
      },
    });

    return tipoCliente;
  }

  async getAllTipoCliente(body) {
    const { empresaId } = body;
    const tipoCliente = await prisma.tipoCliente.findMany({
      where: {
        empresaId,
      }
    });

    return tipoCliente;
  }

  async getTipoCliente(id) {
    const tipoCliente = await prisma.tipoCliente.findUnique({
      where: {
        id,
      },
    });

    return tipoCliente;
  }

  static async createCliente(data) {
    const {
      nombre,
      tipoDocumento,
      numeroDocumento,
      tipoClienteId,
      telefono,
      email,
      empresaId,
    } = data;
    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        tipoDocumento,
        numeroDocumento,
        tipoClienteId,
        telefono,
        email,
        empresaId,
      },
    });

    const result = prisma.cliente.update({
      where: {
        id: cliente.id,
      },
      data: {
        codigo: generateCodeCliente(cliente.id),
      },
    });
    return result;
  }

  static async updateCliente(id, data) {
    const {
      nombre,
      tipoDocumento,
      numeroDocumento,
      tipoClienteId,
      telefono,
      email,
    } = data;
    const cliente = prisma.cliente.update({
      where: {
        id,
      },
      data: {
        nombre,
        tipoDocumento,
        numeroDocumento,
        tipoClienteId,
        telefono,
        email,
      },
    });

    return cliente;
  }

  static async deleteCliente(id) {
    const cliente = prisma.cliente.delete({
      where: {
        id,
      },
    });

    return cliente;
  }

  static async getAllCliente(body) {
    const { empresaId } = body;
    const cliente = await prisma.cliente.findMany({
      where:{
        empresaId,
      }
    });

    return cliente;
  }

  static async getCliente(id) {
    const cliente = await prisma.cliente.findUnique({
      where: {
        id,
      },
    });

    return cliente;
  }
}
