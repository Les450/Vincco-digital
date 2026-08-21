import { useState, useEffect, useRef } from 'react'
import Icon from '../icons/Icon'
import useStore, { perfilDeSucursal } from '../../store/puntos_usestore'
import { TIPOS_PUBLICACION } from '../../data/publicationTypes'
import { useCategoriasInventario } from '../../data/categoriasInventario'
import { agregarInventarioDesdePublicacion, eliminarInventarioDePublicacion, claveInventario } from '../../data/inventario'
import { comprimirImagen } from '../../utils/imagenes'
import ModalAccionBloqueada from '../verificacion/ModalAccionBloqueada'

const STORAGE_KEYS = Object.fromEntries(TIPOS_PUBLICACION.map((t) => [t.id, t.storageKey]))

function useStorage(key, defaults) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(key)
    if (saved) { try { return JSON.parse(saved) } catch {} }
    return defaults
  })
  useEffect(() => {
    // Sin try/catch un QuotaExceededError revienta la app entera
    // (overlay de error de CRA). Si no entra, se avisa por consola:
    // con las imagenes comprimidas no deberia pasar, pero si pasa
    // es mejor perder el ultimo cambio que tirar la pantalla.
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.warn('localStorage lleno: no se pudo guardar', key, e)
    }
  }, [data, key])
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

function FormularioPromocion({ form, setForm, fileInputRef, handleImage, categorias }) {
  return (
    <>
      <div className="panel-form-grupo">
        <label className="panel-form-label">Tipo de promoción</label>
        <select
          className="panel-form-select"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="limitada">Limitada</option>
        </select>
      </div>
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
      <div className="panel-form-row">
        <div className="panel-form-grupo">
          <label className="panel-form-label">Categoría</label>
          <select className="panel-form-select" value={form.categoriaPromocion} onChange={(e) => setForm({ ...form, categoriaPromocion: e.target.value })}>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="panel-form-grupo">
          <label className="panel-form-label">Unidades disponibles</label>
          <input className="panel-form-input" type="number" min="0" placeholder="Ej: 20" value={form.unidades} onChange={(e) => setForm({ ...form, unidades: e.target.value })} />
        </div>
      </div>
      <div className="panel-form-grupo">
        <label className="panel-form-label">Alerta de stock</label>
        <input className="panel-form-input" type="number" min="0" placeholder="Ej: 5 (avisa cuando queden esas unidades o menos)" value={form.alertaStock} onChange={(e) => setForm({ ...form, alertaStock: e.target.value })} />
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
    </>
  )
}

