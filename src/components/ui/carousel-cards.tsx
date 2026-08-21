import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Icon from '@/components/icons/Icon'

/* ==========================================================================
   CARRUSEL DE TARJETAS
   --------------------------------------------------------------------------
   Adaptado del componente de kokonutui (carousel-cards) al proyecto:
   - Sin next/image ni next/link: acá es CRA + react-router, así que la
     imagen es un <img> y la tarjeta entera es un <button>.
   - Los productos casi nunca traen foto, así que cuando no hay imagen se
     dibuja el degradado navy/dorado con el ícono de la categoría, igual
     que las tarjetas de Favoritos. Así ninguna fila queda despareja.

   Es presentacional: no sabe de inventarios ni de negocios, solo recibe
   tarjetas ya armadas y avisa cuál se tocó.
   ========================================================================== */

/* Portadas de los productos que no tienen foto. Son tintes claros de la
   paleta oficial de Vincco (turquesa, dorado, tinta, naranja, hueso):
   sobre una pantalla blanca, cinco bloques oscuros pesaban demasiado.
   El ícono va en el tono fuerte del mismo color, así cada tarjeta se
   distingue sin gritar. */
const PORTADAS: { desde: string; hasta: string; tinta: string }[] = [
  { desde: '#e8f6f6', hasta: '#cdecec', tinta: '#005c5e' },
  { desde: '#fff6e8', hasta: '#ffedc9', tinta: '#8f5214' },
  { desde: '#eef6fa', hasta: '#d9ecf4', tinta: '#003f5a' },
  { desde: '#fff5ec', hasta: '#ffe8d2', tinta: '#a34b00' },
  { desde: '#fbf7f0', hasta: '#f7efe3', tinta: '#856143' },
]

export type TonoEstado = 'ok' | 'bajo' | 'agotado'

export interface ProductoTarjeta {
  id: string | number
  titulo: string
  /** Línea chica bajo el título: categoría, unidad, lo que sea. */
  subtitulo?: string
  /** Ya formateado por quien lo usa (ej. "C$70"). */
  precio?: string
  /** Nota a la derecha del precio (ej. "por plato"). */
  precioNota?: string
  imagen?: string | null
  /** Nombre de ícono del proyecto (components/icons/Icon). */
  icono?: string
  /** Cinta arriba a la izquierda: "Promoción", "Nuevo"... */
  insignia?: string
  /** Disponibilidad abajo de la imagen. */
  estado?: string
  tonoEstado?: TonoEstado
  /** Índice de portada. Si no viene se usa la posición en la fila. */
  portada?: number
}

const ESTILO_ESTADO: Record<TonoEstado, string> = {
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  bajo: 'bg-amber-50 text-amber-700 border-amber-100',
  agotado: 'bg-rose-50 text-rose-700 border-rose-100',
}

/* --- Una tarjeta -------------------------------------------------------- */

