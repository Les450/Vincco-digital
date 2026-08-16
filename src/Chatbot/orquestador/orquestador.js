import { buscar, sugerenciasIniciales, obtenerPorId } from '../conocimiento'
import { evaluarAlcance, MOTIVO } from './alcance'
import { crearRespuesta } from '../motores/tipos'
import motorLocal from '../motores/motorLocal'

/* ══════════════════════════════════════════════════════════════
   ORQUESTADOR

   Es la única puerta de entrada de Kiara. La interfaz llama a
   preguntar() y no sabe nada más: no sabe qué motor hay, ni de
   dónde sale el conocimiento, ni cómo se filtra el alcance.

   El recorrido de una pregunta es SIEMPRE el mismo:

     1. ¿Es sobre Vincco?        -> alcance.js
     2. Buscar en la guía        -> conocimiento/index.js
     3. Armar la respuesta       -> motor activo
     4. Devolver

   Ese orden no cambia nunca, sea cual sea la pregunta y sea cual
   sea el motor. Es lo que hace que Kiara sea predecible.
   ══════════════════════════════════════════════════════════════ */

/* EL MOTOR ACTIVO.
   Para pasar al motor remoto cuando exista backend, se cambia
   esta línea y nada más en toda la aplicación. */
const motor = motorLocal

// Cuántos turnos recuerda dentro de una conversación. Es memoria
// corta a propósito: alcanza para entender un "¿y cómo lo edito?"
// después de una pregunta, y no crece sin control.
export const TURNOS_MEMORIA = 6

const RESPUESTAS_FIJAS = {
  [MOTIVO.SALUDO]: (rol) =>
    crearRespuesta({
      texto: '¡Hola! Soy Kiara, la asistente de Vincco. Preguntame lo que necesités sobre la plataforma.',
      sugerencias: sugerenciasIniciales(rol),
    }),

  [MOTIVO.VACIO]: (rol) =>
    crearRespuesta({
      texto: 'Escribime tu duda sobre Vincco y te ayudo.',
      sugerencias: sugerenciasIniciales(rol),
    }),

  [MOTIVO.FUERA_DE_TEMA]: (rol) =>
    crearRespuesta({
      texto: 'Puedo ayudarte únicamente con dudas relacionadas con la plataforma Vincco.',
      sugerencias: sugerenciasIniciales(rol, 3),
      seguro: false,
    }),

  [MOTIVO.TAREA_ESCOLAR]: (rol) =>
    crearRespuesta({
      texto:
        'Puedo ayudarte únicamente con dudas relacionadas con la plataforma Vincco. ' +
        'Para tareas o preguntas generales necesitás otra herramienta.',
      sugerencias: sugerenciasIniciales(rol, 3),
      seguro: false,
    }),
}

/* Recorta el historial a los últimos turnos. Se le pasa al motor
   como contexto; el motor local todavía no lo usa, pero el remoto
   lo va a necesitar para entender preguntas encadenadas. */
function recortarHistorial(historial = []) {
  return historial.slice(-TURNOS_MEMORIA)
}

export async function preguntar(pregunta, { rol = 'usuario', ruta = '/', historial = [] } = {}) {
  // 1. ¿Es sobre Vincco?
  const { dentro, motivo } = evaluarAlcance(pregunta)
  if (!dentro) {
    const armar = RESPUESTAS_FIJAS[motivo] || RESPUESTAS_FIJAS[MOTIVO.FUERA_DE_TEMA]
    return armar(rol)
  }

  // 2. Buscar en la guía de usuario
  const fragmentos = buscar(pregunta, { rol })

  // 3. Armar la respuesta con el motor activo
  return motor.responder(pregunta, {
    rol,
    ruta,
    fragmentos,
    historial: recortarHistorial(historial),
  })
}

/* Entra directo a una entrada por su id: así llega Kiara cuando el
   usuario TOCA una opción de un menú en vez de escribir. No pasa por
   evaluarAlcance() ni por buscar(): tocar un botón no es texto libre,
   ya se sabe exactamente qué se pidió. */
export async function elegirOpcion(id, { rol = 'usuario', ruta = '/', origenMenu = null } = {}) {
  const entrada = obtenerPorId(id, rol)
  return motor.responderPorEntrada(entrada, { rol, ruta, origenMenu })
}

// Saludo de bienvenida al abrir el chat por primera vez
export function mensajeBienvenida(rol) {
  return crearRespuesta({
    texto:
      'Soy Kiara, la asistente de Vincco. Te explico cómo usar la plataforma: puntos, ' +
      'cotizaciones, tu perfil y cualquier pantalla de la app.',
    sugerencias: sugerenciasIniciales(rol),
  })
}

export const motorActivo = motor.nombre
