import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import { proveedores } from '../data/data_falso'
import Icon from '../components/icons/Icon'
import PublicacionesPanel from '../components/panel/PublicacionesPanel'
import './Panel.css'

const TABS = [
  { id: 'publicaciones', label: 'Publicaciones', icon: 'megaphone' },
  { id: 'proveedores', label: 'Proveedores', icon: 'package' },
  { id: 'inventario', label: 'Inventario', icon: 'bar-chart-2' },
]

const CATEGORIAS_INVENTARIO = [
  'Todas', 'Herramientas', 'Materiales', 'Alimentos', 'Limpieza', 'Electrónicos', 'Ropa', 'Otros',
]

const UNIDADES = ['unidad', 'kg', 'lb', 'litro', 'caja', 'paquete', 'metros']

function ProveedoresSection() {
  const [lista] = useState(
    proveedores.map((p, i) => ({
      ...p,
      descripcion: i === 0
        ? 'Distribuidora de alimentos y productos de consumo masivo'
        : 'Venta de materiales para construcción y ferretería',
      estado: i === 0 ? 'Verificado' : 'Premium',
      categorias: i === 0 ? ['Alimentos', 'Bebidas', 'Lácteos'] : ['Materiales', 'Herramientas', 'Pinturas'],
      contacto: i === 0 ? 'info@distribuidoranorte.com' : 'ventas@materialeslaunion.com',
      telefono: i === 0 ? '2255-3344' : '2277-8899',
      ubicacion: i === 0 ? 'Managua, Nicaragua' : 'León, Nicaragua',
      productos: i === 0
        ? ['Arroz', 'Frijoles', 'Aceite', 'Azúcar', 'Harina']
        : ['Cemento', 'Varilla', 'Pintura', 'Tubería', 'Clavos'],
    }))
  )
  const [favoritos, setFavoritos] = useState([])
  const [selectedProveedor, setSelectedProveedor] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  const toggleFav = (id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const listaFiltrada = filtro === 'favoritos'
    ? lista.filter((p) => favoritos.includes(p.id))
    : lista

  return (
    <div className="panel-seccion">
      <div className="panel-seccion-header">
        <div>
          <h2 className="panel-seccion-titulo">Proveedores</h2>
          <p className="panel-seccion-desc">Encuentra y administra tus proveedores</p>
        </div>
      </div>

      <div className="panel-acciones-barra">
        <button className="panel-btn panel-btn-primary" onClick={() => setFiltro('todos')}>
          <Icon name="search" size={16} /> Buscar nuevos proveedores
        </button>
        <button className="panel-btn panel-btn-outline" onClick={() => setFiltro('todos')}>
          <Icon name="map-pin" size={16} /> Localizar
        </button>
        <button
          className={`panel-btn ${filtro === 'favoritos' ? 'panel-btn-primary' : 'panel-btn-outline'}`}
          onClick={() => setFiltro(filtro === 'favoritos' ? 'todos' : 'favoritos')}
        >
          <Icon name="star" filled size={16} /> Favoritos {favoritos.length > 0 && `(${favoritos.length})`}
        </button>
      </div>

      {listaFiltrada.length === 0 ? (
        <div className="panel-vacio">
          <div className="panel-vacio-icono"><Icon name="package" size={32} /></div>
          <p>{filtro === 'favoritos' ? 'No tienes proveedores favoritos.' : 'No hay proveedores disponibles.'}</p>
        </div>
      ) : (
        <div className="panel-lista">
          {listaFiltrada.map((prov) => (
            <div key={prov.id} className="panel-proveedor-card">
              <div className="panel-proveedor-icono">
                <Icon name={prov.categoria === 'alimentos' ? 'package' : 'box'} size={22} />
              </div>
              <div className="panel-proveedor-info">
                <h3 className="panel-proveedor-nombre">{prov.nombre}</h3>
                <p className="panel-proveedor-detalle">
                  {prov.descripcion} ·{' '}
                  <span className={prov.estado === 'Verificado' ? 'panel-verify' : 'panel-premium'}>
                    {prov.estado}
                  </span>
                </p>
              </div>
              <button
                className="panel-btn panel-btn-outline panel-proveedor-btn-info"
                onClick={() => setSelectedProveedor(prov)}
              >
                Ver información
              </button>
              <button
                className={`panel-proveedor-fav ${favoritos.includes(prov.id) ? 'panel-proveedor-fav--activo' : ''}`}
                onClick={() => toggleFav(prov.id)}
                title={favoritos.includes(prov.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Icon name="star" filled={favoritos.includes(prov.id)} size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedProveedor && (
        <div className="panel-modal-overlay" onClick={() => setSelectedProveedor(null)}>
          <div className="panel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="panel-modal-header">
              <h3 className="panel-modal-titulo">{selectedProveedor.nombre}</h3>
              <button className="panel-modal-cerrar" onClick={() => setSelectedProveedor(null)}><Icon name="x" size={16} /></button>
            </div>
            <div className="panel-modal-body">
              <p className="panel-modal-texto">
                {selectedProveedor.descripcion}
              </p>
              <div>
                <span className="panel-modal-info-label">Categorías</span>
                <div className="panel-modal-productos">
                  {selectedProveedor.categorias.map((cat) => (
                    <span key={cat} className="panel-modal-producto-tag">{cat}</span>
                  ))}
                </div>
              </div>
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Contacto</span>
                <span className="panel-modal-info-value">{selectedProveedor.contacto}</span>
              </div>
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Teléfono</span>
                <span className="panel-modal-info-value">{selectedProveedor.telefono}</span>
              </div>
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Ubicación</span>
                <span className="panel-modal-info-value">{selectedProveedor.ubicacion}</span>
              </div>
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Estado</span>
                <span className={`panel-modal-info-value ${selectedProveedor.estado === 'Verificado' ? 'panel-verify' : 'panel-premium'}`}>
                  {selectedProveedor.estado}
                </span>
              </div>
              <div>
                <span className="panel-modal-info-label">Productos</span>
                <div className="panel-modal-productos">
                  {selectedProveedor.productos.map((prod) => (
                    <span key={prod} className="panel-modal-producto-tag">{prod}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InventarioSection() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('pn_inventario')
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

  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [detalleItem, setDetalleItem] = useState(null)
  const [form, setForm] = useState({
    nombre: '', categoria: 'Herramientas', cantidad: '', unidad: 'unidad', precio: '', stockMinimo: '',
  })

  useEffect(() => {
    localStorage.setItem('pn_inventario', JSON.stringify(items))
  }, [items])

  const abrirNuevo = () => {
    setEditando(null)
    setForm({ nombre: '', categoria: 'Herramientas', cantidad: '', unidad: 'unidad', precio: '', stockMinimo: '' })
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
      nombre: form.nombre, categoria: form.categoria,
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
  const stockBajo = items.filter((i) => i.cantidad > 0 && i.cantidad <= i.stockMinimo).length
  const agotados = items.filter((i) => i.cantidad === 0).length

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

      <div className="panel-inv-filtros">
        {CATEGORIAS_INVENTARIO.map((cat) => (
          <button
            key={cat}
            className={`panel-nav-btn ${filtroCategoria === cat ? 'panel-nav-btn--activo' : ''}`}
            onClick={() => setFiltroCategoria(cat)}
          >
            {cat}
          </button>
        ))}
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
                {CATEGORIAS_INVENTARIO.filter((c) => c !== 'Todas').map((c) => <option key={c} value={c}>{c}</option>)}
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
            return (
              <div key={item.id} className={`panel-inv-item ${status.itemClass}`}>
                <div className="panel-inv-item-icono"><Icon name={getItemIcono(item.categoria)} size={20} /></div>
                <div className="panel-inv-item-info">
                  <h3 className="panel-inv-item-nombre">{item.nombre}</h3>
                  <p className="panel-inv-item-detalle">{item.categoria} · C${item.precio} / {item.unidad}</p>
                </div>
                <div className="panel-inv-item-cantidad">
                  <span className={`panel-inv-item-num ${status.numClass}`}>{item.cantidad}</span>
                  <span className="panel-inv-item-unidad">{item.unidad}</span>
                  <span className={`panel-inv-stock-badge ${status.className}`}>{status.label}</span>
                </div>
                <div className="panel-inv-item-acciones">
                  <button className="panel-btn panel-btn-icono" onClick={() => setDetalleItem(item)} title="Ver detalles"><Icon name="eye" size={16} /></button>
                  <button className="panel-btn panel-btn-icono" onClick={() => abrirEditar(item)} title="Editar"><Icon name="edit-2" size={16} /></button>
                  <button className="panel-btn panel-btn-icono" onClick={() => actualizarStock(item.id)} title="Actualizar existencias"><Icon name="package" size={16} /></button>
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
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Categoría</span>
                <span className="panel-modal-info-value">{detalleItem.categoria}</span>
              </div>
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Precio</span>
                <span className="panel-modal-info-value">C${detalleItem.precio} / {detalleItem.unidad}</span>
              </div>
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Cantidad</span>
                <span className="panel-modal-info-value">{detalleItem.cantidad} {detalleItem.unidad}(s)</span>
              </div>
              <div className="panel-modal-info-row">
                <span className="panel-modal-info-label">Stock mínimo</span>
                <span className="panel-modal-info-value">{detalleItem.stockMinimo} {detalleItem.unidad}(s)</span>
              </div>
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
  const userType = useStore((s) => s.userType)
  const usuario = useStore((s) => s.usuario)
  const [tabActiva, setTabActiva] = useState('publicaciones')

  const esNegocio = userType === 'negocio'

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
          <p className="panel-header-tipo">{usuario.nombre} · Rol: Negocio</p>
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

      <div className="panel-contenido">
        {tabActiva === 'publicaciones' && <PublicacionesPanel />}
        {tabActiva === 'proveedores' && <ProveedoresSection />}
        {tabActiva === 'inventario' && <InventarioSection />}
      </div>
    </div>
  )
}
