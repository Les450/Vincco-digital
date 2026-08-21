/* ══════════════════════════════════════════════════════════════
   Lo que el negocio publica, visto desde el lado del cliente.

   Cubre los tres tipos que aparecen en el Home:
     · promociones (normales y limitadas)  → pn_promociones
     · productos nuevos                    → pn_productos
     · destacadas                          → pn_destacadas

   Antes cada sección del Home leía su clave y se armaba la tarjeta
   a mano, cada una perdiendo campos distintos: en promociones el
   título entraba como categoría, en productos se caía el negocio,
   en destacadas no había forma de abrir nada. Mientras las tarjetas
   no se podían tocar eso no molestaba.

   Ahora sí: al abrir el detalle hace falta todo, y sobre todo hace
   falta saber DE QUÉ NEGOCIO es. Sin eso no hay a quién escribirle
   por WhatsApp ni a quién avisarle de la consulta.

   Este es el único lugar donde se traduce lo publicado a lo que el
   cliente ve. Si mañana sale de Postgres en vez de localStorage, se
   cambia acá y ninguna pantalla se entera.

   El archivo conserva el nombre "promociones" porque es lo que
   importan las pantallas; adentro atiende a los tres tipos.
   ══════════════════════════════════════════════════════════════ */

import {
  promociones as promocionesEjemplo,
  destacadas as destacadasEjemplo,
} from '../data/data_falso'
import { cordobasTexto } from './moneda'

export const CLAVE_PROMOCIONES = 'pn_promociones'
export const CLAVE_PRODUCTOS = 'pn_productos'
export const CLAVE_DESTACADAS = 'pn_destacadas'

/* Un color por tipo, elegidos por contraste y no por gusto: los tres
   llevan texto blanco encima en la foto de la tarjeta.
     naranja-600  → blanco 4.50:1
     turquesa-600 → blanco 5.16:1
     azul-500     → blanco 11.30:1
   El dorado quedó afuera a propósito: blanco sobre dorado da 2.04:1
   y el manual lo prohíbe como fondo de texto claro.               */
const COLOR_PROMO = '#c05900'
const COLOR_PRODUCTO = '#007a7b'
const COLOR_DESTACADA = '#003f5a'

// Cada sucursal publica aparte ("pn_promociones:n1"), igual que el
// inventario. Sin sucursal se usa la clave clásica.
export function claveDeSucursal(base, sucursalId) {
  return sucursalId ? `${base}:${sucursalId}` : base
}

export function leerPublicaciones(clave) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave) || 'null')
    if (Array.isArray(guardado)) return guardado
  } catch {
    // localStorage bloqueado o JSON roto: se sigue con la lista vacía
  }
  return []
}

/* Todas las claves de un tipo que hay en el navegador.

   Hace falta porque cada sucursal guarda aparte y el cliente no
   tiene una "sucursal activa": tiene que ver lo de todos.

   Esto además arregla algo que estaba roto de antes y no se notaba:
   el Home leía siempre "pn_promociones" a secas, pero el panel
   guarda en "pn_promociones:n1" apenas hay una sucursal activa
   (y hay una por defecto). O sea que el cliente nunca veía lo que
   el negocio publicaba — siempre caía en los datos de ejemplo y
   parecía que todo funcionaba.                                    */
function clavesDe(prefijo) {
  const claves = []
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const clave = localStorage.key(i)
      if (clave && clave.startsWith(prefijo)) claves.push(clave)
    }
  } catch {
    // Sin localStorage no hay publicaciones que leer
  }
  return claves
}

/* Datos del negocio que acompañan a una publicación.

   Las creadas antes de este cambio no guardaron nada del negocio,
   así que hay que completarlas con el perfil que está activo. En la
   demo eso es correcto porque todo vive en el mismo navegador; con
   backend, `pub.negocio` siempre va a venir lleno y el respaldo
   deja de usarse solo.                                            */
