import { crearRespuesta } from './tipos'

/* ══════════════════════════════════════════════════════════════
   MOTOR LOCAL

   Arma la respuesta a partir de lo que la capa de conocimiento
   encontró en la guía de usuario. No genera texto: reordena y
   presenta lo que ya está escrito.

   Esa limitación es su mayor virtud. Un motor que no genera texto
   NO PUEDE inventar funciones que no existen, que es exactamente
   lo que hay que evitar en un asistente que le enseña la app a
   gente con poca experiencia digital.

   Funciona sin internet, sin llave de API y sin costo.
   ══════════════════════════════════════════════════════════════ */

export const nombre = 'local'

// Cuando encuentra una entrada, ofrece las otras que también
// coincidieron: casi siempre son la pregunta que sigue.
function armarSugerencias(fragmentos) {
  return fragmentos.slice(1, 4).map((f) => f.entrada.titulo)
}

/* Convierte UNA entrada ya resuelta (por búsqueda o por id) en la
   Respuesta que ve la interfaz. La usan responder() y
   responderPorEntrada(): las dos formas de llegar a una entrada
   terminan armando la respuesta exactamente igual.

   origenMenu: el id del menú del que salió esta entrada, si vino de
   tocar una opción. Se lo lleva la respuesta como "volverA" para que
   la interfaz pueda dibujar el botón de volver. */
function armarRespuestaDeEntrada(entrada, { sugerencias = [], origenMenu = null } = {}) {
  // Menú: no se contesta de una, se ofrecen las ramas como botones.
  if (entrada.tipo === 'menu') {
    return crearRespuesta({
      texto: entrada.resumen,
      opciones: entrada.opciones,
      fuente: entrada.id,
    })
  }

  // La función está documentada pero todavía no existe en la app.
  // Se dice claramente en vez de explicar pasos imposibles.
  if (entrada.pendiente) {
    return crearRespuesta({
      texto: `${entrada.resumen} Es una función que todavía no está disponible en Vincco.`,
      nota: entrada.nota,
      ruta: entrada.ruta,
      rutaLabel: entrada.rutaLabel,
      sugerencias,
      volverA: origenMenu,
      fuente: entrada.id,
    })
  }

  return crearRespuesta({
    texto: entrada.resumen,
    pasos: entrada.pasos?.length ? entrada.pasos : null,
    ruta: entrada.ruta || null,
    rutaLabel: entrada.rutaLabel || null,
    nota: entrada.nota || null,
    sugerencias,
    volverA: origenMenu,
    fuente: entrada.id,
  })
}

export async function responder(pregunta, contexto) {
  const { fragmentos = [] } = contexto

  // Sin fragmentos no hay respuesta. No se improvisa.
  if (!fragmentos.length) {
    return crearRespuesta({
      texto:
        'Eso todavía no está en la guía de usuario, así que prefiero no inventarte una respuesta. ' +
        'Podés escribirle a soporte desde el Centro de ayuda.',
      ruta: '/ayuda',
      rutaLabel: 'Centro de ayuda',
      seguro: false,
    })
  }

  const { entrada } = fragmentos[0]
  return armarRespuestaDeEntrada(entrada, { sugerencias: armarSugerencias(fragmentos) })
}

/* Entra directo a UNA entrada ya elegida, sin buscar: así llega
   Kiara cuando el usuario toca una opción de un menú en vez de
   escribir. Puede devolver otro menú (submenú) o una respuesta
   final; a la interfaz le da igual, arma lo que le llegue. */
export async function responderPorEntrada(entrada, contexto = {}) {
  const { origenMenu = null } = contexto

  if (!entrada) {
    return crearRespuesta({
      texto: 'Esa opción ya no está disponible. Preguntame de nuevo y te ayudo.',
      seguro: false,
    })
  }

  return armarRespuestaDeEntrada(entrada, { origenMenu })
}

const motorLocal = { nombre, responder, responderPorEntrada }
export default motorLocal
