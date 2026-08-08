import { SECCIONES, ENTRADAS } from './guia_generada'
import { parsearGuia } from './parsearGuia.mjs'

/* ══════════════════════════════════════════════════════════════
   CARGA DE LA GUÍA — dos caminos, un solo resultado

   1. INCORPORADA (siempre disponible)
      conocimiento/guia_generada.js viene dentro del bundle,
      generada al compilar desde guiausuario.md. Funciona sin
      internet y responde al instante.

   2. EN VIVO (si se puede)
      Al abrirse Kiara intenta bajar public/guiausuario.md y lo
      parsea con el MISMO parser. Si trae entradas, reemplaza a la
      incorporada. Así se puede actualizar la guía en el servidor
      sin recompilar la app.

   Si la lectura en vivo falla —sin señal, archivo borrado, un
   error de formato— Kiara sigue con la incorporada y el usuario
   ni se entera. Nunca se queda muda.
   ══════════════════════════════════════════════════════════════ */

// process.env.PUBLIC_URL lo define Create React App. En GitHub
// Pages la app no vive en la raíz del dominio, así que sin esto
// el fetch buscaría el archivo en el lugar equivocado.
const RUTA_PUBLICA = `${process.env.PUBLIC_URL || ''}/guiausuario.md`

// Si el servidor no responde en este tiempo, no vale la pena
// seguir esperando: se usa la incorporada.
const ESPERA_MAXIMA = 4000

// Lo que Kiara está usando ahora mismo
let guiaActual = { secciones: SECCIONES, entradas: ENTRADAS, origen: 'incorporada' }

// Una sola descarga por sesión, aunque se llame muchas veces
let promesa = null

async function bajarGuia() {
  // En Node (pruebas, scripts) no hay fetch de navegador ni
  // archivo publicado: se usa la incorporada y listo.
  if (typeof fetch !== 'function' || typeof window === 'undefined') {
    return guiaActual
  }

  const control = new AbortController()
  const corte = setTimeout(() => control.abort(), ESPERA_MAXIMA)

  try {
    const respuesta = await fetch(RUTA_PUBLICA, {
      signal: control.signal,
      cache: 'no-cache',
    })
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)

    const markdown = await respuesta.text()

    // Un servidor mal configurado devuelve el index.html en vez de
    // un 404. Si lo que vino es HTML, no es la guía.
    if (/^\s*<(!doctype|html)/i.test(markdown)) {
      throw new Error('el servidor devolvió HTML, no el archivo')
    }

    const { secciones, entradas, problemas } = parsearGuia(markdown)
    if (!entradas.length) throw new Error('la guía publicada no tiene preguntas')

    if (problemas.length && process.env.NODE_ENV !== 'production') {
      console.warn(`Guía en vivo: ${problemas.length} aviso(s)`, problemas)
    }

    guiaActual = { secciones, entradas, origen: 'en-vivo' }
  } catch (error) {
    // Silencioso en producción: el usuario no tiene por qué saber
    // que hubo un problema si la guía incorporada lo resuelve igual
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        `Guía en vivo no disponible (${error.message}). ` +
        `Kiara usa la guía incorporada.`
      )
    }
  } finally {
    clearTimeout(corte)
  }

  return guiaActual
}

/* Arranca la descarga. Se llama al abrir el chat, no al cargar la
   app: quien nunca abre a Kiara no gasta una descarga. */
export function precargarGuia() {
  if (!promesa) promesa = bajarGuia()
  return promesa
}

/* Lo que hay disponible AHORA, sin esperar. Al principio devuelve
   la incorporada; cuando termina la descarga, la de en vivo. Es
   síncrono a propósito: la búsqueda no puede quedarse esperando. */
export function guia() {
  return guiaActual
}

export function origenGuia() {
  return guiaActual.origen
}
