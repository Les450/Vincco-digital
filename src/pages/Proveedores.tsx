import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import useStore from '@/store/puntos_usestore'
import type { Proveedor, Solicitud } from './proveedores/data'
import { CLAVE_FAVORITOS, CLAVE_SOLICITUDES, SOLICITUDES_INICIALES, PROVEEDORES, NEGOCIOS, type EstadoSolicitud, type NegocioDirectorio } from './proveedores/data'
import { ToastProvider, useToasts } from './proveedores/Toasts'
import Header, { type ModoModulo, type SeccionModulo } from './proveedores/Header'
import Catalogo from './proveedores/Catalogo'
import Solicitudes from './proveedores/Solicitudes'
import ModalProveedor from './proveedores/ModalProveedor'
import { SkeletonTarjeta } from './proveedores/TarjetaProveedor'

// El módulo es uno solo y vive en /proveedores: el negocio ve el
// directorio de proveedores y el proveedor ve el de negocios, con la
// misma interfaz independiente para cada rol.
const MODOS: Record<ModoModulo, {
  eyebrow: string
  titulo: string
  descripcion: string
  sustantivo: string
  entidades: Proveedor[]
}> = {
  negocio: {
    eyebrow: 'Red de proveedores Vincco',
    titulo: 'Proveedores',
    descripcion: 'Descubre y conecta con proveedores verificados para tu negocio.',
    sustantivo: 'proveedores',
    entidades: PROVEEDORES,
  },
  proveedor: {
    eyebrow: 'Directorio de negocios Vincco',
    titulo: 'Negocios',
    descripcion: 'Descubre y conecta con negocios a los que ofrecer tus productos y servicios.',
    sustantivo: 'negocios',
    entidades: NEGOCIOS,
  },
}

function leerFavoritos(): Set<string> {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_FAVORITOS) || '[]')
    return new Set(Array.isArray(guardado) ? guardado : [])
  } catch {
    return new Set()
  }
}

function escribirFavoritos(favs: Set<string>) {
  try {
    window.localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(Array.from(favs)))
  } catch {
    // Sin storage la sesión conserva los favoritos en memoria
  }
}

function leerSolicitudes(): Solicitud[] {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_SOLICITUDES) || 'null')
    if (Array.isArray(guardado)) return guardado
  } catch {
    // Storage corrupto o modo privado: se arranca con los ejemplos
  }
  return SOLICITUDES_INICIALES
}

function escribirSolicitudes(lista: Solicitud[]) {
  try {
    window.localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(lista))
  } catch {
    // Si no se puede guardar, los cambios duran solo esta sesión
  }
}