function FormularioProducto({ form, setForm, fileInputRef, handleImage, categorias }) {
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
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
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

const FORMULARIOS = {
  promocion: FormularioPromocion,
  producto: FormularioProducto,
}

const EMPTY_FORM = {
  promocion: { tipo: 'normal', titulo: '', descripcion: '', imagen: null, descuento: '', validoHasta: '', puntos: '', unidades: '', alertaStock: '', categoriaPromocion: 'Otros' },
  producto: { titulo: '', descripcion: '', imagen: null, precio: '', categoriaProducto: 'Herramientas', stock: '' },
}

export default function PublicacionesPanel() {
  const userType = useStore((s) => s.userType)
  const sucursalId = useStore((s) => s.sucursalActiva[s.userType])
  const inventarioClave = claveInventario(sucursalId)
  // Publicar (crear una promoción o un producto nuevo) requiere
  // cuenta verificada. Ver, editar y borrar lo que ya está
  // publicado no se toca: la regla es sobre publicar, no sobre
  // administrar lo que ya es público.
  const verificado = useStore((s) => s.estadosVerificacion[userType]) === 'aprobada'
  const [bloqueoAbierto, setBloqueoAbierto] = useState(false)

  /* Quién publica. El cliente que ve la promoción en su Home
     necesita saber de qué negocio es para poder escribirle o
     mandarle una consulta; hasta ahora la publicación no guardaba
     ni el nombre. Se toma el perfil de la sucursal activa, que es
     el mismo que el negocio muestra en su perfil público. */
  const perfil = useStore((s) => s.perfiles[s.userType])
  const sucursal = useStore((s) =>
    s.sucursales[s.userType]?.find((x) => x.id === s.sucursalActiva[s.userType])
  )
  const whatsappRed = useStore((s) => s.redesNegocio?.whatsapp)

  const [tipoActivo, setTipoActivo] = useState(TIPOS_PUBLICACION[0].id)
  // Cada sucursal guarda sus publicaciones aparte ("pn_promociones:n1"),
  // igual que el inventario. Si el dueño cambia de sucursal, la lista
  // recarga sola porque la clave cambia.
  const clavePublicaciones = sucursalId
    ? `${STORAGE_KEYS[tipoActivo]}:${sucursalId}`
    : STORAGE_KEYS[tipoActivo]
  const [lista, setLista] = useStorage(clavePublicaciones, [])
  const [filtroPromo, setFiltroPromo] = useState('todas')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [detallePub, setDetallePub] = useState(null)
  const [categorias] = useCategoriasInventario()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(EMPTY_FORM[tipoActivo])

  useEffect(() => {
    setForm(EMPTY_FORM[tipoActivo])
    setMostrarForm(false)
    setEditando(null)
    setFiltroPromo('todas')
  }, [tipoActivo])

  useEffect(() => {
    const saved = localStorage.getItem(clavePublicaciones)
    if (saved) { try { setLista(JSON.parse(saved)) } catch {} }
    else setLista([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clavePublicaciones])

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Se comprime antes de guardarla: la foto original en base64
    // llenaba el localStorage con una o dos publicaciones.
    comprimirImagen(file, 900, 0.72)
      .then((dataUrl) => setForm((prev) => ({ ...prev, imagen: dataUrl })))
      .catch(() => {})
  }

  /* Tarjeta del negocio que viaja pegada a cada publicación.
     Se arma al guardar y no al leer, porque el día que dos personas
     usen la app desde teléfonos distintos el cliente no va a tener
     el perfil del negocio a mano: tiene que venir con la promoción. */
  const datosDelNegocio = () => {
    const p = perfilDeSucursal(perfil, sucursal) || {}
    return {
      id: sucursalId || null,
      rol: userType,
      nombre: p.nombre || '',
      categoria: p.categoria || '',
      telefono: p.telefono || '',
      whatsapp: p.whatsapp || whatsappRed || p.telefono || '',
      direccion: p.direccion || '',
      descripcion: p.descripcion || '',
      foto: p.foto || null,
      verificado,
    }
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!form.titulo) return

    const item = {
      id: editando || Date.now(),
      tipo: tipoActivo,
      fecha: new Date().toISOString().slice(0, 10),
      ...form,
      negocio: datosDelNegocio(),
    }

    if (editando) {
      setLista((prev) => prev.map((p) => p.id === editando ? { ...p, ...item } : p))
    } else {
      setLista((prev) => [item, ...prev])
    }
    agregarInventarioDesdePublicacion({ ...item, tipoPublicacion: tipoActivo, tipoPromocion: form.tipo }, inventarioClave)
    setMostrarForm(false)
    setEditando(null)
    setForm(EMPTY_FORM[tipoActivo])
  }

  const eliminar = (id) => {
    setLista((prev) => prev.filter((p) => p.id !== id))
    eliminarInventarioDePublicacion(id, inventarioClave)
  }

  const abrirNuevo = () => {
    if (!verificado) { setBloqueoAbierto(true); return }
    setEditando(null)
    setForm(EMPTY_FORM[tipoActivo])
    setMostrarForm(true)
  }

  const abrirEditar = (item) => {
    setEditando(item.id)
    /* "negocio" sale del form: no es un campo que se escriba, y al
       guardar se vuelve a armar con el perfil del momento.

       "tipo" en cambio ahora SÍ se conserva. Antes se descartaba
       junto con el id, y como en las promociones ese campo es el
       que dice si es normal o limitada, editar una promoción
       limitada la convertía en normal sin avisar: el select salía
       vacío y al guardar quedaba sin tipo. */
    const { id, fecha, negocio, ...rest } = item
    setForm(rest)
    setMostrarForm(true)
  }

  const tipoInfo = TIPOS_PUBLICACION.find((t) => t.id === tipoActivo)
  const Formulario = FORMULARIOS[tipoActivo]

  const listaFiltrada = tipoActivo === 'promocion' && filtroPromo !== 'todas'
    ? lista.filter((p) => p.tipo === filtroPromo)
    : lista

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
          {' '}{tipoInfo.label} · {listaFiltrada.length} {listaFiltrada.length === 1 ? 'publicación' : 'publicaciones'}
          {tipoActivo === 'promocion' && filtroPromo !== 'todas' && (
            <span className="panel-pub-bar-total">de {lista.length} en total</span>
          )}
        </span>
        <div className="panel-pub-bar-acciones">
          {tipoActivo === 'promocion' && (
            <div className="panel-pub-filtro">
              <Icon name="chevron-down" size={14} className="panel-pub-filtro-flecha" />
              <select
                className="panel-form-select panel-pub-filtro-select"
                value={filtroPromo}
                onChange={(e) => setFiltroPromo(e.target.value)}
                aria-label="Filtrar promociones"
              >
                <option value="todas">Todas</option>
                <option value="normal">Promoción normal</option>
                <option value="limitada">Promoción limitada</option>
              </select>
            </div>
          )}
          <button className="panel-btn panel-btn-primary" onClick={abrirNuevo}>
            + Nueva
          </button>
        </div>
      </div>

      {mostrarForm && (
        <form className="panel-form" onSubmit={guardar}>
          <div className="panel-form-header">
            <span className="panel-form-badge" style={{ background: `${tipoInfo.color}20`, color: tipoInfo.color }}>
              <Icon name={tipoInfo.icon} size={14} /> {tipoInfo.label}
            </span>
            <h3 className="panel-form-titulo">{editando ? 'Editar' : 'Nueva'} publicación</h3>
          </div>

          <Formulario form={form} setForm={setForm} fileInputRef={fileInputRef} handleImage={handleImage} categorias={categorias} />

          <div className="panel-form-acciones">
            <button type="button" className="panel-btn panel-btn-secundario" onClick={() => { setMostrarForm(false); setEditando(null) }}>Cancelar</button>
            <button type="submit" className="panel-btn panel-btn-primary">{editando ? 'Guardar cambios' : 'Publicar'}</button>
          </div>
        </form>
      )}

      {listaFiltrada.length === 0 && !mostrarForm ? (
        <div className="panel-vacio">
          <div className="panel-vacio-icono"><Icon name={tipoInfo.icon} size={40} style={{ color: tipoInfo.color }} /></div>
          {tipoActivo === 'promocion' && filtroPromo !== 'todas' && lista.length > 0 ? (
            <p>No tenés promociones {filtroPromo === 'limitada' ? 'limitadas' : 'normales'} aún.</p>
          ) : (
            <p>No tenés {tipoInfo.label.toLowerCase()} aún.</p>
          )}
          <button className="panel-btn panel-btn-primary" onClick={abrirNuevo}>
            Crear {tipoInfo.label.slice(0, -1)}
          </button>
        </div>
      ) : (
        <div className="panel-pub-grid">
          {[...listaFiltrada].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map((item) => (
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
                    {item.tipo === 'limitada'
                      ? item.unidades && <span className="panel-pub-card-stock">Solo {item.unidades} uds.</span>
                      : item.puntos && <span className="panel-pub-card-pts"><Icon name="star" filled size={11} /> {item.puntos} pts</span>}
                  </div>
                )}
                {tipoActivo === 'promocion' && item.alertaStock > 0 && Number(item.unidades) > 0 && Number(item.unidades) <= Number(item.alertaStock) && (
                  <span className="panel-inv-stock-badge panel-inv-stock-badge--bajo">Stock bajo</span>
                )}
                {tipoActivo === 'producto' && item.precio && (
                  <div className="panel-pub-card-promo">
                    <span className="panel-pub-card-precio">C${item.precio}</span>
                    {item.stock && <span className="panel-pub-card-stock">{item.stock} en stock</span>}
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
                  {detallePub.tipo === 'limitada'
                    ? detallePub.unidades && <span className="panel-pub-detail-stock">Solo {detallePub.unidades} unidades</span>
                    : detallePub.puntos && <span className="panel-pub-detail-pts">{detallePub.puntos} pts por compra</span>}
                  {detallePub.validoHasta && <span className="panel-pub-detail-fecha">Válido hasta {detallePub.validoHasta}</span>}
                </div>
              )}
              {tipoActivo === 'promocion' && detallePub.alertaStock > 0 && Number(detallePub.unidades) > 0 && Number(detallePub.unidades) <= Number(detallePub.alertaStock) && (
                <div className="panel-alerta panel-alerta--warning" style={{ marginTop: 12 }}>
                  <span className="panel-alerta-icono"><Icon name="alert-triangle" size={18} /></span>
                  <span>Stock bajo: quedan {detallePub.unidades} unidades (alerta configurada en {detallePub.alertaStock}).</span>
                </div>
              )}
              {tipoActivo === 'producto' && (
                <div className="panel-pub-detail-promo">
                  {detallePub.precio && <span className="panel-pub-detail-precio">C${detallePub.precio}</span>}
                  {detallePub.stock && <span className="panel-pub-detail-stock">{detallePub.stock} unidades disponibles</span>}
                </div>
              )}

              <div className="panel-card-meta" style={{ marginTop: 16 }}>
                <span><Icon name="calendar" size={13} /> {detallePub.fecha}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {bloqueoAbierto && (
        <ModalAccionBloqueada
          rol={userType}
          mensaje={`Para publicar en Vincco necesitás verificar ${userType === 'proveedor' ? 'tu empresa' : 'tu negocio'}.`}
          onCerrar={() => setBloqueoAbierto(false)}
        />
      )}
    </div>
  )
}
