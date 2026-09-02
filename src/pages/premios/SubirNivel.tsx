import { useEffect, useState } from 'react'
import { Store, Gift, Sparkles, ChevronDown, Star, Check } from 'lucide-react'
import { ANUNCIOS_SUBIR_NIVEL, type AnuncioSubirNivel } from '../../data/premios'
import { META_NIVEL, nivelActual, siguienteNivel, estadoNivel, NIVELES } from './nivelesUI'
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

/* Progresion de niveles: la misma historia que el hero de arriba.
 * La barra se divide en 4 tramos iguales (uno por nivel, alineados
 * con las tarjetas de abajo) y el relleno avanza DENTRO del tramo
 * del nivel actual: con Plata, el marcador cae en el segundo tramo
 * y esa tarjeta queda bordeada en dorado #fea02f. Los puntos vienen
 * del mismo store que el saldo y el badge "Nivel X" de arriba, asi
 * no pueden desincronizarse. */
function ProgresionNiveles({ puntos }: { puntos: number }) {
  const actual = nivelActual(puntos)
  const sig = siguienteNivel(puntos)

  // Mismo % que el hero: cuanto del tramo actual llevas recorrido.
  const fraccion = sig
    ? (puntos - actual.puntosMin) / (sig.puntosMin - actual.puntosMin)
    : 1

  // Posicion sobre la barra completa: tramo actual + lo recorrido
  // dentro de el. Con niveles de 25% cada uno, el marcador siempre
  // queda encima de la tarjeta de tu nivel.
  const indice = NIVELES.findIndex((n) => n.id === actual.id)
  const posicion = ((indice + Math.min(Math.max(fraccion, 0), 1)) / NIVELES.length) * 100

  // El relleno arranca en 0 y crece hasta su posicion real, igual
  // que la barra del hero.
  const [ancho, setAncho] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setAncho(posicion))
    return () => cancelAnimationFrame(id)
  }, [posicion])

  return (
    <div className="mt-8 rounded-3xl border border-hueso-300 bg-white p-5 shadow-[0_2px_18px_-6px_rgba(0,63,90,0.14)] sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-lg font-bold text-tinta-900">Los niveles de Vincco</h3>
        {sig ? (
          <p className="text-sm text-tinta-600">
            Estás en <span className="font-extrabold text-tinta-900">{actual.nombre}</span> · Vas{' '}
            <span className="font-extrabold text-turquesa-700">{Math.round(fraccion * 100)}%</span>{' '}
            hacia {sig.nombre}
          </p>
        ) : (
          <p className="text-sm font-extrabold text-naranja-700">Nivel maximo alcanzado</p>
        )}
      </div>

      {/* Barra partida en 4 tramos; el relleno termina dentro del
          tramo del nivel actual, igual que el % del hero. */}
      <div
        role="progressbar"
        aria-label="Progreso por los niveles de Vincco"
        aria-valuenow={Math.round(fraccion * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`Nivel ${actual.nombre}${sig ? `, ${Math.round(fraccion * 100)}% hacia ${sig.nombre}` : ''}`}
        className="relative mt-6 h-3 rounded-full bg-hueso-200 ring-1 ring-hueso-300"
      >
        {/* Separadores de tramo (uno por cambio de nivel) */}
        {[25, 50, 75].map((pct) => (
          <span
            key={pct}
            aria-hidden="true"
            className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tinta-900/10"
            style={{ left: `${pct}%` }}
          />
        ))}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-naranja-500 to-dorado-400 transition-[width] duration-1000 ease-out"
          style={{ width: `${Math.min(ancho, 100)}%` }}
        />
        {/* Marcador de posicion: viaja con el relleno */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-dorado-500 bg-white shadow-md transition-[left] duration-1000 ease-out"
          style={{ left: `${Math.min(ancho, 100)}%` }}
        />
      </div>

      <ol className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {NIVELES.map((n) => {
          const m = META_NIVEL[n.id]
          const Icono = m.icono
          const esActual = n.id === actual.id
          const superado = n.puntosMax < puntos
          return (
            <li
              key={n.id}
              aria-current={esActual ? 'step' : undefined}
              className={cn(
                'rounded-2xl border-2 p-4 transition',
                esActual
                  ? 'border-dorado-500 bg-dorado-50 shadow-[0_6px_18px_-8px_rgba(254,160,47,0.55)]'
                  : 'border-hueso-200 bg-hueso-50'
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'grid h-10 w-10 place-items-center rounded-xl',
                    esActual ? 'bg-dorado-500/15' : 'bg-white'
                  )}
                >
                  <Icono
                    className={cn('h-5 w-5', superado && !esActual ? 'text-turquesa-600' : m.acentoOscuro)}
                    aria-hidden="true"
                  />
                </span>
                {superado && !esActual && (
                  <Check className="h-4 w-4 text-turquesa-600" aria-hidden="true" />
                )}
              </div>
              <p className="mt-3 text-sm font-extrabold text-tinta-900">{n.nombre}</p>
              <span
                className={cn(
                  'mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide',
                  esActual
                    ? 'bg-dorado-500 text-tinta-900'
                    : superado
                      ? 'bg-turquesa-100 text-turquesa-800'
                      : 'text-tinta-500'
                )}
              >
                {estadoNivel(n, puntos)}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function SubirNivel({ puntos }: { puntos: number }) {
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

      <ProgresionNiveles puntos={puntos} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ANUNCIOS_SUBIR_NIVEL.map((a) => (
          <BloqueAnuncio key={a.id} anuncio={a} />
        ))}
      </div>
    </section>
  )
}