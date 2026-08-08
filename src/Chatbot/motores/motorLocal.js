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

  // La función está documentada pero todavía no existe en la app.
  // Se dice claramente en vez de explicar pasos imposibles.
  if (entrada.pendiente) {
    return crearRespuesta({
      texto: `${entrada.resumen} Es una función que todavía no está disponible en Vincco.`,
      nota: entrada.nota,
      ruta: entrada.ruta,
      rutaLabel: entrada.rutaLabel,
      sugerencias: armarSugerencias(fragmentos),
      fuente: entrada.id,
    })
  }

  return crearRespuesta({
    texto: entrada.resumen,
    pasos: entrada.pasos?.length ? entrada.pasos : null,
    ruta: entrada.ruta || null,
    rutaLabel: entrada.rutaLabel || null,
    nota: entrada.nota || null,
    sugerencias: armarSugerencias(fragmentos),
    fuente: entrada.id,
  })
}

const motorLocal = { nombre, responder }
export default motorLocal
