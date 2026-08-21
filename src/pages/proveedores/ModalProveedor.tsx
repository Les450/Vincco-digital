import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck, Star, MapPin, Mail, Phone, Globe2, Send,
  UploadCloud, Package, CalendarDays, Paperclip,
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogOverlay,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import type { Proveedor } from './data'
import { ASUNTOS } from './data'
import TrustRing from './TrustRing'
import { AvatarProveedor, DISPONIBILIDAD } from './TarjetaProveedor'
import { useToasts } from './Toasts'
import { cn } from '@/lib/utils'

type Tab = 'informacion' | 'productos' | 'resenas' | 'solicitar'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'informacion', label: 'Información' },
  { id: 'productos', label: 'Productos' },
  { id: 'resenas', label: 'Reseñas' },
  { id: 'solicitar', label: 'Invitar' },
]

interface ModalProveedorProps {
  proveedor: Proveedor | null
  tabInicial?: Tab
  onClose: () => void
  onEnviada: (p: Proveedor, asunto: string, mensaje: string) => void
}

export default function ModalProveedor({ proveedor, tabInicial = 'informacion', onClose, onEnviada }: ModalProveedorProps) {
  const toasts = useToasts()
  const [tab, setTab] = useState<Tab>(tabInicial)
  const [asunto, setAsunto] = useState(ASUNTOS[0])
  const [mensaje, setMensaje] = useState('')
  const [archivo, setArchivo] = useState<string | null>(null)
  const [sobreArrastre, setSobreArrastre] = useState(false)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [enviando, setEnviando] = useState(false)

  // Cada apertura arranca en la pestaña pedida y con el form limpio.
  const claveKey = proveedor?.id ?? 'cerrado'
  const abierto = !!proveedor
  const key = `${claveKey}-${tabInicial}-${String(abierto)}`

  const resetForm = () => {
    setAsunto(ASUNTOS[0])
    setMensaje('')
    setArchivo(null)
    setAceptaTerminos(false)
    setEnviando(false)
  }

  const promedioResenas = useMemo(
    () => (proveedor?.resenas.length ? proveedor.resenas.reduce((s, r) => s + r.rating, 0) / proveedor.resenas.length : 0),
    [proveedor]
  )

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (!aceptaTerminos) {
      toasts.error('Revisa los términos', 'Debés aceptar los términos de asociación de Vincco para continuar.')
      return
    }
    setEnviando(true)
    window.setTimeout(() => {
      setEnviando(false)
      if (proveedor) onEnviada(proveedor, asunto, mensaje)
      resetForm()
      onClose()
    }, 1100)
  }

  const disp = proveedor ? DISPONIBILIDAD[proveedor.disponibilidad] : null

  return (
    <Dialog open={abierto} onOpenChange={(o) => { if (!o) { resetForm(); onClose() } }}>
      <DialogOverlay className="bg-vincco-navy-950/60 backdrop-blur-[2px]" />
      <DialogContent
        key={key}
        className="flex h-[92dvh] w-full flex-col gap-0 overflow-hidden rounded-none border-vincco-line bg-vincco-mist p-0 sm:h-[86dvh] sm:max-w-2xl sm:rounded-2xl sm:border"
      >
        {proveedor && disp && (
          <>
            {/* Banner del proveedor */}
            <div className="relative shrink-0 overflow-hidden bg-vincco-navy-900 px-5 pb-5 pt-6 sm:px-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: 'radial-gradient(560px 200px at 85% -20%, rgba(212,168,67,0.28), transparent 60%), radial-gradient(420px 160px at 0% 120%, rgba(27,70,140,0.5), transparent 65%)',
                }}
              />
              <div className="relative flex items-start gap-4">
                <div className="relative shrink-0">
                  <AvatarProveedor nombre={proveedor.nombre} color={proveedor.color} size={64} />
                  {proveedor.verificado && (
                    <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-vincco-navy-900">
                      <BadgeCheck className="h-4 w-4 text-vincco-navy-800" strokeWidth={2.25} />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 text-white">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <h2 className="truncate font-display text-lg font-bold tracking-tight" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
                      {proveedor.nombre}
                    </h2>
                    {proveedor.verificado && (
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10.5px] font-semibold text-vincco-gold-100">Verificado</span>
                    )}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px] text-white/70">
                    <span>{proveedor.categoria} · {proveedor.tipo}</span>
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12.5px]">
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-vincco-gold text-vincco-gold" />
                      <b className="text-white">{proveedor.rating.toFixed(1)}</b>
                      <span className="text-white/60">({proveedor.resenasCount} reseñas)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/80">
                      <MapPin className="h-3.5 w-3.5 text-vincco-gold" strokeWidth={1.75} />
                      {proveedor.ubicacion}
                    </span>
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', disp.clase)}>{disp.label}</span>
                  </div>
                </div>

                <TrustRing score={proveedor.confianza} size={58} withLabel className="bg-white/10 rounded-full ring-1 ring-white/20" />
              </div>
            </div>

            {/* Pestañas internas */}
            <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-vincco-line bg-white px-3 pt-2 sm:px-5" role="tablist" aria-label="Detalle del proveedor">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'relative shrink-0 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold transition-colors',
                    tab === t.id ? 'text-vincco-navy-800' : 'text-vincco-slate2 hover:text-vincco-navy-700'
                  )}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.span
                      layoutId={`tab-${proveedor.id}`}
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-vincco-gold"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Cuerpo */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {tab === 'informacion' && (
                    <div className="space-y-5">
                      <p className="text-[14px] leading-relaxed text-vincco-ink/90">{proveedor.descripcion}</p>

                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-vincco-slate2">Lo que ofrecen</p>
                        <div className="flex flex-wrap gap-2">
                          {proveedor.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-vincco-line bg-white px-3 py-1.5 text-[12.5px] font-medium text-vincco-navy-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2.5 sm:grid-cols-2">
                        <span className="flex items-center gap-2.5 rounded-xl border border-vincco-line bg-white px-3.5 py-3 text-[13px] text-vincco-ink">
                          <Mail className="h-4 w-4 shrink-0 text-vincco-gold-700" strokeWidth={1.75} /> {proveedor.contacto.correo}
                        </span>
                        <span className="flex items-center gap-2.5 rounded-xl border border-vincco-line bg-white px-3.5 py-3 text-[13px] text-vincco-ink">
                          <Phone className="h-4 w-4 shrink-0 text-vincco-gold-700" strokeWidth={1.75} /> {proveedor.contacto.telefono}
                        </span>
                        <span className="flex items-center gap-2.5 rounded-xl border border-vincco-line bg-white px-3.5 py-3 text-[13px] text-vincco-ink">
                          <Globe2 className="h-4 w-4 shrink-0 text-vincco-gold-700" strokeWidth={1.75} /> {proveedor.contacto.sitio}
                        </span>
                        <span className="flex items-center gap-2.5 rounded-xl border border-vincco-line bg-white px-3.5 py-3 text-[13px] text-vincco-ink">
                          <CalendarDays className="h-4 w-4 shrink-0 text-vincco-gold-700" strokeWidth={1.75} /> Miembro desde {proveedor.miembroDesde}
                        </span>
                      </div>
                    </div>
                  )}

                  {tab === 'productos' && (
                    proveedor.productos.length === 0 ? (
                      <p className="py-10 text-center text-sm text-vincco-slate2">Este proveedor aún no publica su catálogo.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {proveedor.productos.map((prod) => (
                          <li key={prod.id} className="flex items-center gap-3.5 rounded-xl border border-vincco-line bg-white px-4 py-3.5">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-vincco-navy-50 text-vincco-navy-700">
                              <Package className="h-[18px] w-[18px]" strokeWidth={1.75} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13.5px] font-semibold text-vincco-ink">{prod.nombre}</p>
                              <p className="text-[12px] text-vincco-slate2">{prod.categoria}</p>
                            </div>
                            <p className="text-[13.5px] font-bold text-vincco-navy-800">
                              C${prod.precio.toFixed(2)} <span className="font-medium text-vincco-slate2">/ {prod.unidad}</span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    )
                  )}

                  {tab === 'resenas' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 rounded-xl border border-vincco-line bg-white px-4 py-4">
                        <span className="font-display text-3xl font-bold text-vincco-ink" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
                          {promedioResenas.toFixed(1)}
                        </span>
                        <div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} className={cn('h-4 w-4', i <= Math.round(promedioResenas) ? 'fill-vincco-gold text-vincco-gold' : 'text-vincco-line')} />
                            ))}
                          </div>
                          <p className="mt-1 text-[12.5px] text-vincco-slate2">Basado en {proveedor.resenasCount} reseñas de clientes Vincco</p>
                        </div>
                      </div>
                      {proveedor.resenas.map((r) => (
                        <div key={r.id} className="rounded-xl border border-vincco-line bg-white px-4 py-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-vincco-ink">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-vincco-navy-50 text-[10px] font-bold text-vincco-navy-700">
                                {r.autor.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                              </span>
                              {r.autor}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star key={i} className={cn('h-3 w-3', i <= r.rating ? 'fill-vincco-gold text-vincco-gold' : 'text-vincco-line')} />
                                ))}
                              </span>
                              <span className="text-[11.5px] text-vincco-slate2">{r.fecha}</span>
                            </div>
                          </div>
                          <p className="mt-2 text-[13px] leading-relaxed text-vincco-slate2">{r.texto}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'solicitar' && (
                    <form onSubmit={enviar} className="space-y-4">
                      <div>
                        <label htmlFor="asunto" className="mb-1.5 block text-[12.5px] font-semibold text-vincco-ink">Asunto</label>
                        <div className="relative">
                          <select
                            id="asunto"
                            value={asunto}
                            onChange={(e) => setAsunto(e.target.value)}
                            className="h-11 w-full appearance-none rounded-xl border border-vincco-line bg-white px-3.5 pr-10 text-sm text-vincco-ink shadow-sm outline-none transition focus:border-vincco-navy-600/50 focus:ring-2 focus:ring-vincco-navy-600/20"
                          >
                            {ASUNTOS.map((a) => <option key={a} value={a}>{a}</option>)}
                          </select>
                          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-vincco-slate2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label htmlFor="mensaje" className="block text-[12.5px] font-semibold text-vincco-ink">Mensaje personalizado</label>
                          <span className="text-[11.5px] tabular-nums text-vincco-slate2">{mensaje.length}/500</span>
                        </div>
                        <Textarea
                          id="mensaje"
                          value={mensaje}
                          maxLength={500}
                          onChange={(e) => setMensaje(e.target.value)}
                          placeholder="Contanos qué necesitás: volúmenes, plazos de entrega, condiciones de pago..."
                          rows={4}
                          className="rounded-xl border-vincco-line bg-white text-sm shadow-sm placeholder:text-vincco-slate2/70 focus:border-vincco-navy-600/50 focus:ring-2 focus:ring-vincco-navy-600/20"
                        />
                      </div>

                      <div>
                        <p className="mb-1.5 text-[12.5px] font-semibold text-vincco-ink">Adjuntar archivo <span className="font-normal text-vincco-slate2">(opcional)</span></p>
                        <label
                          onDragOver={(e) => { e.preventDefault(); setSobreArrastre(true) }}
                          onDragLeave={() => setSobreArrastre(false)}
                          onDrop={(e) => {
                            e.preventDefault()
                            setSobreArrastre(false)
                            const f = e.dataTransfer.files?.[0]
                            if (f) setArchivo(f.name)
                          }}
                          className={cn(
                            'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors',
                            sobreArrastre ? 'border-vincco-navy-600 bg-vincco-navy-50' : 'border-vincco-line bg-white hover:border-vincco-navy-600/40'
                          )}
                        >
                          <input
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (f) setArchivo(f.name)
                            }}
                          />
                          {archivo ? (
                            <>
                              <span className="flex items-center gap-2 text-[13px] font-semibold text-vincco-navy-700">
                                <Paperclip className="h-4 w-4" strokeWidth={1.75} /> {archivo}
                              </span>
                              <span className="text-[11.5px] text-vincco-slate2">Hacé clic para cambiar el archivo</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="h-5 w-5 text-vincco-gold-700" strokeWidth={1.5} />
                              <span className="text-[13px] font-medium text-vincco-ink">Arrastrá tu archivo aquí o hacé clic para elegirlo</span>
                              <span className="text-[11.5px] text-vincco-slate2">PDF, imágenes o Excel · máx. 10 MB</span>
                            </>
                          )}
                        </label>
                      </div>

                      <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-vincco-line bg-white px-3.5 py-3.5">
                        <input
                          type="checkbox"
                          checked={aceptaTerminos}
                          onChange={(e) => setAceptaTerminos(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-vincco-navy-800"
                        />
                        <span className="text-[12.5px] leading-relaxed text-vincco-slate2">
                          Acepto los <span className="font-semibold text-vincco-navy-700 underline underline-offset-2">términos de asociación de Vincco</span> y autorizo a {proveedor.nombre} a contactarme para responder esta solicitud.
                        </span>
                      </label>

                      <div className="flex gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => { resetForm(); setTab('informacion') }}
                          className="h-11 flex-1 rounded-xl border border-vincco-line bg-white text-sm font-semibold text-vincco-slate2 transition hover:bg-vincco-mist hover:text-vincco-ink"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={enviando}
                          className="inline-flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-vincco-navy-800 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(15,44,89,0.3)] transition-all hover:scale-[1.01] hover:bg-vincco-navy-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70"
                        >
                          {enviando ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" strokeWidth={1.75} />
                              Enviar solicitud
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}