function ContenidoProveedores({ rol }: { rol: ModoModulo }) {
  const toasts = useToasts()
  const solicitarAsociacionNegocio = useStore((s) => s.solicitarAsociacionNegocio)
  const modo = MODOS[rol]
  const catalogo = modo.entidades

  const [cargando, setCargando] = useState(true)
  const [seccion, setSeccion] = useState<SeccionModulo>('proveedores')
  const [favoritos, setFavoritos] = useState<Set<string>>(leerFavoritos)
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(leerSolicitudes)
  const [modal, setModal] = useState<{ proveedor: Proveedor; tab: 'informacion' | 'solicitar' } | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setCargando(false), 900)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => { escribirFavoritos(favoritos) }, [favoritos])
  useEffect(() => { escribirSolicitudes(solicitudes) }, [solicitudes])

  const totalSolicitudes = useMemo(
    () => solicitudes.filter((s) => s.estado === 'pendiente' && s.tipo !== 'historial').length,
    [solicitudes]
  )

  const confianzaPromedio = Math.round(catalogo.reduce((s, p) => s + p.confianza, 0) / catalogo.length)

  const enFavorito = (p: Proveedor) => {
    setFavoritos((prev) => {
      const nuevo = new Set(prev)
      if (nuevo.has(p.id)) {
        nuevo.delete(p.id)
        toasts.info('Quitado de favoritos', `${p.nombre} ya no está en tus favoritos.`)
      } else {
        nuevo.add(p.id)
        toasts.exito('Agregado a favoritos', `${p.nombre} quedó guardado para encontrarlo rápido.`)
      }
      return nuevo
    })
  }

  const enEnviada = (p: Proveedor, asunto: string, mensaje: string) => {
    const nueva: Solicitud = {
      id: `sol-${Date.now()}`,
      tipo: 'enviada',
      proveedorNombre: p.nombre,
      proveedorCategoria: p.categoria,
      proveedorColor: p.color,
      asunto,
      mensaje,
      fecha: 'recién enviada',
      estado: 'pendiente',
      etapa: 1,
    }
    setSolicitudes((prev) => [nueva, ...prev])

    if (rol === 'proveedor') {
      // Desde el directorio de negocios, la solicitud además dispara
      // el flujo real de asociación: el negocio la recibe en Avisos
      // y decide si acepta (estado pendiente hasta su respuesta).
      const negocio = p as NegocioDirectorio
      solicitarAsociacionNegocio({
        nombre: p.nombre,
        categoria: p.categoria,
        propietario: negocio.propietario || '',
        whatsapp: p.contacto.telefono,
        correo: p.contacto.correo,
        direccion: negocio.direccion || '',
        municipio: negocio.municipio || '',
        departamento: negocio.departamento || '',
        descripcion: p.descripcion,
        imagen: null,
        color: p.color,
      })
      toasts.exito(`Solicitud enviada a ${p.nombre}`, 'La asociación quedó registrada. Te avisamos cuando el negocio responda.')
    } else {
      toasts.exito(`Solicitud enviada a ${p.nombre}`, 'Te notificaremos cuando respondan.')
    }
  }

  const cancelar = (s: Solicitud) => {
    setSolicitudes((prev) => prev.map((x) =>
      x.id === s.id ? { ...x, estado: 'cancelada', etapa: 1, tipo: 'historial' } : x
    ))
    toasts.info('Solicitud cancelada', `Se canceló tu solicitud a ${s.proveedorNombre}. Podés enviar una nueva cuando quieras.`)
  }

  const reenviar = (s: Solicitud) => {
    setSolicitudes((prev) => prev.map((x) =>
      x.id === s.id ? { ...x, estado: 'pendiente', etapa: 1, fecha: 'recién enviada' } : x
    ))
    toasts.exito('Solicitud reenviada', `Le volvimos a escribir a ${s.proveedorNombre}.`)
  }

  const responder = (s: Solicitud, estado: Extract<EstadoSolicitud, 'aceptada' | 'rechazada'>) => {
    setSolicitudes((prev) => prev.map((x) =>
      x.id === s.id ? { ...x, estado, etapa: 3, tipo: 'historial' } : x
    ))
    if (estado === 'aceptada') {
      toasts.exito('Solicitud aceptada', `Ahora ${s.proveedorNombre} es parte de tu red de asociados.`)
    } else {
      toasts.info('Solicitud rechazada', `Le avisamos a ${s.proveedorNombre} que por ahora no seguirás la asociación.`)
    }
  }

  return (
    <>
      <Header seccion={seccion} onCambiarSeccion={setSeccion} totalSolicitudes={totalSolicitudes} modo={rol} />

      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
        {/* Titular de la página */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-vincco-gold-700">
              {modo.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-[26px] font-bold tracking-tight text-vincco-navy-900 sm:text-[30px]" style={{ fontFamily: "'Sora','Inter',sans-serif" }}>
              {modo.titulo}
            </h1>
            <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-vincco-slate2">
              {modo.descripcion}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-vincco-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-vincco-ink shadow-sm">
              {catalogo.length} {modo.sustantivo}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-vincco-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-vincco-ink shadow-sm">
              <ShieldCheck className="h-4 w-4 text-vincco-gold-700" strokeWidth={1.75} />
              Confianza {confianzaPromedio}%
            </span>
          </div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={seccion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {seccion === 'proveedores' ? (
                cargando ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonTarjeta key={i} />)}
                  </div>
                ) : (
                  <Catalogo
                    datos={catalogo}
                    textos={{ uno: rol === 'proveedor' ? 'negocio' : 'proveedor', muchos: rol === 'proveedor' ? 'negocios' : 'proveedores' }}
                    favoritos={favoritos}
                    enFavorito={enFavorito}
                    enVerPerfil={(p) => setModal({ proveedor: p, tab: 'informacion' })}
                    enSolicitar={(p) => setModal({ proveedor: p, tab: 'solicitar' })}
                  />
                )
              ) : (
                <Solicitudes
                  solicitudes={solicitudes}
                  onCancelar={cancelar}
                  onReenviar={reenviar}
                  onResponder={responder}
                  textos={{
                    uno: rol === 'proveedor' ? 'negocio' : 'proveedor',
                    muchos: rol === 'proveedor' ? 'negocios' : 'proveedores',
                    recibidas: rol === 'proveedor'
                      ? 'Cuando un negocio quiera asociarse con tu empresa, su solicitud de asociación aparecerá aquí.'
                      : 'Cuando un proveedor quiera trabajar con tu negocio, su solicitud de asociación aparecerá aquí.',
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {modal && (
          <ModalProveedor
            proveedor={modal.proveedor}
            tabInicial={modal.tab}
            onClose={() => setModal(null)}
            onEnviada={enEnviada}
          />
        )}
      </main>
    </>
  )
}

export default function Proveedores() {
  const userType = useStore((s) => s.userType)
  const navigate = useNavigate()

  // El módulo es de negocio y proveedor: cada uno ve su propio
  // directorio con la misma interfaz, independientes entre sí.
  const rol: ModoModulo | null = userType === 'proveedor'
    ? 'proveedor'
    : userType === 'negocio'
      ? 'negocio'
      : null

  useEffect(() => {
    if (!rol) navigate('/home')
  }, [rol, navigate])

  if (!rol) return null

  return (
    <div className="min-h-screen bg-vincco-mist pb-24" style={{ color: '#1A1A2E' }}>
      <ToastProvider>
        <ContenidoProveedores rol={rol} />
      </ToastProvider>
    </div>
  )
}