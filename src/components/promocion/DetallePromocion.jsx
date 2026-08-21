import { useState } from 'react'
import Icon from '../icons/Icon'
import useStore from '../../store/puntos_usestore'
import { UNIDADES } from '../../data/inventario'
import {
  textoVigencia,
  textoPuntos,
  textoPrecio,
  linkWhatsApp,
  mensajeWhatsApp,
} from '../../utils/promociones'

/* ══════════════════════════════════════════════════════════════
   El detalle de una publicación, tal como lo ve el cliente.

   Sirve para los tres tipos del Home —promoción, producto nuevo y
   destacada— porque para el cliente son la misma pregunta: qué es,
   quién lo vende y cómo lo consigo. Lo único que cambia es el dato
   del medio: descuento y vigencia en una promoción, precio y stock
   en un producto, me gusta en una destacada.

   Vive aparte de la hoja y de la pantalla porque las dos muestran
   exactamente lo mismo: la hoja lo abre desde el Home sin perder el
   scroll, y la pantalla /promocion/:id lo muestra entero para quien
   entra por un link. Si el contenido estuviera escrito dos veces,
   cualquier arreglo habría que hacerlo dos veces.

   El orden lo pidió Lesbin y no es casual:
     foto → descripción → quién es el negocio → recién ahí, contactar.
   Primero el producto, después la confianza, al final la acción.
   ══════════════════════════════════════════════════════════════ */

