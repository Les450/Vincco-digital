/* ══════════════════════════════════════════════════════════════
   PARSER DE LA GUÍA DE USUARIO

   Convierte guiausuario.md en la estructura que usa Kiara.

   Es .mjs y sin dependencias a propósito: lo usan DOS entornos
   distintos y tiene que dar exactamente el mismo resultado en
   los dos.

     - Node, desde generar-guia.mjs (al compilar)
     - El navegador, para leer el .md publicado (en vivo)

   Si hubiera dos parsers, Kiara respondería distinto según de
   dónde leyó, y eso es imposible de depurar.

   ─────────────────────────────────────────────────────────────
   CONVENCIÓN DEL MARKDOWN

   ## Título de la sección
   > Descripción corta de la sección
   <!-- roles: usuario, negocio | icono: star -->

   ### ¿La pregunta tal como la haría el usuario?

   El primer párrafo es la respuesta corta. Una sola frase.

   1. Primer paso
   2. Segundo paso

   - Ir a: /puntos (Mis puntos)
   - Buscar por: ganar puntos, acumular puntos
   - Nota: una aclaración o advertencia
   - Todavía no disponible

   Todo lo demás (párrafos sueltos, texto antes del primer ##)
   se ignora, así que podés escribir introducciones y comentarios
   sin romper nada.

   ─────────────────────────────────────────────────────────────
   MENÚS (preguntas que dependen de quién pregunta)

   <!-- roles: todos | id: mi-menu | tipo: menu -->

   Texto de arriba de los botones.

   - Opción: id-de-otra-entrada | Texto del botón

   Cada "- Opción:" apunta al id de OTRA entrada de esta guía. Ver
   el detalle completo en guiausuario.md, sección "Cuando una
   pregunta abarca varios perfiles".
   ══════════════════════════════════════════════════════════════ */

