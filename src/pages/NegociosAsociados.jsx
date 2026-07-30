import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import { categoriasNegocioAsociado } from '../data/data_falso'
import './NegociosAsociados.css'

const CAT_ICONOS = {
  'Pulpería': 'store',
  'Ferretería': 'tool',
  'Farmacia': 'heart',
  'Boutique': 'shirt',
  'Restaurante': 'utensils',
  'Cafetería': 'coffee',
  'Agroservicio': 'package',
  'Tecnología': 'laptop',
  'Otro': 'store',
}

const COLORES_NUEVO = ['#007a7b', '#c05900', '#005c5e', '#a34b00', '#dd6600', '#003f5a']

const FORM_VACIO = {
  nombre: '', categoria: categoriasNegocioAsociado[0], propietario: '',
  whatsapp: '', correo: '', direccion: '', municipio: '', departamento: '',
  descripcion: '', imagen: null,
}

function soloDigitos(valor) {
  return (valor || '').replace(/\D/g, '')
}

function MediaNegocio({ negocio, size = 56 }) {
  const icono = CAT_ICONOS[negocio.categoria] || 'store'
  if (negocio.imagen) {
    return <img src={negocio.imagen} alt={negocio.nombre} className="na-detalle-img" />
  }
  return (
    <div
      className="na-detalle-img na-detalle-img--placeholder"
      style={{ background: `linear-gradient(135deg, ${negocio.color} 0%, ${negocio.color}cc 100%)` }}
    >
      <div className="na-detalle-img-patron" />
      <Icon name={icono} size={size} style={{ color: '#ffffff' }} />
    </div>
  )
}

function TarjetaNegocio({ negocio, activo, onSeleccionar }) {
  const icono = CAT_ICONOS[negocio.categoria] || 'store'
  return (
    <button
      type="button"
      className={`na-card ${activo ? 'na-card--activa' : ''}`}
      onClick={() => onSeleccionar(negocio.id)}
    >
      <span
        className="na-card-icono"
        style={{ background: `linear-gradient(135deg, ${negocio.color}, ${negocio.color}cc)` }}
      >
        {negocio.imagen
          ? <img src={negocio.imagen} alt="" />
          : <Icon name={icono} size={19} style={{ color: '#ffffff' }} />}
      </span>
      <span className="na-card-info">
        <span className="na-card-nombre">{negocio.nombre}</span>
        <span className="na-card-categoria">{negocio.categoria}</span>
      </span>
      <Icon name="arrow-right" size={15} className="na-card-flecha" />
    </button>
  )
}

