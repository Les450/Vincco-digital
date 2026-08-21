"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"

type CarouselApi = UseEmblaCarouselType[1]
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0]
type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1]

type CarouselProps = {
  options?: CarouselOptions
  plugins?: CarouselPlugin
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  options?: CarouselOptions
  selectedIndex: number
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

/*
  Carrusel de autoscroll basado en el Carousel de shadcn/ui, adaptado
  al slider que lo consume:

  · SliderContainer es el contenedor desplazable (flex, sin el offset
    -ml-4 del shadcn porque las diapositivas usan gap propio).
  · Slider es cada diapositiva: el ancho lo decide quien lo usa
    (w-[40%], w-[80%], etc.) para que el autoscroll fluya.
  · SliderDotButton es el punto selector: scroll al indice y estilo
    activo segun la diapositiva visible.
  No se incluyen las flechas prev/next del shadcn: este carrusel
  avanza solo, no las necesita.
*/

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ options, plugins, setApi, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(options, plugins)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  return (
    <CarouselContext.Provider value={{ carouselRef, api, options, selectedIndex }}>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const SliderContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn("flex", className)} {...props} />
    </div>
  )
})
SliderContainer.displayName = "SliderContainer"

const Slider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
))
Slider.displayName = "Slider"

const SliderDotButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { index: number; label?: string }
>(({ index, label, className, onClick, ...props }, ref) => {
  const { api, selectedIndex } = useCarousel()
  const activo = selectedIndex === index

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label ? `Ir a ${label}` : `Ir a la diapositiva ${index + 1}`}
      aria-current={activo}
      onClick={(e) => {
        api?.scrollTo(index)
        onClick?.(e)
      }}
      className={cn(
        "h-2 rounded-full transition-all duration-300",
        activo ? "w-8 bg-dorado-500" : "w-2 bg-tinta-300 hover:bg-tinta-400",
        className
      )}
      {...props}
    />
  )
})
SliderDotButton.displayName = "SliderDotButton"

export { type CarouselApi, Carousel, SliderContainer, Slider, SliderDotButton }