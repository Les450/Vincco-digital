import { useState, useEffect, useRef } from 'react'
import Icon from '../icons/Icon'
import { TIPOS_PUBLICACION } from '../../data/publicationTypes'

const STORAGE_KEYS = Object.fromEntries(TIPOS_PUBLICACION.map((t) => [t.id, t.storageKey]))

function useStorage(key, defaults) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(key)
    if (saved) { try { return JSON.parse(saved) } catch {} }
    return defaults
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(data)) }, [data, key])
  return [data, setData]
}

function ImagenUpload({ form, setForm, fileInputRef, handleImage, icon, texto, sub, modificador }) {
  return (
    <div className="panel-form-grupo">
      <label className="panel-form-label">{texto}</label>
      {form.imagen ? (
        <div className="panel-image-preview-container">
          <img src={form.imagen} alt="Preview" className="panel-image-preview" />
          <button type="button" className="panel-image-remove" onClick={() => setForm({ ...form, imagen: null })}><Icon name="x" size={14} /></button>
        </div>
      ) : (
        <div className={`panel-image-upload panel-image-upload--${modificador}`} onClick={() => fileInputRef.current?.click()}>
          <span className="panel-image-upload-icono"><Icon name={icon} size={32} /></span>
          <span className="panel-image-upload-texto">{texto}</span>
          <span className="panel-image-upload-sub">{sub}</span>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
    </div>
  )
}

function FormularioPromocion({ form, setForm, fileInputRef, handleImage }) {
  return (
    <>
      <ImagenUpload form={form} setForm={setForm} fileInputRef={fileInputRef} handleImage={handleImage} icon="flame" texto="Subí la imagen de tu promoción" sub="Recomendado: 1200×600px" modificador="promo" />
      <div className="panel-form-row">
        <div className="panel-form-grupo">
          <label className="panel-form-label">Título de la promoción</label>
          <input className="panel-form-input" type="text" placeholder="Ej: 50% de descuento en herramientas" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
        </div>
        <div className="panel-form-grupo">
          <label className="panel-form-label">% Descuento</label>
          <input className="panel-form-input" type="number" min="0" max="100" placeholder="Ej: 50" value={form.descuento} onChange={(e) => setForm({ ...form, descuento: e.target.value })} />
        </div>
      </div>
      <div className="panel-form-grupo">
        <label className="panel-form-label">Descripción</label>
        <textarea className="panel-form-textarea" rows={2} placeholder="Describí tu promoción..." value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
      </div>
      <div className="panel-form-row">
        <div className="panel-form-grupo">
          <label className="panel-form-label">Válido hasta</label>
          <input className="panel-form-input" type="date" value={form.validoHasta} onChange={(e) => setForm({ ...form, validoHasta: e.target.value })} />
        </div>
        <div className="panel-form-grupo">
          <label className="panel-form-label">Puntos por compra</label>
          <input className="panel-form-input" type="number" min="0" placeholder="Ej: 50" value={form.puntos} onChange={(e) => setForm({ ...form, puntos: e.target.value })} />
        </div>
      </div>
      <div className="panel-form-grupo">
        <label className="panel-form-label">Términos y condiciones</label>
        <textarea className="panel-form-textarea" rows={2} placeholder="Ej: Válido hasta agotar existencias..." value={form.terminos} onChange={(e) => setForm({ ...form, terminos: e.target.value })} />
      </div>
    </>
  )
}

function FormularioProducto({ form, setForm, fileInputRef, handleImage }) {
  return (
    <>
      <ImagenUpload form={form} setForm={setForm} fileInputRef={fileInputRef} handleImage={handleImage} icon="package" texto="Subí la imagen del producto" sub="Recomendado: 800×800px" modificador="producto" />
      <div className="panel-form-row">
        <div className="panel-form-grupo">
          <label className="panel-form-label">Nombre del producto</label>
          <input className="panel-form-input" type="text" placeholder="Ej: Martillo Stanley profesional" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
        </div>
        <div className="panel-form-grupo">
          <label className="panel-form-label">Precio (C$)</label>
          <input className="panel-form-input" type="number" min="0" placeholder="Ej: 180" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
        </div>
      </div>
      <div className="panel-form-grupo">
        <label className="panel-form-label">Descripción</label>
        <textarea className="panel-form-textarea" rows={2} placeholder="Describí tu producto..." value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
      </div>
      <div className="panel-form-row">
        <div className="panel-form-grupo">
          <label className="panel-form-label">Categoría</label>
          <select className="panel-form-select" value={form.categoriaProducto} onChange={(e) => setForm({ ...form, categoriaProducto: e.target.value })}>
            {['Herramientas', 'Materiales', 'Alimentos', 'Limpieza', 'Electrónicos', 'Ropa', 'Otros'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="panel-form-grupo">
          <label className="panel-form-label">Stock</label>
          <input className="panel-form-input" type="number" min="0" placeholder="Ej: 25" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
      </div>
    </>
  )
}

function FormularioLimitada({ form, setForm, fileInputRef, handleImage }) {
  return (
    <>
      <ImagenUpload form={form} setForm={setForm} fileInputRef={fileInputRef} handleImage={handleImage} icon="zap" texto="Subí la imagen de la oferta limitada" sub="Recomendado: 1200×600px" modificador="limitada" />
      <div className="panel-form-row">
        <div className="panel-form-grupo">
          <label className="panel-form-label">Título</label>
          <input className="panel-form-input" type="text" placeholder="Ej: Semana de la Moda" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
        </div>
        <div className="panel-form-grupo">
          <label className="panel-form-label">Unidades disponibles</label>
          <input className="panel-form-input" type="number" min="0" placeholder="Ej: 20" value={form.unidades} onChange={(e) => setForm({ ...form, unidades: e.target.value })} />
        </div>
      </div>
      <div className="panel-form-grupo">
        <label className="panel-form-label">Descripción</label>
        <textarea className="panel-form-textarea" rows={2} placeholder="Describí tu oferta limitada..." value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
      </div>
      <div className="panel-form-row">
        <div className="panel-form-grupo">
          <label className="panel-form-label">Válido hasta</label>
          <input className="panel-form-input" type="date" value={form.validoHasta} onChange={(e) => setForm({ ...form, validoHasta: e.target.value })} />
        </div>
        <div className="panel-form-grupo">
          <label className="panel-form-label">Descuento</label>
          <input className="panel-form-input" type="text" placeholder="Ej: 30% OFF / 2x1" value={form.descuento} onChange={(e) => setForm({ ...form, descuento: e.target.value })} />
        </div>
      </div>
    </>
  )
}

function FormularioDestacada({ form, setForm, fileInputRef, handleImage }) {
  return (
    <>
      <ImagenUpload form={form} setForm={setForm} fileInputRef={fileInputRef} handleImage={handleImage} icon="trending-up" texto="Subí la imagen de la publicación destacada" sub="Recomendado: 1200×600px" modificador="destacada" />
      <div className="panel-form-row">
        <div className="panel-form-grupo">
          <label className="panel-form-label">Título</label>
          <input className="panel-form-input" type="text" placeholder="Ej: Nueva línea de temporada" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
        </div>
        <div className="panel-form-grupo">
          <label className="panel-form-label">Categoría</label>
          <input className="panel-form-input" type="text" placeholder="Ej: Restaurante, Ropa..." value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
        </div>
      </div>
      <div className="panel-form-grupo">
        <label className="panel-form-label">Descripción</label>
        <textarea className="panel-form-textarea" rows={2} placeholder="Contá por qué debería destacarse..." value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
      </div>
    </>
  )
}

const FORMULARIOS = {
  promocion: FormularioPromocion,
  producto: FormularioProducto,
  limitada: FormularioLimitada,
  destacada: FormularioDestacada,
}

const EMPTY_FORM = {
  promocion: { titulo: '', descripcion: '', imagen: null, descuento: '', validoHasta: '', terminos: '', puntos: '' },
  producto: { titulo: '', descripcion: '', imagen: null, precio: '', categoriaProducto: 'Herramientas', stock: '' },
  limitada: { titulo: '', descripcion: '', imagen: null, descuento: '', validoHasta: '', unidades: '' },
  destacada: { titulo: '', descripcion: '', imagen: null, categoria: '' },
}

export default function PublicacionesPanel() {
  const [tipoActivo, setTipoActivo] = useState(TIPOS_PUBLICACION[0].id)
  const [lista, setLista] = useStorage(STORAGE_KEYS[tipoActivo], [])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [detallePub, setDetallePub] = useState(null)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(EMPTY_FORM[tipoActivo])

  useEffect(() => {
    setForm(EMPTY_FORM[tipoActivo])
    setMostrarForm(false)
    setEditando(null)
  }, [tipoActivo])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS[tipoActivo])
    if (saved) { try { setLista(JSON.parse(saved)) } catch {} }
    else setLista([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoActivo])

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm({ ...form, imagen: ev.target.result })
    reader.readAsDataURL(file)
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!form.titulo) return

    const item = { id: Date.now(), tipo: tipoActivo, fecha: new Date().toISOString().slice(0, 10), ...form }

    if (editando) {
      setLista((prev) => prev.map((p) => p.id === editando ? { ...p, ...item } : p))
    } else {
      setLista((prev) => [item, ...prev])
    }
    setMostrarForm(false)
    setEditando(null)
    setForm(EMPTY_FORM[tipoActivo])
  }

  const eliminar = (id) => {
    setLista((prev) => prev.filter((p) => p.id !== id))
  }

  const abrirEditar = (item) => {
    setEditando(item.id)
    const { id, fecha, tipo, ...rest } = item
    setForm(rest)
    setMostrarForm(true)
  }

  const tipoInfo = TIPOS_PUBLICACION.find((t) => t.id === tipoActivo)
  const Formulario = FORMULARIOS[tipoActivo]

  return (
    <div className="panel-seccion">
      <div className="panel-seccion-header">
        <div>
          <h2 className="panel-seccion-titulo">Publicaciones</h2>
          <p className="panel-seccion-desc">Creá y administrá el contenido que ven tus clientes</p>
        </div>
      </div>

      <div className="panel-pub-tabs">
        {TIPOS_PUBLICACION.map((t) => (
          <button
            key={t.id}
            className={`panel-pub-tab ${tipoActivo === t.id ? 'panel-pub-tab--activo' : ''}`}
            onClick={() => setTipoActivo(t.id)}
            style={tipoActivo === t.id ? { '--tab-color': t.color } : {}}
          >
            <span className="panel-pub-tab-icono"><Icon name={t.icon} size={18} /></span>
            <span className="panel-pub-tab-info">
              <span className="panel-pub-tab-label">{t.label}</span>
              <span className="panel-pub-tab-desc">{t.desc}</span>
            </span>
            <span className="panel-pub-tab-count">{tipoActivo === t.id ? lista.length : ''}</span>
          </button>
        ))}
      </div>

      <div className="panel-pub-bar">
        <span className="panel-pub-bar-info">
          <Icon name={tipoInfo.icon} size={16} style={{ color: tipoInfo.color }} />
          {' '}{tipoInfo.label} · {lista.length} publicaciones
        </span>
        <button className="panel-btn panel-btn-primary" onClick={() => { setEditando(null); setForm(EMPTY_FORM[tipoActivo]); setMostrarForm(true) }}>
          + Nueva
        </button>
      </div>

      {mostrarForm && (
        <form className="panel-form" onSubmit={guardar}>
          <div className="panel-form-header">
            <span className="panel-form-badge" style={{ background: `${tipoInfo.color}20`, color: tipoInfo.color }}>
              <Icon name={tipoInfo.icon} size={14} /> {tipoInfo.label}
            </span>
            <h3 className="panel-form-titulo">{editando ? 'Editar' : 'Nueva'} publicación</h3>
          </div>

          <Formulario form={form} setForm={setForm} fileInputRef={fileInputRef} handleImage={handleImage} />

          <div className="panel-form-acciones">
            <button type="button" className="panel-btn panel-btn-secundario" onClick={() => { setMostrarForm(false); setEditando(null) }}>Cancelar</button>
            <button type="submit" className="panel-btn panel-btn-primary">{editando ? 'Guardar cambios' : 'Publicar'}</button>
          </div>
        </form>
      )}

      {lista.length === 0 && !mostrarForm ? (
        <div className="panel-vacio">
          <div className="panel-vacio-icono"><Icon name={tipoInfo.icon} size={40} style={{ color: tipoInfo.color }} /></div>
          <p>No tenés {tipoInfo.label.toLowerCase()} aún.</p>
          <button className="panel-btn panel-btn-primary" onClick={() => { setEditando(null); setForm(EMPTY_FORM[tipoActivo]); setMostrarForm(true) }}>
            Crear {tipoInfo.label.slice(0, -1)}
          </button>
        </div>
      ) : (
        <div className="panel-pub-grid">
          {[...lista].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map((item) => (
            <div key={item.id} className="panel-pub-card" style={{ '--card-accent': tipoInfo.color }}>
              <div className="panel-pub-card-imagen">
                {item.imagen ? (
                  <img src={item.imagen} alt={item.titulo} />
                ) : (
                  <div className="panel-pub-card-placeholder" style={{ background: `${tipoInfo.color}10` }}>
                    <Icon name={tipoInfo.icon} size={36} style={{ color: `${tipoInfo.color}40` }} />
                  </div>
                )}
                <div className="panel-pub-card-type" style={{ background: tipoInfo.color }}>
                  <Icon name={tipoInfo.icon} size={11} /> {tipoInfo.label}
                </div>
              </div>
              <div className="panel-pub-card-body">
                <h3 className="panel-pub-card-titulo">{item.titulo}</h3>
                {item.descripcion && <p className="panel-pub-card-desc">{item.descripcion}</p>}

                {tipoActivo === 'promocion' && item.descuento && (
                  <div className="panel-pub-card-promo">
                    <span className="panel-pub-card-badge">-{item.descuento}%</span>
                    {item.puntos && <span className="panel-pub-card-pts"><Icon name="star" filled size={11} /> {item.puntos} pts</span>}
                  </div>
                )}
                {tipoActivo === 'producto' && item.precio && (
                  <div className="panel-pub-card-promo">
                    <span className="panel-pub-card-precio">C${item.precio}</span>
                    {item.stock && <span className="panel-pub-card-stock">{item.stock} en stock</span>}
                  </div>
                )}
                {tipoActivo === 'limitada' && (
                  <div className="panel-pub-card-promo">
                    {item.descuento && <span className="panel-pub-card-badge">{item.descuento}</span>}
                    {item.unidades && <span className="panel-pub-card-stock">Solo {item.unidades} uds.</span>}
                  </div>
                )}
                {tipoActivo === 'destacada' && item.categoria && (
                  <div className="panel-pub-card-promo">
                    <span className="panel-pub-card-badge">{item.categoria}</span>
                  </div>
                )}

                <div className="panel-pub-card-footer">
                  <span className="panel-pub-card-fecha"><Icon name="calendar" size={11} /> {item.fecha}</span>
                  <div className="panel-pub-card-acciones">
                    <button className="panel-btn panel-btn-icono" onClick={() => setDetallePub(item)} title="Ver"><Icon name="eye" size={14} /></button>
                    <button className="panel-btn panel-btn-icono" onClick={() => abrirEditar(item)} title="Editar"><Icon name="edit-2" size={14} /></button>
                    <button className="panel-btn panel-btn-icono panel-btn-icono--peligro" onClick={() => eliminar(item.id)} title="Eliminar"><Icon name="trash-2" size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {detallePub && (
        <div className="panel-modal-overlay" onClick={() => setDetallePub(null)}>
          <div className="panel-modal panel-modal--pub" onClick={(e) => e.stopPropagation()}>
            <div className="panel-modal-header">
              <h3 className="panel-modal-titulo">{detallePub.titulo}</h3>
              <button className="panel-modal-cerrar" onClick={() => setDetallePub(null)}><Icon name="x" size={16} /></button>
            </div>
            <div className="panel-modal-body">
              {detallePub.imagen && (
                <div className="panel-pub-detail-img">
                  <img src={detallePub.imagen} alt={detallePub.titulo} />
                </div>
              )}
              <div className="panel-pub-detail-info">
                <span className="panel-card-categoria" style={{ background: `${tipoInfo.color}15`, color: tipoInfo.color }}>
                  <Icon name={tipoInfo.icon} size={12} /> {tipoInfo.label}
                </span>
              </div>
              <p className="panel-modal-texto">{detallePub.descripcion}</p>

              {tipoActivo === 'promocion' && (
                <div className="panel-pub-detail-promo">
                  {detallePub.descuento && <span className="panel-pub-detail-badge">-{detallePub.descuento}% OFF</span>}
                  {detallePub.puntos && <span className="panel-pub-detail-pts">{detallePub.puntos} pts por compra</span>}
                  {detallePub.validoHasta && <span className="panel-pub-detail-fecha">Válido hasta {detallePub.validoHasta}</span>}
                </div>
              )}
              {tipoActivo === 'producto' && (
                <div className="panel-pub-detail-promo">
                  {detallePub.precio && <span className="panel-pub-detail-precio">C${detallePub.precio}</span>}
                  {detallePub.stock && <span className="panel-pub-detail-stock">{detallePub.stock} unidades disponibles</span>}
                </div>
              )}
              {tipoActivo === 'limitada' && (
                <div className="panel-pub-detail-promo">
                  {detallePub.descuento && <span className="panel-pub-detail-badge">{detallePub.descuento}</span>}
                  {detallePub.unidades && <span className="panel-pub-detail-stock">Solo {detallePub.unidades} unidades</span>}
                  {detallePub.validoHasta && <span className="panel-pub-detail-fecha">Hasta {detallePub.validoHasta}</span>}
                </div>
              )}
              {tipoActivo === 'destacada' && detallePub.categoria && (
                <div className="panel-pub-detail-promo">
                  <span className="panel-pub-detail-badge">{detallePub.categoria}</span>
                </div>
              )}

              <div className="panel-card-meta" style={{ marginTop: 16 }}>
                <span><Icon name="calendar" size={13} /> {detallePub.fecha}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