export function negocioDePromocion(pub, respaldo = null) {
  const guardado = pub?.negocio
  if (guardado?.nombre) return guardado
  if (!respaldo) return null

  return {
    id: respaldo.id || null,
    nombre: respaldo.nombre || '',
    categoria: respaldo.categoria || '',
    telefono: respaldo.telefono || '',
    whatsapp: respaldo.whatsapp || respaldo.telefono || '',
    direccion: respaldo.direccion || '',
    descripcion: respaldo.descripcion || '',
    foto: respaldo.foto || null,
    verificado: Boolean(respaldo.verificado),
  }
}

// Los campos que el detalle espera siempre, aunque el tipo no los use.
// Así ninguna pantalla tiene que preguntar "¿esto es un producto?"
// antes de leer un campo.
const CAMPOS_COMUNES = {
  descuento: null,
  unidades: null,
  puntos: null,
  precio: null,
  stock: null,
  likesBase: 0,
  validoHasta: null,
  terminos: '',
  esLimitada: false,
}

const aNumero = (v) => (v === '' || v == null ? null : Number(v))

/* ── Promociones ─────────────────────────────────────────────── */

export function normalizarPromocion(pub, respaldoNegocio = null) {
  const descuento = aNumero(pub.descuento)
  const esLimitada = pub.tipo === 'limitada'

  return {
    ...CAMPOS_COMUNES,
    id: pub.id,
    tipo: 'promocion',
    origen: 'publicacion',
    titulo: pub.titulo || '',
    descripcion: pub.descripcion || '',
    imagen: pub.imagen || null,
    descuento,
    unidades: aNumero(pub.unidades),
    puntos: pub.puntos || null,
    validoHasta: pub.validoHasta || null,
    terminos: pub.terminos || '',
    categoria: pub.categoriaPromocion || 'Otros',
    esLimitada,
    fecha: pub.fecha || null,
    badge: descuento ? `${descuento}% OFF` : esLimitada ? 'Limitada' : 'Promoción',
    color: COLOR_PROMO,
    icono: 'flame',
    negocio: negocioDePromocion(pub, respaldoNegocio),
  }
}

/* Las promociones de ejemplo de data_falso tienen otra forma: ahí
   "nombre" es el nombre del comercio, no el de la oferta.         */
export function normalizarPromocionEjemplo(p) {
  return {
    ...CAMPOS_COMUNES,
    id: p.id,
    tipo: 'promocion',
    origen: 'ejemplo',
    // En las de ejemplo el gancho ES el beneficio ("2x puntos hoy"),
    // así que ese texto va de título y el chip de puntos se queda
    // vacío a propósito: repetirlo dos veces no suma nada.
    titulo: p.puntos,
    descripcion: `Promoción vigente en ${p.nombre}. Consultá al negocio por las condiciones.`,
    imagen: null,
    categoria: p.categoria,
    esLimitada: p.badge === 'Limitado',
    fecha: null,
    badge: p.badge,
    color: p.color || COLOR_PROMO,
    icono: 'flame',
    negocio: {
      id: null,
      nombre: p.nombre,
      categoria: p.categoria,
      telefono: '',
      whatsapp: '',
      direccion: 'Nueva Guinea, RACCS',
      descripcion: '',
      foto: null,
      verificado: false,
    },
  }
}

/* ── Productos nuevos ────────────────────────────────────────── */

export function normalizarProducto(pub, respaldoNegocio = null) {
  const stock = aNumero(pub.stock)

  return {
    ...CAMPOS_COMUNES,
    id: pub.id,
    tipo: 'producto',
    origen: 'publicacion',
    titulo: pub.titulo || '',
    descripcion: pub.descripcion || '',
    imagen: pub.imagen || null,
    precio: aNumero(pub.precio),
    stock,
    // El formulario de consulta topa la cantidad con "unidades";
    // en un producto ese tope es el stock. Se copia acá para que el
    // formulario no tenga que saber de tipos.
    unidades: stock,
    categoria: pub.categoriaProducto || 'Otros',
    fecha: pub.fecha || null,
    badge: 'Nuevo',
    color: COLOR_PRODUCTO,
    icono: 'package',
    negocio: negocioDePromocion(pub, respaldoNegocio),
  }
}

/* ── Destacadas ──────────────────────────────────────────────── */

