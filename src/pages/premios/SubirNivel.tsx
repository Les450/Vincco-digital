import { useState } from 'react'
import { Store, Gift, Sparkles, ChevronDown, Star } from 'lucide-react'
import { ANUNCIOS_SUBIR_NIVEL, type AnuncioSubirNivel } from '../../data/premios'
import { cn } from '../../lib/utils'

// Tile (fondo del icono) y chip (etiqueta de puntos) por anuncio.
// El dorado solo se usa como fondo con icono tinta encima, nunca
// como color de texto: la regla de la guia de marca.
const ESTILOS: Record<
  AnuncioSubirNivel['tile'],
  { tile: string; chip: string }
> = {
  naranja: { tile: 'bg-naranja-500 text-hueso-50', chip: 'bg-naranja-100 text-naranja-800' },
  dorado: { tile: 'bg-dorado-500 text-tinta-900', chip: 'bg-dorado-100 text-tinta-800' },
  turquesa: { tile: 'bg-turquesa-600 text-hueso-50', chip: 'bg-turquesa-100 text-turquesa-800' },
}

const ICONOS: Record<AnuncioSubirNivel['icono'], typeof Store> = {
  store: Store,
  gift: Gift,
  sparkles: Sparkles,
}

function BloqueAnuncio({ anuncio }: { anuncio: AnuncioSubirNivel }) {
  const [abierto, setAbierto] = useState(false)
  const s = ESTILOS[anuncio.tile]
  const Icono = ICONOS[anuncio.icono]
  const idDetalles = `detalles-${anuncio.id}`

  return (
    <article className="flex flex-col rounded-2xl border border-hueso-300 bg-[#fbf7f0] p-5 shadow-[0_2px_18px_-6px_rgba(0,63,90,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(0,63,90,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <div className={cn('grid h-12 w-12 place-items-center rounded-2xl', s.tile)}>
          <Icono className="h-6 w-6" aria-hidden="true" />
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold',
            s.chip
          )}
        >
          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
          {anuncio.chip}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-tinta-900">{anuncio.titulo}</h3>
      <p className="mt-1 flex-1 text-sm leading-6 text-tinta-600">{anuncio.descripcion}</p>

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls={idDetalles}
        className="mt-4 inline-flex items-center gap-1.5 self-start rounded-lg text-sm font-bold text-turquesa-600 transition hover:text-turquesa-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa-600"
      >
        {abierto ? 'Ocultar detalles' : 'Ver detalles'}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', abierto && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {abierto && (
        <ul id={idDetalles} className="mt-3 space-y-2 border-t border-hueso-200 pt-3">
          {anuncio.detalles.map((d) => (
            <li key={d} className="flex items-start gap-2.5 text-[13px] leading-5 text-tinta-700">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-turquesa-500"
              />
              {d}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default function SubirNivel() {
  return (
    <section aria-label="Como subir tu nivel en Vincco">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tinta-500">
        Programa de lealtad
      </p>
      <h2 className="mt-1 font-display text-2xl font-bold text-tinta-900 sm:text-3xl">
        Como subir tu nivel en Vincco
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-tinta-600">
        Hay tres caminos para acumular puntos. Elegi el que mas te convenga:
        cada accion suma directo a tu saldo.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ANUNCIOS_SUBIR_NIVEL.map((a) => (
          <BloqueAnuncio key={a.id} anuncio={a} />
        ))}
      </div>
    </section>
  )
}