import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Undo2, XCircle, CheckCircle2, Eye, Mail, Clock3, CalendarDays } from 'lucide-react'
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import type { Solicitud, EstadoSolicitud } from './data'
import { ETAPAS } from './data'
import { EmptyState, AvatarProveedor } from './TarjetaProveedor'
import { cn } from '@/lib/utils'

export const ESTADO_UI: Record<EstadoSolicitud, { label: string; clase: string; punto: string }> = {
  pendiente: { label: 'Pendiente', clase: 'bg-vincco-warning/10 text-vincco-warning ring-vincco-warning/20', punto: 'bg-vincco-warning' },
  aceptada: { label: 'Aceptada', clase: 'bg-vincco-success/10 text-vincco-success ring-vincco-success/20', punto: 'bg-vincco-success' },
  rechazada: { label: 'Rechazada', clase: 'bg-vincco-danger/10 text-vincco-danger ring-vincco-danger/20', punto: 'bg-vincco-danger' },
  cancelada: { label: 'Cancelada', clase: 'bg-vincco-slate2/10 text-vincco-slate2 ring-vincco-slate2/20', punto: 'bg-vincco-slate2' },
}

interface SolicitudesProps {
  solicitudes: Solicitud[]
  onCancelar: (s: Solicitud) => void
  onReenviar: (s: Solicitud) => void
  onResponder: (s: Solicitud, estado: Extract<EstadoSolicitud, 'aceptada' | 'rechazada'>) => void
  // Textos del rol activo: la bandeja es la misma para ambos roles.
  textos: { uno: string; muchos: string; recibidas: string }
}

type Pestana = 'enviadas' | 'recibidas' | 'historial'

const PESTANAS: Array<{ id: Pestana; label: string }> = [
  { id: 'enviadas', label: 'Enviadas' },
  { id: 'recibidas', label: 'Recibidas' },
  { id: 'historial', label: 'Historial' },
]

