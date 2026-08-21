import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import PublicacionesPanel from '../components/panel/PublicacionesPanel'
import ResenasPanel from '../components/panel/ResenasPanel'
import CotizacionesPanel from '../components/panel/CotizacionesPanel'
import PapeleriaPanel from '../components/panel/PapeleriaPanel'
import { useCategoriasInventario } from '../data/categoriasInventario'
import { esPromocion, getEtiquetaPublicacion, claveInventario } from '../data/inventario'
import { moverAPapelera } from '../data/papelera'
import AvisoSucursal from '../components/panel/AvisoSucursal'
import './Panel.css'

// El `|| []` dentro del selector creaba un array nuevo en cada lectura.
// Zustand compara por referencia para decidir si redibuja, y como
// [] !== [] siempre le daba distinto: este componente se redibujaba
// ante cualquier cambio del store, aunque las sucursales no cambiaran.
// Con una constante fija la referencia se mantiene.
const SIN_SUCURSALES = []

const TABS = [
  { id: 'publicaciones', label: 'Publicaciones', icon: 'megaphone' },
  { id: 'inventario', label: 'Inventario', icon: 'bar-chart-2' },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: 'dollar-sign' },
  { id: 'resenas', label: 'Reseñas y Ranking', icon: 'star' },
  { id: 'Papeleria', label: 'Papelería', icon: 'trash-2' },
]

const UNIDADES = ['unidad', 'kg', 'lb', 'litro', 'caja', 'paquete', 'metros']

