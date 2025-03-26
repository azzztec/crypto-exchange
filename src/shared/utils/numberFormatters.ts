export const toFixed = (value: number, to: number = 6): number => {
  return parseFloat(value.toFixed(to))
}
