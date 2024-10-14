import prisma from "../../prisma";
import { generateCodeCliente, generateCodeTipoCliente } from "../../utils/codes";

export class ClienteService {
  static async createTipoCliente(data) {
    const { tipo, empresaId } = data;
    const tipoCliente = await prisma.tipoCliente.create({
      data: {
        tipo,
        empresaId,
      },
    });

    const result = prisma.tipoCliente.update({
      where: {
        id: tipoCliente.id,
      },
      data: {
        codigo: generateCodeTipoCliente(tipoCliente.id),
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

  static async getAllTipoCliente(empresaId) {
    const tipoCliente = await prisma.tipoCliente.findMany({
      where: {
        empresaId,
      },
    });

    return tipoCliente;
  }

  static async getTipoCliente(id) {
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
      formaPago,
      email,
      empresaId,
      paisId,
      trabajadores,
    } = data;
    console.log(data, "DATA CLIENTES");
    const formatTrabajadores = [];
    if (trabajadores && trabajadores.length > 0) {
      for (const trabador of trabajadores) {
        formatTrabajadores.push({
          nombreTrabajador: trabador.nombreTrabajador,
          cargo: trabador.cargo,
          dni: trabador.dni,
          correo: trabador.correo,
          telefono: trabador.telefono,
          nroLicencia: trabador.nroLicencia,
          placa: trabador.placa,
          envioCorreo: trabador.envioCorreo,
          transportista: trabador.transportista,
        });
      }
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        tipoDocumento,
        numeroDocumento,
        telefono,
        formaPago,
        email,
        empresaId,
        tipoClienteId,
        paisId,
        trabajadores: formatTrabajadores,
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
      formaPago,
      telefono,
      email,
      trabajadores,
    } = data;

    const formatTrabajadores = [];
    if (trabajadores && trabajadores.length > 0) {
      for (const trabador of trabajadores) {
        formatTrabajadores.push({
          nombreTrabajador: trabador.nombreTrabajador,
          cargo: trabador.cargo,
          dni: trabador.dni,
          correo: trabador.correo,
          telefono: trabador.telefono,
          nroLicencia: trabador.nroLicencia,
          placa: trabador.placa,
          envioCorreo: trabador.envioCorreo,
          transportista: trabador.transportista,
        });
      }
    }
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
        formaPago,
        email,
        trabajadores: formatTrabajadores,
      },
    });

    return cliente;
  }

  static async deleteCliente(id) {
    const cliente = prisma.cliente.update({
      where: {
        id,
      },
      data: {
        estado: "Inactivo",
      },
    });

    return cliente;
  }

  static async getClientes(empresaId, filterName) {
    const cliente = await prisma.cliente.findMany({
      where: {
        empresaId,
        estado: "Activo",
        ...(filterName && {
          OR: [
            {
              nombre: {
                contains: filterName,
              },
            },
            {
              codigo: {
                contains: filterName,
              },
            },
            {
              numeroDocumento: {
                contains: filterName,
              },
            },
            {
              telefono: {
                contains: filterName,
              },
            },
          ],
        }),
      },
      include: {
        tipoCliente: true,
      },
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
