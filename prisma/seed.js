const { PrismaClient, RolesEnum } = require("@prisma/client");
const {
  randBrand,
  randStreetAddress,
  randPhoneNumber,
  randEmail,
  randUrl,
  randFirstName,
  randLastName,
  randSeatNumber,
  randCity,
} = require("@ngneat/falso");
const { hashSync } = require("bcrypt");
const { DateTime } = require("luxon");
const { EnumTipoCliente } = require("../backend/utils/enums");

const prisma = new PrismaClient();
const rucs = ["1000001", "1000002", "1000003"];

async function main() {
  const startTime = DateTime.now().toSeconds();
  console.log("start to create seeds...");
  const empresas = await createEmpresas();
  const sucursales = empresas.flatMap(({ sucursales }) => sucursales);
  const roles = await createRoles();
  const adminUser = await createAdminUser();
  const vendedores = await createVendedores();
  const tipoClientes = await createTipoCliente();
  console.log({
    roles,
    empresas,
    sucursales,
    adminUser,
    vendedores,
    tipoClientes,
  });
  console.log(
    `seeds created successfully on ${(
      DateTime.now().toSeconds() - startTime
    ).toFixed(2)} seconds`
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

function createAdminUser() {
  const user = "admin@admin.com";
  const password = hashSync("admin", 10);
  return createUser(user, password, RolesEnum.Administrador, rucs[0]);
}

async function createTipoCliente() {
  const tipoClientes = [
    EnumTipoCliente.ciente,
    EnumTipoCliente.proveedor,
    EnumTipoCliente.cienteProveedor,
  ];
  const tipoClienteTasks = tipoClientes.map(async (tipoCliente) => {
    return await prisma.tipoCliente.upsert({
      where: { tipo: tipoCliente },
      create: {
        tipo: tipoCliente,
        empresa: {
          connect: {
            id: 1,
          },
        },
      },
      update: {
        tipo: tipoCliente,
        empresa: {
          connect: {
            id: 1,
          },
        },
      },
    });
  });
  return await Promise.all(tipoClienteTasks);
}

async function createVendedores() {
  const users = [
    {
      username: "vendedor1@admin.com",
      password: hashSync("vendedor1", 10),
      name: `${randFirstName()} ${randLastName()} ${randLastName()}`,
    },
    {
      username: "vendedor2@admin.com",
      password: hashSync("vendedor2", 10),
      name: `${randFirstName()} ${randLastName()} ${randLastName()}`,
    },
  ];

  const userTasks = users.map(async ({ username, password, name }) => {
    return createVendedor(
      username,
      password,
      RolesEnum.Vendedor,
      rucs[0],
      name
    );
  });

  return await Promise.all(userTasks);
}
async function createEmpresas() {
  const empresasTasks = rucs.map(async (ruc, index) => {
    const empresa = await createEmpresa(ruc, index);
    const sucursales = await prisma.sucursal.findMany({
      where: {
        empresaId: empresa.id,
      },
    });

    if (sucursales.length >= 3) {
      return empresa;
    }
    for (let i = 1; i <= 3; i++) {
      await createSucursal(empresa.id, i);
    }

    return await prisma.empresa.findUnique({
      where: { id: empresa.id },
      include: { sucursales: true },
    });
  });

  return await Promise.all(empresasTasks);
}

function createRoles() {
  const roles = [
    RolesEnum.Administrador,
    RolesEnum.Vendedor,
    RolesEnum.Tecnico,
  ];
  const roleTasks = roles.map(async (role) => {
    return prisma.role.upsert({
      where: { name: role },
      create: { name: role },
      update: { name: role },
    });
  });
  return Promise.all(roleTasks);
}

async function createUser(email, password, role, ruc) {
  return prisma.personal.upsert({
    where: { email },
    create: {
      puesto: "CTO",
      nombre: "Victor Benavente",
      email,
      password,
      telefono: randPhoneNumber({ countryCode: "PE" }),
      direccion: randStreetAddress(),
      empresa: {
        connect: rucs.map((ruc) => ({ ruc })),
      },
      role: {
        connect: {
          name: role,
        },
      },
    },
    update: {
      puesto: "CTO",
      nombre: "Victor Benavente",
      email,
      password,
      telefono: randPhoneNumber({ countryCode: "PE" }),
      direccion: randStreetAddress(),
      empresa: {
        connect: rucs.map((ruc) => ({ ruc })),
      },
      role: {
        connect: {
          name: role,
        },
      },
    },
    include: {
      empresa: true,
      role: true,
    },
  });
}

async function createVendedor(email, password, role, ruc, nombre) {
  return prisma.vendedor.upsert({
    where: { email },
    create: {
      aprovacionCotizacion: true,
      comision: 0.1,
      nombre,
      email,
      password,
      telefono: randPhoneNumber({ countryCode: "PE" }),
      direccion: randStreetAddress(),
      empresa: {
        connect: {
          id: 1,
        },
      },
      role: {
        connect: {
          name: role,
        },
      },
    },
    update: {
      aprovacionCotizacion: true,
      comision: 0.1,
      nombre,
      email,
      password,
      telefono: randPhoneNumber({ countryCode: "PE" }),
      direccion: randStreetAddress(),
      empresa: {
        connect: {
          id: 1,
        },
      },
      role: {
        connect: {
          name: role,
        },
      },
    },
    include: {
      empresa: true,
      role: true,
    },
  });
}

function createEmpresa(ruc, index) {
  return prisma.empresa.upsert({
    where: { ruc },
    create: {
      ruc,
      nombre: randBrand(),
      codigo: `000${randSeatNumber()}${index + 1}`,
      direccion: randStreetAddress(),
      telefono: randPhoneNumber({ countryCode: "PE" }),
      email: randEmail(),
      web: randUrl(),
    },
    update: {
      ruc,
      codigo: `000${randSeatNumber({ length: 3 })}${index + 1}`,
      nombre: randBrand(),
      direccion: randStreetAddress(),
      telefono: randPhoneNumber({ countryCode: "PE" }),
      email: randEmail(),
      web: randUrl(),
    },
    include: {
      sucursales: true,
    },
  });
}

async function createSucursal(empresaId, index) {
  return prisma.sucursal.create({
    data: {
      nombre: `${randCity()} ${randBrand()}`,
      codigo: `000${randSeatNumber()}${index + 1}`,
      direccion: randStreetAddress(),
      telefono: randPhoneNumber({ countryCode: "PE" }),
      email: randEmail(),
      empresaId,
    },
  });
}
