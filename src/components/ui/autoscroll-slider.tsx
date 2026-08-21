"use client";

import { BadgeCheck, Eye, MapPin, Star, Store } from "lucide-react";
import type { EmblaOptionsType } from "embla-carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  Slider,
  SliderContainer,
  SliderDotButton,
} from "@/components/ui/autoscroll-slider-utils/carousel";
import { NEGOCIOS_AFILIADOS, type NegocioAfiliado } from "@/data/premios";
import { cn } from "@/lib/utils";

// Acentos de marca que se turnan entre diapositivas: tile del icono
// y resplandor de fondo de cada negocio.
const ACENTOS = [
  { tile: "bg-naranja-500 text-hueso-50", brillo: "bg-naranja-500/25" },
  { tile: "bg-dorado-500 text-tinta-900", brillo: "bg-dorado-400/20" },
  { tile: "bg-turquesa-600 text-hueso-50", brillo: "bg-turquesa-400/20" },
];

function SlideNegocio({
  n,
  indice,
  onVisitar,
}: {
  n: NegocioAfiliado;
  indice: number;
  onVisitar: (id: number) => void;
}) {
  const acento = ACENTOS[indice % ACENTOS.length]

  return (
    <Slider className="w-[88%] px-0.5 sm:w-[72%] lg:w-[40%]">
      <button
        type="button"
        onClick={() => onVisitar(n.id)}
        aria-label={`Visitar ${n.nombre} y ver su inventario`}
        className="group relative block h-full w-full overflow-hidden rounded-3xl bg-tinta-800 text-left shadow-[0_18px_50px_-18px_rgba(0,63,90,0.55)] ring-1 ring-tinta-700 transition hover:ring-dorado-400/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa-600"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className={cn(
              "absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl transition-opacity",
              acento.brillo
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tinta-950/40 to-transparent" />
        </div>

        <div className="relative flex h-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <div
            className={cn(
              "grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-lg lg:h-12 lg:w-12",
              acento.tile
            )}
          >
            <Store className="h-7 w-7 lg:h-6 lg:w-6" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-nowrap items-center gap-2">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-turquesa-500/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-turquesa-300">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Negocio verificado
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-dorado-400/15 px-3 py-1 text-[11px] font-extrabold text-dorado-300">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                +{n.puntos} pts por compra
              </span>
            </div>

            <h3 className="mt-2.5 truncate font-display text-xl font-bold text-hueso-50 lg:mt-2 lg:text-lg">
              {n.nombre}
            </h3>

            <div className="mt-1 flex flex-nowrap items-center gap-x-3 gap-y-1 text-xs text-hueso-200/70">
              <span className="shrink-0 font-bold uppercase tracking-wide text-hueso-200/60">
                {n.categoria}
              </span>
              <span className="flex shrink-0 items-center gap-1 font-bold text-dorado-300">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                {n.rating}
              </span>
              <span className="hidden h-3 w-px shrink-0 bg-white/15 sm:block" />
              <span className="flex min-w-0 items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{n.direccion}</span>
              </span>
            </div>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-turquesa-600 px-4 py-2 text-[11px] font-extrabold text-white shadow-sm transition group-hover:bg-turquesa-500">
            <Eye className="h-4 w-4" aria-hidden="true" />
            Ver inventario
          </span>
        </div>
      </button>
    </Slider>
  );
}

// Los negocios van pasando solos, uno tras otro, como un anuncio
// continuo: loop infinito, pausa al pasar el cursor y al arrastrar
// sigue corriendo. Cada diapositiva es clicable para abrir el
// inventario del negocio (igual que "Ver inventario" en Favoritos).
export default function AutoScrollSlider({
  negocios = NEGOCIOS_AFILIADOS,
  onVisitar,
}: {
  negocios?: NegocioAfiliado[];
  onVisitar: (id: number) => void;
}) {
  const OPTIONS: EmblaOptionsType = { loop: true };

  return (
    <div>
      <Carousel
        options={OPTIONS}
        plugins={[
          AutoScroll({
            speed: 1.5,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            startDelay: 150,
          }),
        ]}
        className="w-full"
      >
        <SliderContainer className="gap-3">
          {negocios.map((n, i) => (
            <SlideNegocio key={n.id} n={n} indice={i} onVisitar={onVisitar} />
          ))}
        </SliderContainer>

        {/* Los puntos van DENTRO del Carousel: usan el contexto del
            carrusel y fallan si se renderizan como hermanos. */}
        <div className="mt-4 flex justify-center gap-2">
          {negocios.map((n, i) => (
            <SliderDotButton key={n.id} index={i} label={n.nombre} />
          ))}
        </div>
      </Carousel>
    </div>
  );
}