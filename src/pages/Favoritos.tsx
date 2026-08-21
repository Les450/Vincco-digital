import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Icon from '../components/icons/Icon'
import { negociosFavoritos } from '../data/data_falso'

type Favorito = {
  id: number
  nombre: string
  categoria: string
  icono: string
  direccion: string
  rating: number
  descripcion: string
  // Solo lo traen los negocios que se administran desde el panel de
  // negocio de este mismo demo: sirve para leer su inventario real.
  sucursalId?: string
}

// Degradés de la identidad Vincco (navy + dorado) que se turnan como
// fondo de cada tarjeta, ya que los favoritos no tienen foto propia.
const DEGRADES = [
  ['#081B36', '#0B2348'],
  ['#0B2348', '#14356E'],
  ['#0F2C59', '#A87F28'],
  ['#081B36', '#14356E'],
  ['#A87F28', '#0B2348'],
]

// Tarjeta de favorito: la misma para el carrusel y para "Ver todos"
// (className controla el ancho/posición según dónde se use).
function FavoritoTarjeta({
  f,
  colorIdx,
  onQuitar,
  onVerInventario,
  className,
}: {
  f: Favorito
  colorIdx: number
  onQuitar: (f: Favorito) => void
  onVerInventario: () => void
  className?: string
}) {
  const [from, to] = DEGRADES[colorIdx % DEGRADES.length]

  return (
    <div className={cn('group relative aspect-[1.5/1] overflow-hidden rounded-2xl border border-white/10', className)}>
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <Icon
          name={f.icono}
          size={132}
          strokeWidth={1.25}
          className="absolute -bottom-6 -right-6 text-white/10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>

      <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white/90 backdrop-blur-md">
        <Icon name={f.icono} size={12} />
        {f.categoria}
      </div>

      <button
        onClick={() => onQuitar(f)}
        aria-label="Quitar de favoritos"
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/35 text-rose-400 backdrop-blur-md transition hover:bg-black/55 active:scale-95"
      >
        <Icon name="heart" size={15} filled />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[15px] font-bold leading-tight text-white" title={f.nombre}>
            {f.nombre}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-[12px] font-bold text-vincco-gold-100">
            <Icon name="star" size={12} filled />
            {f.rating}
          </span>
        </div>
        <p className="flex items-center gap-1 truncate text-[11.5px] text-white/70">
          <Icon name="map-pin" size={11} />
          {f.direccion}
        </p>
        <Button
          size="sm"
          onClick={onVerInventario}
          className="h-8 w-fit gap-1.5 rounded-[8px] bg-white text-[11px] font-bold text-vincco-ink hover:bg-white/90"
        >
          Ver inventario
        </Button>
      </div>
    </div>
  )
}

// Fondo de la página (a ancho completo, sin tarjeta flotante): en
// modo oscuro es un gris casi negro, no el navy de la identidad, para
// que sí se sienta "oscuro" de verdad.
const FONDO_OSCURO = 'linear-gradient(160deg, #0B0E16 0%, #10141F 55%, #080B12 100%)'
const FONDO_CLARO = 'linear-gradient(160deg, #ead9c7 0%, #f1e4d4 55%, #e9edf6 100%)'

