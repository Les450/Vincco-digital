import { ArrowUp, Gift, ArrowRight } from 'lucide-react'
import { ACTIVIDAD_RECIENTE } from '../../data/premios'
import { cn } from '../../lib/utils'

export default function ActividadReciente() {
  return (
    <section aria-label="Actividad reciente">
      <div className="rounded-3xl border border-hueso-300 bg-[#fbf7f0] p-5 shadow-[0_2px_24px_-8px_rgba(0,63,90,0.16)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tinta-500">
              Tus movimientos
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-tinta-900">
              Actividad reciente
            </h2>
          </div>
          <a
            href="#historial"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-turquesa-600 transition hover:text-turquesa-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa-600"
          >
            Ver historial completo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <ul className="mt-6 divide-y divide-hueso-200">
          {ACTIVIDAD_RECIENTE.map((a) => {
            const ganado = a.tipo === 'ganado'
            return (
              <li
                key={a.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                    ganado ? 'bg-turquesa-100 text-turquesa-600' : 'bg-naranja-100 text-naranja-600'
                  )}
                >
                  {ganado ? (
                    <ArrowUp className="h-5 w-5" strokeWidth={2.25} />
                  ) : (
                    <Gift className="h-5 w-5" strokeWidth={2.25} />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-tinta-900">{a.concepto}</p>
                  <p className="mt-0.5 truncate text-xs text-tinta-500">
                    {a.negocio} <span className="text-tinta-300">·</span> {a.fecha}
                  </p>
                </div>

                <span
                  className={cn(
                    'shrink-0 font-display text-base font-bold',
                    ganado ? 'text-turquesa-700' : 'text-naranja-700'
                  )}
                >
                  {ganado ? '+' : '\u2212'}
                  {a.puntos.toLocaleString('es')} pts
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}