export function normalizarDestacada(pub, respaldoNegocio = null) {
  return {
    ...CAMPOS_COMUNES,
    id: pub.id,
    tipo: 'destacada',
    origen: 'publicacion',
    titulo: pub.titulo || '',
    descripcion: pub.descripcion || '',
    imagen: pub.imagen || null,
    categoria: pub.categoria || '',
    likesBase: Number(pub.likes) || 0,
    fecha: pub.fecha || null,
    badge: 'Destacada',
    color: COLOR_DESTACADA,
    icono: 'trending-up',
    negocio: negocioDePromocion(pub, respaldoNegocio),
  }
}

/* Las destacadas de ejemplo no traen negocio: en data_falso son
   solo título, descripción y likes. Sin nadie detrás, la hoja se
   abre sin a quién escribirle y el flujo no se puede probar, así
   que se les presta el perfil que está activo.

   Ojo: esto es andamio de demo. Hoy el panel solo deja publicar
   promociones y productos — no hay un tipo "destacada" —, así que
   esta sección siempre muestra ejemplos. Cuando exista el tipo,
   estas líneas dejan de usarse solas.                             */
export function normalizarDestacadaEjemplo(d, respaldo = null) {
  return {
    ...CAMPOS_COMUNES,
    id: d.id,
    tipo: 'destacada',
    origen: 'ejemplo',
    titulo: d.titulo,
    descripcion: d.descripcion || '',
    imagen: null,
    categoria: d.categoria || '',
    likesBase: Number(d.likes) || 0,
    fecha: null,
    badge: 'Destacada',
    color: COLOR_DESTACADA,
    icono: 'trending-up',
    negocio: negocioDePromocion({}, respaldo),
  }
}

/* ── Listas para el Home ─────────────────────────────────────── */

// Las más nuevas primero: el id es el Date.now() de cuando se creó.
const porMasNuevas = (a, b) => Number(b.id) - Number(a.id)

function listar({ prefijo, clave, filtro, mapear }) {
  const claves = clave ? [clave] : clavesDe(prefijo)
  return claves
    .flatMap((k) => leerPublicaciones(k))
    .filter(filtro || (() => true))
    .map(mapear)
    .sort(porMasNuevas)
}

/* En las tres listas vale la misma regla:

   - `clave` puesta  → solo esa (el socio viendo su propio Home ve
                       lo de la sucursal en la que está parado).
   - `clave` en null → todas (el cliente ve lo de todos los negocios). */

export function promocionesVisibles({ clave = null, respaldo = null, limitadas = false } = {}) {
  const publicadas = listar({
    prefijo: CLAVE_PROMOCIONES,
    clave,
    filtro: (p) => (limitadas ? p.tipo === 'limitada' : p.tipo !== 'limitada'),
    mapear: (p) => normalizarPromocion(p, respaldo),
  })

  if (publicadas.length > 0) return publicadas
  // Las limitadas no tienen ejemplos: o hay publicadas o no hay sección.
  if (limitadas) return []
  return promocionesEjemplo.map(normalizarPromocionEjemplo)
}

export function productosVisibles({ clave = null, respaldo = null } = {}) {
  return listar({
    prefijo: CLAVE_PRODUCTOS,
    clave,
    mapear: (p) => normalizarProducto(p, respaldo),
  })
}

export function destacadasVisibles({ clave = null, respaldo = null } = {}) {
  const publicadas = listar({
    prefijo: CLAVE_DESTACADAS,
    clave,
    mapear: (d) => normalizarDestacada(d, respaldo),
  })

  if (publicadas.length > 0) return publicadas
  return destacadasEjemplo.map((d) => normalizarDestacadaEjemplo(d, respaldo))
}

/* ── Buscar una sola, por id ─────────────────────────────────── */

/* La pantalla /promocion/:id se puede abrir desde un link, sin pasar
   por el Home, así que no recibe el objeto ya armado: tiene que ir a
   buscarlo. Recorre los tres tipos y todas las sucursales.

   Los ids son el Date.now() de la creación, así que chocar entre
   tipos es prácticamente imposible. Los únicos ids repetidos son los
   de los datos de ejemplo (1, 2, 3...), y por eso se buscan al final:
   lo publicado de verdad siempre gana.                             */