// Convierte "¿Cómo gano puntos?" en "como-gano-puntos"
function aId(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

// <!-- roles: usuario, negocio | icono: star | id: puntos -->
function leerComentario(linea) {
  const m = linea.match(/<!--([\s\S]*?)-->/)
  if (!m) return {}

  const datos = {}
  m[1].split('|').forEach((parte) => {
    const i = parte.indexOf(':')
    if (i === -1) return
    const clave = parte.slice(0, i).trim().toLowerCase()
    const valor = parte.slice(i + 1).trim()
    if (clave && valor) datos[clave] = valor
  })
  return datos
}

function listaDeTexto(valor) {
  return valor
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

/* "- Ir a: /puntos (Mis puntos)" -> { ruta, rutaLabel } */
function leerDato(linea, entrada) {
  const texto = linea.replace(/^[-*]\s+/, '').trim()
  const i = texto.indexOf(':')
  const etiqueta = (i === -1 ? texto : texto.slice(0, i)).trim().toLowerCase()
  const valor = i === -1 ? '' : texto.slice(i + 1).trim()

  if (etiqueta === 'ir a' || etiqueta === 'pantalla') {
    const m = valor.match(/^(\S+)\s*(?:\((.+)\))?$/)
    if (m) {
      entrada.ruta = m[1]
      entrada.rutaLabel = m[2] || null
    }
    return true
  }

  if (etiqueta === 'buscar por' || etiqueta === 'claves') {
    entrada.claves = listaDeTexto(valor)
    return true
  }

  if (etiqueta === 'nota' || etiqueta === 'ojo') {
    entrada.nota = valor
    return true
  }

  if (etiqueta === 'roles' || etiqueta === 'para') {
    entrada.roles = listaDeTexto(valor)
    return true
  }

  // "- Opción: id-de-la-entrada | Texto que ve el usuario en el botón"
  // Convierte una entrada en menú: en vez de responder de una, ofrece
  // estas opciones como botones. Cada id tiene que ser el de OTRA
  // entrada de la guía (puede ser otro menú, para submenús).
  if (etiqueta === 'opcion' || etiqueta === 'opción') {
    const [idParte, ...resto] = valor.split('|')
    const id = aId((idParte || '').trim())
    const texto = resto.join('|').trim()
    if (id && texto) entrada.opciones.push({ id, texto })
    return true
  }

  // Marca sin valor: "- Todavía no disponible"
  const sinTildes = etiqueta.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (sinTildes.startsWith('todavia no') || sinTildes === 'pendiente') {
    entrada.pendiente = true
    return true
  }

  return false
}

const ROLES_VALIDOS = ['usuario', 'negocio', 'proveedor']

// "cliente" y "clientes" son la misma cosa que "usuario"
function normalizarRoles(lista) {
  const mapa = {
    cliente: 'usuario', clientes: 'usuario', usuarios: 'usuario',
    negocios: 'negocio', comercio: 'negocio', comercios: 'negocio',
    proveedores: 'proveedor',
  }

  const salida = new Set()
  lista.forEach((r) => {
    const limpio = r.toLowerCase().trim()
    if (limpio === 'todos') { ROLES_VALIDOS.forEach((x) => salida.add(x)); return }
    const rol = mapa[limpio] ?? limpio
    if (ROLES_VALIDOS.includes(rol)) salida.add(rol)
  })

  return salida.size ? [...salida] : [...ROLES_VALIDOS]
}

/* ── El parser ───────────────────────────────────────────── */

export function parsearGuia(markdown) {
  const lineas = String(markdown || '').split(/\r?\n/)

  const secciones = []
  const entradas = []
  const problemas = []

  let seccion = null
  let entrada = null
  // Dónde estamos parados dentro de una entrada
  let esperandoResumen = false
  let enBloqueCodigo = false

  const cerrarEntrada = () => {
    if (!entrada) return
    if (!entrada.resumen) {
      problemas.push(`"${entrada.titulo}" no tiene respuesta corta (el primer párrafo)`)
      entrada.resumen = entrada.titulo
    }
    if (!entrada.claves.length) {
      // Sin claves propias igual se puede encontrar por el título,
      // pero responde bastante peor. Se avisa.
      problemas.push(`"${entrada.titulo}" no tiene "Buscar por:", va a costar encontrarla`)
    }
    if (entrada.tipo === 'menu' && !entrada.opciones.length) {
      problemas.push(`"${entrada.titulo}" es un menú (tipo: menu) pero no tiene ninguna "- Opción:"`)
    }
    entradas.push(entrada)
    entrada = null
  }

  for (let i = 0; i < lineas.length; i++) {
    const limpia = lineas[i].trim()

    // Los bloques de código se ignoran: son ejemplos, no contenido
    if (limpia.startsWith('```')) {
      enBloqueCodigo = !enBloqueCodigo
      continue
    }
    if (enBloqueCodigo) continue

    // ── Sección ──
    if (limpia.startsWith('## ') && !limpia.startsWith('### ')) {
      cerrarEntrada()
      const titulo = limpia.slice(3).trim()
      seccion = {
        id: aId(titulo),
        titulo,
        descripcion: '',
        icono: 'book-open',
        roles: [...ROLES_VALIDOS],
      }
      secciones.push(seccion)
      continue
    }

    // ── Entrada ──
    if (limpia.startsWith('### ')) {
      cerrarEntrada()
      if (!seccion) {
        problemas.push(`"${limpia.slice(4)}" está antes de cualquier sección "##"`)
        seccion = {
          id: 'general', titulo: 'General', descripcion: '',
          icono: 'book-open', roles: [...ROLES_VALIDOS],
        }
        secciones.push(seccion)
      }

      const titulo = limpia.slice(4).trim()
      entrada = {
        id: aId(titulo),
        seccion: seccion.id,
        roles: [...seccion.roles],
        titulo,
        resumen: '',
        pasos: [],
        ruta: null,
        rutaLabel: null,
        claves: [],
        nota: null,
        pendiente: false,
        tipo: 'pregunta',
        opciones: [],
      }
      esperandoResumen = true
      continue
    }

    // ── Descripción de la sección ──
    if (limpia.startsWith('>') && seccion && !entrada) {
      const texto = limpia.replace(/^>\s?/, '').trim()
      seccion.descripcion = seccion.descripcion ? `${seccion.descripcion} ${texto}` : texto
      continue
    }

    // ── Metadatos entre <!-- --> ──
    if (limpia.startsWith('<!--')) {
      const datos = leerComentario(limpia)
      const destino = entrada || seccion
      if (!destino) continue

      if (datos.icono && !entrada) seccion.icono = datos.icono
      if (datos.id) destino.id = aId(datos.id)
      // Los roles de la sección son el valor por defecto de sus entradas
      if (datos.roles) destino.roles = normalizarRoles(listaDeTexto(datos.roles))
      // <!-- tipo: menu --> convierte la entrada en un menú de opciones
      if (datos.tipo && entrada) entrada.tipo = datos.tipo.trim().toLowerCase()
      continue
    }

    if (!entrada) continue

    // ── Pasos: lista numerada ──
    if (/^\d+[.)]\s+/.test(limpia)) {
      entrada.pasos.push(limpia.replace(/^\d+[.)]\s+/, '').trim())
      esperandoResumen = false
      continue
    }

    // ── Datos: viñetas ──
    if (/^[-*]\s+/.test(limpia)) {
      const reconocido = leerDato(limpia, entrada)
      // Una viñeta que no es un dato conocido se toma como paso:
      // hay gente que escribe los pasos con guiones
      if (!reconocido) entrada.pasos.push(limpia.replace(/^[-*]\s+/, '').trim())
      esperandoResumen = false
      continue
    }

    // ── Primer párrafo: la respuesta corta ──
    if (limpia && esperandoResumen) {
      entrada.resumen = entrada.resumen ? `${entrada.resumen} ${limpia}` : limpia
      continue
    }

    // Línea en blanco después del resumen: se cierra el párrafo
    if (!limpia && entrada.resumen) esperandoResumen = false
  }

  cerrarEntrada()

  // Las secciones que quedaron sin entradas no se muestran
  const usadas = new Set(entradas.map((e) => e.seccion))
  const seccionesUsadas = secciones.filter((s) => usadas.has(s.id))

  // Los roles de una sección son la unión de los de sus entradas
  seccionesUsadas.forEach((s) => {
    const roles = new Set()
    entradas.filter((e) => e.seccion === s.id).forEach((e) => e.roles.forEach((r) => roles.add(r)))
    if (roles.size) s.roles = [...roles]
  })

  // Ids repetidos: el segundo pisaría al primero al buscar
  const vistos = new Set()
  entradas.forEach((e) => {
    if (vistos.has(e.id)) {
      problemas.push(`el id "${e.id}" está repetido`)
      e.id = `${e.id}-2`
    }
    vistos.add(e.id)
  })

  return { secciones: seccionesUsadas, entradas, problemas }
}

export default parsearGuia
