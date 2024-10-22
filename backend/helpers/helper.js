import prisma from "../prisma";

export async function generarCodigoGeneric(modelo, empresaId, prefijo) {
  let codigo = prefijo ?? "";

  // Buscar el último código generado en la tabla especificada
  const lastRow = await prisma[modelo].findFirst({
    orderBy: {
      codigo: "desc",
    },
    select: {
      codigo: true,
    },
    where: { empresaId },
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
      where: { empresaId },
    });
    codigo = "00" + (totalRows + 1);
  }

  return prefijo + codigo;
}