function InventarioSection() {
  const sucursalId = useStore((s) => s.sucursalActiva[s.userType])
  const clave = claveInventario(sucursalId)

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(clave)
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return [
      { id: 1, nombre: 'Martillo', categoria: 'Herramientas', cantidad: 25, unidad: 'unidad', precio: 180, stockMinimo: 5 },
      { id: 2, nombre: 'Cemento gris', categoria: 'Materiales', cantidad: 80, unidad: 'kg', precio: 250, stockMinimo: 20 },
      { id: 3, nombre: 'Arroz granza', categoria: 'Alimentos', cantidad: 12, unidad: 'lb', precio: 22, stockMinimo: 30 },
      { id: 4, nombre: 'Cloro galón', categoria: 'Limpieza', cantidad: 6, unidad: 'litro', precio: 55, stockMinimo: 10 },
      { id: 5, nombre: 'Cautín eléctrico', categoria: 'Herramientas', cantidad: 3, unidad: 'unidad', precio: 320, stockMinimo: 2 },
    ]
  })

  // Si el dueño cambia de sucursal, el inventario se recarga de la
  // clave de esa sucursal: cada una administra su propio panel.
  useEffect(() => {
    const saved = localStorage.getItem(clave)
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch {}
    } else {
      setItems([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave])

  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(items))
  }, [items, clave])

  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [detalleItem, setDetalleItem] = useState(null)
  const [categorias, agregarCategoria, eliminarCategoria] = useCategoriasInventario()
  const carruselRef = useRef(null)
  const [agregandoCat, setAgregandoCat] = useState(false)
  const [nuevaCat, setNuevaCat] = useState('')
  const [form, setForm] = useState({
    nombre: '', categoria: categorias[0] || 'Otros', cantidad: '', unidad: 'unidad', precio: '', stockMinimo: '',
  })

  const desplazarCarrusel = (dir) => {
    const el = carruselRef.current
    if (el) el.scrollBy({ left: dir * 140, behavior: 'smooth' })
  }

  const confirmarAgregarCat = () => {
    if (agregarCategoria(nuevaCat)) {
      setNuevaCat('')
      setAgregandoCat(false)
    }
  }

  const eliminarCategoriaConProductos = (cat) => {
    const cantidad = items.filter((i) => i.categoria === cat).length
    const aviso = cantidad > 0
      ? `La categoría "${cat}" tiene ${cantidad} producto(s) en el inventario y se eliminarán. ¿Eliminar categoría?`
      : `¿Eliminar la categoría "${cat}"?`
    if (window.confirm(aviso)) {
      eliminarCategoria(cat)
      setItems((prev) => prev.filter((i) => i.categoria !== cat))
      if (filtroCategoria === cat) setFiltroCategoria('Todas')
    }
  }

  const abrirNuevo = () => {
    setEditando(null)
    setForm({ nombre: '', categoria: categorias[0] || 'Otros', cantidad: '', unidad: 'unidad', precio: '', stockMinimo: '' })
    setMostrarForm(true)
  }

  const abrirEditar = (item) => {
    setEditando(item.id)
    setForm({
      nombre: item.nombre, categoria: item.categoria,
      cantidad: String(item.cantidad), unidad: item.unidad,
      precio: String(item.precio), stockMinimo: String(item.stockMinimo),
    })
    setMostrarForm(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!form.nombre || form.cantidad === '' || form.precio === '') return

    const nuevo = {
      nombre: form.nombre,
      categoria: categorias.includes(form.categoria) ? form.categoria : (categorias[0] || 'Otros'),
      cantidad: Number(form.cantidad), unidad: form.unidad,
      precio: Number(form.precio), stockMinimo: Number(form.stockMinimo) || 0,
    }

    if (editando) {
      setItems((prev) => prev.map((i) => (i.id === editando ? { ...i, ...nuevo } : i)))
    } else {
      setItems((prev) => [{ id: Date.now(), ...nuevo }, ...prev])
    }
    setMostrarForm(false); setEditando(null)
  }

  const eliminar = (id) => {
    const item = items.find((i) => i.id === id)
    if (item) moverAPapelera(item, 'inventario')
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const actualizarStock = (id) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const nuevaCant = prompt('Nueva cantidad:', item.cantidad)
    if (nuevaCant !== null && !isNaN(Number(nuevaCant))) {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, cantidad: Number(nuevaCant) } : i))
    }
  }

  const getStockStatus = (item) => {
    if (item.cantidad === 0) return { label: 'Agotado', className: 'panel-inv-stock-badge--agotado', itemClass: 'panel-inv-item--agotado', numClass: 'panel-inv-item-num--agotado' }
    if (item.cantidad <= item.stockMinimo) return { label: 'Stock bajo', className: 'panel-inv-stock-badge--bajo', itemClass: 'panel-inv-item--bajo', numClass: 'panel-inv-item-num--bajo' }
    return { label: 'Stock suficiente', className: 'panel-inv-stock-badge--suficiente', itemClass: '', numClass: '' }
  }

  const getItemIcono = (cat) => {
    const icons = {
      Herramientas: 'tool', Materiales: 'box', Alimentos: 'package',
      Limpieza: 'droplet', Electrónicos: 'zap', Ropa: 'shirt',
    }
    return icons[cat] || 'package'
  }

  const itemsFiltrados = filtroCategoria === 'Todas'
    ? items : items.filter((i) => i.categoria === filtroCategoria)

  const totalProductos = items.length
  const totalUnidades = items.reduce((s, i) => s + i.cantidad, 0)
  const stockBajo = items.filter((i) => i.stockMinimo > 0 && i.cantidad > 0 && i.cantidad <= i.stockMinimo).length
  const agotados = items.filter((i) => !esPromocion(i) && i.cantidad === 0).length

  return (
    <div className="panel-seccion">
      <div className="panel-seccion-header">
        <div>
          <h2 className="panel-seccion-titulo">Inventario y Stock</h2>
          <p className="panel-seccion-desc">Administra tus productos, cantidades y precios</p>
        </div>
        <button className="panel-btn panel-btn-primary" onClick={abrirNuevo}>+ Agregar producto</button>
      </div>

      <div className="panel-inv-resumen">
        <div className="panel-inv-resumen-card">
          <span className="panel-inv-resumen-num">{totalProductos}</span>
          <span className="panel-inv-resumen-label">Total productos</span>
        </div>
        <div className="panel-inv-resumen-card">
          <span className="panel-inv-resumen-num">{totalUnidades}</span>
          <span className="panel-inv-resumen-label">Unidades en inventario</span>
        </div>
        <div className="panel-inv-resumen-card panel-inv-resumen-card--alerta">
          <span className="panel-inv-resumen-num">{stockBajo + agotados}</span>
          <span className="panel-inv-resumen-label">Stock bajo</span>
        </div>
      </div>

      {(stockBajo > 0 || agotados > 0) && (
        <div className={`panel-alerta ${agotados > 0 ? 'panel-alerta--danger' : 'panel-alerta--warning'}`}>
          <span className="panel-alerta-icono"><Icon name="alert-triangle" size={18} /></span>
          <span>
            {agotados > 0
              ? `${agotados} producto(s) agotado(s) y ${stockBajo} con stock bajo.`
              : `${stockBajo} producto(s) con stock bajo. Revisa tu inventario.`}
          </span>
        </div>
      )}

      <div className="panel-inv-carrusel">
        <button type="button" className="panel-inv-carrusel-btn" onClick={() => desplazarCarrusel(-1)} aria-label="Anterior">
          <Icon name="arrow-left" size={14} />
        </button>
        <div className="panel-inv-filtros" ref={carruselRef}>
          <button
            type="button"
            className={`panel-nav-btn ${filtroCategoria === 'Todas' ? 'panel-nav-btn--activo' : ''}`}
            onClick={() => setFiltroCategoria('Todas')}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <span
              key={cat}
              className={`panel-nav-btn ${filtroCategoria === cat ? 'panel-nav-btn--activo' : ''}`}
              onClick={() => setFiltroCategoria(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFiltroCategoria(cat) }}
            >
              {cat}
              <button
                type="button"
                className="panel-inv-chip-x"
                title="Eliminar categoría"
                onClick={(e) => { e.stopPropagation(); eliminarCategoriaConProductos(cat) }}
              >
                <Icon name="x" size={10} />
              </button>
            </span>
          ))}
          {agregandoCat ? (
            <span className="panel-inv-agregar-form">
              <input
                className="panel-inv-agregar-input"
                type="text"
                placeholder="Nombre de la categoría"
                value={nuevaCat}
                autoFocus
                onChange={(e) => setNuevaCat(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmarAgregarCat() }}
              />
              <button type="button" className="panel-btn panel-btn-icono" onClick={confirmarAgregarCat} title="Guardar categoría"><Icon name="check-circle" size={16} /></button>
              <button type="button" className="panel-btn panel-btn-icono" onClick={() => { setAgregandoCat(false); setNuevaCat('') }} title="Cancelar"><Icon name="x" size={16} /></button>
            </span>
          ) : (
            <button type="button" className="panel-inv-agregar" onClick={() => setAgregandoCat(true)}>
              + Agregar
            </button>
          )}
        </div>
        <button type="button" className="panel-inv-carrusel-btn" onClick={() => desplazarCarrusel(1)} aria-label="Siguiente">
          <Icon name="arrow-right" size={14} />
        </button>
      </div>

      {mostrarForm && (
        <form className="panel-form" onSubmit={guardar}>
          <h3 className="panel-form-titulo">{editando ? 'Editar producto' : 'Agregar producto'}</h3>

          <div className="panel-form-row">
            <div className="panel-form-grupo">
              <label className="panel-form-label">Nombre del producto</label>
              <input className="panel-form-input" type="text" placeholder="Ej: Martillo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="panel-form-grupo">
              <label className="panel-form-label">Categoría</label>
              <select className="panel-form-select" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="panel-form-row panel-form-row--3">
            <div className="panel-form-grupo">
              <label className="panel-form-label">Cantidad</label>
              <input className="panel-form-input" type="number" min="0" placeholder="0" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
            </div>
            <div className="panel-form-grupo">
              <label className="panel-form-label">Unidad</label>
              <select className="panel-form-select" value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })}>
                {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="panel-form-grupo">
              <label className="panel-form-label">Precio (C$)</label>
              <input className="panel-form-input" type="number" min="0" placeholder="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
            </div>
          </div>

          <div className="panel-form-grupo">
            <label className="panel-form-label">Stock mínimo (alerta)</label>
            <input className="panel-form-input" type="number" min="0" placeholder="0" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} />
          </div>

          <div className="panel-form-acciones">
            <button type="button" className="panel-btn panel-btn-secundario" onClick={() => { setMostrarForm(false); setEditando(null) }}>Cancelar</button>
            <button type="submit" className="panel-btn panel-btn-primary">{editando ? 'Guardar cambios' : 'Agregar'}</button>
          </div>
        </form>
      )}

      {itemsFiltrados.length === 0 ? (
        <div className="panel-vacio">
          <p>No hay productos en esta categoría.</p>
          <button className="panel-btn panel-btn-primary" onClick={abrirNuevo}>Agregar producto</button>
        </div>
      ) : (
        <div className="panel-lista">
          {itemsFiltrados.map((item) => {
            const status = getStockStatus(item)
            const etiqueta = getEtiquetaPublicacion(item)
            const esPromo = esPromocion(item)
            return (
              <div key={item.id} className={`panel-inv-item ${status.itemClass}`}>
                <div className="panel-inv-item-icono">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} className="panel-inv-item-img" />
                  ) : (
                    <Icon name={getItemIcono(item.categoria)} size={20} />
                  )}
                </div>
                <div className="panel-inv-item-info">
                  <h3 className="panel-inv-item-nombre">{item.nombre}</h3>
                  <p className="panel-inv-item-detalle">
                    {item.categoria}{esPromo
                      ? item.descuento ? ` · -${item.descuento}%` : ''
                      : ` · C$${item.precio} / ${item.unidad}`}
                  </p>
                  {etiqueta && (
                    <span className={`panel-inv-tag ${etiqueta.className}`}>
                      <Icon name={etiqueta.icono} size={11} /> {etiqueta.label}
                    </span>
                  )}
                </div>
                <div className="panel-inv-item-cantidad">
                  <span className={`panel-inv-item-num ${status.numClass}`}>{item.cantidad}</span>
                  <span className="panel-inv-item-unidad">{item.unidad}</span>
                  <span className={`panel-inv-stock-badge ${status.className}`}>{status.label}</span>
                </div>
                <div className="panel-inv-item-acciones">
                  <button className="panel-btn panel-btn-icono" onClick={() => setDetalleItem(item)} title="Ver detalles"><Icon name="eye" size={16} /></button>
                  <button className="panel-btn panel-btn-icono" onClick={() => abrirEditar(item)} title="Editar"><Icon name="edit-2" size={16} /></button>
                  {!esPromo && (
                    <button className="panel-btn panel-btn-icono" onClick={() => actualizarStock(item.id)} title="Actualizar existencias"><Icon name="package" size={16} /></button>
                  )}
                  <button className="panel-btn panel-btn-icono panel-btn-icono--peligro" onClick={() => eliminar(item.id)} title="Eliminar"><Icon name="trash-2" size={16} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {detalleItem && (
        <div className="panel-modal-overlay" onClick={() => setDetalleItem(null)}>
          <div className="panel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="panel-modal-header">
              <h3 className="panel-modal-titulo">{detalleItem.nombre}</h3>
              <button className="panel-modal-cerrar" onClick={() => setDetalleItem(null)}><Icon name="x" size={16} /></button>
            </div>
            <div className="panel-modal-body">
              {detalleItem.imagen && (
                <div className="panel-inv-detail-img">
                  <img src={detalleItem.imagen} alt={detalleItem.nombre} />
                </div>
              )}
              {getEtiquetaPublicacion(detalleItem) && (
                <div className="panel-modal-info-row">
                  <span className="panel-modal-info-label">Publicación</span>
                  <span className={`panel-inv-tag ${getEtiquetaPublicacion(detalleItem).className}`}>
                    <Icon name={getEtiquetaPublicacion(detalleItem).icono} size={11} />
                    {' '}{getEtiquetaPublicacion(detalleItem).label}
                  </span>
                </div>
              )}
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Categoría</span>
                <span className="panel-modal-info-value">{detalleItem.categoria}</span>
              </div>
              {esPromocion(detalleItem) ? (
                <>
                  {detalleItem.descuento && (
                    <div className="panel-modal-info-row">
                      <span className="panel-modal-info-label">Descuento</span>
                      <span className="panel-modal-info-value">-{detalleItem.descuento}%</span>
                    </div>
                  )}
                  {detalleItem.validoHasta && (
                    <div className="panel-modal-info-row">
                      <span className="panel-modal-info-label">Válido hasta</span>
                      <span className="panel-modal-info-value">{detalleItem.validoHasta}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="panel-modal-info-row">
                  <span className="panel-modal-info-label">Precio</span>
                  <span className="panel-modal-info-value">C${detalleItem.precio} / {detalleItem.unidad}</span>
                </div>
              )}
              {esPromocion(detalleItem) && (
                <div className="panel-modal-info-row">
                  <span className="panel-modal-info-label">Unidades</span>
                  <span className="panel-modal-info-value">{detalleItem.cantidad} {detalleItem.unidad}(s)</span>
                </div>
              )}
              {esPromocion(detalleItem) && detalleItem.stockMinimo > 0 && (
                <div className="panel-modal-info-row">
                  <span className="panel-modal-info-label">Alerta de stock</span>
                  <span className="panel-modal-info-value">{detalleItem.stockMinimo} {detalleItem.unidad}(s)</span>
                </div>
              )}
              {!esPromocion(detalleItem) && (
                <>
                  <div className="panel-modal-info-row">
                    <span className="panel-modal-info-label">Cantidad</span>
                    <span className="panel-modal-info-value">{detalleItem.cantidad} {detalleItem.unidad}(s)</span>
                  </div>
                  <div className="panel-modal-info-row">
                    <span className="panel-modal-info-label">Stock mínimo</span>
                    <span className="panel-modal-info-value">{detalleItem.stockMinimo} {detalleItem.unidad}(s)</span>
                  </div>
                </>
              )}
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Estado</span>
                <span className={`panel-inv-stock-badge ${getStockStatus(detalleItem).className}`}>
                  {getStockStatus(detalleItem).label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PanelNegocio() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userType = useStore((s) => s.userType)
  const usuario = useStore((s) => s.usuario)
  const sucursales = useStore((s) => s.sucursales[userType] ?? SIN_SUCURSALES)
  const sucursalActivaId = useStore((s) => s.sucursalActiva[userType])
  const sucursal = sucursales.find((s) => s.id === sucursalActivaId) || sucursales[0]
  const [tabActiva, setTabActiva] = useState('publicaciones')

  const esNegocio = userType === 'negocio'

  // Permite entrar directo a una seccion desde fuera. Se respeta el
  // valor de la URL la primera vez; despues el usuario navega como
  // siempre con las tabs.
  useEffect(() => {
    const tabDeUrl = searchParams.get('tab')
    if (tabDeUrl && TABS.some((t) => t.id === tabDeUrl)) {
      setTabActiva(tabDeUrl)
    }
  }, [searchParams])

  useEffect(() => {
    if (!esNegocio) {
      navigate('/home')
    }
  }, [esNegocio, navigate])

  if (!esNegocio) return null

  return (
    <div className="panel panel-negocio" style={{ '--panel-accent': '#c05900', '--panel-accent-hover': '#a34b00' }}>
      <div className="panel-header">
        <button className="panel-header-btn" onClick={() => navigate('/home')}>
          <Icon name="arrow-left" size={18} />
        </button>
        <div className="panel-header-info">
          <h1 className="panel-header-titulo">Panel de Negocio</h1>
          <p className="panel-header-tipo">{sucursal?.nombre || usuario.nombre}</p>
        </div>
      </div>

      <nav className="panel-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`panel-nav-btn ${tabActiva === tab.id ? 'panel-nav-btn--activo' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            <span className="panel-nav-icono"><Icon name={tab.icon} size={18} /></span>
            <span className="panel-nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <AvisoSucursal />

      <div className="panel-contenido">
        {tabActiva === 'publicaciones' && <PublicacionesPanel />}
        {tabActiva === 'inventario' && <InventarioSection />}
        {tabActiva === 'resenas' && <ResenasPanel />}
        {tabActiva === 'cotizaciones' && <CotizacionesPanel />}
        {tabActiva === 'Papeleria' && <PapeleriaPanel />}
        {tabActiva !== 'publicaciones' && tabActiva !== 'inventario' && tabActiva !== 'resenas' && tabActiva !== 'cotizaciones' && tabActiva !== 'Papeleria' && (
          <div className="panel-seccion panel-placeholder">
            <h2 className="panel-seccion-titulo">
              {TABS.find((t) => t.id === tabActiva)?.label}
            </h2>
            <p>Esta sección estará disponible próximamente.</p>
          </div>
        )}
      </div>
    </div>
  )
}
