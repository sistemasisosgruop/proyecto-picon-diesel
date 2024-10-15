import prisma from "../../prisma";
// import { generateCodeAgenteAduanas } from "../../utils/codes";

export class AgenteAduanasService {
  static async createAgenteAduanas(data) {
    const { nombre, observaciones, telefono, email, empresaId } = data;
    const agente = await prisma.agenteAduanas.create({
      data: {
        codigo: await this.generarCodigo(empresaId),
        nombre,
        observaciones,
        telefono,
        email,
        empresaId,
      },
    });

    // const result = prisma.agenteAduanas.update({
    //   where: {
    //     id: agente.id,
    //   },
    //   data: {
    //     codigo: generateCodeAgenteAduanas(agente.id),
    //   },
    // });

    return agente;
  }

  static async updateAgenteAduanas(id, data) {
    const { nombre, observaciones, telefono, email } = data;
    const result = prisma.agenteAduanas.update({
      where: {
        id,
      },
      data: {
        nombre,
        observaciones,
        telefono,
        email,
      },
    });

    return result;
  }

  static async deleteAgenteAduanas(id) {
    const result = prisma.agenteAduanas.delete({
      where: {
        id,
      },
    });

    return result;
  }

  static async getAgenteAduanas(id) {
    const result = prisma.agenteAduanas.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  static async getAgentesAduanas(body) {
    const { empresaId } = body;
    const result = await prisma.agenteAduanas.findMany({
      where: {
        empresaId,
      },
    });

    return result;
  }

  static async generarCodigo(empresaId) {
    const prefijo = "AGEN";
    let codigo;

    const lastRow = await prisma.agenteAduanas.findFirst({
      orderBy: {
        codigo: "desc",
      },
      select: {
        codigo: true,
      },
      where: { empresaId },
    });

    if (lastRow) {
      const ultimosTresDigitos = lastRow.codigo.slice(-3);
      const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
      codigo = String(nextCodigo).padStart(3, "0");
    } else {
      codigo = "001";
    }
    return prefijo + codigo;
  }
}
