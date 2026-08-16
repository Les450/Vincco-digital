import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'
import { Monto } from '../Monto'

// Bandeja de cotizaciones enviadas del proveedor. Son las mismas
// que el negocio recibe en su panel ("Mis Cotizaciones"): lo que para
// uno es enviado, para el otro es recibido. Viven en la misma clave
// de localStorage y aquí se filtran por el nombre del proveedor.

const STORAGE_KEY = 'vn_cotizaciones_recibidas'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Los estados viajan con su color y su icono para que la bandeja se
// lea de un vistazo: el verde es aceptada (se cerró negocio), el rojo
// rechazada (se perdió), el ámbar vencida (se dejó pasar) y el teal
// pendiente (sigue en juego).
const ESTADOS = {
  pendiente: { label: 'Pendiente', icono: 'clock', color: '#007a7b' },
  aceptada: { label: 'Aceptada', icono: 'check-circle', color: '#15803d' },
  rechazada: { label: 'Rechazada', icono: 'x', color: '#b3261e' },
  vencida: { label: 'Vencida', icono: 'alert-triangle', color: '#b45309' },
}

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'aceptada', label: 'Aceptadas' },
  { id: 'rechazada', label: 'Rechazadas' },
  { id: 'vencida', label: 'Vencidas' },
]

