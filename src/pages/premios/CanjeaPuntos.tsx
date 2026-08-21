import { useState } from 'react'
import {
  Coffee,
  CupSoda,
  Croissant,
  Tag,
  Ticket,
  Wrench,
  Scissors,
  Cake,
  Film,
  Store,
  Star,
  ChevronDown,
  Check,
  type LucideIcon,
} from 'lucide-react'
import {
  RECOMPENSAS,
  RECOMPENSAS_VISIBLES,
  type IconoRecompensa,
} from '../../data/premios'
import { cn } from '../../lib/utils'

const ICONOS: Record<IconoRecompensa, LucideIcon> = {
  coffee: Coffee,
  'cup-soda': CupSoda,
  croissant: Croissant,
  tag: Tag,
  ticket: Ticket,
  wrench: Wrench,
  scissors: Scissors,
  cake: Cake,
  film: Film,
}

export default function CanjeaPuntos({ puntos }: { puntos: number }) {
  const [verTodas, setVerTodas] = useState(false)
  const [canjeada, setCanjeada] = useState<number | null>(null)

  const visibles = verTodas ? RECOMPENSAS : RECOMPENSAS.slice(0, RECOMPENSAS_VISIBLES)
  const disponibles = RECOMPENSAS.filter((r) => r.puntos <= puntos).length

  return (
    <section aria-label="Canjea tus puntos">
      <div className="rounded-3xl border border-hueso-300 bg-[#fbf7f0] p-5 shadow-[0_2px_24px_-8px_rgba(0,63,90,0.16)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-tinta-900 sm:text-3xl">
            Canjea tus puntos
          </h2>
          {/* Pill de saldo: fondo dorado con texto tinta, la regla del dorado */}
          <span className="inline-flex items-center gap-2 rounded-full bg-dorado-500 px-5 py-2 text-sm font-extrabold text-tinta-900 shadow-sm">
            <Star className="h-4 w-4 fill-tinta-800 text-tinta-800" aria-hidden="true" />
            {puntos.toLocaleString('es')} pts
          </span>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-tinta-800">Recompensas disponibles</p>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold',
              disponibles > 0
                ? 'bg-turquesa-100 text-turquesa-800'
                : 'bg-hueso-200 text-tinta-500'
            )}
          >
            {disponibles > 0
              ? `${disponibles} ${disponibles === 1 ? 'para canjear' : 'para canjear'}`
              : 'Sin recompensas por ahora'}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((r) => {
            const Icono = ICONOS[r.icono]
            const alcanza = puntos >= r.puntos
            const falta = r.puntos - puntos
            const yaCanjeada = canjeada === r.id
            return (
              <article
                key={r.id}
                className="flex flex-col rounded-2xl border border-hueso-300 bg-white/60 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(0,63,90,0.22)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-turquesa-100 px-3 py-1 text-[11px] font-extrabold text-turquesa-800">
                    <Icono className="h-3.5 w-3.5" aria-hidden="true" />
                    {r.categoria}
                  </span>
                  {/* Badge de puntos: naranja grande con texto hueso */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-naranja-500 px-3 py-1 text-[11px] font-extrabold text-hueso-50">
                    <Star className="h-3 w-3 fill-hueso-50" aria-hidden="true" />
                    {r.puntos} pts
                  </span>
                </div>

                <h3 className="mt-4 font-display text-base font-bold text-tinta-900">
                  {r.nombre}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-tinta-500">
                  <Store className="h-3.5 w-3.5 text-turquesa-600" aria-hidden="true" />
                  {r.negocio}
                </p>

                <button
                  type="button"
                  disabled={!alcanza || yaCanjeada}
                  onClick={() => setCanjeada(r.id)}
                  className={cn(
                    'mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa-600',
                    yaCanjeada
                      ? 'cursor-default bg-turquesa-700 text-white'
                      : alcanza
                        ? 'bg-turquesa-600 text-white hover:bg-turquesa-700'
                        : 'cursor-not-allowed bg-hueso-200 text-tinta-400'
                  )}
                >
                  {yaCanjeada ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Listo para canjear en el negocio
                    </>
                  ) : alcanza ? (
                    'Canjear recompensa'
                  ) : (
                    `Te faltan ${falta.toLocaleString('es')} pts`
                  )}
                </button>
              </article>
            )
          })}
        </div>

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={() => setVerTodas((v) => !v)}
            aria-expanded={verTodas}
            className="inline-flex items-center gap-2 rounded-full border-2 border-tinta-800 px-6 py-2.5 text-sm font-extrabold text-tinta-900 transition hover:bg-tinta-800 hover:text-hueso-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa-600"
          >
            {verTodas ? 'Ver menos' : 'Ver todas las recompensas'}
            <ChevronDown
              className={cn('h-4 w-4 transition-transform duration-200', verTodas && 'rotate-180')}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  )
}