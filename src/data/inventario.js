export const INVENTARIO_KEY = 'pn_inventario'

// Cada sucursal tiene su propio inventario: la clave se compone con
// el id de la sucursal activa. Sin id se usa la clave clasica para
// no romper nada que aun no conozca las sucursales.
export function claveInventario(sucursalId) {
  return sucursalId ? `${INVENTARIO_KEY}:${sucursalId}` : INVENTARIO_KEY
}

export function cargarInventario(clave = INVENTARIO_KEY) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave) || 'null')
    if (Array.isArray(guardado)) return guardado
  } catch {}
  return []
}

export function guardarInventario(items, clave = INVENTARIO_KEY) {
  localStorage.setItem(clave, JSON.stringify(items))
}

export const esPromocion = (item) => item?.tipoPublicacion === 'promocion'

export function getEtiquetaPublicacion(item) {
  if (item?.tipoPublicacion === 'producto') {
    return { label: 'Nuevo', className: 'panel-inv-tag--producto', icono: 'package' }
  }
  if (item?.tipoPublicacion === 'promocion') {
    return item.subtipoPromocion === 'limitada'
      ? { label: 'Promoción limitada', className: 'panel-inv-tag--promocion', icono: 'flame' }
      : { label: 'Promoción normal', className: 'panel-inv-tag--promocion', icono: 'flame' }
  }
  return null
}

function construirEntrada(pub) {
  const categoria = pub.categoriaProducto || pub.categoriaPromocion || pub.categoria || 'Otros'
  if (pub.tipoPublicacion === 'promocion') {
    const limitada = pub.tipoPromocion === 'limitada'
    return {
      nombre: pub.titulo,
      categoria,
      cantidad: Number(pub.unidades) || 0,
      unidad: 'unidad',
      precio: 0,
      stockMinimo: 0,
      tipoPublicacion: 'promocion',
      subtipoPromocion: limitada ? 'limitada' : 'normal',
      descuento: pub.descuento ? Number(pub.descuento) : null,
      validoHasta: pub.validoHasta || null,
      publicacionId: pub.id,
      origen: 'publicacion',
      imagen: pub.imagen || null,
    }
  }
  return {
    nombre: pub.titulo,
    categoria,
    cantidad: Number(pub.stock) || 0,
    unidad: 'unidad',
    precio: Number(pub.precio) || 0,
    stockMinimo: 0,
    tipoPublicacion: 'producto',
    publicacionId: pub.id,
    origen: 'publicacion',
    imagen: pub.imagen || null,
  }
}

export function agregarInventarioDesdePublicacion(pub, clave = INVENTARIO_KEY) {
  const items = cargarInventario(clave)
  const entrada = construirEntrada(pub)
  const idx = items.findIndex((i) => i.publicacionId === pub.id)
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...entrada }
  } else {
    items.unshift({ id: Date.now(), ...entrada })
  }
  guardarInventario(items, clave)
}

export function eliminarInventarioDePublicacion(publicacionId, clave = INVENTARIO_KEY) {
  const items = cargarInventario(clave).filter((i) => i.publicacionId !== publicacionId)
  guardarInventario(items, clave)
}
