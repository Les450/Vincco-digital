import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import PublicacionesPanel from '../components/panel/PublicacionesPanel'
import './Panel.css'

const SECCIONES = [
  { id: 'publicaciones', label: 'Publicaciones', icon: 'megaphone' },
  { id: 'proveedores', label: 'Proveedores', icon: 'package' },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: 'dollar-sign' },
  { id: 'reseñas', label: 'Reseñas y Ranking', icon: 'star' },
  { id: 'directorio', label: 'Directorio', icon: 'file-text' },
  { id: 'inventario', label: 'Inventario', icon: 'bar-chart-2' },
]

const CATEGORIAS_INVENTARIO = [
  'Todas', 'Herramientas', 'Materiales', 'Alimentos', 'Limpieza', 'Electrónicos', 'Ropa', 'Otros',
]

const UNIDADES = ['unidad', 'kg', 'lb', 'litro', 'caja', 'paquete', 'metros']

function InventarioSection() {
  const [items, setItems] = useState([
    { id: 1, nombre: 'Martillo', categoria: 'Herramientas', cantidad: 25, unidad: 'unidad', precio: 180, stockMinimo: 5 },
    { id: 2, nombre: 'Cemento gris', categoria: 'Materiales', cantidad: 80, unidad: 'kg', precio: 250, stockMinimo: 20 },
    { id: 3, nombre: 'Arroz granza', categoria: 'Alimentos', cantidad: 12, unidad: 'lb', precio: 22, stockMinimo: 30 },
    { id: 4, nombre: 'Cloro galón', categoria: 'Limpieza', cantidad: 6, unidad: 'litro', precio: 55, stockMinimo: 10 },
    { id: 5, nombre: 'Cautín eléctrico', categoria: 'Herramientas', cantidad: 3, unidad: 'unidad', precio: 320, stockMinimo: 2 },
  ])

  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', categoria: 'Herramientas', cantidad: '', unidad: 'unidad', precio: '', stockMinimo: '' })

  const abrirNuevo = () => {
    setEditando(null)
    setForm({ nombre: '', categoria: 'Herramientas', cantidad: '', unidad: 'unidad', precio: '', stockMinimo: '' })
    setMostrarForm(true)
  }

  const abrirEditar = (item) => {
    setEditando(item.id)
    setForm({
      nombre: item.nombre,
      categoria: item.categoria,
      cantidad: String(item.cantidad),
      unidad: item.unidad,
      precio: String(item.precio),
      stockMinimo: String(item.stockMinimo),
    })
    setMostrarForm(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!form.nombre || form.cantidad === '' || form.precio === '') return

    const nuevo = {
      nombre: form.nombre,
      categoria: form.categoria,
      cantidad: Number(form.cantidad),
      unidad: form.unidad,
      precio: Number(form.precio),
      stockMinimo: Number(form.stockMinimo) || 0,
    }

    if (editando) {
      setItems((prev) => prev.map((i) => (i.id === editando ? { ...i, ...nuevo } : i)))
    } else {
      setItems((prev) => [{ id: Date.now(), ...nuevo }, ...prev])
    }
    setMostrarForm(false)
    setEditando(null)
  }

  const eliminar = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const itemsFiltrados = filtroCategoria === 'Todas'
    ? items
    : items.filter((i) => i.categoria === filtroCategoria)

  const totalProductos = items.length
  const totalUnidades = items.reduce((s, i) => s + i.cantidad, 0)
  const stockBajo = items.filter((i) => i.cantidad <= i.stockMinimo).length

  return (
    <div className="panel-seccion">
      <div className="panel-seccion-header">
        <div>
          <h2 className="panel-seccion-titulo">Inventario y Stock</h2>
          <p className="panel-seccion-desc">Gestiona tus productos, cantidades y precios</p>
        </div>
        <button className="panel-btn panel-btn-primary" onClick={abrirNuevo}>+ Agregar producto</button>
      </div>

      <div className="panel-inv-resumen">
        <div className="panel-inv-resumen-card">
          <span className="panel-inv-resumen-num">{totalProductos}</span>
          <span className="panel-inv-resumen-label">Productos</span>
        </div>
        <div className="panel-inv-resumen-card">
          <span className="panel-inv-resumen-num">{totalUnidades}</span>
          <span className="panel-inv-resumen-label">Unidades totales</span>
        </div>
        <div className="panel-inv-resumen-card panel-inv-resumen-card--alerta">
          <span className="panel-inv-resumen-num">{stockBajo}</span>
          <span className="panel-inv-resumen-label">Stock bajo</span>
        </div>
      </div>

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
            const bajoStock = item.cantidad <= item.stockMinimo
            return (
              <div key={item.id} className={`panel-inv-item ${bajoStock ? 'panel-inv-item--bajo' : ''}`}>
                <div className="panel-inv-item-icono">
                  <Icon name={item.categoria === 'Herramientas' ? 'tool' : item.categoria === 'Materiales' ? 'box' : item.categoria === 'Alimentos' ? 'package' : item.categoria === 'Limpieza' ? 'droplet' : item.categoria === 'Electrónicos' ? 'zap' : item.categoria === 'Ropa' ? 'shirt' : 'package'} size={20} />
                </div>
                <div className="panel-inv-item-info">
                  <h3 className="panel-inv-item-nombre">{item.nombre}</h3>
                  <p className="panel-inv-item-detalle">{item.categoria} · C${item.precio} / {item.unidad}</p>
                </div>
                <div className="panel-inv-item-cantidad">
                  <span className={`panel-inv-item-num ${bajoStock ? 'panel-inv-item-num--bajo' : ''}`}>{item.cantidad}</span>
                  <span className="panel-inv-item-unidad">{item.unidad}</span>
                  {bajoStock && <span className="panel-inv-item-alerta">Stock bajo</span>}
                </div>
                <div className="panel-card-acciones">
                  <button className="panel-btn panel-btn-icono" onClick={() => abrirEditar(item)} title="Editar"><Icon name="edit-2" size={16} /></button>
                  <button className="panel-btn panel-btn-icono panel-btn-icono--peligro" onClick={() => eliminar(item.id)} title="Eliminar"><Icon name="trash-2" size={16} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SeccionPlaceholder({ id, label }) {
  return (
    <div className="panel-seccion panel-placeholder">
      <h2 className="panel-seccion-titulo">{label}</h2>
      <p>Esta sección estará disponible próximamente.</p>
    </div>
  )
}

export default function PanelSocio() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userType, usuario } = useStore()
  const seccionInicial = location.pathname === '/publicaciones' ? 'publicaciones' : 'publicaciones'
  const [seccionActiva, setSeccionActiva] = useState(seccionInicial)

  useEffect(() => {
    if (location.pathname === '/publicaciones') {
      setSeccionActiva('publicaciones')
    }
  }, [location.pathname])

  const esSocio = userType === 'negocio' || userType === 'proveedor'

  if (!esSocio) {
    navigate('/home')
    return null
  }

  const nombreTipo = userType === 'negocio' ? 'Negocio' : 'Proveedor'

  const acento = userType === 'negocio'
    ? { '--panel-accent': '#c05900', '--panel-accent-hover': '#a34b00' }
    : { '--panel-accent': '#007a7b', '--panel-accent-hover': '#005c5e' }

  return (
    <div className="panel panel-socio" style={acento}>
      <div className="panel-header">
        <button className="panel-header-btn" onClick={() => navigate('/home')}>
          <Icon name="arrow-left" size={18} />
        </button>
        <div className="panel-header-info">
          <h1 className="panel-header-titulo">Panel de Socio</h1>
          <p className="panel-header-tipo">
            {usuario.nombre} · {nombreTipo}
          </p>
        </div>
      </div>

      <nav className="panel-nav">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            className={`panel-nav-btn ${seccionActiva === s.id ? 'panel-nav-btn--activo' : ''}`}
            onClick={() => setSeccionActiva(s.id)}
          >
            <span className="panel-nav-icono"><Icon name={s.icon} size={18} /></span>
            <span className="panel-nav-label">{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="panel-contenido">
        {seccionActiva === 'publicaciones' && <PublicacionesPanel />}
        {seccionActiva === 'inventario' && <InventarioSection />}
        {seccionActiva !== 'publicaciones' && seccionActiva !== 'inventario' && (
          <SeccionPlaceholder
            id={seccionActiva}
            label={SECCIONES.find((s) => s.id === seccionActiva)?.label || ''}
          />
        )}
      </div>
    </div>
  )
}
