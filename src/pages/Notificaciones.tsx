import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCheck, Trash2 } from 'lucide-react'
import useStore, { perfilDeSucursal } from '@/store/puntos_usestore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import Icon from '../components/icons/Icon'
import BotonVolver from '../components/BotonVolver'
import FormularioCotizacion from '../components/panel/FormularioCotizacion'
// El modal de cotización trae su estilo de esta hoja, la misma que
// usa la pantalla de Negocios Asociados donde vive normalmente.
import './NegociosAsociados.css'
import { filtrarPorConfig } from '../utils/filtroNotificaciones'

type Filtro = 'todas' | 'no-leidas' | 'leidas'

// Fondo claro a pantalla completa: cubre todos los bordes, sin el
// turquesa que rodeaba la tarjeta y se veía raro en laptops.
const FONDO_CLARO = 'linear-gradient(160deg, #ffffff 0%, #f4f6f8 55%, #e9edf6 100%)'

type Notificacion = {
  id: number
  tipo: string
  icono: string
  titulo: string
  descripcion: string
  fecha: string
  leida: boolean
  ruta: string
  userType: string
  negocioAsociadoId?: number
  // Consulta de un cliente sobre una promoción del Home
  consultaId?: string
  // Pedido de precio de un negocio a un proveedor
  solicitudId?: string
}

type SolicitudCotizacion = {
  id: string
  estado: string
  publicacionTitulo: string
  publicacionPrecio: number | null
  cantidad: number
  unidad: string
  mensaje: string
  negocio: { id: string | null; nombre: string; telefono: string }
}

type ConsultaPromocion = {
  id: string
  estado: string
  promocionTitulo: string
  cantidad: number | null
  mensaje: string
  cliente: { nombre: string; telefono: string }
}

function formatearFecha(iso: string) {
  const fecha = new Date(iso)
  const ahora = new Date()
  const diffMs = ahora.getTime() - fecha.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMs / 3600000)
  const diffDias = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Justo ahora'
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHoras < 24) return `Hace ${diffHoras}h`
  if (diffDias < 7) return `Hace ${diffDias}d`

  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const hora = String(fecha.getHours()).padStart(2, '0')
  const min = String(fecha.getMinutes()).padStart(2, '0')
  return `${dia}/${mes} ${hora}:${min}`
}

function EmptyState({ filtro }: { filtro: Filtro }) {
  const icono = filtro === 'no-leidas' ? 'party-popper' : filtro === 'leidas' ? 'inbox' : 'bell'
  const titulo =
    filtro === 'no-leidas' ? 'No tienes avisos pendientes' : filtro === 'leidas' ? 'No hay avisos leídos' : 'No hay avisos'
  const sub = filtro === 'no-leidas' ? '¡Estás al día!' : 'Los avisos aparecerán aquí'

  return (
    <div className="flex flex-col items-center gap-2.5 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-vincco-gold/15 text-vincco-gold-700">
        <Icon name={icono} size={26} />
      </span>
      <p className="text-[15px] font-bold text-vincco-ink">{titulo}</p>
      <p className="text-[13px] text-vincco-slate2">{sub}</p>
    </div>
  )
}

