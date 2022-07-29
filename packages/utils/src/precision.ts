export function precision(v: number, dot: number = 4) {
  return parseFloat(v.toPrecision(dot));
}
