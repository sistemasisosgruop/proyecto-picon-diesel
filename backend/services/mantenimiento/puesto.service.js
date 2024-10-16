import prisma from "../../prisma.js";

export class PuestoService {
  static async createPuesto(data) {
    const { nombre, permisos } = data;
    console.log(data, " crear puesto");
    const validarNombre = await prisma.puesto.findFirst({
      where: { nombre: nombre.toUpperCase() },
    });
    if (validarNombre) {
      throw new Error("El nombre ya existe. Intenta con otro.");
    }
    const newPuesto = await prisma.puesto.create({ data: { nombre: nombre.toUpperCase() } });

    const newPermisos = [];
    if (permisos && permisos.legth > 0) {
      for (const permiso of permisos) {
        newPermisos.push({
          puestoId: newPuesto.id,
          submoduloId: permiso.submoduloId,
          crear: permiso.crear,
          leer: permiso.leer,
          actualizar: permiso.actualizar,
          eliminar: permiso.eliminar,
        });
      }
    }

    await prisma.permiso.createMany({ data: newPermisos });
    // const transaction = await prisma.$transaction([createPermisos]);
    return newPuesto;
  }

  static async updatePuesto(puestoId, puesto) {
    const { nombre, permisos } = puesto;
    console.log(puesto, "DATA UPDATE");
    const validarNombre = await prisma.puesto.findFirst({
      where: { nombre: nombre.toUpperCase(), id: { not: puestoId } },
    });

    if (validarNombre) {
      throw new Error("El nombre ya existe. Intenta con otro.");
    }

    const newPermisos = [];
    if (permisos && permisos.length > 0) {
      for (const permiso of permisos) {
        newPermisos.push({
          puestoId: Number(puestoId),
          submoduloId: Number(permiso.submoduloId),
          crear: permiso.crear,
          leer: permiso.leer,
          actualizar: permiso.actualizar,
          eliminar: permiso.eliminar,
        });
      }
    }
    console.log(puestoId, "PUESTO ");
    console.log(newPermisos, "PERMISOS");
    const createPermisos = prisma.permiso.createMany({ data: newPermisos });
    const delteOldPermisos = prisma.permiso.deleteMany({ where: { puestoId: Number(puestoId) } });
    await prisma.$transaction([delteOldPermisos, createPermisos]);
    return await prisma.puesto.update({
      data: { nombre: nombre.toUpperCase() },
      where: {
        id: puestoId,
      },
    });
  }

  static async getPuestos(queryParams) {
    // const { empresaId } = queryParams;
    const data = await prisma.puesto.findMany({
      include: {
        permisos: {
          include: {
            submodulo: {
              include: {
                modulo: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return data;
  }

  static async deletePuesto(puestoId) {
    return await prisma.puesto.delete({
      where: {
        id: puestoId,
      },
    });
  }
}
