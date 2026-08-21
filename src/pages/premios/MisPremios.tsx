import { useEffect, useState } from 'react'
import { Medal, Award, Crown, Gem, Star, Check, Eye, EyeOff } from 'lucide-react'
import { NIVELES, type Nivel, type UsuarioPremios } from '../../data/premios'
import { cn } from '../../lib/utils'

// Icono y acento de cada nivel. Los acentos usan tintes de la paleta
// de marca: bronce = naranja claro, plata = gris azulado (tinta-200),
// oro = dorado, VIP = naranja de marca.
const META_NIVEL: Record<
  Nivel['id'],
  { icono: typeof Medal; acento: string; badge: string }
> = {
  bronce: { icono: Medal, acento: 'text-naranja-300', badge: 'bg-hueso-300 text-tinta-900' },
  plata: { icono: Award, acento: 'text-tinta-200', badge: 'bg-tinta-200 text-tinta-900' },
  oro: { icono: Crown, acento: 'text-dorado-400', badge: 'bg-dorado-500 text-tinta-900' },
  vip: { icono: Gem, acento: 'text-naranja-400', badge: 'bg-naranja-500 text-hueso-50' },
}

function nivelActual(puntos: number): Nivel {
  return [...NIVELES].reverse().find((n) => puntos >= n.puntosMin) ?? NIVELES[0]
}

function siguienteNivel(puntos: number): Nivel | null {
  return NIVELES.find((n) => puntos < n.puntosMin) ?? null
}

