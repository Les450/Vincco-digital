import { entradasDelRol, entradaPorId } from './guia_generada'
import { guia, precargarGuia, origenGuia } from './cargarGuia'
import { normalizar, palabras } from '../orquestador/normalizar'

export { precargarGuia, origenGuia }

/* ══════════════════════════════════════════════════════════════
   CAPA DE CONOCIMIENTO

   Es la ÚNICA puerta por la que Kiara accede a información.
   Hoy adentro busca por palabras clave dentro de la guía de
   usuario. El día que se quiera usar una base vectorial (RAG),
   se cambia el interior de buscar() y nada más se entera: ni el
   orquestador ni la interfaz.

   Por eso buscar() devuelve siempre la misma forma:
     [{ entrada, puntaje }]  ordenado de mejor a peor
   ══════════════════════════════════════════════════════════════ */

// Un resultado tiene que superar esto para considerarse una
// respuesta. Debajo del umbral Kiara prefiere decir que no sabe
// antes que responder cualquier cosa: una respuesta errada hace
// más daño que un "no lo sé".
export const UMBRAL = 2

/* Cuánto vale coincidir en cada parte de la entrada.
   Las claves pesan más que el resumen porque son las palabras
   que alguien escribiría de verdad al preguntar. */
const PESO = {
  claveExacta: 6,
  clave: 3,
  titulo: 2,
  resumen: 1,
  seccion: 1,
}

/* Qué parte de la pregunta tiene que quedar explicada para que la
   respuesta se considere buena. Con 0.5, "cómo edito mi inventario"
   no se conforma con una entrada que solo entendió "edito".

   Sin esta regla pasaba algo feo: un cliente preguntaba por el
   inventario (que no tiene) y, como la palabra "edito" coincidía
   con "¿Cómo edito mi perfil?", Kiara le contestaba del perfil.
   Una respuesta que no es la pregunta es peor que un "no lo sé". */
const COBERTURA_MINIMA = 0.5

function puntuar(entrada, consulta) {
  const consultaN = normalizar(consulta)
  const terminos = palabras(consulta)
  const vacio = { puntaje: 0, cobertura: 0, tocoClave: false }
  if (!terminos.length) return vacio

  let puntaje = 0
  let tocoClave = false

  // La clave completa aparece tal cual en la pregunta:
  // "ganar puntos" dentro de "como hago para ganar puntos"
  entrada.claves.forEach((clave) => {
    const claveN = normalizar(clave)
    if (claveN.includes(' ') && consultaN.includes(claveN)) {
      puntaje += PESO.claveExacta
      tocoClave = true
    }
  })

  const tituloP = palabras(entrada.titulo)
  const resumenP = palabras(entrada.resumen)
  const clavesP = entrada.claves.flatMap((c) => palabras(c))
  const seccionP = palabras(entrada.seccion.replace(/-/g, ' '))

  // Cuántas palabras distintas de la pregunta quedaron explicadas
  const acertados = new Set()

  terminos.forEach((t) => {
    let acerto = false
    if (clavesP.includes(t)) { puntaje += PESO.clave; tocoClave = true; acerto = true }
    if (tituloP.includes(t)) { puntaje += PESO.titulo; acerto = true }
    if (resumenP.includes(t)) { puntaje += PESO.resumen; acerto = true }
    if (seccionP.includes(t)) { puntaje += PESO.seccion; acerto = true }
    if (acerto) acertados.add(t)
  })

  return { puntaje, cobertura: acertados.size / terminos.length, tocoClave }
}

/* Una coincidencia sirve si:
     - entendió TODA la pregunta, o
     - tocó una palabra clave y entendió al menos la mitad
   Si no, se descarta aunque el puntaje sea alto. */
function esRelevante({ puntaje, cobertura, tocoClave }) {
  if (puntaje < UMBRAL) return false
  if (cobertura >= 1) return true
  return tocoClave && cobertura >= COBERTURA_MINIMA
}

/* Busca en la guía. El rol filtra antes de puntuar: a un cliente
   no tiene sentido devolverle cómo editar inventario, porque no
   tiene inventario. */
export function buscar(consulta, { rol = 'usuario', limite = 3 } = {}) {
  // guia() devuelve la versión en vivo si ya se descargó, y la
  // incorporada mientras tanto. La búsqueda no espera nunca.
  const candidatas = entradasDelRol(rol, guia().entradas)

  return candidatas
    .map((entrada) => ({ entrada, ...puntuar(entrada, consulta) }))
    .filter(esRelevante)
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, limite)
}

/* Preguntas que se le ofrecen al usuario cuando abre el chat sin
   saber qué preguntar. Salen de la propia guía, así que si mañana
   se agregan entradas nuevas, las sugerencias se actualizan solas. */
export function sugerenciasIniciales(rol, cantidad = 4) {
  const entradas = entradasDelRol(rol, guia().entradas)
  const preferidas = {
    usuario: ['ganar-puntos', 'canjear-recompensas', 'favoritos', 'editar-perfil'],
    negocio: ['publicar-producto', 'editar-inventario', 'puntos-que-doy', 'ranking'],
    proveedor: ['responder-cotizacion', 'zona-cobertura', 'vitrina-clientes', 'ranking'],
  }

  const ids = preferidas[rol] || preferidas.usuario
  const elegidas = ids
    .map((id) => entradas.find((e) => e.id === id))
    .filter(Boolean)

  // Si alguna de las preferidas no existe, se completa con lo
  // primero que haya, para que el chat nunca abra vacío
  const resto = entradas.filter((e) => !elegidas.includes(e))
  return [...elegidas, ...resto].slice(0, cantidad).map((e) => e.titulo)
}

/* Cuántas entradas conoce Kiara. Se muestra en la pantalla de la
   guía para que se note cuando la base crece. */
export function tamanoBase(rol) {
  return entradasDelRol(rol, guia().entradas).length
}

/* Trae UNA entrada por su id, sin buscar por texto. Así llega Kiara
   cuando el usuario toca una opción de un menú en vez de escribir.
   Respeta el rol igual que buscar(): si la entrada no es para ese
   rol, es como si no existiera. */
export function obtenerPorId(id, rol = 'usuario') {
  const entrada = entradaPorId(id, guia().entradas)
  if (!entrada || !entrada.roles.includes(rol)) return null
  return entrada
}
