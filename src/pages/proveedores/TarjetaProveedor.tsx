import { motion } from 'framer-motion'
import { Star, MapPin, Heart, BadgeCheck, Eye, Handshake, SearchX, PackagePlus, Truck } from 'lucide-react'
import type { Proveedor } from './data'
import TrustRing from './TrustRing'
import { cn } from '@/lib/utils'

export const DISPONIBILIDAD: Record<Proveedor['disponibilidad'], { label: string; clase: string }> = {
  disponible: { label: 'Disponible', clase: 'bg-vincco-success/10 text-vincco-success' },
  ocupado: { label: 'Ocupado', clase: 'bg-vincco-warning/10 text-vincco-warning' },
  nuevo: { label: 'Nuevo', clase: 'bg-vincco-gold/15 text-vincco-gold-700' },
}

export function AvatarProveedor({ nombre, color, size = 48 }: { nombre: string; color: string; size?: number }) {
  const iniciales = nombre.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.32 }}
      aria-hidden="true"
    >
      {iniciales}
    </span>
  )
}

function RatingFila({ proveedor, size = 13 }: { proveedor: Proveedor; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-vincco-ink">
      <Star className="fill-vincco-gold text-vincco-gold" style={{ width: size, height: size }} />
      <span className="font-semibold">{proveedor.rating.toFixed(1)}</span>
      <span className="text-vincco-slate2">({proveedor.resenasCount})</span>
    </span>
  )
}

interface CardProps {
  proveedor: Proveedor
  favorito: boolean
  enFavorito: (p: Proveedor) => void
  enVerPerfil: (p: Proveedor) => void
  enSolicitar: (p: Proveedor) => void
}

