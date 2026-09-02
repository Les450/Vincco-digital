import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import Icon from '../components/icons/Icon'
import { getNegocioPublico, getCatalogoNegocio } from '../data/catalogoNegocios'
import { esPromocion } from '../data/inventario'
import { CarruselProductos, GrillaProductos, type ProductoTarjeta } from '../components/ui/carousel-cards'

/* ==========================================================================
   INVENTARIO DE UN NEGOCIO · vista del CLIENTE
   --------------------------------------------------------------------------
   Es la misma tarjeta de producto del panel de negocio, pero en modo
   lectura: acá el cliente NO agrega, NO edita, NO borra y NO ve nada de
   la administración interna del comercio (stock mínimo, alertas de
   reposición, papelera). Solo mira lo que el negocio publicó.

   Se entra desde "Ver inventario" en la pantalla de Favoritos.
   ========================================================================== */

type Producto = {
  id: number | string
  nombre: string
  categoria: string
  cantidad: number
  unidad: string
  precio: number
  stockMinimo: number
  tipoPublicacion?: 'producto' | 'promocion'
  subtipoPromocion?: 'normal' | 'limitada'
  descuento?: number | null
  validoHasta?: string | null
  imagen?: string | null
}

type Negocio = {
  id: number
  nombre: string
  categoria: string
  icono: string
  direccion: string
  rating: number
  descripcion?: string
  sucursalId?: string
}

// Cada categoría cae en un ícono; si no hay coincidencia se usa la caja.
// Las llaves están en minúscula porque cada negocio nombra sus
// categorías como quiere ("Bebidas", "bebidas calientes"...).
const ICONOS_CATEGORIA: [string[], string][] = [
  [['herramienta'], 'tool'],
  [['material', 'construc'], 'box'],
  [['pintura'], 'droplet'],
  [['aliment', 'desayuno', 'plato', 'especial', 'panader'], 'utensils'],
  [['bebida', 'café', 'cafe'], 'coffee'],
  [['repost', 'pastel', 'dulce'], 'gift'],
  [['limpieza', 'higiene'], 'droplet'],
  [['medicament', 'vacuna', 'consulta', 'suplement'], 'heart'],
  [['electr', 'audio', 'almacen', 'técnic', 'tecnic'], 'zap'],
  [['ropa', 'dama', 'caballero', 'accesorio'], 'shirt'],
  [['corte', 'color', 'uñas', 'estética', 'estetica'], 'star'],
  [['promo', 'oferta'], 'percent'],
  [['servicio', 'cupo'], 'clock'],
]

function iconoDeCategoria(categoria = '') {
  const texto = categoria.toLowerCase()
  const encontrado = ICONOS_CATEGORIA.find(([claves]) => claves.some((c) => texto.includes(c)))
  return encontrado ? encontrado[1] : 'package'
}

/* El cliente ve la misma cantidad que maneja el negocio, pero el
   estado se dice en su idioma: al comprador no le sirve "stock bajo"
   (eso es una alerta de reposición del dueño), le sirve saber si
   todavía alcanza si va hoy. */
function estadoDisponibilidad(item: Producto) {
  if (Number(item.cantidad) === 0) {
    return { label: 'Agotado', tono: 'agotado' as const }
  }
  if (Number(item.stockMinimo) > 0 && Number(item.cantidad) <= Number(item.stockMinimo)) {
    return { label: 'Últimas unidades', tono: 'bajo' as const }
  }
  return { label: 'Disponible', tono: 'ok' as const }
}

const ESTILO_DISPONIBILIDAD = {
  ok: 'bg-turquesa-50 text-turquesa-700 border-turquesa-100',
  bajo: 'bg-dorado-50 text-dorado-800 border-dorado-200',
  agotado: 'bg-rose-50 text-rose-600 border-rose-100',
}

