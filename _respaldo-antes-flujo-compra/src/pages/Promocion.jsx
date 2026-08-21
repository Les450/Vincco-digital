import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/icons/Icon'
import DetallePromocion from '../components/promocion/DetallePromocion'
import useStore, { perfilDeSucursal } from '../store/puntos_usestore'
import { buscarPromocion } from '../utils/promociones'

/* La promoción en pantalla completa.

   Se llega acá desde "Ver la promoción completa" en la hoja, o
   entrando directo por el link. Por eso no recibe la promoción por
   props: la busca por id entre todas las publicaciones guardadas,
   incluidas las de cada sucursal.                                */

export default function Promocion() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Respaldo para las promociones publicadas antes de que las
  // publicaciones guardaran a su negocio. Ver utils/promociones.js.
  const perfiles = useStore((s) => s.perfiles)
  const sucursal = useStore((s) =>
    s.sucursales.negocio?.find((x) => x.id === s.sucursalActiva.negocio)
  )
  const respaldo = useMemo(
    () => perfilDeSucursal(perfiles?.negocio, sucursal),
    [perfiles, sucursal]
  )

  const promo = useMemo(() => buscarPromocion(id, respaldo), [id, respaldo])

  return (
    <div className="vc-promo-pagina">
      <div className="vc-promo-pagina__barra">
        <button type="button" className="vc-promo-pagina__volver" onClick={() => navigate(-1)}>
          <Icon name="arrow-left" size={16} /> Volver
        </button>
      </div>

      <div className="vc-promo-pagina__caja">
        {promo ? (
          <DetallePromocion promo={promo} variante="pantalla" />
        ) : (
          <div className="vc-promo-pagina__vacio">
            <span className="vc-promo-pagina__vacio-icono">
              <Icon name="flame" size={28} />
            </span>
            <h3>Esta promoción ya no está</h3>
            <p>Puede que el negocio la haya quitado o que se haya vencido.</p>
            <button type="button" className="vc-promo__btn vc-promo__btn--primario" onClick={() => navigate('/home')}>
              Ver otras promociones
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
