export const parsePrice = (price: number): string => {
  // price Perú
  return price.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })
}
