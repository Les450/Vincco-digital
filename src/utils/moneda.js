// Vincco opera en Nicaragua: TODO monto se guarda y se piensa en
// cordobas (NIO). Este helper existe para que ninguna pantalla vuelva
// a inventar su propio formato ni use un simbolo de otra moneda.
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

// Tipo de cambio fijo: cuantos cordobas vale 1 dolar. Se actualiza a
// mano hasta que exista un feed de tasa de cambio del dia (ver
// GRUPO_REGION en data/config_opciones.js). Solo se usa para MOSTRAR
// un monto en dolares cuando el usuario eligio esa moneda en
// Configuraciones: lo que se guarda siempre son cordobas.
export const TIPO_CAMBIO_USD = 36.6

const DIVISAS = {
  NIO: MONEDA,
  USD: { codigo: 'USD', simbolo: 'US$', nombre: 'dólar', nombrePlural: 'dólares' },
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

// El valor de entrada siempre esta en cordobas; esto solo lo convierte
// para mostrarlo si la moneda pedida es USD.
function convertir(valorEnCordobas, moneda) {
  const n = Number(valorEnCordobas) || 0
  return moneda === 'USD' ? n / TIPO_CAMBIO_USD : n
}

// Forma larga, la que se muestra al usuario en montos destacados.
// cordobasTexto(1240) -> "1,240 córdobas"
// cordobasTexto(1240, { moneda: 'USD' }) -> "33.88 dólares"
export function cordobasTexto(valorEnCordobas, { decimales, moneda = 'NIO' } = {}) {
  const divisa = DIVISAS[moneda] || DIVISAS.NIO
  const convertido = convertir(valorEnCordobas, moneda)
  const decimalesFinal = decimales ?? (moneda === 'USD' ? 2 : 0)
  const palabra = Math.abs(convertido) === 1 ? divisa.nombre : divisa.nombrePlural
  return `${numero(convertido, decimalesFinal)} ${palabra}`
}

// Forma corta con simbolo, para precios en linea dentro de listas.
// cordobas(1240) -> "C$1,240"
// cordobas(1240, { moneda: 'USD' }) -> "US$33.88"
export function cordobas(valorEnCordobas, { decimales, conEspacio = false, moneda = 'NIO' } = {}) {
  const divisa = DIVISAS[moneda] || DIVISAS.NIO
  const convertido = convertir(valorEnCordobas, moneda)
  const decimalesFinal = decimales ?? (moneda === 'USD' ? 2 : 0)
  return `${divisa.simbolo}${conEspacio ? ' ' : ''}${numero(convertido, decimalesFinal)}`
}

export default cordobasTexto
