import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import { proveedores } from '../data/data_falso'
import './PanelNegocio.css'

const TABS = [
  { id: 'publicaciones', label: 'Publicaciones', icon: '📢' },
  { id: 'proveedores', label: 'Proveedores', icon: '📦' },
  { id: 'inventario', label: 'Inventario', icon: '📊' },
]

const CATEGORIAS_PUBLICACION = [
  'Promoción', 'Producto', 'Oferta', 'Evento', 'Noticia', 'Servicio',
]

const ESTADOS_PUBLICACION = ['Activa', 'Inactiva', 'Programada']

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
    <div className="pn-seccion">
      <div className="pn-seccion-header">
        <div>
          <h2 className="pn-seccion-titulo">Proveedores</h2>
          <p className="pn-seccion-desc">Encuentra y administra tus proveedores</p>
        </div>
      </div>

      <div className="pn-acciones-barra">
        <button className="pn-btn pn-btn-primary" onClick={() => setFiltro('todos')}>
          🔍 Buscar nuevos proveedores
        </button>
        <button className="pn-btn pn-btn-outline" onClick={() => setFiltro('todos')}>
          📍 Localizar
        </button>
        <button
          className={`pn-btn ${filtro === 'favoritos' ? 'pn-btn-primary' : 'pn-btn-outline'}`}
          onClick={() => setFiltro(filtro === 'favoritos' ? 'todos' : 'favoritos')}
        >
          ⭐ Favoritos {favoritos.length > 0 && `(${favoritos.length})`}
        </button>
      </div>

      {listaFiltrada.length === 0 ? (
        <div className="pn-vacio">
          <div className="pn-vacio-icono">📦</div>
          <p>{filtro === 'favoritos' ? 'No tienes proveedores favoritos.' : 'No hay proveedores disponibles.'}</p>
        </div>
      ) : (
        <div className="pn-lista">
          {listaFiltrada.map((prov) => (
            <div key={prov.id} className="pn-proveedor-card">
              <div className="pn-proveedor-icono">
                {prov.categoria === 'alimentos' ? '🥫' : '🧱'}
              </div>
              <div className="pn-proveedor-info">
                <h3 className="pn-proveedor-nombre">{prov.nombre}</h3>
                <p className="pn-proveedor-detalle">
                  {prov.descripcion} ·{' '}
                  <span style={{ color: prov.estado === 'Verificado' ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {prov.estado}
                  </span>
                </p>
              </div>
              <button
                className={`pn-btn pn-btn-outline`}
                onClick={() => setSelectedProveedor(prov)}
                style={{ fontSize: 12, padding: '6px 14px', flexShrink: 0 }}
              >
                Ver información
              </button>
              <button
                className={`pn-proveedor-fav ${favoritos.includes(prov.id) ? 'pn-proveedor-fav--activo' : ''}`}
                onClick={() => toggleFav(prov.id)}
                title={favoritos.includes(prov.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {favoritos.includes(prov.id) ? '⭐' : '☆'}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedProveedor && (
        <div className="pn-modal-overlay" onClick={() => setSelectedProveedor(null)}>
          <div className="pn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pn-modal-header">
              <h3 className="pn-modal-titulo">{selectedProveedor.nombre}</h3>
              <button className="pn-modal-cerrar" onClick={() => setSelectedProveedor(null)}>×</button>
            </div>
            <div className="pn-modal-body">
              <p style={{ margin: 0, color: '#374151', fontSize: 14, lineHeight: 1.6 }}>
                {selectedProveedor.descripcion}
              </p>
              <div>
                <span className="pn-modal-info-label">Categorías</span>
                <div className="pn-modal-productos">
                  {selectedProveedor.categorias.map((cat) => (
                    <span key={cat} className="pn-modal-producto-tag">{cat}</span>
                  ))}
                </div>
              </div>
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Contacto</span>
                <span className="pn-modal-info-value">{selectedProveedor.contacto}</span>
              </div>
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Teléfono</span>
                <span className="pn-modal-info-value">{selectedProveedor.telefono}</span>
              </div>
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Ubicación</span>
                <span className="pn-modal-info-value">{selectedProveedor.ubicacion}</span>
              </div>
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Estado</span>
                <span className="pn-modal-info-value" style={{ color: selectedProveedor.estado === 'Verificado' ? '#15803d' : '#b45309', fontWeight: 600 }}>
                  {selectedProveedor.estado}
                </span>
              </div>
              <div>
                <span className="pn-modal-info-label">Productos</span>
                <div className="pn-modal-productos">
                  {selectedProveedor.productos.map((prod) => (
                    <span key={prod} className="pn-modal-producto-tag">{prod}</span>
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

function PublicacionesSection() {
  const [lista, setLista] = useState(() => {
    const saved = localStorage.getItem('pn_publicaciones')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return [
      {
        id: 1, titulo: 'Nuevo lote de herramientas',
        descripcion: 'Tenemos las mejores herramientas para tu ferretería.',
        imagen: null, categoria: 'Producto',
        fecha: '2026-06-14', estado: 'Activa',
      },
      {
        id: 2, titulo: 'Oferta especial en granos básicos',
        descripcion: 'Aprovecha nuestros precios mayoristas en arroz, frijoles y maíz.',
        imagen: null, categoria: 'Oferta',
        fecha: '2026-06-12', estado: 'Activa',
      },
      {
        id: 3, titulo: '50% de descuento en segunda unidad',
        descripcion: 'Compra un producto y llévate el segundo con mitad de precio.',
        imagen: null, categoria: 'Promoción',
        fecha: '2026-06-10', estado: 'Programada',
      },
    ]
  })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [detallePub, setDetallePub] = useState(null)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    titulo: '', descripcion: '', categoria: 'Producto',
    fecha: new Date().toISOString().slice(0, 10), estado: 'Activa', imagen: null,
  })

  useEffect(() => {
    localStorage.setItem('pn_publicaciones', JSON.stringify(lista))
  }, [lista])

  const abrirNueva = () => {
    setEditando(null)
    setForm({
      titulo: '', descripcion: '', categoria: 'Producto',
      fecha: new Date().toISOString().slice(0, 10), estado: 'Activa', imagen: null,
    })
    setMostrarForm(true)
  }

  const abrirEditar = (pub) => {
    setEditando(pub.id)
    setForm({
      titulo: pub.titulo, descripcion: pub.descripcion,
      categoria: pub.categoria,
      fecha: pub.fecha, estado: pub.estado,
      imagen: pub.imagen,
    })
    setMostrarForm(true)
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm({ ...form, imagen: ev.target.result })
    reader.readAsDataURL(file)
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!form.titulo || !form.descripcion) return

    if (editando) {
      setLista((prev) =>
        prev.map((p) => p.id === editando ? { ...p, ...form } : p)
      )
    } else {
      setLista((prev) => [{ id: Date.now(), ...form }, ...prev])
    }
    setMostrarForm(false)
    setEditando(null)
  }

  const eliminar = (id) => {
    setLista((prev) => prev.filter((p) => p.id !== id))
  }

  const ordenarPorFecha = (items) =>
    [...items].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const historial = ordenarPorFecha(lista).slice(0, 5)

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'Activa': return 'pn-estado-badge--activa'
      case 'Inactiva': return 'pn-estado-badge--inactiva'
      case 'Programada': return 'pn-estado-badge--programada'
      default: return ''
    }
  }

  return (
    <div className="pn-seccion">
      <div className="pn-seccion-header">
        <div>
          <h2 className="pn-seccion-titulo">Publicaciones</h2>
          <p className="pn-seccion-desc">Administra tus promociones, productos y ofertas</p>
        </div>
        <button className="pn-btn pn-btn-primary" onClick={abrirNueva}>
          + Nueva Publicación
        </button>
      </div>

      {mostrarForm && (
        <form className="pn-form" onSubmit={guardar}>
          <h3 className="pn-form-titulo">
            {editando ? 'Editar publicación' : 'Nueva publicación'}
          </h3>

          <div className="pn-form-grupo">
            <label className="pn-form-label">Imagen principal</label>
            {form.imagen ? (
              <div className="pn-image-preview-container">
                <img src={form.imagen} alt="Preview" className="pn-image-preview" />
                <button type="button" className="pn-image-remove" onClick={() => setForm({ ...form, imagen: null })}>×</button>
              </div>
            ) : (
              <div className="pn-image-upload" onClick={() => fileInputRef.current?.click()}>
                <span className="pn-image-upload-icono">📷</span>
                <span className="pn-image-upload-texto">Haz clic para agregar una imagen</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImage}
            />
          </div>

          <div className="pn-form-grupo">
            <label className="pn-form-label">Título</label>
            <input
              className="pn-form-input" type="text"
              placeholder="Ej: Nuevo lote de herramientas"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>

          <div className="pn-form-grupo">
            <label className="pn-form-label">Descripción</label>
            <textarea
              className="pn-form-textarea" rows={3}
              placeholder="Describe tu publicación..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          <div className="pn-form-row">
            <div className="pn-form-grupo">
              <label className="pn-form-label">Categoría</label>
              <select
                className="pn-form-select"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              >
                {CATEGORIAS_PUBLICACION.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="pn-form-grupo">
              <label className="pn-form-label">Fecha de publicación</label>
              <input
                className="pn-form-input" type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </div>
          </div>

          <div className="pn-form-grupo">
            <label className="pn-form-label">Estado</label>
            <select
              className="pn-form-select"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              {ESTADOS_PUBLICACION.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="pn-form-acciones">
            <button type="button" className="pn-btn pn-btn-secundario" onClick={() => { setMostrarForm(false); setEditando(null) }}>
              Cancelar
            </button>
            <button type="submit" className="pn-btn pn-btn-primary">
              {editando ? 'Guardar cambios' : 'Publicar'}
            </button>
          </div>
        </form>
      )}

      {lista.length === 0 ? (
        <div className="pn-vacio">
          <p>No tienes publicaciones aún.</p>
          <button className="pn-btn pn-btn-primary" onClick={abrirNueva}>
            Crear primera publicación
          </button>
        </div>
      ) : (
        <>
          <div className="pn-lista">
            {ordenarPorFecha(lista).map((pub) => (
              <div key={pub.id} className={`pn-card ${pub.estado === 'Inactiva' ? 'pn-card--inactiva' : ''}`}>
                <div className="pn-card-imagen">
                  {pub.imagen ? (
                    <img src={pub.imagen} alt={pub.titulo} />
                  ) : (
                    <div className="pn-card-imagen-placeholder">
                      {pub.categoria === 'Promoción' ? '🔥' : pub.categoria === 'Oferta' ? '💥' : '📷'}
                    </div>
                  )}
                </div>
                <div className="pn-card-cuerpo">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {pub.categoria}
                    </span>
                    <span className={`pn-estado-badge ${getEstadoBadgeClass(pub.estado)}`}>
                      {pub.estado}
                    </span>
                  </div>
                  <h3 className="pn-card-titulo">{pub.titulo}</h3>
                  <p className="pn-card-descripcion">{pub.descripcion}</p>
                  <div className="pn-card-meta">
                    <span>📅 {pub.fecha}</span>
                  </div>
                  <div className="pn-card-acciones">
                    <button className="pn-btn pn-btn-icono" onClick={() => setDetallePub(pub)} title="Ver detalles">👁️</button>
                    <button className="pn-btn pn-btn-icono" onClick={() => abrirEditar(pub)} title="Editar">✏️</button>
                    <button className="pn-btn pn-btn-icono pn-btn-icono--peligro" onClick={() => eliminar(pub.id)} title="Eliminar">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {historial.length > 0 && (
            <div className="pn-historial">
              <h3 className="pn-historial-titulo">🕐 Últimas publicaciones</h3>
              {historial.map((pub) => (
                <div key={pub.id} className="pn-historial-item" onClick={() => setDetallePub(pub)} style={{ cursor: 'pointer' }}>
                  <div className="pn-historial-item-icono">
                    {pub.categoria === 'Promoción' ? '🔥' : pub.categoria === 'Oferta' ? '💥' : '📷'}
                  </div>
                  <div className="pn-historial-item-info">
                    <p className="pn-historial-item-titulo">{pub.titulo}</p>
                    <p className="pn-historial-item-fecha">{pub.fecha} · {pub.estado}</p>
                  </div>
                  <span className={`pn-estado-badge ${getEstadoBadgeClass(pub.estado)}`}>
                    {pub.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {detallePub && (
        <div className="pn-modal-overlay" onClick={() => setDetallePub(null)}>
          <div className="pn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pn-modal-header">
              <h3 className="pn-modal-titulo">{detallePub.titulo}</h3>
              <button className="pn-modal-cerrar" onClick={() => setDetallePub(null)}>×</button>
            </div>
            <div className="pn-detalle-publicacion">
              {detallePub.imagen && <img src={detallePub.imagen} alt={detallePub.titulo} />}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {detallePub.categoria}
                </span>
                <span className={`pn-estado-badge ${getEstadoBadgeClass(detallePub.estado)}`}>
                  {detallePub.estado}
                </span>
              </div>
              <p>{detallePub.descripcion}</p>
              <div className="pn-card-meta">
                <span>📅 {detallePub.fecha}</span>
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
    if (item.cantidad === 0) return { label: 'Agotado', className: 'pn-inv-stock-badge--agotado', itemClass: 'pn-inv-item--agotado', numClass: 'pn-inv-item-num--agotado' }
    if (item.cantidad <= item.stockMinimo) return { label: 'Stock bajo', className: 'pn-inv-stock-badge--bajo', itemClass: 'pn-inv-item--bajo', numClass: 'pn-inv-item-num--bajo' }
    return { label: 'Stock suficiente', className: 'pn-inv-stock-badge--suficiente', itemClass: '', numClass: '' }
  }

  const getItemIcono = (cat) => {
    const icons = {
      Herramientas: '🔧', Materiales: '🧱', Alimentos: '🌾',
      Limpieza: '🧴', Electrónicos: '⚡', Ropa: '👕',
    }
    return icons[cat] || '📦'
  }

  const itemsFiltrados = filtroCategoria === 'Todas'
    ? items : items.filter((i) => i.categoria === filtroCategoria)

  const totalProductos = items.length
  const totalUnidades = items.reduce((s, i) => s + i.cantidad, 0)
  const stockBajo = items.filter((i) => i.cantidad > 0 && i.cantidad <= i.stockMinimo).length
  const agotados = items.filter((i) => i.cantidad === 0).length

  return (
    <div className="pn-seccion">
      <div className="pn-seccion-header">
        <div>
          <h2 className="pn-seccion-titulo">Inventario y Stock</h2>
          <p className="pn-seccion-desc">Administra tus productos, cantidades y precios</p>
        </div>
        <button className="pn-btn pn-btn-primary" onClick={abrirNuevo}>+ Agregar producto</button>
      </div>

      <div className="pn-inv-resumen">
        <div className="pn-inv-resumen-card">
          <span className="pn-inv-resumen-num">{totalProductos}</span>
          <span className="pn-inv-resumen-label">Total productos</span>
        </div>
        <div className="pn-inv-resumen-card">
          <span className="pn-inv-resumen-num">{totalUnidades}</span>
          <span className="pn-inv-resumen-label">Unidades en inventario</span>
        </div>
        <div className="pn-inv-resumen-card pn-inv-resumen-card--alerta">
          <span className="pn-inv-resumen-num">{stockBajo + agotados}</span>
          <span className="pn-inv-resumen-label">Stock bajo</span>
        </div>
      </div>

      {(stockBajo > 0 || agotados > 0) && (
        <div className={`pn-alerta ${agotados > 0 ? 'pn-alerta--danger' : 'pn-alerta--warning'}`}>
          <span className="pn-alerta-icono">{agotados > 0 ? '🚨' : '⚠️'}</span>
          <span>
            {agotados > 0
              ? `${agotados} producto(s) agotado(s) y ${stockBajo} con stock bajo.`
              : `${stockBajo} producto(s) con stock bajo. Revisa tu inventario.`}
          </span>
        </div>
      )}

      <div className="pn-inv-filtros">
        {CATEGORIAS_INVENTARIO.map((cat) => (
          <button
            key={cat}
            className={`pn-nav-btn ${filtroCategoria === cat ? 'pn-nav-btn--activo' : ''}`}
            onClick={() => setFiltroCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {mostrarForm && (
        <form className="pn-form" onSubmit={guardar}>
          <h3 className="pn-form-titulo">{editando ? 'Editar producto' : 'Agregar producto'}</h3>

          <div className="pn-form-row">
            <div className="pn-form-grupo">
              <label className="pn-form-label">Nombre del producto</label>
              <input className="pn-form-input" type="text" placeholder="Ej: Martillo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="pn-form-grupo">
              <label className="pn-form-label">Categoría</label>
              <select className="pn-form-select" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS_INVENTARIO.filter((c) => c !== 'Todas').map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="pn-form-row pn-form-row--3">
            <div className="pn-form-grupo">
              <label className="pn-form-label">Cantidad</label>
              <input className="pn-form-input" type="number" min="0" placeholder="0" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
            </div>
            <div className="pn-form-grupo">
              <label className="pn-form-label">Unidad</label>
              <select className="pn-form-select" value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })}>
                {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="pn-form-grupo">
              <label className="pn-form-label">Precio (C$)</label>
              <input className="pn-form-input" type="number" min="0" placeholder="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
            </div>
          </div>

          <div className="pn-form-grupo">
            <label className="pn-form-label">Stock mínimo (alerta)</label>
            <input className="pn-form-input" type="number" min="0" placeholder="0" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} />
          </div>

          <div className="pn-form-acciones">
            <button type="button" className="pn-btn pn-btn-secundario" onClick={() => { setMostrarForm(false); setEditando(null) }}>Cancelar</button>
            <button type="submit" className="pn-btn pn-btn-primary">{editando ? 'Guardar cambios' : 'Agregar'}</button>
          </div>
        </form>
      )}

      {itemsFiltrados.length === 0 ? (
        <div className="pn-vacio">
          <p>No hay productos en esta categoría.</p>
          <button className="pn-btn pn-btn-primary" onClick={abrirNuevo}>Agregar producto</button>
        </div>
      ) : (
        <div className="pn-lista">
          {itemsFiltrados.map((item) => {
            const status = getStockStatus(item)
            return (
              <div key={item.id} className={`pn-inv-item ${status.itemClass}`}>
                <div className="pn-inv-item-icono">{getItemIcono(item.categoria)}</div>
                <div className="pn-inv-item-info">
                  <h3 className="pn-inv-item-nombre">{item.nombre}</h3>
                  <p className="pn-inv-item-detalle">{item.categoria} · C${item.precio} / {item.unidad}</p>
                </div>
                <div className="pn-inv-item-cantidad">
                  <span className={`pn-inv-item-num ${status.numClass}`}>{item.cantidad}</span>
                  <span className="pn-inv-item-unidad">{item.unidad}</span>
                  <span className={`pn-inv-stock-badge ${status.className}`}>{status.label}</span>
                </div>
                <div className="pn-inv-item-acciones">
                  <button className="pn-btn pn-btn-icono" onClick={() => setDetalleItem(item)} title="Ver detalles">👁️</button>
                  <button className="pn-btn pn-btn-icono" onClick={() => abrirEditar(item)} title="Editar">✏️</button>
                  <button className="pn-btn pn-btn-icono" onClick={() => actualizarStock(item.id)} title="Actualizar existencias">📦</button>
                  <button className="pn-btn pn-btn-icono pn-btn-icono--peligro" onClick={() => eliminar(item.id)} title="Eliminar">🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {detalleItem && (
        <div className="pn-modal-overlay" onClick={() => setDetalleItem(null)}>
          <div className="pn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pn-modal-header">
              <h3 className="pn-modal-titulo">{detalleItem.nombre}</h3>
              <button className="pn-modal-cerrar" onClick={() => setDetalleItem(null)}>×</button>
            </div>
            <div className="pn-modal-body">
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Categoría</span>
                <span className="pn-modal-info-value">{detalleItem.categoria}</span>
              </div>
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Precio</span>
                <span className="pn-modal-info-value">C${detalleItem.precio} / {detalleItem.unidad}</span>
              </div>
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Cantidad</span>
                <span className="pn-modal-info-value">{detalleItem.cantidad} {detalleItem.unidad}(s)</span>
              </div>
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Stock mínimo</span>
                <span className="pn-modal-info-value">{detalleItem.stockMinimo} {detalleItem.unidad}(s)</span>
              </div>
              <div className="pn-modal-info-row">
                <span className="pn-modal-info-label">Estado</span>
                <span className={`pn-inv-stock-badge ${getStockStatus(detalleItem).className}`}>
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
  const { userType, negocio, usuario } = useStore()
  const [tabActiva, setTabActiva] = useState('publicaciones')

  const esNegocio = userType === 'negocio'

  useEffect(() => {
    if (!esNegocio) {
      navigate('/home')
    }
  }, [esNegocio, navigate])

  if (!esNegocio) return null

  return (
    <div className="pn">
      <div className="pn-header">
        <button className="pn-header-btn" onClick={() => navigate('/home')}>
          ←
        </button>
        <div className="pn-header-info">
          <h1 className="pn-header-titulo">{negocio.nombre}</h1>
          <p className="pn-header-tipo">{usuario.nombre} · Rol: Negocio</p>
        </div>
      </div>

      <nav className="pn-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`pn-nav-btn ${tabActiva === tab.id ? 'pn-nav-btn--activo' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            <span className="pn-nav-icono">{tab.icon}</span>
            <span className="pn-nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="pn-contenido">
        {tabActiva === 'publicaciones' && <PublicacionesSection />}
        {tabActiva === 'proveedores' && <ProveedoresSection />}
        {tabActiva === 'inventario' && <InventarioSection />}
      </div>
    </div>
  )
}
