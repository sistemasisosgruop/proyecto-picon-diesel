import prisma from '../../../prisma';
import { generateCodeMaquina } from '../../../utils/codes';

export class MaquinaService {
  static async createMaquina(data) {
    const { empresaId, numeroCilindros, ...props } = data;
    console.log(data, 'CREATE DATA MAQUINA');
    try {
      const newMaquinaCreate = {
        codigo: '01',
        fabricaMaquinaId: 1,
        modeloMaquinaId: 1,
        nombreMaquinaId: 2,
        paisId: 1,
        codigoOriginal: 'cod originar motor',
        modeloMotor: 'modelo motor',
        marcaMotorId: 1,
        motorPaisId: 1,
        codigoFabricaBombaInyeccion: 'cod fabrica',
        tipoBombaInyeccion: 'bomba inyeccion',
        marcaFabricaSistemaInyeccionId: 2,
        descripcionBombaInyeccionId: 2,
        bombaInyeccionPaisId: 1,
        codigoOriginalBombaInyeccion: 'cort original bomba inyeccion',
        codigoFabricaInyector: 'fab',
        tipoFabricaInyector: 'tipo fabrica',
        marcaFabricaInyectorId: 1,
        descripcionInyectorId: 1,
        inyectorPaisId: 1,
        codigoOriginalInyector: 'codigo original inyector',
        codigoTobera: 'codigo tobera',
        tipoTobera: 'tipo tobera',
        codigoOriginalTobera: 'codigo original',
        numeroCilindros: 2,
        empresaId: 2,
      };
      console.log(newMaquinaCreate, 'newMaquinaCreate');
      const maquina = await prisma.maquina.create({
        data: newMaquinaCreate,
      });

      const newMaquina = await prisma.maquina.update({
        where: {
          id: maquina.id,
        },
        data: {
          codigo: generateCodeMaquina(maquina.id),
        },
      });

      return newMaquina;
    } catch (error) {
      console.log(error);
    }
  }

  static async updateMaquina(id, data) {
    const maquina = await prisma.maquina.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return maquina;
  }

  static async deleteMaquina(id) {
    const maquina = await prisma.maquina.delete({
      where: {
        id,
      },
    });

    return maquina;
  }

  static async getMaquinas(empresaId, filterName) {
    return prisma.maquina.findMany({
      where: {
        empresaId,
        ...(filterName && {
          OR: [
            {
              codigo: {
                contains: filterName,
              },
            },
            {
              codigoOriginal: {
                contains: filterName,
              },
            },
            {
              modeloMotor: {
                contains: filterName,
              },
            },
            {
              fabricaMaquina: {
                codigo: {
                  contains: filterName,
                },
              },
            },
            {
              codigoFabricaBombaInyeccion: {
                contains: filterName,
              },
            },
            {
              codigoFabricaInyector: {
                contains: filterName,
              },
            },
          ],
        }),
      },
      include: {
        fabricaMaquina: {
          select: {
            fabrica: true,
          },
        },
        procedencia: {
          select: {
            nombre: true,
          },
        },
        marcaFabricaInyector: {
          select: {
            marca: true,
          },
        },
        marcaFabricaSistemaInyeccion: {
          select: {
            marca: true,
          },
        },
        descripcionBombaInyeccion: {
          select: {
            descripcion: true,
          },
        },
        descripcionInyector: {
          select: {
            descripcion: true,
          },
        },
        procedenciaBombaInyeccion: {
          select: {
            nombre: true,
          },
        },
        procedenciaInyector: {
          select: {
            nombre: true,
          },
        },
        marcaMotor: {
          select: {
            marca: true,
          },
        },
        modeloMaquina: {
          select: {
            modelo: true,
          },
        },
        nombreMaquina: {
          select: {
            nombre: true,
          },
        },
        procedenciaMotor: {
          select: {
            nombre: true,
          },
        },
      },
    });
  }

  static async getMaquina(id) {
    const maquina = await prisma.maquina.findUnique({
      where: {
        id,
      },
    });

    return maquina;
  }
}