export function buscarPublicacion(id, respaldoNegocio = null) {
  const buscado = String(id)

  const tipos = [
    { prefijo: CLAVE_PROMOCIONES, normalizar: normalizarPromocion },
    { prefijo: CLAVE_PRODUCTOS, normalizar: normalizarProducto },
    { prefijo: CLAVE_DESTACADAS, normalizar: normalizarDestacada },
  ]

  for (const { prefijo, normalizar } of tipos) {
    for (const clave of clavesDe(prefijo)) {
      const encontrada = leerPublicaciones(clave).find((p) => String(p.id) === buscado)
      if (encontrada) return normalizar(encontrada, respaldoNegocio)
    }
  }

  const promo = promocionesEjemplo.find((p) => String(p.id) === buscado)
  if (promo) return normalizarPromocionEjemplo(promo)

  const dest = destacadasEjemplo.find((d) => String(d.id) === buscado)
  if (dest) return normalizarDestacadaEjemplo(dest, respaldoNegocio)

  return null
}

/* ── Textos ──────────────────────────────────────────────────── */

/* Los puntos como los tiene que leer una persona.

   El panel guarda un número suelto ("50") porque el campo pide un
   número, pero "50" solo, en una tarjeta, no dice nada. Las
   promociones de ejemplo en cambio ya traen la frase entera
   ("2x puntos hoy") y hay que dejarla tal cual.                   */
export function textoPuntos(puntos) {
  if (puntos == null || puntos === '') return null

  const numero = Number(puntos)
  if (Number.isFinite(numero) && String(puntos).trim() !== '') {
    return `${numero} ${numero === 1 ? 'punto' : 'puntos'}`
  }

  return String(puntos)
}

// El precio con el símbolo y el formato que ya usa el resto de la
// app (utils/moneda), en vez de un "C$" escrito a mano.
export function textoPrecio(precio) {
  if (precio == null || precio === '' || Number.isNaN(Number(precio))) return null
  return cordobasTexto(Number(precio))
}

/* Texto de vigencia en palabras. Devuelve null si no hay fecha,
   para que la pantalla directamente no muestre la línea.          */
export function textoVigencia(validoHasta) {
  if (!validoHasta) return null

  const hasta = new Date(`${validoHasta}T23:59:59`)
  if (Number.isNaN(hasta.getTime())) return null

  // floor y no ceil: la fecha se cierra a las 23:59 del último día,
  // así que redondear hacia arriba regalaba un día que no existe.
  const dias = Math.floor((hasta.getTime() - Date.now()) / 86400000)
  if (dias < 0) return 'Promoción vencida'
  if (dias === 0) return 'Último día'
  if (dias === 1) return 'Queda 1 día'
  if (dias <= 7) return `Quedan ${dias} días`

  return `Válida hasta el ${hasta.getDate()}/${hasta.getMonth() + 1}`
}

/* Link de WhatsApp con el mensaje ya escrito. Mismo patrón que usan
   CotizacionesPanel y CotizacionesEnviadas: se limpia todo lo que
   no sea número porque los teléfonos se guardan con espacios y +.  */
export function linkWhatsApp(numero, mensaje) {
  const limpio = String(numero || '').replace(/\D/g, '')
  if (!limpio) return null
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`
}

const COMO_SE_LLAMA = {
  promocion: 'la promoción',
  producto: 'el producto',
  destacada: 'la publicación',
}

export function mensajeWhatsApp(item, nombreCliente) {
  const saludo = nombreCliente ? `Hola, soy ${nombreCliente}.` : 'Hola.'
  const que = COMO_SE_LLAMA[item.tipo] || 'la publicación'
  return `${saludo} Vi en Vincco ${que} "${item.titulo}"${
    item.negocio?.nombre ? ` de ${item.negocio.nombre}` : ''
  } y quería consultar por ${item.tipo === 'producto' ? 'él' : 'ella'}.`
}