export function TarjetaGrid({ proveedor, favorito, enFavorito, enVerPerfil, enSolicitar }: CardProps) {
  const disp = DISPONIBILIDAD[proveedor.disponibilidad]

  return (
    <motion.article
      variants={{ oculto: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl border border-vincco-line bg-white p-5 shadow-[0_1px_2px_rgba(11,35,72,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-vincco-gold/40 hover:shadow-[0_14px_34px_rgba(11,35,72,0.12)]"
    >
      <button
        onClick={() => enFavorito(proveedor)}
        aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={favorito}
        className={cn(
          'absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
          favorito
            ? 'border-vincco-gold/50 bg-vincco-gold/15 text-vincco-gold-700'
            : 'border-vincco-line bg-white text-vincco-slate2 hover:text-vincco-danger'
        )}
      >
        <Heart className="h-4 w-4" strokeWidth={1.75} fill={favorito ? 'currentColor' : 'none'} />
      </button>

      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <AvatarProveedor nombre={proveedor.nombre} color={proveedor.color} />
          {proveedor.verificado && (
            <span
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-vincco-navy-800 ring-2 ring-white"
              title="Proveedor verificado"
            >
              <BadgeCheck className="h-3 w-3 text-white" strokeWidth={2.25} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-2">
          <h3 className="truncate font-display text-[15px] font-bold tracking-tight text-vincco-ink" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
            {proveedor.nombre}
          </h3>
          <p className="mt-0.5 text-[12.5px] text-vincco-slate2">{proveedor.categoria} · {proveedor.tipo}</p>
        </div>

        <TrustRing score={proveedor.confianza} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', disp.clase)}>
          {proveedor.disponibilidad === 'disponible' && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          {disp.label}
        </span>
        <RatingFila proveedor={proveedor} />
      </div>

      <p className="mt-2.5 flex items-center gap-1 text-[12.5px] font-medium text-vincco-slate2">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-vincco-gold-700" strokeWidth={1.75} />
        {proveedor.ubicacion}
      </p>

      <p className="mt-2 line-clamp-2 min-h-[36px] text-[13px] leading-snug text-vincco-slate2">
        {proveedor.descripcion}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => enVerPerfil(proveedor)}
          className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-lg border border-vincco-line bg-white text-[13px] font-semibold text-vincco-navy-700 transition-all hover:border-vincco-navy-600/40 hover:bg-vincco-mist active:scale-[0.98]"
        >
          <Eye className="h-4 w-4" strokeWidth={1.75} />
          Ver perfil
        </button>
        <button
          onClick={() => enSolicitar(proveedor)}
          className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-lg bg-vincco-navy-800 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(15,44,89,0.25)] transition-all hover:scale-[1.02] hover:bg-vincco-navy-700 active:scale-[0.98]"
        >
          <Handshake className="h-4 w-4" strokeWidth={1.75} />
          Invitar
        </button>
      </div>
    </motion.article>
  )
}

export function TarjetaLista({ proveedor, favorito, enFavorito, enVerPerfil, enSolicitar }: CardProps) {
  const disp = DISPONIBILIDAD[proveedor.disponibilidad]

  return (
    <motion.article
      variants={{ oculto: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col gap-3 rounded-2xl border border-vincco-line bg-white p-4 shadow-[0_1px_2px_rgba(11,35,72,0.06)] transition-all duration-200 hover:border-vincco-gold/40 hover:shadow-[0_10px_28px_rgba(11,35,72,0.1)] sm:flex-row sm:items-center sm:gap-4"
    >
      <div className="relative shrink-0 self-start sm:self-center">
        <AvatarProveedor nombre={proveedor.nombre} color={proveedor.color} size={46} />
        {proveedor.verificado && (
          <span className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-vincco-navy-800 ring-2 ring-white" title="Proveedor verificado">
            <BadgeCheck className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 className="truncate font-display text-[15px] font-bold tracking-tight text-vincco-ink" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
            {proveedor.nombre}
          </h3>
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', disp.clase)}>
            {disp.label}
          </span>
          <RatingFila proveedor={proveedor} size={12} />
        </div>
        <p className="mt-1 line-clamp-1 text-[13px] text-vincco-slate2">{proveedor.descripcion}</p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-vincco-slate2">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-vincco-gold-700" strokeWidth={1.75} />
            {proveedor.ubicacion}
          </span>
          <span className="text-vincco-line">·</span>
          <span>{proveedor.categoria}</span>
          <span className="text-vincco-line">·</span>
          <span>{proveedor.tipo}</span>
        </p>
      </div>

      <div className="flex items-center gap-3 sm:pr-1">
        <TrustRing score={proveedor.confianza} size={46} />
        <button
          onClick={() => enFavorito(proveedor)}
          aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={favorito}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
            favorito
              ? 'border-vincco-gold/50 bg-vincco-gold/15 text-vincco-gold-700'
              : 'border-vincco-line bg-white text-vincco-slate2 hover:text-vincco-danger'
          )}
        >
          <Heart className="h-4 w-4" strokeWidth={1.75} fill={favorito ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={() => enSolicitar(proveedor)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-vincco-navy-800 px-3.5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(15,44,89,0.25)] transition-all hover:scale-[1.02] hover:bg-vincco-navy-700 active:scale-[0.98]"
        >
          <Handshake className="h-4 w-4" strokeWidth={1.75} />
          Invitar
        </button>
      </div>
    </motion.article>
  )
}

// ── Estados vacíos ──────────────────────────────────────────

interface EmptyStateProps {
  icono: 'lupa' | 'sobre' | 'invitar'
  titulo: string
  descripcion: string
  accion?: { label: string; onClick: () => void }
}

export function EmptyState({ icono, titulo, descripcion, accion }: EmptyStateProps) {
  const Icono = icono === 'lupa' ? SearchX : icono === 'sobre' ? PackagePlus : Truck

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center rounded-2xl border border-dashed border-vincco-line bg-white px-6 py-14 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-vincco-gold/15 text-vincco-gold-700">
        <Icono className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <h3 className="mt-4 font-display text-[16px] font-bold text-vincco-ink" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
        {titulo}
      </h3>
      <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-vincco-slate2">{descripcion}</p>
      {accion && (
        <button
          onClick={accion.onClick}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-vincco-navy-800 px-5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(15,44,89,0.25)] transition-all hover:scale-[1.02] hover:bg-vincco-navy-700 active:scale-[0.98]"
        >
          {accion.label}
        </button>
      )}
    </motion.div>
  )
}

// ── Skeletons (shimmer suave, sin spinners) ──────────────────

const SHIMMER = 'animate-shimmer bg-[linear-gradient(110deg,#EDEFF5_8%,#F7F8FB_26%,#EDEFF5_42%)] bg-[length:200%_100%] rounded-md'

export function SkeletonTarjeta() {
  return (
    <div className="flex flex-col rounded-2xl border border-vincco-line bg-white p-5">
      <div className="flex items-start gap-3.5">
        <span className={`${SHIMMER} h-12 w-12 rounded-full`} />
        <div className="flex-1 space-y-2 pt-1">
          <span className={`${SHIMMER} block h-3.5 w-3/4`} />
          <span className={`${SHIMMER} block h-3 w-1/2`} />
        </div>
        <span className={`${SHIMMER}  rounded-full`} style={{ width: 52, height: 52 }} />
      </div>
      <div className="mt-4 space-y-2">
        <span className={`${SHIMMER} block h-3 w-2/3`} />
        <span className={`${SHIMMER} block h-3 w-full`} />
        <span className={`${SHIMMER} block h-3 w-5/6`} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className={`${SHIMMER} h-[38px] rounded-lg`} />
        <span className={`${SHIMMER} h-[38px] rounded-lg`} />
      </div>
    </div>
  )
}