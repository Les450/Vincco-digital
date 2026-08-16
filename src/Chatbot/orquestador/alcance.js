import { normalizar, palabras } from './normalizar'

/* ══════════════════════════════════════════════════════════════
   FILTRO DE ALCANCE

   Kiara no es ChatGPT. Este filtro corre ANTES del motor y es la
   primera de las dos defensas que impiden que se salga del tema:

     1. este filtro, que rechaza lo que claramente no es de Vincco
     2. la base de conocimiento cerrada, que simplemente no tiene
        de dónde sacar una respuesta sobre otra cosa

   Se rechaza de entrada y no se le pasa al motor: es más rápido
   y no deja lugar a que el motor improvise.
   ══════════════════════════════════════════════════════════════ */

export const MOTIVO = {
  OK: 'ok',
  VACIO: 'vacio',
  FUERA_DE_TEMA: 'fuera',
  TAREA_ESCOLAR: 'tarea',
  SALUDO: 'saludo',
}

/* Cosas que la gente prueba con cualquier chatbot y que Vincco no
   hace. Se listan explícitamente para poder responder con claridad
   en vez de con un "no entendí". */
const TEMAS_AJENOS = [
  'clima', 'tiempo va hacer', 'temperatura', 'lluvia',
  'chiste', 'chistes', 'adivinanza', 'cuento', 'poema', 'poesia',
  'receta', 'cocinar', 'como cocinar',
  'quien gano', 'partido', 'futbol', 'beisbol', 'deporte',
  'noticia', 'noticias', 'politica', 'presidente', 'elecciones',
  'traduce', 'traducir', 'traduccion',
  'canta', 'cancion', 'musica', 'pelicula', 'serie',
  'bitcoin', 'criptomoneda', 'acciones', 'bolsa',
  'medicina', 'sintoma', 'enfermedad', 'diagnostico',
]

const TAREAS = [
  'resuelve', 'resolve', 'calcula la', 'ecuacion', 'derivada', 'integral',
  'ensayo', 'redacta un ensayo', 'tarea de', 'examen', 'resumen del libro',
  'quien invento', 'quien descubrio', 'en que ano', 'capital de',
]

const SALUDOS = [
  'hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches',
  'que tal', 'saludos', 'hey', 'holi', 'adios', 'gracias', 'chao',
]

/* Palabras que garantizan que la pregunta SÍ es de Vincco.
   Si aparece alguna, se acepta aunque también haya sonado a otra
   cosa: "¿me hacés un resumen de cómo funcionan los puntos?"
   tiene "resumen" pero es claramente de Vincco. */
const PROPIAS = [
  'vincco', 'kiara', 'punto', 'puntos', 'canje', 'canjear', 'recompensa',
  'recompensas', 'nivel', 'niveles', 'cotizacion', 'cotizaciones', 'cotizar',
  'inventario', 'stock', 'proveedor', 'proveedores', 'negocio', 'negocios',
  'comercio', 'perfil', 'cuenta', 'registro', 'registrar', 'directorio',
  'favoritos', 'insignia', 'insignias', 'ranking', 'resena', 'resenas',
  'publicacion', 'publicaciones', 'publicar', 'configuracion', 'ajustes',
  'notificacion', 'notificaciones', 'calendario', 'menu', 'pantalla', 'app',
  'aplicacion', 'cordoba', 'cordobas', 'precio', 'precios', 'producto',
  'productos', 'cliente', 'clientes', 'vitrina', 'cobertura', 'sesion',
  'contrasena', 'verificado', 'verificada', 'verificacion', 'verificar',
  'verificarme', 'formalizado', 'formalizar',
]

function contieneAlguna(textoN, lista) {
  return lista.some((t) => textoN.includes(normalizar(t)))
}

/* Devuelve { dentro, motivo }. El orquestador decide qué decir
   según el motivo, para que la respuesta sea útil y no una pared. */
export function evaluarAlcance(pregunta) {
  const textoN = normalizar(pregunta)

  if (!textoN || palabras(pregunta).length === 0) {
    // Puede ser solo un saludo, que sí tiene respuesta amable
    if (contieneAlguna(textoN, SALUDOS)) return { dentro: false, motivo: MOTIVO.SALUDO }
    return { dentro: false, motivo: MOTIVO.VACIO }
  }

  // Si menciona algo propio de Vincco, entra sin más análisis
  const terminos = palabras(pregunta)
  if (terminos.some((t) => PROPIAS.includes(t))) {
    return { dentro: true, motivo: MOTIVO.OK }
  }

  if (contieneAlguna(textoN, TAREAS)) return { dentro: false, motivo: MOTIVO.TAREA_ESCOLAR }
  if (contieneAlguna(textoN, TEMAS_AJENOS)) return { dentro: false, motivo: MOTIVO.FUERA_DE_TEMA }

  // Saludo suelto, sin pregunta adentro
  if (terminos.length <= 3 && contieneAlguna(textoN, SALUDOS)) {
    return { dentro: false, motivo: MOTIVO.SALUDO }
  }

  /* No dijo nada prohibido ni nada propio. Se deja pasar: la
     búsqueda en la guía va a decidir. Si no encuentra nada,
     igual termina en "no lo sé", que es la respuesta correcta.
     Rechazar acá sería castigar a quien preguntó bien con
     palabras que no están en la lista. */
  return { dentro: true, motivo: MOTIVO.OK }
}