// Iniciales para el avatar cuando el negocio no subió foto.
function iniciales(nombre = '') {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return 'VC'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

function TarjetaNegocio({ negocio, asociado }) {
  if (!negocio?.nombre) return null

  const subtitulo = [negocio.categoria, negocio.direccion].filter(Boolean).join(' · ')

  return (
    <div className="vc-promo__negocio">
      <div className="vc-promo__negocio-avatar" aria-hidden="true">
        {negocio.foto
          ? <img src={negocio.foto} alt="" />
          : <span>{iniciales(negocio.nombre)}</span>}
      </div>

      <div className="vc-promo__negocio-datos">
        <p className="vc-promo__negocio-etiqueta">Publicado por</p>
        <h4 className="vc-promo__negocio-nombre">
          {negocio.nombre}
          {negocio.verificado && (
            <span className="vc-promo__verificado" title="Negocio verificado">
              <Icon name="check-circle" size={14} />
              Verificado
            </span>
          )}
          {asociado && (
            <span className="vc-promo__verificado vc-promo__verificado--asociado" title="Ya es tu proveedor">
              <Icon name="handshake" size={14} />
              Tu proveedor
            </span>
          )}
        </h4>
        {subtitulo && <p className="vc-promo__negocio-sub">{subtitulo}</p>}
        {negocio.telefono && (
          <p className="vc-promo__negocio-tel">
            <Icon name="phone" size={13} /> {negocio.telefono}
          </p>
        )}
      </div>
    </div>
  )
}

function FormularioConsulta({ item, onEnviado, onCancelar, esNegocio }) {
  const enviarConsultaPromocion = useStore((s) => s.enviarConsultaPromocion)
  const enviarSolicitudCotizacion = useStore((s) => s.enviarSolicitudCotizacion)
  const [cantidad, setCantidad] = useState(1)
  const [unidad, setUnidad] = useState('unidad')
  const [mensaje, setMensaje] = useState('')

  // El tope es lo que el negocio dijo tener: unidades en una
  // promoción, stock en un producto (ya viene copiado en "unidades").
  // Sin nada declarado no se limita: no inventamos un stock que el
  // negocio no puso.
  const tope = item.unidades && item.unidades > 0 ? item.unidades : null

  const cambiar = (delta) => {
    setCantidad((prev) => {
      const siguiente = prev + delta
      if (siguiente < 1) return 1
      if (tope && siguiente > tope) return tope
      return siguiente
    })
  }

  const enviar = (e) => {
    e.preventDefault()
    // El mismo formulario sirve para los dos, pero no terminan en el
    // mismo lugar: la del cliente es una consulta que el negocio
    // confirma; la del negocio es un pedido de precio que el
    // proveedor contesta con una cotización formal.
    if (esNegocio) enviarSolicitudCotizacion({ publicacion: item, cantidad, unidad, mensaje })
    else enviarConsultaPromocion({ promocion: item, cantidad, mensaje })
    onEnviado()
  }

  return (
    <form className="vc-promo__form" onSubmit={enviar}>
      <p className="vc-promo__form-titulo">
        {esNegocio ? 'Pedile precio al proveedor' : 'Consultale al negocio'}
      </p>

      <label className="vc-promo__campo">
        <span className="vc-promo__campo-label">¿Cuántas necesitás?</span>
        <span className="vc-promo__contador">
          <button
            type="button"
            className="vc-promo__contador-btn"
            onClick={() => cambiar(-1)}
            disabled={cantidad <= 1}
            aria-label="Quitar una"
          >
            −
          </button>
          <span className="vc-promo__contador-valor" aria-live="polite">{cantidad}</span>
          <button
            type="button"
            className="vc-promo__contador-btn"
            onClick={() => cambiar(1)}
            disabled={Boolean(tope) && cantidad >= tope}
            aria-label="Agregar una"
          >
            +
          </button>
        </span>
      </label>

      {esNegocio && (
        <label className="vc-promo__campo">
          <span className="vc-promo__campo-label">Unidad de medida</span>
          <select
            className="vc-promo__select"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
          >
            {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </label>
      )}

      {tope && (
        <p className="vc-promo__form-nota">
          {esNegocio ? 'El proveedor' : 'El negocio'} publicó {tope}{' '}
          {tope === 1 ? 'unidad disponible' : 'unidades disponibles'}.
        </p>
      )}

      <label className="vc-promo__campo vc-promo__campo--bloque">
        <span className="vc-promo__campo-label">Tu pregunta <em>(opcional)</em></span>
        <textarea
          className="vc-promo__textarea"
          rows={3}
          maxLength={280}
          placeholder={esNegocio
            ? 'Ej: ¿Hacen entrega en Nueva Guinea? ¿Precio por volumen?'
            : 'Ej: ¿Hasta qué hora puedo pasar a retirarlo?'}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
      </label>

      <div className="vc-promo__form-acciones">
        <button type="button" className="vc-promo__btn vc-promo__btn--fantasma" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="vc-promo__btn vc-promo__btn--primario">
          <Icon name="mail" size={16} /> {esNegocio ? 'Pedir cotización' : 'Enviar al negocio'}
        </button>
      </div>
    </form>
  )
}

function Enviado({ negocio, onCerrar, esNegocio }) {
  const quien = negocio?.nombre || (esNegocio ? 'El proveedor' : 'El negocio')

  return (
    <div className="vc-promo__enviado">
      <span className="vc-promo__enviado-icono">
        <Icon name="check" size={30} />
      </span>
      <h4 className="vc-promo__enviado-titulo">
        {esNegocio ? 'Cotización pedida' : 'Consulta enviada'}
      </h4>
      <p className="vc-promo__enviado-texto">
        {esNegocio
          ? `${quien} ya recibió tu pedido. Cuando te mande la cotización con precios te llega el aviso, y la vas a ver en Mis Cotizaciones.`
          : `${quien} ya la recibió. Cuando te responda te va a llegar el aviso acá mismo, en Avisos.`}
      </p>
      {onCerrar && (
        <button type="button" className="vc-promo__btn vc-promo__btn--primario" onClick={onCerrar}>
          Entendido
        </button>
      )}
    </div>
  )
}

export default function DetallePromocion({ promo, variante = 'hoja', onVerTodo, onCerrar, likes }) {
  const [paso, setPaso] = useState('detalle')
  const nombreCliente = useStore((s) => s.perfiles.usuario?.nombre)
  const userType = useStore((s) => s.userType)

  if (!promo) return null

  const negocio = promo.negocio
  const vigencia = textoVigencia(promo.validoHasta)
  const precio = textoPrecio(promo.precio)
  const whatsapp = linkWhatsApp(negocio?.whatsapp || negocio?.telefono, mensajeWhatsApp(promo, nombreCliente))

  /* Quién puede pedir, y qué está pidiendo.

     El cliente le consulta a un negocio; el negocio le pide precio a
     un proveedor. Es el mismo gesto un escalón más arriba de la
     cadena, y por eso comparte pantalla. El proveedor no pide nada
     desde acá: en su Home ve su propio escaparate. */
  const esNegocio = userType === 'negocio'
  const puedeConsultar = userType === 'usuario' || esNegocio

  return (
    <div className={`vc-promo vc-promo--${variante} vc-promo--${promo.tipo}`}>
      <div className="vc-promo__media" style={{ background: `linear-gradient(135deg, ${promo.color} 0%, ${promo.color}cc 100%)` }}>
        {promo.imagen
          ? <img src={promo.imagen} alt={promo.titulo} className="vc-promo__img" />
          : (
            <span className="vc-promo__media-icono" aria-hidden="true">
              <Icon name={promo.icono || 'flame'} size={44} />
            </span>
          )}

        {promo.badge && (
          <span className="vc-promo__badge" style={{ color: promo.color }}>{promo.badge}</span>
        )}
        {promo.esLimitada && (
          <span className="vc-promo__badge vc-promo__badge--limitada">
            <Icon name="clock" size={12} /> Limitada
          </span>
        )}
      </div>

      <div className="vc-promo__cuerpo">
        {promo.categoria && <p className="vc-promo__categoria">{promo.categoria}</p>}
        <h3 className="vc-promo__titulo">{promo.titulo}</h3>

        {/* El precio manda en un producto: va grande y antes que
            cualquier chip, porque es lo primero que la persona
            busca cuando abre la ficha de algo que quiere comprar. */}
        {precio && (
          <p className="vc-promo__precio">
            {precio}
            {promo.stock ? (
              <span className="vc-promo__precio-stock">
                {promo.stock} {promo.stock === 1 ? 'disponible' : 'disponibles'}
              </span>
            ) : null}
          </p>
        )}

        {promo.descripcion && <p className="vc-promo__descripcion">{promo.descripcion}</p>}

        <div className="vc-promo__chips">
          {textoPuntos(promo.puntos) && (
            <span className="vc-promo__chip vc-promo__chip--puntos">
              <Icon name="star" filled size={13} /> {textoPuntos(promo.puntos)}
            </span>
          )}
          {promo.descuento ? (
            <span className="vc-promo__chip vc-promo__chip--descuento">
              <Icon name="percent" size={13} /> {promo.descuento}% de descuento
            </span>
          ) : null}
          {promo.tipo !== 'producto' && promo.unidades ? (
            <span className="vc-promo__chip">
              <Icon name="package" size={13} /> {promo.unidades} {promo.unidades === 1 ? 'disponible' : 'disponibles'}
            </span>
          ) : null}
          {vigencia && (
            <span className="vc-promo__chip vc-promo__chip--vigencia">
              <Icon name="clock" size={13} /> {vigencia}
            </span>
          )}
          {promo.tipo === 'destacada' && likes != null && (
            <span className="vc-promo__chip vc-promo__chip--likes">
              <Icon name="heart" filled size={13} /> {likes} {likes === 1 ? 'me gusta' : 'me gusta'}
            </span>
          )}
        </div>

        <TarjetaNegocio negocio={negocio} asociado={promo.asociado} />

        {paso === 'enviado' ? (
          <Enviado negocio={negocio} onCerrar={onCerrar} esNegocio={esNegocio} />
        ) : paso === 'formulario' ? (
          <FormularioConsulta
            item={promo}
            esNegocio={esNegocio}
            onEnviado={() => setPaso('enviado')}
            onCancelar={() => setPaso('detalle')}
          />
        ) : puedeConsultar ? (
          <>
            <div className="vc-promo__acciones">
              {whatsapp ? (
                <a
                  className="vc-promo__btn vc-promo__btn--secundario"
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="message-circle" size={17} /> Escribir por WhatsApp
                </a>
              ) : (
                <span className="vc-promo__btn vc-promo__btn--secundario vc-promo__btn--inactivo">
                  <Icon name="message-circle" size={17} /> Sin WhatsApp registrado
                </span>
              )}

              <button
                type="button"
                className="vc-promo__btn vc-promo__btn--primario"
                onClick={() => setPaso('formulario')}
              >
                <Icon name="file-text" size={17} /> {esNegocio ? 'Pedir cotización' : 'Cotizar en Vincco'}
              </button>
            </div>

            {variante === 'hoja' && onVerTodo && (
              <button type="button" className="vc-promo__vertodo" onClick={onVerTodo}>
                Ver todo el detalle <Icon name="arrow-right" size={14} />
              </button>
            )}
          </>
        ) : (
          <p className="vc-promo__aviso-rol">
            Esta es una de tus publicaciones: así la ven tus clientes. Los pedidos
            los mandan ellos, o los negocios cuando le compran a un proveedor.
          </p>
        )}
      </div>
    </div>
  )
}
