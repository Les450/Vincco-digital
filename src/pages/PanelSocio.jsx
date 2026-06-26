import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import { publicaciones } from '../data/publicaciones_falso'
import './PanelSocio.css'

const SECCIONES = [
  { id: 'publicaciones', label: 'Publicaciones', icon: '📢' },
  { id: 'proveedores', label: 'Proveedores', icon: '📦' },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: '💰' },
  { id: 'reseñas', label: 'Reseñas y Ranking', icon: '⭐' },
  { id: 'directorio', label: 'Directorio', icon: '📋' },
  { id: 'inventario', label: 'Inventario', icon: '📊' },
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
    <div className="ps-seccion">
      <div className="ps-seccion-header">
        <div>
          <h2 className="ps-seccion-titulo">Inventario y Stock</h2>
          <p className="ps-seccion-desc">Gestiona tus productos, cantidades y precios</p>
        </div>
        <button className="ps-btn ps-btn-primary" onClick={abrirNuevo}>+ Agregar producto</button>
      </div>

      <div className="ps-inv-resumen">
        <div className="ps-inv-resumen-card">
          <span className="ps-inv-resumen-num">{totalProductos}</span>
          <span className="ps-inv-resumen-label">Productos</span>
        </div>
        <div className="ps-inv-resumen-card">
          <span className="ps-inv-resumen-num">{totalUnidades}</span>
          <span className="ps-inv-resumen-label">Unidades totales</span>
        </div>
        <div className="ps-inv-resumen-card ps-inv-resumen-card--alerta">
          <span className="ps-inv-resumen-num">{stockBajo}</span>
          <span className="ps-inv-resumen-label">Stock bajo</span>
        </div>
      </div>

      <div className="ps-inv-filtros">
        {CATEGORIAS_INVENTARIO.map((cat) => (
          <button
            key={cat}
            className={`ps-nav-btn ${filtroCategoria === cat ? 'ps-nav-btn--activo' : ''}`}
            onClick={() => setFiltroCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {mostrarForm && (
        <form className="ps-form" onSubmit={guardar}>
          <h3 className="ps-form-titulo">{editando ? 'Editar producto' : 'Agregar producto'}</h3>

          <div className="ps-form-row">
            <div className="ps-form-grupo">
              <label className="ps-form-label">Nombre del producto</label>
              <input className="ps-form-input" type="text" placeholder="Ej: Martillo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="ps-form-grupo">
              <label className="ps-form-label">Categoría</label>
              <select className="ps-form-select" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS_INVENTARIO.filter((c) => c !== 'Todas').map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="ps-form-row ps-form-row--3">
            <div className="ps-form-grupo">
              <label className="ps-form-label">Cantidad</label>
              <input className="ps-form-input" type="number" min="0" placeholder="0" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
            </div>
            <div className="ps-form-grupo">
              <label className="ps-form-label">Unidad</label>
              <select className="ps-form-select" value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })}>
                {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="ps-form-grupo">
              <label className="ps-form-label">Precio (C$)</label>
              <input className="ps-form-input" type="number" min="0" placeholder="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
            </div>
          </div>

          <div className="ps-form-grupo">
            <label className="ps-form-label">Stock mínimo (alerta)</label>
            <input className="ps-form-input" type="number" min="0" placeholder="0" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} />
          </div>

          <div className="ps-form-acciones">
            <button type="button" className="ps-btn ps-btn-secundario" onClick={() => { setMostrarForm(false); setEditando(null) }}>Cancelar</button>
            <button type="submit" className="ps-btn ps-btn-primary">{editando ? 'Guardar cambios' : 'Agregar'}</button>
          </div>
        </form>
      )}

      {itemsFiltrados.length === 0 ? (
        <div className="ps-vacio">
          <p>No hay productos en esta categoría.</p>
          <button className="ps-btn ps-btn-primary" onClick={abrirNuevo}>Agregar producto</button>
        </div>
      ) : (
        <div className="ps-lista">
          {itemsFiltrados.map((item) => {
            const bajoStock = item.cantidad <= item.stockMinimo
            return (
              <div key={item.id} className={`ps-inv-item ${bajoStock ? 'ps-inv-item--bajo' : ''}`}>
                <div className="ps-inv-item-icono">
                  {item.categoria === 'Herramientas' ? '🔧' : item.categoria === 'Materiales' ? '🧱' : item.categoria === 'Alimentos' ? '🌾' : item.categoria === 'Limpieza' ? '🧴' : item.categoria === 'Electrónicos' ? '⚡' : item.categoria === 'Ropa' ? '👕' : '📦'}
                </div>
                <div className="ps-inv-item-info">
                  <h3 className="ps-inv-item-nombre">{item.nombre}</h3>
                  <p className="ps-inv-item-detalle">{item.categoria} · C${item.precio} / {item.unidad}</p>
                </div>
                <div className="ps-inv-item-cantidad">
                  <span className={`ps-inv-item-num ${bajoStock ? 'ps-inv-item-num--bajo' : ''}`}>{item.cantidad}</span>
                  <span className="ps-inv-item-unidad">{item.unidad}</span>
                  {bajoStock && <span className="ps-inv-item-alerta">Stock bajo</span>}
                </div>
                <div className="ps-card-acciones">
                  <button className="ps-btn ps-btn-icono" onClick={() => abrirEditar(item)} title="Editar">✏️</button>
                  <button className="ps-btn ps-btn-icono ps-btn-icono--peligro" onClick={() => eliminar(item.id)} title="Eliminar">🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const TIPOS_PUBLICACION = [
  { id: 'imagen_breve', label: 'Imagen + descripción breve' },
  { id: 'descripcion_larga', label: 'Descripción larga + imagen' },
  { id: 'promocion', label: 'Promoción especial' },
]

const TIPO_NOMBRE = {
  imagen_breve: 'Imagen + Breve',
  descripcion_larga: 'Descripción larga',
  promocion: 'Promoción',
}

function PublicacionesSection() {
  const [lista, setLista] = useState(publicaciones)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    tipo: 'imagen_breve',
    titulo: '',
    descripcion: '',
    fechaLimite: '',
  })

  const abrirNueva = () => {
    setEditando(null)
    setForm({ tipo: 'imagen_breve', titulo: '', descripcion: '', fechaLimite: '' })
    setMostrarForm(true)
  }

  const abrirEditar = (pub) => {
    setEditando(pub.id)
    setForm({
      tipo: pub.tipo,
      titulo: pub.titulo,
      descripcion: pub.descripcion,
      fechaLimite: pub.fechaLimite || '',
    })
    setMostrarForm(true)
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!form.titulo || !form.descripcion) return

    if (editando) {
      setLista((prev) =>
        prev.map((p) =>
          p.id === editando
            ? { ...p, ...form, fecha: new Date().toISOString().slice(0, 10) }
            : p
        )
      )
    } else {
      setLista((prev) => [
        {
          id: Date.now(),
          ...form,
          imagen: null,
          fecha: new Date().toISOString().slice(0, 10),
          activa: true,
        },
        ...prev,
      ])
    }
    setMostrarForm(false)
    setEditando(null)
  }

  const eliminar = (id) => {
    setLista((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleActiva = (id) => {
    setLista((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p))
    )
  }

  return (
    <div className="ps-seccion">
      <div className="ps-seccion-header">
        <div>
          <h2 className="ps-seccion-titulo">Publicaciones</h2>
          <p className="ps-seccion-desc">
            Administra tus productos, promociones y ofertas
          </p>
        </div>
        <button className="ps-btn ps-btn-primary" onClick={abrirNueva}>
          + Nueva publicación
        </button>
      </div>

      {mostrarForm && (
        <form className="ps-form" onSubmit={guardar}>
          <h3 className="ps-form-titulo">
            {editando ? 'Editar publicación' : 'Nueva publicación'}
          </h3>

          <div className="ps-form-grupo">
            <label className="ps-form-label">Tipo de publicación</label>
            <select
              className="ps-form-select"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              {TIPOS_PUBLICACION.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ps-form-grupo">
            <label className="ps-form-label">Título</label>
            <input
              className="ps-form-input"
              type="text"
              placeholder="Ej: Nuevo lote de herramientas"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>

          <div className="ps-form-grupo">
            <label className="ps-form-label">Descripción</label>
            <textarea
              className="ps-form-textarea"
              rows={form.tipo === 'descripcion_larga' ? 5 : 3}
              placeholder={
                form.tipo === 'imagen_breve'
                  ? 'Descripción breve de la publicación...'
                  : form.tipo === 'promocion'
                  ? 'Describe la promoción especial...'
                  : 'Escribe una descripción detallada...'
              }
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          {form.tipo === 'promocion' && (
            <div className="ps-form-grupo">
              <label className="ps-form-label">Fecha límite</label>
              <input
                className="ps-form-input"
                type="date"
                value={form.fechaLimite}
                onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
              />
            </div>
          )}

          <div className="ps-form-acciones">
            <button
              type="button"
              className="ps-btn ps-btn-secundario"
              onClick={() => {
                setMostrarForm(false)
                setEditando(null)
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="ps-btn ps-btn-primary">
              {editando ? 'Guardar cambios' : 'Publicar'}
            </button>
          </div>
        </form>
      )}

      {lista.length === 0 ? (
        <div className="ps-vacio">
          <p>No tienes publicaciones aún.</p>
          <button className="ps-btn ps-btn-primary" onClick={abrirNueva}>
            Crear primera publicación
          </button>
        </div>
      ) : (
        <div className="ps-lista">
          {lista.map((pub) => (
            <div
              key={pub.id}
              className={`ps-card ${!pub.activa ? 'ps-card--inactiva' : ''}`}
            >
              <div className="ps-card-imagen">
                {pub.imagen ? (
                  <img src={pub.imagen} alt={pub.titulo} />
                ) : (
                  <div className="ps-card-imagen-placeholder">
                    {pub.tipo === 'promocion' ? '🔥' : '📷'}
                  </div>
                )}
              </div>
              <div className="ps-card-cuerpo">
                <div className="ps-card-tipo" data-tipo={pub.tipo}>
                  {TIPO_NOMBRE[pub.tipo] || pub.tipo}
                </div>
                <h3 className="ps-card-titulo">{pub.titulo}</h3>
                <p className="ps-card-descripcion">{pub.descripcion}</p>
                <div className="ps-card-meta">
                  <span>{pub.fecha}</span>
                  {pub.fechaLimite && (
                    <span className="ps-card-limite">
                      Vence: {pub.fechaLimite}
                    </span>
                  )}
                  <span className={pub.activa ? 'ps-card-activa' : 'ps-card-inactiva-tag'}>
                    {pub.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div className="ps-card-acciones">
                  <button
                    className="ps-btn ps-btn-icono"
                    onClick={() => toggleActiva(pub.id)}
                    title={pub.activa ? 'Desactivar' : 'Activar'}
                  >
                    {pub.activa ? '⏸️' : '▶️'}
                  </button>
                  <button
                    className="ps-btn ps-btn-icono"
                    onClick={() => abrirEditar(pub)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="ps-btn ps-btn-icono ps-btn-icono--peligro"
                    onClick={() => eliminar(pub.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SeccionPlaceholder({ id, label }) {
  return (
    <div className="ps-seccion ps-placeholder">
      <h2 className="ps-seccion-titulo">{label}</h2>
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

  return (
    <div className="ps">
      <div className="ps-header">
        <button className="ps-header-btn" onClick={() => navigate('/home')}>
          ←
        </button>
        <div className="ps-header-info">
          <h1 className="ps-header-titulo">Panel de Socio</h1>
          <p className="ps-header-tipo">
            {usuario.nombre} · {nombreTipo}
          </p>
        </div>
      </div>

      <nav className="ps-nav">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            className={`ps-nav-btn ${seccionActiva === s.id ? 'ps-nav-btn--activo' : ''}`}
            onClick={() => setSeccionActiva(s.id)}
          >
            <span className="ps-nav-icono">{s.icon}</span>
            <span className="ps-nav-label">{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="ps-contenido">
        {seccionActiva === 'publicaciones' && <PublicacionesSection />}
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