export default function MisPremios({
  usuario,
  ocultarSaldo = false,
}: {
  usuario: UsuarioPremios
  ocultarSaldo?: boolean
}) {
  const nivel = nivelActual(usuario.puntos)
  const sig = siguienteNivel(usuario.puntos)
  const meta = META_NIVEL[nivel.id]
  const NivelIcono = meta.icono

  // El saldo tapado es solo visual: se revela al toque y vuelve a
  // taparse a los cinco segundos, para que miradas ajenas no se
  // queden con el número.
  const [revelado, setRevelado] = useState(false)
  useEffect(() => {
    if (!ocultarSaldo || !revelado) return undefined
    const t = setTimeout(() => setRevelado(false), 5000)
    return () => clearTimeout(t)
  }, [ocultarSaldo, revelado])

  const saldoTapado = ocultarSaldo && !revelado

  const progreso = sig
    ? ((usuario.puntos - nivel.puntosMin) / (sig.puntosMin - nivel.puntosMin)) * 100
    : 100
  const faltan = sig ? sig.puntosMin - usuario.puntos : 0

  // La barra arranca en 0 y crece hasta el porcentaje real: la
  // animación de ancho la hace la transición de Tailwind.
  const [ancho, setAncho] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setAncho(progreso))
    return () => cancelAnimationFrame(id)
  }, [progreso])

  const estadoNivel = (n: Nivel): string | null => {
    if (n.puntosMax < usuario.puntos) return 'Superado'
    if (n.id === nivel.id) return 'Tu nivel actual'
    return `Desde ${n.puntosMin.toLocaleString('es')} pts`
  }

  return (
    <section aria-label="Mis premios" className="relative">
      <div className="relative overflow-hidden rounded-3xl bg-tinta-800 shadow-[0_18px_50px_-18px_rgba(0,63,90,0.55)] ring-1 ring-tinta-700">
        {/* Manchas de color de marca: graficos grandes permitidos */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-naranja-500/20 blur-3xl" />
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-dorado-400/20 blur-3xl" />
          <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-turquesa-400/15 blur-3xl" />
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            {/* Perfil + saldo */}
            <div>
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-dorado-500 shadow-lg shadow-dorado-500/20 ring-2 ring-dorado-400/40"
                >
                  {usuario.foto ? (
                    <img src={usuario.foto} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-2xl font-black text-tinta-900">
                      {usuario.iniciales}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-hueso-50">{usuario.nombre}</p>
                  <p className="text-sm text-hueso-200/70">@{usuario.handle}</p>
                  <p className="mt-0.5 text-xs text-hueso-200/50">
                    Miembro desde {usuario.miembroDesde}
                  </p>
                </div>
              </div>

<div className="mt-8">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-hueso-200/60">
                    Tu saldo
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    {saldoTapado ? (
                      <button
                        type="button"
                        onClick={() => setRevelado(true)}
                        aria-label="Mostrar mi saldo de puntos"
                        title="Mostrar saldo"
                        className="flex h-9 items-center gap-2 rounded-xl bg-hueso-50/10 px-3 font-display text-2xl font-black leading-none tracking-widest text-hueso-50 transition hover:bg-hueso-50/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dorado-400"
                      >
                        •••
                        <Eye aria-hidden="true" className="h-4 w-4 text-hueso-200/70" />
                      </button>
                    ) : (
                      <>
                        <span className="font-display text-3xl font-black leading-none tracking-tight text-hueso-50 sm:text-4xl">
                          {usuario.puntos.toLocaleString('es')}
                        </span>
                        {ocultarSaldo && (
                          <button
                            type="button"
                            onClick={() => setRevelado(false)}
                            aria-label="Ocultar mi saldo de puntos"
                            title="Ocultar saldo"
                            className="rounded-lg p-1 text-hueso-200/60 transition hover:text-hueso-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dorado-400"
                          >
                            <EyeOff aria-hidden="true" className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                    <span className="text-sm font-semibold text-dorado-300">pts</span>
                    <Star aria-hidden="true" className="ml-1 h-4 w-4 fill-dorado-400 text-dorado-400" />
                  </div>
                </div>
            </div>

            {/* Nivel actual + progreso */}
            <div className="w-full md:max-w-sm">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-extrabold',
                  meta.badge
                )}
              >
                <NivelIcono className="h-4 w-4" aria-hidden="true" />
                Nivel {nivel.nombre}
              </span>

              <div className="mt-5">
                <div
                  role="progressbar"
                  aria-label="Progreso hacia el siguiente nivel"
                  aria-valuenow={Math.round(progreso)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-3 overflow-hidden rounded-full bg-tinta-950/70 ring-1 ring-white/10"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-naranja-500 to-dorado-400 transition-[width] duration-1000 ease-out"
                    style={{ width: `${Math.min(ancho, 100)}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-sm">
                  {sig ? (
                    <>
                      <span className="font-extrabold text-hueso-50">
                        {Math.round(progreso)}% hacia {sig.nombre}
                      </span>
                      <span className="text-hueso-200/70">
                        Te faltan{' '}
                        <span className="font-bold text-dorado-300">
                          {faltan.toLocaleString('es')} pts
                        </span>
                      </span>
                    </>
                  ) : (
                    <span className="font-extrabold text-dorado-400">Nivel maximo alcanzado</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Minitarjetas de los 4 niveles */}
          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {NIVELES.map((n) => {
              const m = META_NIVEL[n.id]
              const Icono = m.icono
              const esActual = n.id === nivel.id
              const estado = estadoNivel(n)
              return (
                <div
                  key={n.id}
                  className={cn(
                    'rounded-2xl border p-4 transition',
                    esActual
                      ? 'border-dorado-400 bg-dorado-400/10 ring-2 ring-dorado-400/70'
                      : 'border-white/10 bg-white/5'
                  )}
                >
                  <Icono className={cn('h-6 w-6', m.acento)} aria-hidden="true" />
                  <p className="mt-3 text-sm font-extrabold text-hueso-50">{n.nombre}</p>
                  <span
                    className={cn(
                      'mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide',
                      esActual
                        ? 'bg-dorado-500 text-tinta-900'
                        : estado === 'Superado'
                          ? 'border border-white/15 text-hueso-200/60'
                          : 'text-hueso-200/70'
                    )}
                  >
                    {estado === 'Superado' && <Check className="h-3 w-3" aria-hidden="true" />}
                    {estado}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}