export default function NegociosAsociados() {
  const navigate = useNavigate()
  const { userType, negociosAsociados, agregarNegocioAsociado, enviarNotificacionCompra } = useStore()

  const [busqueda, setBusqueda] = useState('')
  const [seleccionadoId, setSeleccionadoId] = useState(negociosAsociados[0]?.id ?? null)
  const [vistaDetalleMobile, setVistaDetalleMobile] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  const [notifEnviada, setNotifEnviada] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (negociosAsociados.length === 0) {
      setSeleccionadoId(null)
      return
    }
    if (!negociosAsociados.some((n) => n.id === seleccionadoId)) {
      setSeleccionadoId(negociosAsociados[0].id)
    }
  }, [negociosAsociados, seleccionadoId])

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return negociosAsociados
    return negociosAsociados.filter((n) =>
      n.nombre.toLowerCase().includes(texto) || n.categoria.toLowerCase().includes(texto)
    )
  }, [negociosAsociados, busqueda])

  const seleccionado = negociosAsociados.find((n) => n.id === seleccionadoId) || null

  const totalNegocios = negociosAsociados.length
  const idxSeleccionado = negociosAsociados.findIndex((n) => n.id === seleccionadoId)
  const anterior = totalNegocios > 1 ? negociosAsociados[(idxSeleccionado - 1 + totalNegocios) % totalNegocios] : null
  const siguiente = totalNegocios > 1 ? negociosAsociados[(idxSeleccionado + 1) % totalNegocios] : null

  const handleSeleccionar = (id) => {
    setSeleccionadoId(id)
    setVistaDetalleMobile(true)
    setNotifEnviada(false)
  }

  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, imagen: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setForm(FORM_VACIO)
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.whatsapp.trim()) return
    const color = COLORES_NUEVO[negociosAsociados.length % COLORES_NUEVO.length]
    const id = agregarNegocioAsociado({ ...form, color })
    cerrarFormulario()
    setSeleccionadoId(id)
    setVistaDetalleMobile(true)
  }

  const handleEnviarNotificacion = () => {
    if (!seleccionado) return
    enviarNotificacionCompra()
    setNotifEnviada(true)
    setTimeout(() => setNotifEnviada(false), 3000)
  }

  const whatsappHref = seleccionado && soloDigitos(seleccionado.whatsapp)
    ? `https://wa.me/${soloDigitos(seleccionado.whatsapp)}`
    : null

  const hayNegocios = negociosAsociados.length > 0

  if (userType !== 'proveedor') {
    navigate('/home')
    return null
  }

  return (
    <div className="na">
      <div className="na-header">
        <button className="na-header-btn" onClick={() => navigate('/inicio')} type="button" aria-label="Volver">
          <Icon name="arrow-left" size={18} />
        </button>
        <div className="na-header-info">
          <h1>Negocios Asociados</h1>
          <p>Administra los negocios con los que trabajas</p>
        </div>
        <button className="na-btn-agregar" onClick={() => setMostrarFormulario(true)} type="button">
          + Agregar negocio
        </button>
      </div>

      {!hayNegocios ? (
        <div className="na-vacio">
          <div className="na-vacio-icono"><Icon name="store" size={30} /></div>
          <h3>Aún no tienes negocios asociados.</h3>
          <p>Agrega tus primeros negocios para comenzar a gestionar tus relaciones comerciales desde Vincco.</p>
          <button className="na-vacio-btn" onClick={() => setMostrarFormulario(true)} type="button">
            + Agregar negocio
          </button>
        </div>
      ) : (
        <div className={`na-layout ${vistaDetalleMobile ? 'na-layout--detalle-mobile' : ''}`}>
          <div className="na-col-lista">
            <div className="na-search">
              <Icon name="search" size={18} className="na-search-icono" />
              <input
                type="text"
                placeholder="Buscar negocio asociado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar negocio asociado"
              />
            </div>

            <div className="na-lista">
              {filtrados.length === 0 ? (
                <p className="na-lista-sin-resultados">No encontramos negocios con ese nombre.</p>
              ) : (
                filtrados.map((n) => (
                  <TarjetaNegocio key={n.id} negocio={n} activo={n.id === seleccionadoId} onSeleccionar={handleSeleccionar} />
                ))
              )}
            </div>
          </div>

          <div className="na-col-detalle">
            {seleccionado && (
              <motion.div
                key={seleccionado.id}
                className="na-detalle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <button className="na-detalle-volver" onClick={() => setVistaDetalleMobile(false)} type="button">
                  <Icon name="arrow-left" size={16} /> Negocios asociados
                </button>

                <div className="na-detalle-stack">
                  {siguiente && (
                    <div
                      className="na-stack-ghost na-stack-ghost--der"
                      aria-hidden="true"
                      style={!siguiente.imagen ? { background: `linear-gradient(135deg, ${siguiente.color}, ${siguiente.color}cc)` } : undefined}
                    >
                      {siguiente.imagen && <img src={siguiente.imagen} alt="" className="na-detalle-img" />}
                    </div>
                  )}
                  {anterior && (
                    <div
                      className="na-stack-ghost na-stack-ghost--izq"
                      aria-hidden="true"
                      style={!anterior.imagen ? { background: `linear-gradient(135deg, ${anterior.color}, ${anterior.color}cc)` } : undefined}
                    >
                      {anterior.imagen && <img src={anterior.imagen} alt="" className="na-detalle-img" />}
                    </div>
                  )}

                  <div className="na-detalle-media">
                    <MediaNegocio negocio={seleccionado} />
                    <div className="na-detalle-media-scrim" />

                    <div className="na-detalle-media-top">
                      <span className={`na-chip-estado na-chip-estado--${seleccionado.estado.toLowerCase()}`}>
                        <span className="na-chip-dot" />
                        {seleccionado.estado}
                      </span>
                    </div>

                    <div className="na-detalle-media-bottom">
                      <span className="na-chip-indice">
                        {idxSeleccionado + 1} · {seleccionado.categoria.toUpperCase()}
                      </span>
                      <p className="na-detalle-media-caption">{seleccionado.descripcion}</p>
                    </div>
                  </div>
                </div>

                <div className="na-detalle-body">
                  <p className="na-detalle-categoria">{seleccionado.categoria}</p>
                  <h2 className="na-detalle-nombre">{seleccionado.nombre}</h2>

                  <div className="na-detalle-meta">
                    <div className="na-detalle-meta-item">
                      <Icon name="map-pin" size={15} />
                      <span>{seleccionado.direccion}, {seleccionado.municipio}, {seleccionado.departamento}</span>
                    </div>
                    <div className="na-detalle-meta-item">
                      <Icon name="user" size={15} />
                      <span>{seleccionado.propietario}</span>
                    </div>
                    <div className="na-detalle-meta-item">
                      <Icon name="mail" size={15} />
                      <span>{seleccionado.correo}</span>
                    </div>
                    <div className="na-detalle-meta-item">
                      <Icon name="message-circle" size={15} />
                      <span>{seleccionado.whatsapp}</span>
                    </div>
                  </div>

                  <p className="na-detalle-descripcion">{seleccionado.descripcion}</p>

                  <div className="na-detalle-acciones">
                    <a
                      className="na-btn na-btn-whatsapp"
                      href={whatsappHref || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-disabled={!whatsappHref}
                      onClick={(e) => { if (!whatsappHref) e.preventDefault() }}
                    >
                      <Icon name="message-circle" size={17} /> Contactar por WhatsApp
                    </a>
                    <motion.button
                      className="na-btn na-btn-notificar"
                      onClick={handleEnviarNotificacion}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {notifEnviada ? (
                          <motion.span
                            key="ok"
                            className="na-btn-contenido"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                          >
                            <Icon name="check-circle" size={17} /> Notificación enviada
                          </motion.span>
                        ) : (
                          <motion.span
                            key="enviar"
                            className="na-btn-contenido"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                          >
                            <Icon name="bell" size={17} /> Enviar notificación de compra
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {mostrarFormulario && (
          <motion.div
            className="na-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarFormulario}
          >
            <motion.div
              className="na-modal"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="na-modal-header">
                <h3>Agregar negocio asociado</h3>
                <button className="na-modal-cerrar" onClick={cerrarFormulario} type="button" aria-label="Cerrar">
                  <Icon name="x" size={16} />
                </button>
              </div>

              <form className="na-form" onSubmit={handleGuardar}>
                <div className="na-form-grupo">
                  <label>Imagen del negocio</label>
                  {form.imagen ? (
                    <div className="na-form-imagen-preview">
                      <img src={form.imagen} alt="Vista previa" />
                      <button
                        type="button"
                        className="na-form-imagen-quitar"
                        onClick={() => setForm((f) => ({ ...f, imagen: null }))}
                        aria-label="Quitar imagen"
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="na-form-imagen-upload" onClick={() => fileInputRef.current?.click()}>
                      <Icon name="camera" size={24} />
                      <span>Subir imagen del negocio</span>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagen} />
                </div>

                <div className="na-form-row">
                  <div className="na-form-grupo">
                    <label>Nombre del negocio *</label>
                    <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Pulpería El Buen Precio" />
                  </div>
                  <div className="na-form-grupo">
                    <label>Categoría</label>
                    <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                      {categoriasNegocioAsociado.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="na-form-row">
                  <div className="na-form-grupo">
                    <label>Propietario</label>
                    <input type="text" value={form.propietario} onChange={(e) => setForm({ ...form, propietario: e.target.value })} placeholder="Nombre del propietario" />
                  </div>
                  <div className="na-form-grupo">
                    <label>Número de WhatsApp *</label>
                    <input type="tel" required value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+505 8888 8888" />
                  </div>
                </div>

                <div className="na-form-grupo">
                  <label>Correo electrónico</label>
                  <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} placeholder="correo@ejemplo.com" />
                </div>

                <div className="na-form-grupo">
                  <label>Dirección</label>
                  <input type="text" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} placeholder="Dirección exacta" />
                </div>

                <div className="na-form-row">
                  <div className="na-form-grupo">
                    <label>Municipio</label>
                    <input type="text" value={form.municipio} onChange={(e) => setForm({ ...form, municipio: e.target.value })} placeholder="Ej: Nueva Guinea" />
                  </div>
                  <div className="na-form-grupo">
                    <label>Departamento</label>
                    <input type="text" value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} placeholder="Ej: RACCS" />
                  </div>
                </div>

                <div className="na-form-grupo">
                  <label>Descripción</label>
                  <textarea rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Breve descripción del negocio" />
                </div>

                <div className="na-form-acciones">
                  <button type="button" className="na-btn-secundario" onClick={cerrarFormulario}>Cancelar</button>
                  <button type="submit" className="na-btn-primario">Guardar negocio</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
