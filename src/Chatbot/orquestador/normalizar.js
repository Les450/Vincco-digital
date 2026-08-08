/* Normaliza texto para poder compararlo.

   La gente escribe en el celular sin tildes y sin mayúsculas:
   "como gano puntos" tiene que encontrar "¿Cómo gano puntos?".

   Es la misma idea que ya usa la pantalla de Ayuda, extraída acá
   para que la use también Kiara y no haya dos versiones que se
   comporten distinto. */

const ACENTOS = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' }

export function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (c) => ACENTOS[c])
    .replace(/[¿?¡!.,;:()"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/* Palabras que no aportan nada al buscar. Si no se quitan, la
   pregunta "¿cómo hago una cotización?" coincide con cualquier
   entrada que diga "cómo" o "una", que son casi todas. */
const VACIAS = new Set([
  'a', 'ahi', 'ahora', 'al', 'algo', 'aqui', 'asi', 'como', 'con', 'cual',
  'cuales', 'cuando', 'cuanto', 'cuantos', 'cuantas', 'de', 'del', 'donde',
  'e', 'el', 'ella', 'ello', 'en', 'es', 'esa', 'esas', 'ese', 'eso', 'esos',
  'esta', 'este', 'esto', 'fue', 'hace', 'hacer', 'hago', 'hay', 'la', 'las',
  'le', 'lo', 'los', 'mas', 'me', 'mi', 'mis', 'muy', 'o', 'otra', 'otro',
  'para', 'pero', 'por', 'porque', 'que', 'quien', 'se', 'ser', 'si', 'sobre',
  'solo', 'son', 'su', 'sus', 'tambien', 'te', 'tengo', 'tiene', 'toda',
  'todo', 'tu', 'tus', 'un', 'una', 'unas', 'unos', 'usted', 'vos', 'y',
  'ya', 'yo',
])

// Corta la frase en palabras útiles. Descarta las de una sola
// letra porque nunca distinguen nada.
export function palabras(texto) {
  return normalizar(texto)
    .split(' ')
    .filter((p) => p.length > 1 && !VACIAS.has(p))
}