export default function Favoritos() {
  const navigate = useNavigate()
  const [favoritos, setFavoritos] = useState<Favorito[]>(negociosFavoritos)
  const [busqueda, setBusqueda] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [verTodos, setVerTodos] = useState(false)
  const [modoOscuro, setModoOscuro] = useState(true)
  const [confirmando, setConfirmando] = useState<Favorito | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const favoritosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return favoritos.filter((f) => !texto || f.nombre.toLowerCase().includes(texto))
  }, [favoritos, busqueda])

  const totalDots = favoritosFiltrados.length

  useEffect(() => {
    setCurrentIdx(0)
  }, [busqueda])

  useEffect(() => {
    if (!sliderRef.current) return
    const card = sliderRef.current.children[0] as HTMLElement | undefined
    if (!card) return
    const cardWidth = card.clientWidth + 16
    sliderRef.current.scrollTo({ left: currentIdx * cardWidth, behavior: 'smooth' })
  }, [currentIdx])

  const handlePrev = () => setCurrentIdx((prev) => (prev > 0 ? prev - 1 : totalDots - 1))
  const handleNext = () => setCurrentIdx((prev) => (prev < totalDots - 1 ? prev + 1 : 0))

  const quitarFavorito = (id: number) => {
    setFavoritos((prev) => prev.filter((f) => f.id !== id))
    setConfirmando(null)
  }

  const pedirConfirmacion = (f: Favorito) => {
    setConfirmando(f)
  }

  // "Ver inventario" abre el catálogo de ese negocio: los productos que
  // el comercio subió desde su panel, en modo lectura.
  const verInventario = (id: number) => navigate(`/negocio/${id}/inventario`)

  return (
    <div
      className="flex min-h-screen w-full items-start justify-center px-4 pb-12 pt-6 transition-colors duration-300 sm:px-6 sm:py-10"
      style={{
        background: modoOscuro ? FONDO_OSCURO : FONDO_CLARO,
      }}
    >
      <div className="w-full max-w-6xl">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/inicio')}
              aria-label="Volver"
              title="Volver"
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full border transition active:scale-95',
                modoOscuro
                  ? 'border-white/15 bg-white/5 text-white hover:bg-white/10'
                  : 'border-vincco-line bg-white text-vincco-navy-700 shadow-sm hover:bg-vincco-mist'
              )}
            >
              <Icon name="arrow-left" size={16} />
            </button>
            <h1
              className={cn(
                'truncate font-display text-[19px] font-bold tracking-tight transition-colors sm:text-[22px]',
                modoOscuro ? 'text-white' : 'text-vincco-ink'
              )}
              style={{ fontFamily: "'Sora','Inter',sans-serif" }}
            >
              Mis Favoritos
            </h1>
          </div>

          {/* Buscador corto + toggle de tema + Ver todos */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full max-w-[280px] md:max-w-[340px]">
              <Icon
                name="search"
                size={15}
                className={cn(
                  'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2',
                  modoOscuro ? 'text-white/40' : 'text-vincco-slate2'
                )}
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar favorito..."
                aria-label="Buscar negocio favorito"
                className={cn(
                  'h-10 w-full rounded-full border pl-9 pr-4 text-[13px] font-medium outline-none transition focus:ring-2 focus:ring-vincco-gold/50',
                  modoOscuro
                    ? 'border-white/15 bg-white/10 text-white placeholder:text-white/40'
                    : 'border-white/10 bg-white/95 text-vincco-ink shadow-[0_6px_18px_rgba(0,20,32,0.25)] placeholder:text-vincco-slate2/70'
                )}
              />
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => setModoOscuro((v) => !v)}
                aria-label={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full border transition active:scale-95',
                  modoOscuro
                    ? 'border-white/15 bg-white/5 text-vincco-gold hover:bg-white/10'
                    : 'border-vincco-line bg-white text-vincco-navy-700 shadow-sm hover:bg-vincco-mist'
                )}
              >
                <Icon name={modoOscuro ? 'sun' : 'moon'} size={16} />
              </button>

              {favoritosFiltrados.length > 0 && (
                <button
                  onClick={() => setVerTodos((v) => !v)}
                  className={cn(
                    'flex shrink-0 items-center gap-1 text-[13px] font-semibold transition-colors',
                    modoOscuro ? 'text-white/80 hover:text-white' : 'text-vincco-navy-700 hover:text-vincco-ink'
                  )}
                >
                  {verTodos ? 'Ocultar' : 'Ver todos'}
                  <Icon name={verTodos ? 'chevron-down' : 'chevron-right'} size={14} />
                </button>
              )}
            </div>
          </div>

          {favoritosFiltrados.length === 0 ? (
            <div
              className={cn(
                'rounded-2xl border border-dashed px-6 py-14 text-center transition-colors',
                modoOscuro ? 'border-white/20 bg-white/5' : 'border-vincco-line bg-white/70'
              )}
            >
              <div className={cn('mb-3 flex justify-center', modoOscuro ? 'text-white/50' : 'text-vincco-slate2')}>
                <Icon name="heart" size={30} />
              </div>
              <p className={cn('mb-1 text-[15px] font-bold', modoOscuro ? 'text-white' : 'text-vincco-ink')}>
                {favoritos.length === 0 ? 'Aún no tienes comercios favoritos.' : 'No encontramos favoritos con ese nombre.'}
              </p>
              <div
                className={cn(
                  'mx-auto mb-5 max-w-xs text-[13px] leading-relaxed',
                  modoOscuro ? 'text-white/60' : 'text-vincco-slate2'
                )}
              >
                {favoritos.length === 0
                  ? 'Guarda tus negocios favoritos para encontrarlos rápidamente cuando los necesites.'
                  : 'Prueba con otro término de búsqueda.'}
              </div>
              <Button
                onClick={() => navigate('/directorio')}
                className="rounded-full bg-vincco-gold text-vincco-navy-950 hover:bg-vincco-gold/90"
              >
                Explorar negocios
              </Button>
            </div>
          ) : (
            <>
              {/* Carrusel */}
              <div ref={sliderRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {favoritosFiltrados.map((f, idx) => (
                  <FavoritoTarjeta
                    key={f.id}
                    f={f}
                    colorIdx={idx}
                    onQuitar={pedirConfirmacion}
                    onVerInventario={() => verInventario(f.id)}
                    className="min-w-[86%] shrink-0 snap-start sm:min-w-[47%] lg:min-w-[31.5%]"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {favoritosFiltrados.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      aria-label={`Ir al favorito ${idx + 1}`}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        currentIdx === idx
                          ? 'w-7 bg-vincco-gold'
                          : modoOscuro
                            ? 'w-2 bg-white/25 hover:bg-white/45'
                            : 'w-2 bg-vincco-navy-900/15 hover:bg-vincco-navy-900/30'
                      )}
                    />
                  ))}
                </div>

                {totalDots > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      aria-label="Anterior"
                      className={cn(
                        'flex size-8 items-center justify-center rounded-full border transition active:scale-95',
                        modoOscuro
                          ? 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                          : 'border-vincco-line bg-white text-vincco-slate2 hover:bg-vincco-mist hover:text-vincco-navy-800'
                      )}
                    >
                      <Icon name="chevron-right" size={14} className="rotate-180" />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Siguiente"
                      className={cn(
                        'flex size-8 items-center justify-center rounded-full border transition active:scale-95',
                        modoOscuro
                          ? 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                          : 'border-vincco-line bg-white text-vincco-slate2 hover:bg-vincco-mist hover:text-vincco-navy-800'
                      )}
                    >
                      <Icon name="chevron-right" size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Ver todos: las mismas tarjetas del carrusel, en grilla de 2 columnas hacia abajo */}
              <AnimatePresence initial={false}>
                {verTodos && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className={cn('border-t pt-5', modoOscuro ? 'border-white/10' : 'border-vincco-line')}>
                      <p
                        className={cn(
                          'mb-3 text-[11px] font-bold uppercase tracking-wide',
                          modoOscuro ? 'text-white/60' : 'text-vincco-slate2'
                        )}
                      >
                        Todos tus favoritos
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                        {favoritosFiltrados.map((f, idx) => (
                          <FavoritoTarjeta
                            key={f.id}
                            f={f}
                            colorIdx={idx}
                            onQuitar={pedirConfirmacion}
                            onVerInventario={() => verInventario(f.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Confirmación para quitar un favorito: el corazón ya está
          rellenado porque el negocio es favorito; tocarlo solo muestra
          este aviso y el favorito se quita si el cliente confirma. */}
      <AnimatePresence>
        {confirmando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setConfirmando(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-vincco-line bg-white p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <Icon name="heart" size={22} filled />
              </div>
              <h2 className="font-display text-[17px] font-bold tracking-tight text-vincco-ink" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
                Quitar de favoritos
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-vincco-slate2">
                ¿Estás seguro que quieres quitar <strong className="text-vincco-ink">{confirmando.nombre}</strong> de tu lista de favoritos?
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => setConfirmando(null)}
                  className="h-10 rounded-[10px] border-vincco-line text-[13px] font-bold text-vincco-ink"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => quitarFavorito(confirmando.id)}
                  className="h-10 rounded-[10px] bg-rose-500 text-[13px] font-bold text-white hover:bg-rose-600"
                >
                  Aceptar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
