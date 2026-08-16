import { useState, useEffect } from 'react'
import useStore from '../../store/puntos_usestore'
import { cotizacionesRecibidas, proveedores } from '../../data/data_falso'
import { Monto } from '../Monto'
import Icon from '../icons/Icon'
import AccionBloqueada from '../verificacion/AccionBloqueada'

const STORAGE_KEY = 'vn_cotizaciones_recibidas'

const ESTADOS = {
  pendiente: { label: 'Pendiente', icono: 'clock' },
  aceptada: { label: 'Aceptada', icono: 'check-circle' },
  rechazada: { label: 'Rechazada', icono: 'x' },
  vencida: { label: 'Vencida', icono: 'alert-triangle' },
}

const MOTIVOS_RECHAZO = [
  'Precio elevado',
  'Tiempo de entrega',
  'Ya no necesito los productos',
  'Elegí otro proveedor',
  'Otro',
]

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function iniciales(nombre) {
  const partes = (nombre || '').trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

function capitalizar(texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function formatearFecha(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${d} ${MESES[m - 1]} ${y}`
}

function esVencida(c) {
  if (c.estado !== 'pendiente' || !c.vence) return false
  return new Date(`${c.vence}T23:59:59`).getTime() < Date.now()
}

function hoyIso(offsetDias = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDias)
  return d.toISOString().slice(0, 10)
}

function esDelMesPasado(fechaIso) {
  if (!fechaIso) return false
  const [y, m] = fechaIso.split('-').map(Number)
  const hoy = new Date()
  const mesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
  return y === mesPasado.getFullYear() && m === mesPasado.getMonth() + 1
}

const FILTROS_FECHA = [
  { id: 'todas', label: 'Todas las fechas' },
  { id: 'hoy', label: 'Hoy' },
  { id: 'ayer', label: 'Ayer' },
  { id: 'mesPasado', label: 'Mes pasado' },
]

function estadoVigente(c) {
  return esVencida(c) ? 'vencida' : c.estado
}

function subtotal(c) {
  return (c.productos || []).reduce((s, p) => s + p.cantidad * p.precio, 0)
}

function totalCotizacion(c) {
  return subtotal(c) - (c.descuento || 0) + (c.envio || 0)
}

function infoProveedor(nombre) {
  return proveedores.find((p) => p.nombre === nombre) || { nombre, color: '#003f5a', rating: null, categoria: '', ubicacion: '', whatsapp: '' }
}

export default function CotizacionesPanel() {
  const perfil = useStore((s) => s.perfiles.negocio)
  const negocio = useStore((s) => s.negocio)
  // Recibir cotizaciones de proveedores requiere cuenta verificada.
  const verificado = useStore((s) => s.estadosVerificacion.negocio) === 'aprobada'
  // Los montos se guardan siempre en cordobas; esto solo cambia como
  // se MUESTRAN, segun lo que el negocio eligio en Configuraciones.
  const moneda = useStore((s) => s.configuraciones.negocio?.moneda) || 'NIO'

  const [cotizaciones, setCotizaciones] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return cotizacionesRecibidas
  })

  const [filtro, setFiltro] = useState('todas')
  const [filtroFecha, setFiltroFecha] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [detalleId, setDetalleId] = useState(null)
  const [aceptandoId, setAceptandoId] = useState(null)
  const [rechazandoId, setRechazandoId] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [eliminandoId, setEliminandoId] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cotizaciones))
  }, [cotizaciones])

  if (!verificado) {
    return (
      <div className="panel-seccion">
        <div className="panel-cot-header">
          <div>
            <h2 className="panel-cot-titulo">Mis Cotizaciones</h2>
            <p className="panel-cot-desc">Consulta y administra las cotizaciones recibidas de tus proveedores.</p>
          </div>
        </div>
        <AccionBloqueada
          rol="negocio"
          mensaje="Para recibir y responder cotizaciones de tus proveedores necesitás verificar tu negocio."
        />
      </div>
    )
  }

  const nombreNegocio = perfil?.nombre || negocio?.nombre || 'Mi negocio'

  const conEstado = cotizaciones.map((c) => ({ ...c, estadoVigente: estadoVigente(c) }))
  const ordenadas = [...conEstado].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const stats = {
    recibidas: cotizaciones.length,
    pendientes: conEstado.filter((c) => c.estadoVigente === 'pendiente').length,
    aceptadas: conEstado.filter((c) => c.estadoVigente === 'aceptada').length,
    rechazadas: conEstado.filter((c) => c.estadoVigente === 'rechazada').length,
    vencidas: conEstado.filter((c) => c.estadoVigente === 'vencida').length,
  }

  const termino = busqueda.trim().toLowerCase()
  const filtradas = ordenadas.filter((c) => {
    if (filtro !== 'todas' && c.estadoVigente !== filtro) return false
    if (filtroFecha === 'hoy' && c.fecha !== hoyIso(0)) return false
    if (filtroFecha === 'ayer' && c.fecha !== hoyIso(-1)) return false
    if (filtroFecha === 'mesPasado' && !esDelMesPasado(c.fecha)) return false
    if (!termino) return true
    const info = infoProveedor(c.proveedor)
    const productos = (c.productos || []).map((p) => p.nombre).join(' ').toLowerCase()
    return (
      info.nombre.toLowerCase().includes(termino) ||
      c.numero.toLowerCase().includes(termino) ||
      (c.solicitud || '').toLowerCase().includes(termino) ||
      productos.includes(termino)
    )
  })

  const detalle = conEstado.find((c) => c.id === detalleId) || null

  const confirmarAceptar = () => {
    setCotizaciones((prev) =>
      prev.map((c) => (c.id === aceptandoId ? { ...c, estado: 'aceptada', motivo: null } : c))
    )
    setAceptandoId(null)
  }

  const confirmarRechazo = () => {
    setCotizaciones((prev) =>
      prev.map((c) => (c.id === rechazandoId ? { ...c, estado: 'rechazada', motivo: motivo || null } : c))
    )
    setRechazandoId(null)
    setMotivo('')
  }

  const confirmarEliminar = () => {
    setCotizaciones((prev) => prev.filter((c) => c.id !== eliminandoId))
    if (detalleId === eliminandoId) setDetalleId(null)
    setEliminandoId(null)
  }

  const contactar = (c) => {
    const info = infoProveedor(c.proveedor)
    if (!info.whatsapp) return
    const mensaje = `Hola ${info.nombre}, soy ${nombreNegocio} de Vincco. Quiero hablar sobre la cotización ${c.numero} que me enviaron.`
    window.open(`https://wa.me/${info.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  const limpiarFiltros = () => {
    setFiltro('todas')
    setFiltroFecha('todas')
    setBusqueda('')
  }

  const renderBadge = (estado) => (
    <span className={`panel-cot-badge panel-cot-badge--${estado}`}>
      <Icon name={ESTADOS[estado].icono} size={12} /> {ESTADOS[estado].label}
    </span>
  )

  return (
    <div className="panel-seccion">
      <div className="panel-cot-header">
        <div>
          <h2 className="panel-cot-titulo">Mis Cotizaciones</h2>
          <p className="panel-cot-desc">Consulta y administra las cotizaciones recibidas de tus proveedores.</p>
        </div>
      </div>

      <div className="panel-cot-stats">
        <button
          type="button"
          className={`panel-cot-stat panel-cot-stat--recibidas ${filtro === 'todas' ? 'panel-cot-stat--activo' : ''}`}
          onClick={() => setFiltro('todas')}
        >
          <span className="panel-cot-stat-icono"><Icon name="inbox" size={20} /></span>
          <div>
            <span className="panel-cot-stat-num">{stats.recibidas}</span>
            <span className="panel-cot-stat-label">Recibidas</span>
          </div>
        </button>
        <button
          type="button"
          className={`panel-cot-stat panel-cot-stat--pendientes ${filtro === 'pendiente' ? 'panel-cot-stat--activo' : ''}`}
          onClick={() => setFiltro('pendiente')}
        >
          <span className="panel-cot-stat-icono"><Icon name="clock" size={20} /></span>
          <div>
            <span className="panel-cot-stat-num">{stats.pendientes}</span>
            <span className="panel-cot-stat-label">Pendientes</span>
          </div>
        </button>
        <button
          type="button"
          className={`panel-cot-stat panel-cot-stat--aceptadas ${filtro === 'aceptada' ? 'panel-cot-stat--activo' : ''}`}
          onClick={() => setFiltro('aceptada')}
        >
          <span className="panel-cot-stat-icono"><Icon name="check-circle" size={20} /></span>
          <div>
            <span className="panel-cot-stat-num">{stats.aceptadas}</span>
            <span className="panel-cot-stat-label">Aceptadas</span>
          </div>
        </button>
        <button
          type="button"
          className={`panel-cot-stat panel-cot-stat--rechazadas ${filtro === 'rechazada' ? 'panel-cot-stat--activo' : ''}`}
          onClick={() => setFiltro('rechazada')}
        >
          <span className="panel-cot-stat-icono"><Icon name="x" size={20} /></span>
          <div>
            <span className="panel-cot-stat-num">{stats.rechazadas}</span>
            <span className="panel-cot-stat-label">Rechazadas</span>
          </div>
        </button>
      </div>

      <div className="panel-cot-toolbar">
        <div className="panel-pub-filtro">
          <Icon name="chevron-down" size={14} className="panel-pub-filtro-flecha" />
          <select
            className="panel-form-select panel-pub-filtro-select"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            aria-label="Filtrar por fecha"
          >
            {FILTROS_FECHA.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="panel-cot-buscador">
          <span className="panel-cot-buscador-icono"><Icon name="search" size={15} /></span>
          <input
            type="text"
            placeholder="Buscar proveedor, cotización o producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {cotizaciones.length === 0 ? (
        <div className="panel-cot-vacio">
          <div className="panel-cot-vacio-icono"><Icon name="inbox" size={30} /></div>
          <strong>No tienes cotizaciones</strong>
          <p>Cuando tus proveedores socios te envíen una cotización, aparecerá aquí.</p>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="panel-cot-vacio">
          <div className="panel-cot-vacio-icono"><Icon name="search" size={30} /></div>
          <strong>Sin resultados</strong>
          <p>No encontramos cotizaciones que coincidan con tu búsqueda.</p>
          <button className="panel-btn panel-btn-primary" onClick={limpiarFiltros}>Limpiar filtros</button>
        </div>
      ) : (
        <>
          <h3 className="panel-cot-lista-titulo">
            <Icon name="file-text" size={16} /> Cotizaciones recibidas
            <span className="panel-cot-lista-count">{filtradas.length}</span>
          </h3>

          <div className="panel-cot-lista">
            {filtradas.map((c) => {
              const info = infoProveedor(c.proveedor)
              return (
                <article key={c.id} className="panel-cot-card">
                  <div className="panel-cot-card-top">
                    <div className="panel-cot-proveedor">
                      <span className="panel-cot-avatar" style={{ background: info.color }}>{iniciales(info.nombre)}</span>
                      <div>
                        <h3 className="panel-cot-proveedor-nombre">{info.nombre}</h3>
                        <div className="panel-cot-proveedor-meta">
                          {info.categoria && <span>{capitalizar(info.categoria)}</span>}
                          {info.rating && (
                            <span className="panel-cot-proveedor-rating"><Icon name="star" filled size={11} /> {info.rating}</span>
                          )}
                          {info.ubicacion && <span><Icon name="map-pin" size={11} /> {info.ubicacion}</span>}
                        </div>
                      </div>
                    </div>
                    {renderBadge(c.estadoVigente)}
                  </div>

                  <p className="panel-cot-num">Cotización <span>#{c.numero}</span></p>

                  {c.solicitud && (
                    <span className="panel-cot-solicitud">
                      <Icon name="file-text" size={12} /> Pediste: <strong>{c.solicitud}</strong>
                    </span>
                  )}

                  <div className="panel-cot-meta">
                    <span className="panel-cot-meta-chip"><Icon name="calendar" size={11} /> {formatearFecha(c.fecha)}</span>
                    <span className="panel-cot-meta-chip">
                      <Icon name="package" size={11} /> {c.productos.length} {c.productos.length === 1 ? 'producto' : 'productos'}
                    </span>
                    {c.entrega && <span className="panel-cot-meta-chip"><Icon name="truck" size={11} /> {c.entrega}</span>}
                    {c.formaPago && <span className="panel-cot-meta-chip"><Icon name="wallet" size={11} /> {c.formaPago}</span>}
                  </div>

                  <div className="panel-cot-card-footer">
                    <div className="panel-cot-total">
                      <span className="panel-cot-total-label">Total estimado</span>
                      <span className="panel-cot-total-num"><Monto valor={totalCotizacion(c)} conEspacio moneda={moneda} /></span>
                    </div>
                    <div className="panel-cot-card-acciones">
                      <button className="panel-btn panel-btn-icono panel-btn-icono--peligro" title="Eliminar" onClick={() => setEliminandoId(c.id)}>
                        <Icon name="trash-2" size={16} />
                      </button>
                      <button className="panel-cot-btn panel-cot-btn--ver" onClick={() => setDetalleId(c.id)}>
                        <Icon name="eye" size={13} /> Ver cotización
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}

      {detalle && <DetalleCotizacion cotizacion={detalle} onCerrar={() => setDetalleId(null)} onAceptar={setAceptandoId} onRechazar={setRechazandoId} onEliminar={setEliminandoId} onContactar={contactar} renderBadge={renderBadge} />}

      {aceptandoId && (
        <ModalConfirmacion
          icono="check"
          clase="aceptar"
          titulo="¿Estás seguro de que deseas aceptar esta cotización?"
          descripcion="Al aceptar, se iniciará el proceso de compra/pedido con este proveedor."
          boton="Confirmar aceptación"
          onCancelar={() => setAceptandoId(null)}
          onConfirmar={confirmarAceptar}
        />
      )}

      {rechazandoId && (
        <div className="panel-modal-overlay" onClick={() => setRechazandoId(null)}>
          <div className="panel-modal panel-modal--cot" onClick={(e) => e.stopPropagation()}>
            <div className="panel-modal-header">
              <h3 className="panel-modal-titulo">Rechazar cotización</h3>
              <button className="panel-modal-cerrar" onClick={() => setRechazandoId(null)}><Icon name="x" size={16} /></button>
            </div>
            <div className="panel-modal-body">
              <p className="panel-modal-texto">¿Por qué deseas rechazar esta cotización?</p>
              <div className="panel-cot-motivos">
                {MOTIVOS_RECHAZO.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`panel-cot-motivo ${motivo === m ? 'panel-cot-motivo--activo' : ''}`}
                    onClick={() => setMotivo(m)}
                  >
                    <span className="panel-cot-motivo-radio" />
                    {m}
                  </button>
                ))}
              </div>
              <div className="panel-form-acciones">
                <button className="panel-btn panel-btn-secundario" onClick={() => { setRechazandoId(null); setMotivo('') }}>Cancelar</button>
                <button className="panel-btn panel-btn-primary" style={{ background: '#b3261e', '--panel-accent': '#b3261e' }} onClick={confirmarRechazo}>Confirmar rechazo</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {eliminandoId && (
        <ModalConfirmacion
          icono="trash-2"
          clase="eliminar"
          titulo="¿Eliminar esta cotización?"
          descripcion="La quitarás de tu bandeja de cotizaciones. Esta acción no se puede deshacer."
          boton="Eliminar"
          onCancelar={() => setEliminandoId(null)}
          onConfirmar={confirmarEliminar}
        />
      )}
    </div>
  )
}

function DetalleCotizacion({ cotizacion, onCerrar, onAceptar, onRechazar, onEliminar, onContactar, renderBadge }) {
  const info = infoProveedor(cotizacion.proveedor)
  const estado = cotizacion.estadoVigente
  const sub = subtotal(cotizacion)
  const total = totalCotizacion(cotizacion)
  // Los montos se guardan siempre en cordobas; esto solo cambia como
  // se MUESTRAN, segun lo que el negocio eligio en Configuraciones.
  const moneda = useStore((s) => s.configuraciones.negocio?.moneda) || 'NIO'

  return (
    <div className="panel-modal-overlay" onClick={onCerrar}>
      <div className="panel-modal panel-modal--cot" onClick={(e) => e.stopPropagation()}>
        <div className="panel-modal-header">
          <h3 className="panel-modal-titulo">Cotización #{cotizacion.numero}</h3>
          <div className="panel-cot-detail-close">
            {renderBadge(estado)}
            <button className="panel-modal-cerrar" onClick={onCerrar}><Icon name="x" size={16} /></button>
          </div>
        </div>

        <div className="panel-modal-body">
          <div className="panel-cot-detail-proveedor">
            <span className="panel-cot-avatar" style={{ background: info.color }}>{iniciales(info.nombre)}</span>
            <div className="panel-cot-detail-proveedor-info">
              <h4 className="panel-cot-detail-proveedor-nombre">{info.nombre}</h4>
              <div className="panel-cot-proveedor-meta">
                {info.categoria && <span>{capitalizar(info.categoria)}</span>}
                {info.rating && (
                  <span className="panel-cot-proveedor-rating"><Icon name="star" filled size={11} /> {info.rating}</span>
                )}
                {info.ubicacion && <span><Icon name="map-pin" size={11} /> {info.ubicacion}</span>}
              </div>
            </div>
          </div>

          <div className="panel-cot-detail-datos">
            <div className="panel-cot-dato">
              <span className="panel-cot-dato-label">Fecha de envío</span>
              <span className="panel-cot-dato-value">{formatearFecha(cotizacion.fecha)}</span>
            </div>
            <div className="panel-cot-dato">
              <span className="panel-cot-dato-label">Vencimiento</span>
              <span className="panel-cot-dato-value">{formatearFecha(cotizacion.vence)}</span>
            </div>
            {cotizacion.entrega && (
              <div className="panel-cot-dato">
                <span className="panel-cot-dato-label">Entrega</span>
                <span className="panel-cot-dato-value"><Icon name="truck" size={13} /> {cotizacion.entrega}</span>
              </div>
            )}
            {cotizacion.formaPago && (
              <div className="panel-cot-dato">
                <span className="panel-cot-dato-label">Forma de pago</span>
                <span className="panel-cot-dato-value"><Icon name="wallet" size={13} /> {cotizacion.formaPago}</span>
              </div>
            )}
          </div>

          {cotizacion.solicitud && (
            <span className="panel-cot-solicitud panel-cot-solicitud--full">
              <Icon name="file-text" size={12} /> Pediste: <strong>{cotizacion.solicitud}</strong>
            </span>
          )}

          <div>
            <h5 className="panel-cot-detail-subtitulo">Productos</h5>
            <div className="panel-cot-tabla-wrap">
              <table className="panel-cot-tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizacion.productos.map((p, i) => (
                    <tr key={i}>
                      <td>{p.nombre}</td>
                      <td>{p.cantidad} {p.unidad}</td>
                      <td><Monto valor={p.precio} moneda={moneda} /></td>
                      <td><Monto valor={p.cantidad * p.precio} moneda={moneda} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-cot-totales">
            <div className="panel-cot-total-line"><span>Subtotal</span><b><Monto valor={sub} moneda={moneda} /></b></div>
            {cotizacion.descuento > 0 && (
              <div className="panel-cot-total-line panel-cot-total-line--descuento"><span>Descuento</span><b>− <Monto valor={cotizacion.descuento} moneda={moneda} /></b></div>
            )}
            {cotizacion.envio > 0 && (
              <div className="panel-cot-total-line"><span>Envío</span><b><Monto valor={cotizacion.envio} moneda={moneda} /></b></div>
            )}
            <div className="panel-cot-total-line panel-cot-total-line--grande"><span>Total</span><b><Monto valor={total} moneda={moneda} /></b></div>
          </div>

          {(cotizacion.condiciones || cotizacion.entrega || cotizacion.formaPago) && (
            <div className="panel-cot-condiciones">
              <span className="panel-cot-condiciones-titulo"><Icon name="tag" size={12} /> Condiciones del proveedor</span>
              <p>{cotizacion.condiciones || 'Sin condiciones especiales adicionales.'}</p>
            </div>
          )}

          {estado === 'aceptada' && (
            <div className="panel-cot-nota panel-cot-nota--aceptada">
              <Icon name="check-circle" size={18} />
              <span>Esta cotización fue aceptada. Se inició el proceso de compra con este proveedor.</span>
            </div>
          )}
          {estado === 'rechazada' && (
            <div className="panel-cot-nota panel-cot-nota--rechazada">
              <Icon name="x" size={18} />
              <span>Esta cotización fue rechazada.{cotizacion.motivo ? ` Motivo: ${cotizacion.motivo}.` : ''}</span>
            </div>
          )}
          {estado === 'vencida' && (
            <div className="panel-cot-nota panel-cot-nota--vencida">
              <Icon name="alert-triangle" size={18} />
              <span>Esta cotización venció y ya no se puede aceptar. Contactá al proveedor si todavía te interesa.</span>
            </div>
          )}

          <div className="panel-cot-acciones">
            {estado === 'pendiente' && (
              <>
                <button className="panel-cot-btn panel-cot-btn--aceptar" onClick={() => onAceptar(cotizacion.id)}>
                  <Icon name="check" size={14} /> Aceptar cotización
                </button>
                <button className="panel-cot-btn panel-cot-btn--rechazar" onClick={() => onRechazar(cotizacion.id)}>
                  <Icon name="x" size={14} /> Rechazar
                </button>
              </>
            )}
            {info.whatsapp && (
              <button className="panel-cot-btn panel-cot-btn--contacto" onClick={() => onContactar(cotizacion)}>
                <Icon name="message-circle" size={14} /> Contactar proveedor
              </button>
            )}
            <button className="panel-cot-btn panel-cot-btn--eliminar" onClick={() => onEliminar(cotizacion.id)}>
              <Icon name="trash-2" size={14} /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalConfirmacion({ icono, clase, titulo, descripcion, boton, onCancelar, onConfirmar }) {
  return (
    <div className="panel-modal-overlay" onClick={onCancelar}>
      <div className="panel-modal panel-modal--cot" onClick={(e) => e.stopPropagation()}>
        <div className="panel-cot-confirm">
          <div className={`panel-cot-confirm-icono panel-cot-confirm-icono--${clase}`}>
            <Icon name={icono} size={26} />
          </div>
          <h3>{titulo}</h3>
          <p>{descripcion}</p>
          <div className="panel-cot-confirm-acciones">
            <button className="panel-btn panel-btn-secundario" onClick={onCancelar}>Cancelar</button>
            <button className={`panel-cot-btn panel-cot-btn--${clase === 'aceptar' ? 'aceptar' : 'eliminar-confirmar'}`} onClick={onConfirmar}>{boton}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
