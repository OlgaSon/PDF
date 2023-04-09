export const roundToDecimal = (
  numberToRound: number,
  decimalPlaces: number = 3
): number => parseFloat(numberToRound.toFixed(decimalPlaces));
