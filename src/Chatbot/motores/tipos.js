/* ══════════════════════════════════════════════════════════════
   CONTRATO DE LOS MOTORES

   Un "motor" es lo que convierte una pregunta en una respuesta.
   Hoy hay uno solo (motorLocal), pero el orquestador no lo llama
   por su nombre: lo llama por este contrato. Así, cuando exista
   backend, se enchufa motorRemoto cambiando UN import y ninguna
   otra parte de la app se entera.

   ─────────────────────────────────────────────────────────────
   TODO MOTOR DEBE EXPORTAR:

     nombre: string

     async responder(pregunta, contexto) -> Respuesta
       Pregunta libre, escrita por el usuario. contexto trae
       "fragmentos", lo que encontró la búsqueda en la guía.

     async responderPorEntrada(entrada, contexto) -> Respuesta
       Entrada YA elegida, sin buscar: así llega Kiara cuando el
       usuario toca una opción de un menú en vez de escribir.
       contexto trae "origenMenu", el id del menú del que salió.

   ─────────────────────────────────────────────────────────────
   contexto (de responder) = {
     rol:        'usuario' | 'negocio' | 'proveedor'
     ruta:       la pantalla donde está parado el usuario
     fragmentos: [{ entrada, puntaje }] de la capa de conocimiento
     historial:  últimos turnos de la conversación
   }

   contexto (de responderPorEntrada) = {
     rol:        'usuario' | 'negocio' | 'proveedor'
     ruta:       la pantalla donde está parado el usuario
     origenMenu: id del menú del que salió esta entrada, o null
   }

   Respuesta = {
     texto:        string — la respuesta principal, breve
     pasos:        string[] — instrucciones, opcional
     ruta:         string — a qué pantalla llevar, opcional
     rutaLabel:    string — cómo se llama esa pantalla
     nota:         string — advertencia, opcional
     sugerencias:  string[] — qué más puede preguntar
     opciones:     { id, texto }[] — menú de respuesta rápida. Si viene
                   con algo, la interfaz dibuja botones en vez de dejar
                   escribir: el id es el de OTRA entrada de la guía
     volverA:      string — id del menú del que salió esta respuesta,
                   para dibujar un botón "Volver al menú". null si esta
                   respuesta no vino de ningún menú
     fuente:       string — de qué entrada de la guía salió
     seguro:       boolean — false si el motor no está confiado
   }

   ─────────────────────────────────────────────────────────────
   REGLA QUE NINGÚN MOTOR PUEDE ROMPER

   Si no hay fragmentos, el motor NO responde: devuelve una
   respuesta de "no lo sé". Ningún motor inventa contenido que no
   esté en la guía de usuario. Cuando llegue el motor remoto, esta
   regla se aplica verificando que la respuesta del modelo se
   apoye en los fragmentos recibidos.
   ══════════════════════════════════════════════════════════════ */

// Respuesta vacía de referencia. Sirve de plantilla y evita que
// cada motor arme el objeto con campos distintos.
export const RESPUESTA_BASE = {
  texto: '',
  pasos: null,
  ruta: null,
  rutaLabel: null,
  nota: null,
  sugerencias: [],
  opciones: null,
  volverA: null,
  fuente: null,
  seguro: true,
}

export function crearRespuesta(parcial) {
  return { ...RESPUESTA_BASE, ...parcial }
}