export function TarjetaProducto({
  item,
  indice = 0,
  onSeleccionar,
  className,
}: {
  item: ProductoTarjeta
  indice?: number
  onSeleccionar?: (item: ProductoTarjeta) => void
  className?: string
}) {
  const portada = PORTADAS[(item.portada ?? indice) % PORTADAS.length]
  const agotado = item.tonoEstado === 'agotado'

  return (
    <button
      type="button"
      onClick={() => onSeleccionar?.(item)}
      aria-label={`Ver ${item.titulo}`}
      className={cn(
        'group flex w-full rounded-xl text-left transition focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-dorado-500 focus-visible:ring-offset-2',
        className
      )}
    >
      <Card
        className={cn(
          /* Color explícito a propósito: la app corre con <body class="dark">,
             así que los tokens de shadcn (bg-card / text-card-foreground) se
             vuelven oscuros y la tarjeta se perdía sobre el fondo claro. */
          'relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-hueso-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md',
          agotado && 'opacity-75'
        )}
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
          {item.imagen ? (
            <img
              src={item.imagen}
              alt={item.titulo}
              loading="lazy"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105',
                agotado && 'grayscale'
              )}
            />
          ) : (
            <div
              className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${portada.desde}, ${portada.hasta})` }}
            >
              {/* El ícono grande de fondo es adorno; el chico es el que se lee. */}
              <Icon
                name={item.icono || 'package'}
                size={104}
                strokeWidth={1.25}
                className="absolute -bottom-5 -right-5 opacity-10"
                style={{ color: portada.tinta }}
              />
              <span
                className="absolute inset-0 grid place-items-center"
                style={{ color: portada.tinta }}
              >
                <Icon name={item.icono || 'package'} size={30} strokeWidth={1.5} />
              </span>
            </div>
          )}

          {item.insignia && (
            <Badge className="absolute left-2 top-2 rounded-md border-0 bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-tinta-900 backdrop-blur-sm hover:bg-white/90">
              {item.insignia}
            </Badge>
          )}

          {item.estado && (
            <span
              className={cn(
                'absolute bottom-2 left-2 rounded-full border px-2 py-0.5 text-[10px] font-bold',
                ESTILO_ESTADO[item.tonoEstado || 'ok']
              )}
            >
              {item.estado}
            </span>
          )}
        </div>

        <CardContent className="bg-white p-3 pb-0">
          <h3 className="line-clamp-2 text-[13.5px] font-bold leading-snug tracking-tight text-tinta-900">
            {item.titulo}
          </h3>
          {item.subtitulo && (
            <p className="mt-0.5 truncate text-[11.5px] font-medium text-tinta-600">{item.subtitulo}</p>
          )}
        </CardContent>

        <CardFooter className="mt-auto flex items-baseline justify-between gap-2 bg-white p-3 pt-2">
          {item.precio && (
            <span className="text-[14px] font-extrabold tabular-nums tracking-tight text-turquesa-700">
              {item.precio}
            </span>
          )}
          {item.precioNota && (
            <span className="truncate text-[11px] text-tinta-600">{item.precioNota}</span>
          )}
        </CardFooter>
      </Card>
    </button>
  )
}

/* --- Una fila con scroll horizontal ------------------------------------- */

export function CarruselProductos({
  titulo,
  items,
  onSeleccionar,
  sobreOscuro = true,
  className,
}: {
  titulo: string
  items: ProductoTarjeta[]
  onSeleccionar?: (item: ProductoTarjeta) => void
  /** true cuando la fila va sobre el fondo navy del panel. */
  sobreOscuro?: boolean
  className?: string
}) {
  const pista = React.useRef<HTMLDivElement>(null)

  const desplazar = (dir: number) => {
    pista.current?.scrollBy({ left: dir * 260, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    // div y no <section>: hay un reset CSS global (App.css) que le da
    // `padding: 4rem 0` a cualquier <section> de la app, pensado para
    // el landing, y acá inflaba el espacio entre categorías.
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3
          className={cn(
            'truncate text-[16px] font-bold tracking-tight sm:text-[17px]',
            sobreOscuro ? 'text-white' : 'text-tinta-900'
          )}
          style={{ fontFamily: "'Fraunces','Georgia',serif" }}
        >
          {titulo} <span className="opacity-50">›</span>
        </h3>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-[11px] font-semibold tabular-nums',
              sobreOscuro ? 'text-white/55' : 'text-tinta-600'
            )}
          >
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
          {/* En celular sobra: se pasa con el dedo. */}
          <div className="hidden items-center gap-1 sm:flex">
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Anterior"
              onClick={() => desplazar(-1)}
              className={cn(
                'h-7 w-7 rounded-full',
                sobreOscuro
                  ? 'border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white'
                  : 'border-hueso-200 bg-white text-tinta-600 hover:bg-hueso-50'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Siguiente"
              onClick={() => desplazar(1)}
              className={cn(
                'h-7 w-7 rounded-full',
                sobreOscuro
                  ? 'border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white'
                  : 'border-hueso-200 bg-white text-tinta-600 hover:bg-hueso-50'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={pista}
        className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => (
          <TarjetaProducto
            key={item.id}
            item={item}
            indice={idx}
            onSeleccionar={onSeleccionar}
            /* Ancho fijo, como la vitrina de referencia: la tarjeta mide
               siempre lo mismo y lo que cambia es cuántas entran en pantalla.
               En celular son más angostas para que entren dos. */
            className="w-[168px] flex-none snap-start sm:w-[240px] md:w-[260px]"
          />
        ))}
      </div>
    </div>
  )
}

/* --- Las mismas tarjetas en grilla (para búsquedas y filtros) ------------ */

export function GrillaProductos({
  items,
  onSeleccionar,
  className,
}: {
  items: ProductoTarjeta[]
  onSeleccionar?: (item: ProductoTarjeta) => void
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {items.map((item, idx) => (
        <TarjetaProducto key={item.id} item={item} indice={idx} onSeleccionar={onSeleccionar} />
      ))}
    </div>
  )
}

export default CarruselProductos