// Traduce un producto del inventario a la tarjeta del carrusel.
// Las promociones que vienen del panel pueden no traer precio: el
// negocio a veces solo carga el descuento.
function aTarjeta(item: Producto, portada = 0): ProductoTarjeta {
  const estado = estadoDisponibilidad(item)
  const promo = esPromocion(item)

  let precio = 'Consultar'
  if (Number(item.precio) > 0) precio = `C$${item.precio}`
  else if (promo && item.descuento) precio = `-${item.descuento}%`

  const insignia = item.tipoPublicacion
    ? promo
      ? item.descuento
        ? `-${item.descuento}%`
        : 'Promoción'
      : 'Nuevo'
    : undefined

  return {
    id: item.id,
    titulo: item.nombre,
    subtitulo: item.categoria,
    precio,
    precioNota: `${item.cantidad} ${item.unidad}`,
    imagen: item.imagen || null,
    icono: iconoDeCategoria(item.categoria),
    // Todos los productos de una categoría comparten el color de portada,
    // y el color sale del orden de la categoría en este negocio: así el
    // catálogo se ve ordenado y dos filas seguidas nunca coinciden.
    portada,
    insignia,
    // "Disponible" en las nueve tarjetas es ruido: la pastilla aparece
    // solo cuando hay algo que avisar (quedan pocas o se acabó).
    estado: estado.tono === 'ok' ? undefined : estado.label,
    tonoEstado: estado.tono,
  }
}

// Los dos tipos de promoción que el negocio publica desde su panel.
const esPromoLimitada = (item: Producto) => esPromocion(item) && item.subtipoPromocion === 'limitada'
const esPromoNormal = (item: Producto) => esPromocion(item) && item.subtipoPromocion !== 'limitada'

function cumpleTipo(item: Producto, filtro: string) {
  if (filtro === 'promocion') return esPromoNormal(item)
  if (filtro === 'limitada') return esPromoLimitada(item)
  return true
}

const ORDENES = [
  { id: 'destacado', label: 'Disponibles primero' },
  { id: 'precio-asc', label: 'Precio: de menor a mayor' },
  { id: 'precio-desc', label: 'Precio: de mayor a menor' },
  { id: 'nombre', label: 'Nombre (A–Z)' },
]

