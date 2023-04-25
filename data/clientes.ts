import { TipoDocumentoEnum } from "@prisma/client";

export const clientes = [
  {
    codigo: "CLIE001",
    nombre: "Juan Perez",
    email: "cliente01@mail.com",
    telefono: "123456789",
    tipoDocumento: TipoDocumentoEnum.DNI,
    numeroDocumento: "12345678",
    empresaId: 1,
    tipoClienteId: 4
  },
  {
    codigo: "CLIE002",
    nombre: "Maria Perez",
    email: "cliente02@mail.com",
    telefono: "123456789",
    tipoDocumento: TipoDocumentoEnum.DNI,
    numeroDocumento: "12345678",
    empresaId: 1,
    tipoClienteId: 5
  },
  {
    codigo: "CLIE003",
    nombre: "Pedro Perez",
    email: "cliente03@mail.com",
    telefono: "123456789",
    tipoDocumento: TipoDocumentoEnum.RUC,
    numeroDocumento: "12345678",
    empresaId: 1,
    tipoClienteId: 6
  },
  {
    codigo: "CLIE004",
    nombre: "Luis Perez",
    email: "cliente04@mail.com",
    telefono: "123456789",
    tipoDocumento: TipoDocumentoEnum.RUC,
    numeroDocumento: "12345678",
    empresaId: 1,
    tipoClienteId: 4
  }
];
