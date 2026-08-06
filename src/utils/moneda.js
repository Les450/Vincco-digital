// Vincco opera en Nicaragua: TODO monto va en cordobas (NIO, simbolo C$).
// Nunca en dolares. Este helper existe para que ninguna pantalla vuelva a
// inventar su propio formato ni use un simbolo de otra moneda.
//
// Ojo con el simbolo "C$": fuera de Nicaragua se lee como dolar canadiense
// (y los traductores automaticos del navegador lo traducen asi). Por eso,
// en los montos grandes y destacados usamos la palabra completa
// "cordobas" con cordobasTexto(); el simbolo queda solo para precios
// cortos en linea, donde el contexto ya es claro.

export const MONEDA = {
  codigo: 'NIO',
  simbolo: 'C$',
  nombre: 'córdoba',
  nombrePlural: 'córdobas',
  // Icono que acompaña los montos. Ojo: no usar 'dollar-sign',
  // se lee como dolar y confunde al usuario nicaraguense.
  icono: 'wallet',
}

// Separador de miles fijo con coma. No se usa toLocaleString porque
// segun el navegador puede caer en un locale que separa con punto
// (1.240) y eso se confunde con decimales.
function separarMiles(entero) {
  return entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// numero(1240) -> "1,240"   |   numero(1240.5, 2) -> "1,240.50"
export function numero(valor, decimales = 0) {
  const n = Number(valor)
  if (!Number.isFinite(n)) return '0'

  const fijo = Math.abs(n).toFixed(decimales)
  const [entero, decimal] = fijo.split('.')
  const signo = n < 0 ? '-' : ''

  return `${signo}${separarMiles(entero)}${decimal ? `.${decimal}` : ''}`
}

// Forma larga, la que se muestra al usuario en montos destacados.
// cordobasTexto(1240) -> "1,240 córdobas"
// cordobasTexto(1)    -> "1 córdoba"
export function cordobasTexto(valor, { decimales = 0 } = {}) {
  const n = Number(valor)
  const palabra = Math.abs(n) === 1 ? MONEDA.nombre : MONEDA.nombrePlural
  return `${numero(valor, decimales)} ${palabra}`
}

// Forma corta con simbolo, para precios en linea dentro de listas.
// cordobas(1240) -> "C$1,240"
export function cordobas(valor, { decimales = 0, conEspacio = false } = {}) {
  return `${MONEDA.simbolo}${conEspacio ? ' ' : ''}${numero(valor, decimales)}`
}

export default cordobasTexto