export default function InventarioNegocio() {
  const { id } = useParams()
  const navigate = useNavigate()

  const negocio: Negocio | null = useMemo(() => getNegocioPublico(id), [id])
  const { productos, origen } = useMemo(() => getCatalogoNegocio(negocio), [negocio]) as {
    productos: Producto[]
    origen: 'panel' | 'ejemplo' | 'ninguno'
  }

  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  // Los tres botones de arriba: todo el catálogo, solo promociones
  // normales, o solo promociones limitadas. Son los mismos dos tipos que
  // el negocio elige al publicar (Publicaciones → Promoción).
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [orden, setOrden] = useState('destacado')
  const [detalleItem, setDetalleItem] = useState<Producto | null>(null)
  const carruselRef = useRef<HTMLDivElement>(null)

  // Las categorías salen de los propios productos: cada negocio arma
  // las suyas y el cliente solo ve las que tienen algo adentro.
  const categorias = useMemo(() => {
    const vistas: string[] = []
    productos.forEach((item) => {
      const cat = item.categoria || 'Otros'
      if (!vistas.includes(cat)) vistas.push(cat)
    })
    return vistas
  }, [productos])

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    const filtrados = productos.filter((item) => {
      const porCategoria = filtroCategoria === 'Todas' || (item.categoria || 'Otros') === filtroCategoria
      const porTexto =
        !texto ||
        (item.nombre || '').toLowerCase().includes(texto) ||
        (item.categoria || '').toLowerCase().includes(texto)
      return porCategoria && porTexto && cumpleTipo(item, filtroTipo)
    })

    const porNombre = (a: Producto, b: Producto) => (a.nombre || '').localeCompare(b.nombre || '', 'es')
    const agotado = (i: Producto) => (Number(i.cantidad) === 0 ? 1 : 0)

    return [...filtrados].sort((a, b) => {
      if (orden === 'precio-asc') return Number(a.precio) - Number(b.precio) || porNombre(a, b)
      if (orden === 'precio-desc') return Number(b.precio) - Number(a.precio) || porNombre(a, b)
      if (orden === 'nombre') return porNombre(a, b)
      // Por defecto lo agotado se va al final: no tiene sentido que
      // el cliente abra la pantalla y lo primero que vea sea lo que no hay.
      return agotado(a) - agotado(b) || porNombre(a, b)
    })
  }, [productos, busqueda, filtroCategoria, filtroTipo, orden])

  // Sin búsqueda ni categoría elegida se muestran los carruseles, una
  // fila por categoría. Apenas el cliente filtra, las mismas tarjetas
  // pasan a grilla: un carrusel con dos resultados de búsqueda queda raro.
  const modoCarrusel = filtroTipo === 'todos' && filtroCategoria === 'Todas' && !busqueda.trim()

  const porCategoria = useMemo(
    () =>
      categorias
        .map((cat) => ({
          categoria: cat,
          items: visibles.filter((i) => (i.categoria || 'Otros') === cat),
        }))
        .filter((grupo) => grupo.items.length > 0),
    [categorias, visibles]
  )

  // La tarjeta solo devuelve su id: acá se recupera el producto completo
  // para abrir el detalle.
  const porId = useMemo(() => {
    const mapa = new Map<string, Producto>()
    productos.forEach((item) => mapa.set(String(item.id), item))
    return mapa
  }, [productos])

  const abrirDetalle = (tarjeta: ProductoTarjeta) => {
    const item = porId.get(String(tarjeta.id))
    if (item) setDetalleItem(item)
  }

  const desplazarCarrusel = (dir: number) => {
    carruselRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })
  }

  // Los tres botones de arriba también filtran el catálogo.
  const metricas = [
    { id: 'todos', label: 'Productos publicados', valor: productos.length },
    { id: 'promocion', label: 'Promociones', valor: productos.filter(esPromoNormal).length },
    { id: 'limitada', label: 'Limitadas', valor: productos.filter(esPromoLimitada).length },
  ]

  // El negocio no está en la lista (link viejo o favorito ya quitado)
  if (!negocio) {
    return (
      <div className="min-h-screen bg-hueso-50">
        <Encabezado titulo="Inventario" subtitulo="Negocio no encontrado" onVolver={() => navigate('/favoritos')} />
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6">
          <p className="text-[14px] text-tinta-700">No encontramos este negocio. Puede que ya no esté en tus favoritos.</p>
          <button
            onClick={() => navigate('/favoritos')}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-turquesa-600 px-6 text-sm font-bold text-white transition hover:bg-turquesa-700"
          >
            Volver a favoritos
          </button>
        </div>
      </div>
    )
  }

  const estadoDetalle = detalleItem ? estadoDisponibilidad(detalleItem) : null

  return (
    <div className="min-h-screen bg-hueso-50">
      <Encabezado
        titulo={negocio.nombre}
        subtitulo={`${negocio.categoria} · Inventario publicado`}
        onVolver={() => navigate(-1)}
      />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Ficha del negocio: el cliente tiene que saber en qué comercio
            está parado antes de mirar los productos. */}
        {/* div y no <section>: un reset global (App.css) le da
            `padding: 4rem 0` a cualquier <section>, pensado para el
            landing, e inflaba el espacio de este bloque. */}
        <div className="flex items-start gap-4 rounded-2xl border border-hueso-200 bg-white p-5 shadow-sm">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-turquesa-50 text-turquesa-700">
            <Icon name={negocio.icono} size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[17px] font-bold tracking-tight text-tinta-900" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
              {negocio.nombre}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-[12.5px] font-medium text-tinta-600">
              <Icon name="map-pin" size={12} />
              {negocio.direccion}
            </p>
            {negocio.descripcion && <p className="mt-2 text-[13px] leading-relaxed text-tinta-700">{negocio.descripcion}</p>}
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-dorado-50 px-2.5 py-1 text-[12.5px] font-bold text-dorado-800">
            <Icon name="star" size={13} filled />
            {negocio.rating}
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-tinta-900" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
              Catálogo
            </h2>
            <p className="mt-0.5 text-[13px] text-tinta-600">Productos y precios que este negocio tiene publicados</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {metricas.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={filtroTipo === m.id}
                onClick={() => setFiltroTipo(m.id)}
                className={cn(
                  'rounded-2xl border px-3 py-4 text-center transition',
                  filtroTipo === m.id
                    ? 'border-turquesa-300 bg-turquesa-50'
                    : 'border-hueso-200 bg-white hover:border-turquesa-200'
                )}
              >
                <span className={cn('block text-[24px] font-extrabold leading-tight', filtroTipo === m.id ? 'text-turquesa-700' : 'text-tinta-900')}>
                  {m.valor}
                </span>
                <span className="mt-1 block text-[10.5px] font-bold uppercase tracking-wide text-tinta-600">{m.label}</span>
              </button>
            ))}
          </div>

          {productos.length > 0 && (
            <>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Icon name="search" size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-500" />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    aria-label="Buscar producto en este negocio"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="h-10 w-full rounded-full border border-hueso-200 bg-white pl-9 pr-9 text-[13px] font-medium text-tinta-900 outline-none transition placeholder:text-tinta-500/70 focus:border-turquesa-400 focus:ring-2 focus:ring-turquesa-400/25"
                  />
                  {busqueda && (
                    <button
                      type="button"
                      onClick={() => setBusqueda('')}
                      aria-label="Limpiar búsqueda"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-tinta-500 hover:text-tinta-900"
                    >
                      <Icon name="x" size={14} />
                    </button>
                  )}
                </div>
                <div className="relative shrink-0 sm:w-[220px]">
                  <select
                    aria-label="Ordenar productos"
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                    className="h-10 w-full appearance-none rounded-full border border-hueso-200 bg-white px-4 pr-9 text-[12.5px] font-semibold text-tinta-900 outline-none transition focus:border-turquesa-400 focus:ring-2 focus:ring-turquesa-400/25"
                  >
                    {ORDENES.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-tinta-500">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Chips de categoría: las define el negocio, no el cliente,
                  así que no hay X ni "+ Agregar" como en el panel. */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => desplazarCarrusel(-1)}
                  aria-label="Anterior"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-hueso-200 bg-white text-tinta-600 transition hover:bg-hueso-50"
                >
                  <Icon name="arrow-left" size={13} />
                </button>
                <div ref={carruselRef} className="flex flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => setFiltroCategoria('Todas')}
                    className={cn(
                      'shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors',
                      filtroCategoria === 'Todas'
                        ? 'border-turquesa-600 bg-turquesa-600 text-white'
                        : 'border-hueso-200 bg-white text-tinta-700 hover:border-turquesa-300 hover:text-turquesa-700'
                    )}
                  >
                    Todas
                  </button>
                  {categorias.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFiltroCategoria(cat)}
                      className={cn(
                        'shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors',
                        filtroCategoria === cat
                          ? 'border-turquesa-600 bg-turquesa-600 text-white'
                          : 'border-hueso-200 bg-white text-tinta-700 hover:border-turquesa-300 hover:text-turquesa-700'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => desplazarCarrusel(1)}
                  aria-label="Siguiente"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-hueso-200 bg-white text-tinta-600 transition hover:bg-hueso-50"
                >
                  <Icon name="arrow-right" size={13} />
                </button>
              </div>
            </>
          )}

          {productos.length === 0 ? (
            <EstadoVacio
              texto="Este negocio todavía no ha publicado productos en Vincco."
              accion={{ label: 'Volver a favoritos', onClick: () => navigate('/favoritos') }}
            />
          ) : visibles.length === 0 ? (
            <EstadoVacio
              texto="No encontramos productos con ese filtro."
              accion={{
                label: 'Ver todo el catálogo',
                onClick: () => {
                  setBusqueda('')
                  setFiltroCategoria('Todas')
                  setFiltroTipo('todos')
                },
              }}
            />
          ) : modoCarrusel ? (
            // Una fila por categoría, como una vitrina.
            <div className="flex flex-col gap-7">
              {porCategoria.map((grupo) => (
                <CarruselProductos
                  key={grupo.categoria}
                  titulo={grupo.categoria}
                  items={grupo.items.map((item) => aTarjeta(item, categorias.indexOf(grupo.categoria)))}
                  onSeleccionar={abrirDetalle}
                  sobreOscuro={false}
                />
              ))}
            </div>
          ) : (
            // Buscando o con una categoría elegida: las mismas tarjetas,
            // pero en grilla, que es como se leen unos pocos resultados.
            <GrillaProductos
              items={visibles.map((item) => aTarjeta(item, categorias.indexOf(item.categoria || 'Otros')))}
              onSeleccionar={abrirDetalle}
            />
          )}

          <p className="flex items-center gap-1.5 text-[12px] font-medium text-tinta-500">
            <Icon name="info" size={13} />
            {origen === 'panel'
              ? 'Las existencias y los precios los actualiza el negocio desde su panel.'
              : 'Catálogo de muestra. Cuando el negocio administre su panel, verás sus productos reales.'}
          </p>
        </div>
      </main>

      {/* Detalle del producto: la misma ficha del panel, sin el stock
          mínimo (esa es una configuración interna del comercio). */}
      <Dialog open={!!detalleItem} onOpenChange={(o) => !o && setDetalleItem(null)}>
        <DialogOverlay className="bg-tinta-950/60 backdrop-blur-[2px]" />
        <DialogContent className="rounded-2xl border-hueso-200 bg-white p-0 sm:max-w-sm">
          {detalleItem && estadoDetalle && (
            <>
              {detalleItem.imagen && (
                <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                  <img src={detalleItem.imagen} alt={detalleItem.nombre} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-6">
                <DialogTitle
                  className="text-[18px] font-bold tracking-tight text-tinta-900"
                  style={{ fontFamily: "'Fraunces','Georgia',serif" }}
                >
                  {detalleItem.nombre}
                </DialogTitle>

                <div className="mt-4 space-y-0 divide-y divide-hueso-200">
                  <FilaDetalle label="Negocio" valor={negocio.nombre} />
                  <FilaDetalle label="Categoría" valor={detalleItem.categoria} />
                  {Number(detalleItem.precio) > 0 && (
                    <FilaDetalle label="Precio" valor={`C$${detalleItem.precio} / ${detalleItem.unidad}`} />
                  )}
                  {esPromocion(detalleItem) && detalleItem.descuento && (
                    <FilaDetalle label="Descuento" valor={`-${detalleItem.descuento}%`} />
                  )}
                  {esPromocion(detalleItem) && detalleItem.validoHasta && (
                    <FilaDetalle label="Válido hasta" valor={detalleItem.validoHasta} />
                  )}
                  <FilaDetalle label="Cantidad" valor={`${detalleItem.cantidad} ${detalleItem.unidad}(s)`} />
                  <div className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-[12.5px] font-semibold text-tinta-600">Disponibilidad</span>
                    <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-bold', ESTILO_DISPONIBILIDAD[estadoDetalle.tono])}>
                      {estadoDetalle.label}
                    </span>
                  </div>
                  <FilaDetalle label="Dónde está" valor={negocio.direccion} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Encabezado({ titulo, subtitulo, onVolver }: { titulo: string; subtitulo: string; onVolver: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-hueso-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
        <button
          onClick={onVolver}
          aria-label="Volver"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hueso-200 bg-white text-tinta-700 transition hover:bg-hueso-50 active:scale-95"
        >
          <Icon name="arrow-left" size={16} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[16px] font-bold tracking-tight text-tinta-900 sm:text-[18px]" style={{ fontFamily: "'Fraunces','Georgia',serif" }}>
            {titulo}
          </h1>
          <p className="truncate text-[12px] font-medium text-tinta-600">{subtitulo}</p>
        </div>
      </div>
    </header>
  )
}

function EstadoVacio({ texto, accion }: { texto: string; accion: { label: string; onClick: () => void } }) {
  return (
    <div className="rounded-2xl border border-dashed border-hueso-300 bg-white px-6 py-14 text-center">
      <p className="text-[14px] text-tinta-700">{texto}</p>
      <button
        onClick={accion.onClick}
        className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-turquesa-600 px-6 text-sm font-bold text-white transition hover:bg-turquesa-700"
      >
        {accion.label}
      </button>
    </div>
  )
}

function FilaDetalle({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-[12.5px] font-semibold text-tinta-600">{label}</span>
      <span className="text-[13px] font-semibold text-tinta-900">{valor}</span>
    </div>
  )
}
