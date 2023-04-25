export function generateCode(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `000${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `00${currentNumber}`;
  }

  if (currentNumber >= 100 && currentNumber < 1000) {
    return `0${currentNumber}`;
  }

  return String(number);
}

export function generateCodeTipoCliente(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `TIP00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `TIP0${currentNumber}`;
  }

  return `TIP${currentNumber}`;
}

export function generateCodeCliente(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `CLIE00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `CLIE0${currentNumber}`;
  }

  return `CLIE${currentNumber}`;
}

export function generateCodeCostos(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `CC00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `C0${currentNumber}`;
  }

  return `C${currentNumber}`;
}

export function generateCodeBanco(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `BAN00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `BAN0${currentNumber}`;
  }

  return `BAN${currentNumber}`;
}

export function generateCodeCuentaBancaria(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `CUEN00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `CUEN0${currentNumber}`;
  }

  return `CUEN${currentNumber}`;
}

export function generateCodeAgenteAduanas(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `AGEN00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `AGEN0${currentNumber}`;
  }

  return `AGEN${currentNumber}`;
}

export function generateCodeTipoVia(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `VIA00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `VIA0${currentNumber}`;
  }

  return `VIA${currentNumber}`;
}

export function generateCodeGastoImportacion(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `GAS00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `GAS0${currentNumber}`;
  }

  return `GAS${currentNumber}`;
}

export function generateFactorInternamiento(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `FAC00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `FAC0${currentNumber}`;
  }

  return `FAC${currentNumber}`;
}

export function generateCodeMaquina(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `MAC00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `MAC0${currentNumber}`;
  }

  return `MAC${currentNumber}`;
}

export function generateCodeAlmacen(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `ALM-00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `ALM-0${currentNumber}`;
  }

  return `ALM-${currentNumber}`;
}

export function generateCodeMotivoMovimientoAlmacen(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `MMA-00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `MMA-0${currentNumber}`;
  }

  return `MMA-${currentNumber}`;
}

export function generateCodeAgenciaTransportes(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `AGT-00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `AGT-0${currentNumber}`;
  }

  return `AGT-${currentNumber}`;
}

export function generateCodeVehiculo(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `VH-00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `VH-0${currentNumber}`;
  }

  return `VH-${currentNumber}`;
}

export function generateCodeChofer(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `CHF-00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `CHF-0${currentNumber}`;
  }

  return `CHF-${currentNumber}`;
}

export function generateCodeTipoCambio(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `CAMB00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `CAMB0${currentNumber}`;
  }

  return `CAMB${currentNumber}`;
}

export function generateCodeFormaDePago(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `00${currentNumber}`;
  }

  return `${currentNumber}`;
}

export function generateCodeTrasladoGuiaRemision(number) {
  const currentNumber = Number(number);

  return `0${currentNumber}`;
}

export function generateCodePresupuestoMaterial(number) {
  const currentNumber = Number(number);
  if (currentNumber < 10) {
    return `MAT00${currentNumber}`;
  }

  if (currentNumber >= 10 && currentNumber < 100) {
    return `MAT0${currentNumber}`;
  }

  return `MAT${currentNumber}`;
}

export function generateGenericCode(prefijo, id) {
  const currentId = Number(id);
  if(currentId < 10){
    return `${prefijo}-00${currentId}`;
  } else if (currentId >=10 && currentId < 100){
    return `${prefijo}-0${currentId}`;
  }
  return `${prefijo}-${currentId}`;
}