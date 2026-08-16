import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import NegociosCarousel from '../components/NegociosCarousel'
import CotizacionesEnviadas from '../components/panel/CotizacionesEnviadas'
import ModalAccionBloqueada from '../components/verificacion/ModalAccionBloqueada'
import { categoriasNegocioAsociado } from '../data/data_falso'
import './NegociosAsociados.css'

const COLORES_NUEVO = ['#007a7b', '#c05900', '#005c5e', '#a34b00', '#dd6600', '#003f5a']

const FORM_VACIO = {
  nombre: '', categoria: categoriasNegocioAsociado[0], propietario: '',
  whatsapp: '', correo: '', direccion: '', municipio: '', departamento: '',
  descripcion: '', imagen: null,
}

function soloDigitos(valor) {
  return (valor || '').replace(/\D/g, '')
}

export default function NegociosAsociados() {
  const navigate = useNavigate()
  const userType = useStore((s) => s.userType)
  const todosLosNegocios = useStore((s) => s.negociosAsociados)
  const solicitarAsociacionNegocio = useStore((s) => s.solicitarAsociacionNegocio)
  const editarNegocioAsociado = useStore((s) => s.editarNegocioAsociado)
  const quitarAsociacionNegocio = useStore((s) => s.quitarAsociacionNegocio)
  const enviarNotificacionCompra = useStore((s) => s.enviarNotificacionCompra)
  const proveedor = useStore((s) => s.perfiles.proveedor)
  const [errorDuplicado, setErrorDuplicado] = useState('')
  const [confirmarQuitar, setConfirmarQuitar] = useState(false)

  // Las rechazadas no se muestran: ya se sabe la respuesta y no
  // estorban en la lista. Siguen en el store por si se quiere volver
  // a intentar (el chequeo de duplicados más abajo no las cuenta).
  const negociosAsociados = useMemo(
    () => todosLosNegocios.filter((n) => n.estado !== 'rechazada'),
    [todosLosNegocios]
  )
  // Agregar un negocio asociado (y cotizarle) requiere cuenta
  // verificada. Ver y editar los que ya tenés no se toca.
  const verificado = useStore((s) => s.estadosVerificacion.proveedor) === 'aprobada'
  const [bloqueoAbierto, setBloqueoAbierto] = useState(false)
  const [cotizacionesAbiertas, setCotizacionesAbiertas] = useState(false)

  const [busqueda, setBusqueda] = useState('')
  const [seleccionadoId, setSeleccionadoId] = useState(negociosAsociados[0]?.id ?? null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  // Cuando es null el modal agrega; cuando trae un id, edita ese negocio
  const [editandoId, setEditandoId] = useState(null)
  const fileInputRef = useRef(null)

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return negociosAsociados
    return negociosAsociados.filter((n) =>
      n.nombre.toLowerCase().includes(texto) || n.categoria.toLowerCase().includes(texto)
    )
  }, [negociosAsociados, busqueda])

  // El carrusel solo muestra los negocios filtrados, asi que el seleccionado
  // tiene que existir dentro de esa lista. Si al buscar desaparece,
  // se pasa al primero de los resultados.
  useEffect(() => {
    if (filtrados.length === 0) return
    if (!filtrados.some((n) => n.id === seleccionadoId)) {
      setSeleccionadoId(filtrados[0].id)
    }
  }, [filtrados, seleccionadoId])

  const seleccionado = negociosAsociados.find((n) => n.id === seleccionadoId) || null
  const negocioEditando = editandoId ? todosLosNegocios.find((n) => n.id === editandoId) : null

  const handleSeleccionar = (id) => {
    setSeleccionadoId(id)
  }

  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, imagen: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const abrirAgregar = () => {
    if (!verificado) { setBloqueoAbierto(true); return }
    setEditandoId(null)
    setForm(FORM_VACIO)
    setErrorDuplicado('')
    setMostrarFormulario(true)
  }

  // Precarga el formulario con los datos del negocio para editarlos
  const abrirEditar = (negocio) => {
    setEditandoId(negocio.id)
    setConfirmarQuitar(false)
    setForm({
      nombre: negocio.nombre || '',
      categoria: negocio.categoria || categoriasNegocioAsociado[0],
      propietario: negocio.propietario || '',
      whatsapp: negocio.whatsapp || '',
      correo: negocio.correo || '',
      direccion: negocio.direccion || '',
      municipio: negocio.municipio || '',
      departamento: negocio.departamento || '',
      descripcion: negocio.descripcion || '',
      imagen: negocio.imagen || null,
    })
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setEditandoId(null)
    setForm(FORM_VACIO)
    setErrorDuplicado('')
    setConfirmarQuitar(false)
  }

  const handleQuitarAsociacion = () => {
    if (!confirmarQuitar) { setConfirmarQuitar(true); return }
    quitarAsociacionNegocio(editandoId)
    cerrarFormulario()
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.whatsapp.trim()) return

    if (editandoId) {
      editarNegocioAsociado(editandoId, form)
      setSeleccionadoId(editandoId)
    } else {
      // No se puede mandar otra solicitud a un negocio que ya tiene
      // una pendiente, ni a uno que ya aceptó: para eso ya está
      // asociado. Si te rechazó, se puede volver a intentar.
      const yaEnviada = todosLosNegocios.some((n) =>
        n.nombre.trim().toLowerCase() === form.nombre.trim().toLowerCase() &&
        (n.estado === 'pendiente' || n.estado === 'aceptada')
      )
      if (yaEnviada) {
        setErrorDuplicado('Ya le enviaste una solicitud a este negocio (o ya está asociado). Esperá su respuesta.')
        return
      }
      const color = COLORES_NUEVO[negociosAsociados.length % COLORES_NUEVO.length]
      setSeleccionadoId(solicitarAsociacionNegocio({ ...form, color }))
    }

    cerrarFormulario()
    // Se limpia la busqueda para que el negocio guardado
    // no quede filtrado fuera del carrusel
    setBusqueda('')
  }

  const handleCotizacionEnviada = () => {
    // La cotización se guardó en localStorage desde el formulario.
    // Se dispara la notificación al negocio para que aparezca en
    // su bandeja de "Cotizaciones" en el panel.
    enviarNotificacionCompra()
  }

  const whatsappHref = seleccionado && soloDigitos(seleccionado.whatsapp)
    ? `https://wa.me/${soloDigitos(seleccionado.whatsapp)}`
    : null

  const hayNegocios = negociosAsociados.length > 0

  // Navegar dentro del render es un efecto secundario que React
  // desaconseja. <Navigate> hace la redireccion de forma declarativa
  // y replace evita ensuciar el historial del navegador.
  if (userType !== 'proveedor') {
    return <Navigate to="/home" replace />
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
        <div className="na-header-acciones">
          <button className="na-btn-agregar" onClick={abrirAgregar} type="button">
            + Solicitar asociación
          </button>
          <button className="na-btn-cotizaciones" onClick={() => setCotizacionesAbiertas(true)} type="button">
            <Icon name="file-text" size={14} /> Cotizaciones enviadas
          </button>
        </div>
      </div>

      <CotizacionesEnviadas
        abierto={cotizacionesAbiertas}
        onCerrar={() => setCotizacionesAbiertas(false)}
      />

      {!hayNegocios ? (
        <div className="na-vacio">
          <div className="na-vacio-icono"><Icon name="store" size={30} /></div>
          <h3>Todavía no tenés negocios asociados.</h3>
          <p>Solicitá la asociación con tus primeros negocios. Quedan asociados recién cuando la aceptan.</p>
          <button className="na-vacio-btn" onClick={abrirAgregar} type="button">
            + Solicitar asociación
          </button>
        </div>
      ) : (
        <NegociosCarousel
          negocios={filtrados}
          seleccionadoId={seleccionadoId}
          onSeleccionar={handleSeleccionar}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          whatsappHref={whatsappHref}
          onEditar={abrirEditar}
          proveedor={proveedor}
          verificado={verificado}
          onBloqueado={() => setBloqueoAbierto(true)}
          onCotizar={handleCotizacionEnviada}
          // Se frena la rotacion automatica mientras el usuario busca
          // o tiene algún formulario/modal abierto
          pausado={mostrarFormulario || busqueda.trim().length > 0}
        />
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
                <h3>{editandoId ? 'Editar negocio asociado' : 'Solicitar asociación con un negocio'}</h3>
                <button className="na-modal-cerrar" onClick={cerrarFormulario} type="button" aria-label="Cerrar">
                  <Icon name="x" size={16} />
                </button>
              </div>

              {!editandoId && (
                <p className="na-form-aviso">
                  <Icon name="info" size={13} />
                  Esto le manda un aviso al negocio. Queda asociado recién cuando lo acepte.
                </p>
              )}

              {errorDuplicado && (
                <p className="na-form-error">
                  <Icon name="alert-triangle" size={13} />
                  {errorDuplicado}
                </p>
              )}

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

                {negocioEditando?.estado === 'aceptada' && (
                  <button
                    type="button"
                    className="na-btn-quitar"
                    onClick={handleQuitarAsociacion}
                  >
                    <Icon name="x" size={13} />
                    {confirmarQuitar ? '¿Seguro? Tocá de nuevo para quitarla' : 'Quitar asociación con este negocio'}
                  </button>
                )}

                <div className="na-form-acciones">
                  <button type="button" className="na-btn-secundario" onClick={cerrarFormulario}>Cancelar</button>
                  <button type="submit" className="na-btn-primario">
                    {editandoId ? 'Guardar cambios' : 'Enviar solicitud'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {bloqueoAbierto && (
        <ModalAccionBloqueada
          rol="proveedor"
          mensaje="Para agregar o cotizarle a un negocio asociado necesitás verificar tu empresa."
          onCerrar={() => setBloqueoAbierto(false)}
        />
      )}
    </div>
  )
}
