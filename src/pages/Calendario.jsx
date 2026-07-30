import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import './Calendario.css'


const COLORES_CATEGORIA = {
  cotizacion: '#007a7b',
  pedido: '#c05900',
  promocion: '#8f5a00',
  inventario: '#b3261e',
  evento: '#00374e',
  recordatorio: '#a34b00',
  mantenimiento: '#746454',
}

const ETIQUETAS_CATEGORIA = {
  cotizacion: 'Cotizaciones',
  pedido: 'Pedidos',
  promocion: 'Promociones',
  inventario: 'Inventario',
  evento: 'Eventos',
  recordatorio: 'Recordatorios',
  mantenimiento: 'Mantenimiento',
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function formatearFecha(iso) {
  const f = new Date(iso)
  return `${f.getDate()} de ${MESES[f.getMonth()]}, ${f.getFullYear()}`
}

export default function Calendario() {
  const navigate = useNavigate()
  const { eventosCalendario, userType } = useStore()
  const [mesActual, setMesActual] = useState(() => new Date().getMonth())
  const [anioActual, setAnioActual] = useState(() => new Date().getFullYear())
  const [filtro, setFiltro] = useState('todas')
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [transicion, setTransicion] = useState(null)

  const eventosDelUsuario = useMemo(() => {
    return eventosCalendario.filter(
      (e) => e.userType === 'general' || e.userType === userType
    )
  }, [eventosCalendario, userType])

  const eventosFiltrados = useMemo(() => {
    if (filtro === 'todas') return eventosDelUsuario
    return eventosDelUsuario.filter((e) => e.categoria === filtro)
  }, [eventosDelUsuario, filtro])

  const diasDelMes = useMemo(() => {
    const primerDia = new Date(anioActual, mesActual, 1)
    const ultimoDia = new Date(anioActual, mesActual + 1, 0)
    const inicioSemana = primerDia.getDay()
    const totalDias = ultimoDia.getDate()

    const celdas = []

    for (let i = 0; i < inicioSemana; i++) {
      celdas.push(null)
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const fecha = new Date(anioActual, mesActual, dia)
      const fechaStr = fecha.toISOString().split('T')[0]
      const eventosDelDia = eventosFiltrados.filter((e) => {
        const eFecha = new Date(e.fecha)
        return (
          eFecha.getDate() === dia &&
          eFecha.getMonth() === mesActual &&
          eFecha.getFullYear() === anioActual
        )
      })

      const categorias = [...new Set(eventosDelDia.map((e) => e.categoria))]
      const esHoy =
        new Date().getDate() === dia &&
        new Date().getMonth() === mesActual &&
        new Date().getFullYear() === anioActual

      celdas.push({ dia, fecha: fechaStr, eventos: eventosDelDia, categorias, esHoy })
    }

    return celdas
  }, [anioActual, mesActual, eventosFiltrados])

  const eventosDiaSeleccionado = useMemo(() => {
    if (!diaSeleccionado) return []
    return eventosFiltrados.filter((e) => {
      const ef = new Date(e.fecha)
      return (
        ef.getDate() === diaSeleccionado.dia &&
        ef.getMonth() === mesActual &&
        ef.getFullYear() === anioActual
      )
    })
  }, [diaSeleccionado, eventosFiltrados, mesActual, anioActual])

  const irAlMes = useCallback((direccion) => {
    setTransicion(direccion > 0 ? 'next' : 'prev')
    setTimeout(() => {
      let nuevoMes = mesActual + direccion
      let nuevoAnio = anioActual
      if (nuevoMes < 0) {
        nuevoMes = 11
        nuevoAnio--
      } else if (nuevoMes > 11) {
        nuevoMes = 0
        nuevoAnio++
      }
      setMesActual(nuevoMes)
      setAnioActual(nuevoAnio)
      setDiaSeleccionado(null)
      setTransicion(null)
    }, 150)
  }, [mesActual, anioActual])

  const irAHoy = useCallback(() => {
    const hoy = new Date()
    setMesActual(hoy.getMonth())
    setAnioActual(hoy.getFullYear())
    setDiaSeleccionado(null)
  }, [])

  const contadoresFiltro = useMemo(() => {
    const c = { todas: eventosDelUsuario.length }
    for (const cat of Object.keys(COLORES_CATEGORIA)) {
      c[cat] = eventosDelUsuario.filter((e) => e.categoria === cat).length
    }
    return c
  }, [eventosDelUsuario])

  return (
    <div className="cal">
      <div className="cal-header">
        <h2>Calendario</h2>
        <button className="cal-hoy-btn" onClick={irAHoy} type="button">Hoy</button>
      </div>

      <div className="cal-filtros">
        <button
          className={`cal-filtro-btn ${filtro === 'todas' ? 'cal-filtro-btn--activo' : ''}`}
          onClick={() => setFiltro('todas')}
          type="button"
        >
          Todos ({contadoresFiltro.todas})
        </button>
        {Object.entries(ETIQUETAS_CATEGORIA).map(([key, label]) => (
          <button
            key={key}
            className={`cal-filtro-btn ${filtro === key ? 'cal-filtro-btn--activo' : ''}`}
            style={filtro === key ? { background: COLORES_CATEGORIA[key], borderColor: COLORES_CATEGORIA[key] } : {}}
            onClick={() => setFiltro(key)}
            type="button"
          >
            {label} ({contadoresFiltro[key]})
          </button>
        ))}
      </div>

      <div className="cal-leyenda">
        {Object.entries(ETIQUETAS_CATEGORIA).map(([key, label]) => (
          <span key={key} className="cal-leyenda-item">
            <span className="cal-leyenda-dot" style={{ background: COLORES_CATEGORIA[key] }} />
            {label}
          </span>
        ))}
      </div>

      <div className="cal-mes-nav">
        <button className="cal-mes-btn" onClick={() => irAlMes(-1)} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="cal-mes-titulo">{MESES[mesActual]} {anioActual}</span>
        <button className="cal-mes-btn" onClick={() => irAlMes(1)} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="cal-grid-wrapper">
        <div className={`cal-grid ${transicion ? `cal-grid--${transicion}` : ''}`}>
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="cal-dia-nombre">{d}</div>
          ))}
          {diasDelMes.map((celda, i) => (
            celda ? (
              <button
                key={i}
                className={`cal-dia ${celda.esHoy ? 'cal-dia--hoy' : ''} ${diaSeleccionado?.dia === celda.dia ? 'cal-dia--seleccionado' : ''} ${celda.eventos.length > 0 ? 'cal-dia--con-eventos' : ''}`}
                onClick={() => setDiaSeleccionado(diaSeleccionado?.dia === celda.dia ? null : celda)}
                type="button"
              >
                <span className="cal-dia-num">{celda.dia}</span>
                {celda.categorias.length > 0 && (
                  <span className="cal-dia-dots">
                    {celda.categorias.slice(0, 3).map((cat) => (
                      <span key={cat} className="cal-dia-dot" style={{ background: COLORES_CATEGORIA[cat] }} />
                    ))}
                    {celda.categorias.length > 3 && (
                      <span className="cal-dia-mas">+{celda.categorias.length - 3}</span>
                    )}
                  </span>
                )}
              </button>
            ) : (
              <div key={i} className="cal-dia cal-dia--vacio" />
            )
          ))}
        </div>
      </div>

      {diaSeleccionado && (
        <div className="cal-detalle-overlay" onClick={() => setDiaSeleccionado(null)}>
          <div className="cal-detalle" onClick={(e) => e.stopPropagation()}>
            <div className="cal-detalle-header">
              <div>
                <span className="cal-detalle-fecha">{formatearFecha(new Date(anioActual, mesActual, diaSeleccionado.dia))}</span>
                <span className="cal-detalle-conteo">{eventosDiaSeleccionado.length} evento{eventosDiaSeleccionado.length !== 1 ? 's' : ''}</span>
              </div>
              <button className="cal-detalle-cerrar" onClick={() => setDiaSeleccionado(null)} type="button"><Icon name="x" size={16} /></button>
            </div>

            {eventosDiaSeleccionado.length === 0 ? (
              <div className="cal-detalle-vacio">
                <span className="cal-detalle-vacio-icono"><Icon name="calendar" size={28} /></span>
                <p>No hay eventos para este día</p>
              </div>
            ) : (
              <div className="cal-detalle-lista">
                {eventosDiaSeleccionado.map((e) => {
                  const estado = e.estado
                  const estadoClase = estado === 'vencido' ? 'cal-evento--vencido' : estado === 'completado' ? 'cal-evento--completado' : ''
                  return (
                    <div key={e.id} className={`cal-evento ${estadoClase}`}>
                      <div className="cal-evento-barra" style={{ background: COLORES_CATEGORIA[e.categoria] }} />
                      <div className="cal-evento-icono" style={{ background: `${COLORES_CATEGORIA[e.categoria]}15`, color: COLORES_CATEGORIA[e.categoria] }}><Icon name={e.icono} size={18} /></div>
                      <div className="cal-evento-contenido">
                        <div className="cal-evento-titulo">{e.titulo}</div>
                        <div className="cal-evento-descripcion">{e.descripcion}</div>
                        <div className="cal-evento-meta">
                          <span className="cal-evento-categoria" style={{ background: `${COLORES_CATEGORIA[e.categoria]}20`, color: COLORES_CATEGORIA[e.categoria] }}>
                            {ETIQUETAS_CATEGORIA[e.categoria]}
                          </span>
                          {e.hora && <span className="cal-evento-hora"><Icon name="clock" size={13} /> {e.hora}</span>}
                          <span className={`cal-evento-estado cal-evento-estado--${estado}`}>
                            {estado === 'pendiente' ? 'Pendiente' : estado === 'completado' ? 'Completado' : 'Vencido'}
                          </span>
                        </div>
                        <button className="cal-evento-btn" onClick={() => { setDiaSeleccionado(null); navigate(e.ruta) }} type="button">
                          Abrir módulo
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