function iniciales(nombre) {
  const partes = (nombre || '').trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return '¿?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
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

function estadoVigente(c) {
  return esVencida(c) ? 'vencida' : c.estado
}

function subtotal(c) {
  return (c.productos || []).reduce((s, p) => s + p.cantidad * p.precio, 0)
}

function totalCotizacion(c) {
  return subtotal(c) - (c.descuento || 0) + (c.envio || 0)
}

// Resuelve a qué negocio fue dirigida la cotización: primero por id
// (la guarda contra el registro), luego por nombre (cotizaciones
// viejas o del demo) y como último recurso un rótulo genérico.
function negocioInfo(c, asociados) {
  const porId = asociados.find((n) => n.id === c.negocioId)
  if (porId) return porId
  if (c.negocio) return { id: null, nombre: c.negocio, color: '#007a7b', whatsapp: null }
  return { id: null, nombre: 'Negocio asociado', color: '#003f5a', whatsapp: null }
}

export default function CotizacionesEnviadas({ abierto, onCerrar }) {
  const proveedor = useStore((s) => s.perfiles.proveedor)
  const asociados = useStore((s) => s.negociosAsociados)
  // Los montos se guardan siempre en cordobas; esto solo cambia como
  // se MUESTRAN, según lo que el proveedor eligió en Configuraciones.
  const moneda = useStore((s) => s.configuraciones.proveedor?.moneda) || 'NIO'

  const [cotizaciones, setCotizaciones] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [detalleId, setDetalleId] = useState(null)

  // Cada vez que se abre la bandeja se relee el storage fresco: así
  // una cotización recién enviada desde el carrusel aparece sin
  // necesidad de recargar la página.
  useEffect(() => {
    if (!abierto) return
    let lista = []
    try {
      const guardadas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(guardadas)) lista = guardadas
    } catch {
      lista = []
    }
    setCotizaciones(lista)
    setFiltro('todas')
    setDetalleId(null)
  }, [abierto])

  // Solo las nuestras: las que envió este proveedor (su nombre va
  // grabado en cada cotización, igual que en la bandeja del negocio).
  const mías = cotizaciones.filter((c) => c.proveedor === proveedor.nombre)

  const conEstado = mías.map((c) => ({ ...c, estadoVigente: estadoVigente(c) }))
  const ordenadas = [...conEstado].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const stats = {
    enviadas: mías.length,
    pendientes: conEstado.filter((c) => c.estadoVigente === 'pendiente').length,
    aceptadas: conEstado.filter((c) => c.estadoVigente === 'aceptada').length,
    rechazadas: conEstado.filter((c) => c.estadoVigente === 'rechazada').length,
  }

  const filtradas = filtro === 'todas' ? ordenadas : ordenadas.filter((c) => c.estadoVigente === filtro)

  const detalle = conEstado.find((c) => c.id === detalleId) || null

  const contactar = (c) => {
    const negocio = negocioInfo(c, asociados)
    if (!negocio.whatsapp) return
    const mensaje = `Hola ${negocio.nombre}, soy ${proveedor.nombre} de Vincco. Te escribo por la cotización ${c.numero} que te envié.`
    window.open(`https://wa.me/${String(negocio.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  const badge = (estado) => (
    <span className={`na-cot-badge na-cot-badge--${estado}`}>
      <Icon name={ESTADOS[estado].icono} size={12} /> {ESTADOS[estado].label}
    </span>
  )

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            className="na-cot-overlay"
            onClick={onCerrar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.div
            className="na-cot-drawer"
            role="dialog"
            aria-label="Cotizaciones enviadas"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="na-cot-head">
              <div className="na-cot-head-texto">
                <span className="na-cot-head-kicker">Panel de proveedor · Envíos</span>
                <h2 className="na-cot-head-titulo">
                  Cotizaciones enviadas
                  <span className="na-cot-head-count">{stats.enviadas}</span>
                </h2>
                <p className="na-cot-head-desc">
                  Las cotizaciones que mandaste a los negocios y cómo las respondieron
                </p>
              </div>
              <button className="na-cot-head-cerrar" onClick={onCerrar} type="button" aria-label="Cerrar">
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="na-cot-cuerpo">
              {mías.length === 0 ? (
                <div className="na-cot-vacio">
                  <div className="na-cot-vacio-icono"><Icon name="file-text" size={30} /></div>
                  <h3>Aún no has enviado cotizaciones</h3>
                  <p>
                    Desde el carrusel de negocios asociados, toca <strong>Cotizar</strong> en un
                    negocio y arma tu propuesta: quedará registrada aquí para darle seguimiento.
                  </p>
                  <button className="na-cot-vacio-btn" onClick={onCerrar} type="button">
                    Entendido
                  </button>
                </div>
              ) : (
                <>
                  <div className="na-cot-stats">
                    <div className="na-cot-stat na-cot-stat--total">
                      <span className="na-cot-stat-num">{stats.enviadas}</span>
                      <span className="na-cot-stat-label">Enviadas</span>
                    </div>
                    <div className="na-cot-stat na-cot-stat--pendiente">
                      <span className="na-cot-stat-num">{stats.pendientes}</span>
                      <span className="na-cot-stat-label">Pendientes</span>
                    </div>
                    <div className="na-cot-stat na-cot-stat--aceptada">
                      <span className="na-cot-stat-num">{stats.aceptadas}</span>
                      <span className="na-cot-stat-label">Aceptadas</span>
                    </div>
                    <div className="na-cot-stat na-cot-stat--rechazada">
                      <span className="na-cot-stat-num">{stats.rechazadas}</span>
                      <span className="na-cot-stat-label">Rechazadas</span>
                    </div>
                  </div>

                  <div className="na-cot-filtros">
                    {FILTROS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        className={`na-cot-filtro ${filtro === f.id ? 'na-cot-filtro--activo' : ''}`}
                        onClick={() => setFiltro(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {filtradas.length === 0 ? (
                    <div className="na-cot-vacio na-cot-vacio--chico">
                      <div className="na-cot-vacio-icono"><Icon name="search" size={26} /></div>
                      <h3>Nada por acá</h3>
                      <p>No hay cotizaciones con ese estado.</p>
                      <button className="na-cot-vacio-btn" onClick={() => setFiltro('todas')} type="button">
                        Ver todas
                      </button>
                    </div>
                  ) : (
                    <ol className="na-cot-lista">
                      {filtradas.map((c) => {
                        const info = negocioInfo(c, asociados)
                        const estado = c.estadoVigente
                        return (
                          <li key={c.id}>
                            <article className={`na-cot-card na-cot-card--${estado}`}>
                              <div className="na-cot-card-top">
                                <div className="na-cot-destino">
                                  <span className="na-cot-avatar" style={{ background: info.color }}>
                                    {iniciales(info.nombre)}
                                  </span>
                                  <div className="na-cot-destino-info">
                                    <span className="na-cot-destino-para">Para</span>
                                    <h3 className="na-cot-destino-nombre">{info.nombre}</h3>
                                    <span className="na-cot-destino-meta">
                                      <span className="na-cot-folio">#{c.numero}</span>
                                      <span className="na-cot-dot" aria-hidden="true" />
                                      Enviada el {formatearFecha(c.fecha)}
                                    </span>
                                  </div>
                                </div>
                                {badge(estado)}
                              </div>

                              {c.solicitud && (
                                <p className="na-cot-solicitud">
                                  <span className="na-cot-solicitud-barra" aria-hidden="true" />
                                  <Icon name="file-text" size={12} />
                                  {c.solicitud.replace(/^Solicitaste /i, 'El negocio pidió: ')}
                                </p>
                              )}

                              <div className="na-cot-card-pie">
                                <div className="na-cot-productos">
                                  <span className="na-cot-productos-num">{c.productos.length}</span>
                                  <span>
                                    {c.productos.length === 1 ? 'producto' : 'productos'}
                                  </span>
                                </div>
                                <div className="na-cot-total">
                                  <span className="na-cot-total-label">Total estimado</span>
                                  <span className="na-cot-total-num">
                                    <Monto valor={totalCotizacion(c)} conEspacio moneda={moneda} />
                                  </span>
                                </div>
                                <button
                                  className="na-cot-btn-detalle"
                                  onClick={() => setDetalleId(c.id)}
                                  type="button"
                                >
                                  Ver detalle <Icon name="chevron-right" size={13} />
                                </button>
                              </div>
                            </article>
                          </li>
                        )
                      })}
                    </ol>
                  )}
                </>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {detalle && (
              <DetalleEnviada
                cotizacion={detalle}
                negocio={negocioInfo(detalle, asociados)}
                moneda={moneda}
                badge={badge}
                onCerrar={() => setDetalleId(null)}
                onContactar={() => contactar(detalle)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

function DetalleEnviada({ cotizacion, negocio, moneda, badge, onCerrar, onContactar }) {
  const estado = cotizacion.estadoVigente
  const sub = subtotal(cotizacion)
  const total = totalCotizacion(cotizacion)

  return (
    <motion.div
      className="na-cot-overlay na-cot-overlay--detalle"
      onClick={onCerrar}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="na-cot-detail"
        role="dialog"
        aria-label={`Cotización ${cotizacion.numero}`}
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="na-cot-detail-head">
          <div className="na-cot-detail-titulo">
            <span className="na-cot-detail-folio">Cotización #{cotizacion.numero}</span>
            <div className="na-cot-detail-id">
              {badge(estado)}
            </div>
          </div>
          <button className="na-cot-detail-cerrar" onClick={onCerrar} type="button" aria-label="Cerrar">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="na-cot-detail-cuerpo">
          <div className="na-cot-detail-destino">
            <span className="na-cot-avatar na-cot-avatar--lg" style={{ background: negocio.color }}>
              {iniciales(negocio.nombre)}
            </span>
            <div>
              <span className="na-cot-destino-para">Cotización enviada a</span>
              <h4 className="na-cot-detail-negocio">{negocio.nombre}</h4>
            </div>
          </div>

          <div className="na-cot-detail-datos">
            <div className="na-cot-dato">
              <span className="na-cot-dato-label">Envía</span>
              <span className="na-cot-dato-valor">{cotizacion.proveedor}</span>
            </div>
            <div className="na-cot-dato">
              <span className="na-cot-dato-label">Fecha de envío</span>
              <span className="na-cot-dato-valor">{formatearFecha(cotizacion.fecha)}</span>
            </div>
            <div className="na-cot-dato">
              <span className="na-cot-dato-label">Vence</span>
              <span className="na-cot-dato-valor">{formatearFecha(cotizacion.vence)}</span>
            </div>
            {cotizacion.entrega && (
              <div className="na-cot-dato">
                <span className="na-cot-dato-label">Entrega</span>
                <span className="na-cot-dato-valor"><Icon name="truck" size={13} /> {cotizacion.entrega}</span>
              </div>
            )}
            {cotizacion.formaPago && (
              <div className="na-cot-dato">
                <span className="na-cot-dato-label">Forma de pago</span>
                <span className="na-cot-dato-valor"><Icon name="wallet" size={13} /> {cotizacion.formaPago}</span>
              </div>
            )}
          </div>

          {cotizacion.solicitud && (
            <p className="na-cot-detail-solicitud">
              <Icon name="file-text" size={12} />
              {cotizacion.solicitud.replace(/^Solicitaste /i, 'El negocio pidió: ')}
            </p>
          )}

          <div className="na-cot-detail-seccion">
            <h5 className="na-cot-detail-subtitulo">Productos cotizados</h5>
            <div className="na-cot-tabla-wrap">
              <table className="na-cot-tabla">
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

          <div className="na-cot-totales">
            <div className="na-cot-total-line"><span>Subtotal</span><b><Monto valor={sub} moneda={moneda} /></b></div>
            {cotizacion.descuento > 0 && (
              <div className="na-cot-total-line na-cot-total-line--descuento"><span>Descuento</span><b>− <Monto valor={cotizacion.descuento} moneda={moneda} /></b></div>
            )}
            {cotizacion.envio > 0 && (
              <div className="na-cot-total-line"><span>Envío</span><b><Monto valor={cotizacion.envio} moneda={moneda} /></b></div>
            )}
            <div className="na-cot-total-line na-cot-total-line--grande"><span>Total ofertado</span><b><Monto valor={total} moneda={moneda} /></b></div>
          </div>

          {cotizacion.condiciones && (
            <div className="na-cot-condiciones">
              <span className="na-cot-condiciones-titulo"><Icon name="tag" size={12} /> Condiciones ofrecidas</span>
              <p>{cotizacion.condiciones}</p>
            </div>
          )}

          {estado === 'pendiente' && (
            <div className="na-cot-nota na-cot-nota--pendiente">
              <Icon name="clock" size={17} />
              <span>El negocio todavía no responde. Si vence la fecha, la cotización se marca como vencida.</span>
            </div>
          )}
          {estado === 'aceptada' && (
            <div className="na-cot-nota na-cot-nota--aceptada">
              <Icon name="check-circle" size={17} />
              <span>El negocio aceptó la cotización: se inició el proceso de venta.</span>
            </div>
          )}
          {estado === 'rechazada' && (
            <div className="na-cot-nota na-cot-nota--rechazada">
              <Icon name="x" size={17} />
              <span>El negocio rechazó la cotización.{cotizacion.motivo ? ` Motivo: ${cotizacion.motivo}.` : ''}</span>
            </div>
          )}
          {estado === 'vencida' && (
            <div className="na-cot-nota na-cot-nota--vencida">
              <Icon name="alert-triangle" size={17} />
              <span>La cotización venció sin respuesta. Podés contactar al negocio o armar una nueva.</span>
            </div>
          )}

          <div className="na-cot-detail-acciones">
            {negocio.whatsapp && (
              <button className="na-cot-btn na-cot-btn--whatsapp" onClick={onContactar} type="button">
                <Icon name="message-circle" size={14} /> Contactar negocio
              </button>
            )}
            <button className="na-cot-btn na-cot-btn--cerrar" onClick={onCerrar} type="button">
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}