function NotificacionItem({
  n,
  modoEliminar,
  seleccionada,
  onToggleSeleccion,
  onClick,
  negociosAsociados,
  consultas,
  solicitudes,
  onResponder,
  onResponderConsulta,
  onCotizar,
  onRechazarSolicitud,
}: {
  n: Notificacion
  modoEliminar: boolean
  seleccionada: boolean
  onToggleSeleccion: (id: number) => void
  onClick: (n: Notificacion) => void
  negociosAsociados: Array<{ id: number; estado: string }>
  consultas: ConsultaPromocion[]
  solicitudes: SolicitudCotizacion[]
  onResponder: (e: React.MouseEvent, n: Notificacion, aceptar: boolean) => void
  onResponderConsulta: (e: React.MouseEvent, n: Notificacion, aceptar: boolean) => void
  onCotizar: (e: React.MouseEvent, n: Notificacion) => void
  onRechazarSolicitud: (e: React.MouseEvent, n: Notificacion) => void
}) {
  const esSolicitud = n.tipo === 'solicitud_asociacion'
  const solicitud = esSolicitud ? negociosAsociados.find((neg) => neg.id === n.negocioAsociadoId) : null
  const solicitudPendiente = esSolicitud && (!solicitud || solicitud.estado === 'pendiente')

  /* Consulta de un cliente sobre una promoción. Es el mismo gesto
     que la solicitud de asociación —el aviso trae los botones y se
     responde sin salir de acá— pero con otras palabras: el negocio
     no "acepta" a un cliente, le confirma que se lo tiene. */
  const esConsulta = n.tipo === 'consulta_promocion'
  const consulta = esConsulta ? consultas.find((c) => c.id === n.consultaId) : null
  const consultaPendiente = esConsulta && (!consulta || consulta.estado === 'pendiente')

  /* Pedido de precio de un negocio. Acá el proveedor no contesta con
     un botón de sí o no: contesta con una cotización de verdad, con
     precios, que es lo que el negocio necesita para decidir. Por eso
     el botón abre el formulario de cotización en vez de resolver.

     El `solicitudId` distingue los pedidos reales de los avisos de
     ejemplo que el store genera al arrancar, que tienen el mismo
     tipo pero no tienen pedido detrás. */
  const esPedidoCot = n.tipo === 'negocio_solicito_cotizacion_prov' && Boolean(n.solicitudId)
  const pedido = esPedidoCot ? solicitudes.find((c) => c.id === n.solicitudId) : null
  const pedidoPendiente = esPedidoCot && (!pedido || pedido.estado === 'pendiente')

  return (
    <div
      className={cn(
        'flex w-full cursor-pointer gap-3 px-3.5 py-4 transition-colors first:rounded-t-2xl first:pt-4 last:rounded-b-2xl last:pb-4 hover:bg-vincco-mist/70',
        !n.leida && 'bg-vincco-navy-50/40',
        modoEliminar && seleccionada && 'bg-vincco-gold/10 hover:bg-vincco-gold/10'
      )}
      onClick={() => onClick(n)}
    >
      {modoEliminar && (
        <span className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={seleccionada}
            onChange={() => onToggleSeleccion(n.id)}
            aria-label={`Seleccionar aviso: ${n.titulo}`}
            className="size-[18px] cursor-pointer accent-vincco-gold-700"
          />
        </span>
      )}

      <Avatar className="size-11 shrink-0">
        <AvatarFallback className="bg-vincco-navy-50 text-vincco-navy-700">
          <Icon name={n.icono} size={19} />
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-vincco-ink">{n.titulo}</p>
          {!n.leida && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-vincco-success" />}
        </div>
        <p className="text-[13px] leading-relaxed text-vincco-slate2">{n.descripcion}</p>

        {esPedidoCot && !modoEliminar && (
          <>
            {pedido?.mensaje && (
              <p className="rounded-lg bg-vincco-mist/70 px-3 py-2 text-[13px] italic leading-relaxed text-vincco-slate2">
                “{pedido.mensaje}”
              </p>
            )}
            {pedidoPendiente ? (
              <div className="flex flex-wrap gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  className="h-7 gap-1 bg-vincco-navy-600 text-xs hover:bg-vincco-navy-700"
                  onClick={(e) => onCotizar(e, n)}
                >
                  <Icon name="file-text" size={12} /> Responder con cotización
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={(e) => onRechazarSolicitud(e, n)}
                >
                  <Icon name="x" size={12} /> No puedo
                </Button>
              </div>
            ) : (
              <p className="flex items-center gap-1.5 pt-0.5 text-xs font-semibold text-vincco-slate2">
                <Icon name={pedido?.estado === 'cotizada' ? 'check-circle' : 'x'} size={13} />
                {pedido?.estado === 'cotizada' ? 'Ya le mandaste la cotización' : 'Le dijiste que no podés'}
              </p>
            )}
          </>
        )}

        {esConsulta && !modoEliminar && (
          <>
            {consulta?.mensaje && (
              <p className="rounded-lg bg-vincco-mist/70 px-3 py-2 text-[13px] italic leading-relaxed text-vincco-slate2">
                “{consulta.mensaje}”
              </p>
            )}
            {consultaPendiente ? (
              <div className="flex gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  className="h-7 gap-1 bg-vincco-success text-xs hover:bg-vincco-success/90"
                  onClick={(e) => onResponderConsulta(e, n, true)}
                >
                  <Icon name="check" size={12} /> Confirmar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={(e) => onResponderConsulta(e, n, false)}
                >
                  <Icon name="x" size={12} /> No puedo
                </Button>
              </div>
            ) : (
              <p className="flex items-center gap-1.5 pt-0.5 text-xs font-semibold text-vincco-slate2">
                <Icon name={consulta?.estado === 'confirmada' ? 'check-circle' : 'x'} size={13} />
                {consulta?.estado === 'confirmada'
                  ? 'Le confirmaste esta consulta'
                  : 'Le dijiste que no podés atenderla'}
              </p>
            )}
          </>
        )}

        {esSolicitud &&
          !modoEliminar &&
          (solicitudPendiente ? (
            <div className="flex gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                className="h-7 gap-1 bg-vincco-success text-xs hover:bg-vincco-success/90"
                onClick={(e) => onResponder(e, n, true)}
              >
                <Icon name="check" size={12} /> Aceptar
              </Button>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={(e) => onResponder(e, n, false)}>
                <Icon name="x" size={12} /> Rechazar
              </Button>
            </div>
          ) : (
            <p className="flex items-center gap-1.5 pt-0.5 text-xs font-semibold text-vincco-slate2">
              <Icon name={solicitud?.estado === 'aceptada' ? 'check-circle' : 'x'} size={13} />
              {solicitud?.estado === 'aceptada' ? 'Aceptaste esta solicitud' : 'Rechazaste esta solicitud'}
            </p>
          ))}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <span className="text-xs font-medium text-vincco-slate2/80">{formatearFecha(n.fecha)}</span>
          <Badge
            className={cn(
              'rounded-full border-none px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
              !n.leida ? 'bg-vincco-navy-50 text-vincco-navy-700' : 'bg-vincco-mist text-vincco-slate2/70'
            )}
          >
            {!n.leida ? 'No leída' : 'Leída'}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default function Notificaciones() {
  const navigate = useNavigate()
  const notificaciones = useStore((s) => s.notificaciones)
  const userType = useStore((s) => s.userType)
  const config = useStore((s) => s.configuraciones[s.userType])
  const marcarNotificacionLeida = useStore((s) => s.marcarNotificacionLeida)
  const marcarTodasLeidas = useStore((s) => s.marcarTodasLeidas)
  const eliminarNotificaciones = useStore((s) => s.eliminarNotificaciones)
  const negociosAsociados = useStore((s) => s.negociosAsociados)
  const responderAsociacionNegocio = useStore((s) => s.responderAsociacionNegocio)
  const consultasPromocion = useStore((s) => s.consultasPromocion)
  const responderConsultaPromocion = useStore((s) => s.responderConsultaPromocion)
  const solicitudesCotizacion = useStore((s) => s.solicitudesCotizacion)
  const marcarSolicitudCotizada = useStore((s) => s.marcarSolicitudCotizada)
  const rechazarSolicitudCotizacion = useStore((s) => s.rechazarSolicitudCotizacion)

  // Perfil del proveedor que va a firmar la cotización, con los
  // datos de la sucursal en la que está parado. La fusión se hace
  // fuera del selector para no devolver un objeto nuevo en cada
  // snapshot (eso hace que zustand re-renderice en bucle).
  const perfilBaseProveedor = useStore((s) => s.perfiles.proveedor)
  const sucursalProveedor = useStore((s) =>
    s.sucursales.proveedor?.find((x: { id: string }) => x.id === s.sucursalActiva.proveedor)
  )
  const perfilProveedor = useMemo(
    () => perfilDeSucursal(perfilBaseProveedor, sucursalProveedor),
    [perfilBaseProveedor, sucursalProveedor]
  )
  // Pedido que se está respondiendo con el formulario de cotización
  const [cotizando, setCotizando] = useState<SolicitudCotizacion | null>(null)
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [modoEliminar, setModoEliminar] = useState(false)
  const [seleccionadas, setSeleccionadas] = useState<number[]>([])
  const [confirmar, setConfirmar] = useState(false)

  // Las que corresponden al rol Y que la configuración deja pasar.
  // Si el usuario apagó los avisos de promociones en /config, acá
  // dejan de aparecer de verdad.
  const permitidas: Notificacion[] = useMemo(
    () => filtrarPorConfig(notificaciones.filter((n: Notificacion) => n.userType === userType), config, userType),
    [notificaciones, config, userType]
  )

  const notificacionesFiltradas = useMemo(() => {
    const ordenadas = [...permitidas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    if (filtro === 'no-leidas') return ordenadas.filter((n) => !n.leida)
    if (filtro === 'leidas') return ordenadas.filter((n) => n.leida)
    return ordenadas
  }, [permitidas, filtro])

  // Subdivisiones de la lista: en "Todas" se separan No leídas y Leídas
  // en dos paneles con su encabezado; con un filtro puntual queda uno solo.
  const grupos = useMemo(() => {
    if (filtro !== 'todas') {
      return [
        {
          titulo: filtro === 'no-leidas' ? 'No leídas' : 'Leídas',
          items: notificacionesFiltradas,
        },
      ]
    }

    const grupos = []
    const noLeidas = notificacionesFiltradas.filter((n) => !n.leida)
    const leidas = notificacionesFiltradas.filter((n) => n.leida)
    if (noLeidas.length > 0) grupos.push({ titulo: 'No leídas', items: noLeidas })
    if (leidas.length > 0) grupos.push({ titulo: 'Leídas', items: leidas })
    return grupos
  }, [notificacionesFiltradas, filtro])

  // El contador usa la misma lista que se ve, así el número del
  // badge nunca dice 5 cuando en pantalla hay 3.
  const noLeidas = useMemo(() => permitidas.filter((n) => !n.leida).length, [permitidas])

  // Solo deja selecciones que sigan existiendo (por si algo fue
  // eliminado mientras se navegaba entre filtros)
  const seleccionadasValidas = useMemo(
    () => seleccionadas.filter((id) => notificaciones.some((n: Notificacion) => n.id === id)),
    [seleccionadas, notificaciones]
  )

  const idsVisibles = notificacionesFiltradas.map((n) => n.id)
  const todasVisiblesSeleccionadas =
    notificacionesFiltradas.length > 0 && idsVisibles.every((id) => seleccionadasValidas.includes(id))

  const handleClick = (n: Notificacion) => {
    if (modoEliminar) {
      toggleSeleccion(n.id)
      return
    }
    if (!n.leida) marcarNotificacionLeida(n.id)
    navigate(n.ruta)
  }

  // Acepta o rechaza una solicitud de asociación desde el aviso
  // mismo, sin ir a ninguna otra pantalla. stopPropagation porque el
  // aviso entero también tiene su propio onClick (que navega).
  const responderSolicitud = (e: React.MouseEvent, n: Notificacion, aceptar: boolean) => {
    e.stopPropagation()
    responderAsociacionNegocio(n.negocioAsociadoId, aceptar)
    if (!n.leida) marcarNotificacionLeida(n.id)
  }

  // El negocio le contesta al cliente sin salir de Avisos. El cliente
  // recibe el resultado como un aviso propio, igual que en la
  // asociación con proveedores.
  const responderConsulta = (e: React.MouseEvent, n: Notificacion, aceptar: boolean) => {
    e.stopPropagation()
    responderConsultaPromocion(n.consultaId, aceptar)
    if (!n.leida) marcarNotificacionLeida(n.id)
  }

  /* El proveedor responde el pedido con una cotización de verdad.

     No se arma una cotización nueva acá: se abre el formulario que
     el proveedor ya usa desde Negocios Asociados, prellenado con lo
     que le pidieron. Al enviarlo, la cotización cae donde siempre
     (vn_cotizaciones_recibidas) y el negocio la ve en Mis
     Cotizaciones, que ya sabe aceptarla o rechazarla. */
  const abrirCotizacion = (e: React.MouseEvent, n: Notificacion) => {
    e.stopPropagation()
    const pedido = solicitudesCotizacion.find((c: SolicitudCotizacion) => c.id === n.solicitudId)
    if (!pedido) return
    if (!n.leida) marcarNotificacionLeida(n.id)
    setCotizando(pedido)
  }

  const rechazarPedido = (e: React.MouseEvent, n: Notificacion) => {
    e.stopPropagation()
    rechazarSolicitudCotizacion(n.solicitudId)
    if (!n.leida) marcarNotificacionLeida(n.id)
  }

  const toggleSeleccion = (id: number) => {
    setSeleccionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const marcarTodosVisibles = () => {
    setSeleccionadas((prev) =>
      todasVisiblesSeleccionadas
        ? prev.filter((id) => !idsVisibles.includes(id))
        : Array.from(new Set(prev.concat(idsVisibles)))
    )
  }

  const salirModoEliminar = () => {
    setModoEliminar(false)
    setSeleccionadas([])
    setConfirmar(false)
  }

  const confirmarEliminacion = () => {
    eliminarNotificaciones(seleccionadasValidas)
    salirModoEliminar()
  }

  return (
    <div
      className="min-h-screen w-full px-4 pb-8 pt-6 sm:px-6 sm:pt-10"
      style={{ background: FONDO_CLARO }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 p-4 sm:p-7">
        <CardHeader className="space-y-4 p-0">
          <div className="flex items-center justify-between gap-3">
            {/* Fondo claro, asi que el boton va en tono papel: el borde
                llega a 3.78:1 contra el blanco del encabezado. */}
            <div className="flex min-w-0 items-center gap-3">
              <BotonVolver tono="papel" />
              <h1
                className="font-display text-[20px] font-bold tracking-tight text-vincco-ink sm:text-[22px]"
                style={{ fontFamily: "'Sora','Inter',sans-serif" }}
              >
                Avisos
              </h1>
            </div>

            {!modoEliminar && (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 text-vincco-slate2 disabled:opacity-30"
                  onClick={marcarTodasLeidas}
                  disabled={noLeidas === 0}
                  aria-label="Marcar todas como leídas"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="size-[18px]" strokeWidth={1.75} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 text-vincco-slate2 hover:bg-vincco-danger/10 hover:text-vincco-danger"
                  onClick={() => setModoEliminar(true)}
                  aria-label="Eliminar avisos"
                  title="Eliminar avisos"
                >
                  <Trash2 className="size-[18px]" strokeWidth={1.75} />
                </Button>
              </div>
            )}
          </div>

          {modoEliminar ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={marcarTodosVisibles}>
                {todasVisiblesSeleccionadas ? 'Desmarcar todos' : 'Marcar todos'}
              </Button>
              <Button
                size="sm"
                className="bg-vincco-danger text-white hover:bg-vincco-danger/90 disabled:pointer-events-none disabled:opacity-40"
                disabled={seleccionadasValidas.length === 0}
                onClick={() => seleccionadasValidas.length > 0 && setConfirmar(true)}
              >
                Eliminar seleccionados {seleccionadasValidas.length > 0 && `(${seleccionadasValidas.length})`}
              </Button>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={salirModoEliminar}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Tabs value={filtro} onValueChange={(v) => setFiltro(v as Filtro)}>
              <TabsList className="w-full justify-start gap-1 overflow-x-auto bg-vincco-mist [&_button]:gap-1.5">
                <TabsTrigger value="todas" className="data-[state=active]:bg-vincco-navy-800 data-[state=active]:text-white">
                  Todas
                  <Badge className="border-none bg-vincco-navy-800/10 text-vincco-navy-800">{permitidas.length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="no-leidas"
                  className="data-[state=active]:bg-vincco-navy-800 data-[state=active]:text-white"
                >
                  No leídas
                  <Badge className="border-none bg-vincco-navy-800/10 text-vincco-navy-800">{noLeidas}</Badge>
                </TabsTrigger>
                <TabsTrigger value="leidas" className="data-[state=active]:bg-vincco-navy-800 data-[state=active]:text-white">
                  Leídas
                  <Badge className="border-none bg-vincco-navy-800/10 text-vincco-navy-800">
                    {permitidas.length - noLeidas}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {notificacionesFiltradas.length === 0 ? (
            <EmptyState filtro={filtro} />
          ) : (
            <div className="flex flex-col gap-6">
              {grupos.map((grupo) => (
                <div key={grupo.titulo} className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-[11px] font-bold uppercase tracking-wide text-vincco-slate2">
                      {grupo.titulo}
                    </h2>
                    <span className="rounded-full bg-vincco-navy-50 px-2 py-0.5 text-[10px] font-bold text-vincco-navy-700">
                      {grupo.items.length}
                    </span>
                  </div>
                  <div className="divide-y divide-vincco-line overflow-hidden rounded-2xl border border-vincco-line bg-white shadow-[0_6px_18px_rgba(0,24,36,0.07)]">
                    {grupo.items.map((n) => (
                      <NotificacionItem
                        key={n.id}
                        n={n}
                        modoEliminar={modoEliminar}
                        seleccionada={seleccionadasValidas.includes(n.id)}
                        onToggleSeleccion={toggleSeleccion}
                        onClick={handleClick}
                        negociosAsociados={negociosAsociados}
                        consultas={consultasPromocion}
                        solicitudes={solicitudesCotizacion}
                        onResponder={responderSolicitud}
                        onResponderConsulta={responderConsulta}
                        onCotizar={abrirCotizacion}
                        onRechazarSolicitud={rechazarPedido}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      <Dialog open={confirmar} onOpenChange={(o) => !o && salirModoEliminar()}>
        <DialogOverlay className="bg-vincco-navy-950/60 backdrop-blur-[2px]" />
        <DialogContent className="gap-3 rounded-2xl border-vincco-line p-6 sm:max-w-sm">
          <DialogTitle
            className="font-display text-[17px] font-bold text-vincco-ink"
            style={{ fontFamily: "'Sora','Inter',sans-serif" }}
          >
            {todasVisiblesSeleccionadas ? '¿Eliminar todos los avisos seleccionados?' : '¿Eliminar avisos seleccionados?'}
          </DialogTitle>
          <p className="text-[13px] leading-relaxed text-vincco-slate2">
            Los avisos seleccionados se eliminarán y no podrán recuperarse.
          </p>
          <div className="flex justify-end gap-2.5 pt-1">
            <Button variant="outline" onClick={salirModoEliminar}>
              Cancelar
            </Button>
            <Button className="bg-vincco-danger text-white hover:bg-vincco-danger/90" onClick={confirmarEliminacion}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* El formulario de cotización del proveedor, abierto desde el
          aviso y ya cargado con lo que el negocio pidió: producto,
          cantidad y unidad. Al proveedor solo le queda poner precios
          y condiciones. */}
      {cotizando && (
        <FormularioCotizacion
          negocio={{ id: cotizando.negocio.id, nombre: cotizando.negocio.nombre }}
          proveedor={perfilProveedor}
          solicitudInicial={
            cotizando.mensaje ||
            `${cotizando.cantidad} ${cotizando.unidad} de ${cotizando.publicacionTitulo}`
          }
          productosIniciales={[
            {
              nombre: cotizando.publicacionTitulo,
              cantidad: cotizando.cantidad,
              unidad: cotizando.unidad,
              // Si la publicación traía precio se propone ese mismo,
              // que es el que el negocio vio. El proveedor lo ajusta.
              precio: cotizando.publicacionPrecio ?? '',
            },
          ]}
          onClose={() => setCotizando(null)}
          onEnviada={(cotizacion: { id: number; numero: string }) => {
            marcarSolicitudCotizada(cotizando.id, cotizacion)
            setCotizando(null)
          }}
        />
      )}
    </div>
  )
}
