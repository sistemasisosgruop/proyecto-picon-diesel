import prisma from "../prisma";

export async function generarCodigoGeneric(modelo, prefijo, whereFilter) {
  let codigo = prefijo ?? "";
  console.log(modelo, prefijo, whereFilter, "GENERAR CODIGO");
  // Buscar el último código generado en la tabla especificada
  const lastRow = await prisma[modelo].findFirst({
    orderBy: {
      codigo: "desc",
    },
    select: {
      codigo: true,
    },
    where: whereFilter,
  });
  console.log(lastRow, "lastRow");
  // Obtener los últimos 3 dígitos del código encontrado
  const ultimosTresDigitos = lastRow?.codigo?.slice(-3);

  // Si hay un código existente, incrementarlo
  if (lastRow && Number(ultimosTresDigitos)) {
    const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
    codigo = String(nextCodigo).padStart(3, "0");
  } else {
    const totalRows = await prisma[modelo].count({
      where: whereFilter,
    });
    codigo = "00" + (totalRows + 1);
  }

  return prefijo + codigo;
}

export async function generarNumeracionCorrelativoGeneric(modelo, prefijo, whereFilter) {
  let numero = prefijo ?? "";
  console.log(modelo, prefijo, whereFilter, "GENERAR CODIGO");
  // Buscar el último código generado en la tabla especificada
  const lastRow = await prisma[modelo].findFirst({
    orderBy: {
      numero: "desc",
    },
    select: {
      numero: true,
    },
    where: whereFilter,
  });
  console.log(lastRow, "lastRow");
  // Obtener los últimos 3 dígitos del código encontrado
  const ultimosTresDigitos = lastRow?.numero?.slice(-9);

  // Si hay un código existente, incrementarlo
  if (lastRow && Number(ultimosTresDigitos)) {
    const nextCodigo = parseInt(ultimosTresDigitos, 10) + 1;
    numero = String(nextCodigo).padStart(9, "0");
  } else {
    const totalRows = await prisma[modelo].count({
      where: whereFilter,
    });
    numero = "00000000" + (totalRows + 1);
  }

  return prefijo + numero;
}
