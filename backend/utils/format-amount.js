import Dinero from "dinero.js";

export function formatAmount(amount, precision = 2) {
  const factor = Math.pow(10, precision);
  const roundedAmount = Math.round(amount * factor);

  return Dinero({ amount: roundedAmount, precision });
}
