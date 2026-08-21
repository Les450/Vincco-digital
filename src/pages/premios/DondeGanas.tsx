import { useNavigate } from 'react-router-dom'
import { Store, BadgeCheck } from 'lucide-react'
import AutoScrollSlider from '../../components/ui/autoscroll-slider'
import { NEGOCIOS_AFILIADOS } from '../../data/premios'

export default function DondeGanas() {
  const navigate = useNavigate()
  const visitar = (id: number) => navigate(`/negocio/${id}/inventario`)

  return (
    <section aria-label="Donde ganas puntos">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tinta-500">
        Red afiliada
      </p>
      <h2 className="mt-1 font-display text-2xl font-bold text-tinta-900 sm:text-3xl">
        Donde ganas
      </h2>
      <h3 className="mt-2 text-base font-bold text-tinta-800">Negocios afiliados</h3>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-tinta-600">
        Son los negocios verificados dentro de Vincco: te suman puntos en cada compra y
        podes visitarlos para ver su inventario.
      </p>

      {/* Los negocios pasan solos, como anuncios; pausan al pasar el cursor.
          Cada tarjeta abre el inventario del negocio. */}
      <div className="mt-6">
        <AutoScrollSlider negocios={NEGOCIOS_AFILIADOS} onVisitar={visitar} />
      </div>

      {/* Chips clicables de cada negocio verificado */}
      <div
        className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Negocios afiliados verificados"
      >
        {NEGOCIOS_AFILIADOS.map((n) => (
          <button
            key={n.id}
            type="button"
            role="listitem"
            onClick={() => visitar(n.id)}
            aria-label={`Ver inventario de ${n.nombre}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-hueso-300 bg-[#fbf7f0] px-4 py-2 text-sm font-bold text-tinta-800 shadow-sm transition hover:-translate-y-0.5 hover:border-turquesa-300 hover:text-turquesa-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa-600"
          >
            <Store className="h-4 w-4 text-turquesa-600" aria-hidden="true" />
            {n.nombre}
            <BadgeCheck className="h-3.5 w-3.5 text-turquesa-500" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  )
}