import { TipoDocumentoEnum } from '@prisma/client';

export const agenciaDeTransporte = [
  {
    codigo: "AGT-001",
    nombre: "Agencia A",
    tipoDocumento: TipoDocumentoEnum.DNI,
    numeroDocumento: "23547689",
    direccion: "Dirección A",
    telefono: "123567894",
    email: "agenciaa@gmail.com",
    empresaId: 1
},
{
    codigo: "AGT-002",
    nombre: "Agencia B",
    tipoDocumento: TipoDocumentoEnum.DNI,
    numeroDocumento: "34567890",
    direccion: "Direccion B",
    telefono: "435678976",
    email: "agenciab@gmail.com",
    empresaId: 1
}
]

// export const agenciaDeTransporte = [
//   {
//     id: 1,
//     codigo: "AGT-001",
//     nombre: "Agencia 1",
//     tipoDocumento: "DNI",
//     numeroDocumento: "12345678",
//     telefono: "123456789",
//     correo: "agencia01",
//     direccion: "Av. 1",
//     estado: "Activo",
//   },
//   {
//     id: 2,
//     codigo: "AGT-002",
//     nombre: "Agencia 2",
//     tipoDocumento: "DNI",
//     numeroDocumento: "12345678",
//     telefono: "123456789",
//     correo: "agencia02",
//     direccion: "Av. 2",
//     estado: "Activo",
//   },
//   {
//     id: 3,
//     codigo: "AGT-003",
//     nombre: "Agencia 3",
//     tipoDocumento: "DNI",
//     numeroDocumento: "12345678",
//     telefono: "123456789",
//     correo: "agencia03",
//     direccion: "Av. 3",
//     estado: "Activo",
//   },
//   {
//     id: 4,
//     codigo: "AGT-004",
//     nombre: "Agencia 4",
//     tipoDocumento: "DNI",
//     numeroDocumento: "12345678",
//     telefono: "123456789",
//     correo: "agencia04",
//     direccion: "Av. 4",
//     estado: "Activo",
//   },
// ];