function Timeline({ etapa, estado }: { etapa: number; estado: EstadoSolicitud }) {
  const colorEtapa = (i: number) => {
    if (estado === 'rechazada') return i < 3 ? 'bg-vincco-danger' : 'bg-vincco-danger'
    if (estado === 'cancelada') return i < Math.min(etapa, 3) ? 'bg-vincco-slate2/50' : 'bg-vincco-line'
    return i < etapa ? 'bg-vincco-navy-800' : 'bg-vincco-line'
  }

  return (
    <div className="flex w-full max-w-[260px] items-center" aria-hidden="true">
      {ETAPAS.map((etapaLabel, i) => (
        <div key={etapaLabel} className={cn('flex items-center', i < ETAPAS.length - 1 && 'flex-1')}>
          <span className={cn('flex h-2.5 w-2.5 shrink-0 rounded-full ring-4', colorEtapa(i), i < etapa ? 'ring-current/10' : 'ring-vincco-mist')} />
          {i < ETAPAS.length - 1 && (
            <span className={cn('mx-1 h-0.5 flex-1 rounded-full', colorEtapa(i + 1) === 'bg-vincco-line' || estado === 'cancelada' ? 'bg-vincco-line' : 'bg-vincco-navy-800/60')} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Solicitudes({ solicitudes, onCancelar, onReenviar, onResponder, textos }: SolicitudesProps) {
  const [pestana, setPestana] = useState<Pestana>('enviadas')
  const [detalle, setDetalle] = useState<Solicitud | null>(null)

  const listas: Record<Pestana, Solicitud[]> = useMemo(() => ({
    enviadas: solicitudes.filter((s) => s.tipo === 'enviada'),
    recibidas: solicitudes.filter((s) => s.tipo === 'recibida'),
    historial: solicitudes.filter((s) => s.tipo === 'historial'),
  }), [solicitudes])

  const lista = listas[pestana]

  const confirmarCancelar = (s: Solicitud) => {
    onCancelar(s)
  }

  const CONTENIDO_VACIO: Record<Pestana, { titulo: string; descripcion: string }> = {
    enviadas: {
      titulo: 'Todavía no enviaste solicitudes',
      descripcion: `No tienes solicitudes activas. ¡Empieza conectando con un ${textos.uno}! Explorá el catálogo y enviá tu primera solicitud de asociación.`,
    },
    recibidas: {
      titulo: 'No tienes solicitudes recibidas',
      descripcion: textos.recibidas,
    },
    historial: {
      titulo: 'Historial vacío por ahora',
      descripcion: `Las solicitudes que canceles o que respondan los ${textos.muchos} quedarán registradas aquí para consulta.`,
    },
  }

  const detalleEstado = detalle ? ESTADO_UI[detalle.estado] : null

  return (
    <div className="space-y-5">
      {/* Pestanas de solicitudes */}
      <div className="inline-flex rounded-xl border border-vincco-line bg-white p-1 shadow-sm" role="tablist" aria-label="Filtrar solicitudes">
        {PESTANAS.map((p) => {
          const contar = p.id === 'enviadas' ? listas.enviadas.length : p.id === 'recibidas' ? listas.recibidas.length : listas.historial.length
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={pestana === p.id}
              onClick={() => setPestana(p.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors',
                pestana === p.id ? 'bg-vincco-navy-800 text-white shadow-sm' : 'text-vincco-slate2 hover:text-vincco-navy-700'
              )}
            >
              {p.label}
              <span className={cn(
                'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold',
                pestana === p.id ? 'bg-vincco-gold text-vincco-navy-950' : 'bg-vincco-mist text-vincco-slate2'
              )}>
                {contar}
              </span>
            </button>
          )
        })}
      </div>

      {lista.length === 0 ? (
        <EmptyState
          icono="sobre"
          titulo={CONTENIDO_VACIO[pestana].titulo}
          descripcion={CONTENIDO_VACIO[pestana].descripcion}
        />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={pestana}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-3"
          >
            {lista.map((s) => {
              const ui = ESTADO_UI[s.estado]
              const esEnviada = s.tipo === 'enviada'
              const pendiente = s.estado === 'pendiente'
              return (
                <motion.article
                  key={s.id}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="rounded-2xl border border-vincco-line bg-white p-4 shadow-[0_1px_2px_rgba(11,35,72,0.05)] transition-all hover:border-vincco-gold/40 hover:shadow-[0_10px_28px_rgba(11,35,72,0.1)] sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex min-w-0 flex-1 gap-3.5">
                      <AvatarProveedor nombre={s.proveedorNombre} color={s.proveedorColor} size={46} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <h3 className="truncate font-display text-[14.5px] font-bold tracking-tight text-vincco-ink" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
                            {s.proveedorNombre}
                          </h3>
                          <span className="text-[12px] font-medium text-vincco-slate2">{s.proveedorCategoria}</span>
                          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1', ui.clase)}>
                            <span className={cn('h-1.5 w-1.5 rounded-full', ui.punto)} />
                            {ui.label}
                          </span>
                        </div>
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-vincco-slate2">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-vincco-navy-700">
                            <Send className="h-3.5 w-3.5 text-vincco-gold-700" strokeWidth={1.75} />
                            {s.asunto}
                          </span>
                          <span className="hidden text-vincco-line sm:inline">·</span>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
                            {s.fecha}
                          </span>
                        </p>
                        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-vincco-slate2">“{s.mensaje}”</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-vincco-slate2">Proceso</span>
                          <Timeline etapa={s.etapa} estado={s.estado} />
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      {esEnviada && pendiente && (
                        <button
                          onClick={() => confirmarCancelar(s)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-vincco-danger/25 bg-vincco-danger/5 px-3.5 text-[12.5px] font-semibold text-vincco-danger transition hover:bg-vincco-danger/10"
                        >
                          <XCircle className="h-4 w-4" strokeWidth={1.75} />
                          Cancelar solicitud
                        </button>
                      )}
                      {esEnviada && s.estado === 'rechazada' && (
                        <button
                          onClick={() => onReenviar(s)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-vincco-navy-600/25 bg-vincco-navy-50 px-3.5 text-[12.5px] font-semibold text-vincco-navy-700 transition hover:bg-vincco-navy-800 hover:text-white"
                        >
                          <Undo2 className="h-4 w-4" strokeWidth={1.75} />
                          Reenviar
                        </button>
                      )}
                      {!esEnviada && s.estado === 'pendiente' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onResponder(s, 'rechazada')}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-vincco-danger/25 bg-vincco-danger/5 px-3 text-[12.5px] font-semibold text-vincco-danger transition hover:bg-vincco-danger/10"
                          >
                            <XCircle className="h-4 w-4" strokeWidth={1.75} />
                            Rechazar
                          </button>
                          <button
                            onClick={() => onResponder(s, 'aceptada')}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-vincco-navy-800 px-3.5 text-[12.5px] font-semibold text-white shadow-[0_4px_12px_rgba(15,44,89,0.25)] transition hover:scale-[1.02] hover:bg-vincco-navy-700"
                          >
                            <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                            Aceptar
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => setDetalle(s)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-vincco-line bg-white px-3.5 text-[12.5px] font-semibold text-vincco-slate2 transition hover:text-vincco-navy-700"
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.75} />
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Detalle de la solicitud */}
      <Dialog open={!!detalle} onOpenChange={(o) => !o && setDetalle(null)}>
        <DialogOverlay className="bg-vincco-navy-950/60 backdrop-blur-[2px]" />
        <DialogContent className="flex max-h-[85dvh] flex-col rounded-2xl border-vincco-line bg-vincco-mist p-0 sm:max-w-lg">
          {detalle && detalleEstado && (
            <>
              <div className="flex items-start gap-4 border-b border-vincco-line bg-white px-6 py-5">
                <AvatarProveedor nombre={detalle.proveedorNombre} color={detalle.proveedorColor} size={52} />
                <div className="min-w-0 flex-1">
                  <DialogTitle className="font-display text-lg font-bold text-vincco-ink" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
                    {detalle.proveedorNombre}
                  </DialogTitle>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-vincco-slate2">
                    <span>{detalle.proveedorCategoria}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" strokeWidth={1.75} /> {detalle.fecha}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-vincco-slate2">Proceso</span>
                    <Timeline etapa={detalle.etapa} estado={detalle.estado} />
                  </div>
                </div>
                <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1', detalleEstado.clase)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', detalleEstado.punto)} />
                  {detalleEstado.label}
                </span>
              </div>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-vincco-slate2">
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.75} /> Asunto
                  </p>
                  <p className="text-[14px] font-semibold text-vincco-ink">{detalle.asunto}</p>
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-vincco-slate2">Mensaje</p>
                  <div className="rounded-xl border border-vincco-line bg-white px-4 py-3.5 text-[13.5px] leading-relaxed text-vincco-ink/90">
                    “{detalle.mensaje}”
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}