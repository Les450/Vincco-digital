import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, Truck, CheckCircle2 } from 'lucide-react'
import './SocioVincco.css'

// Mismo logo oficial que usa el resto del flujo de registro
// (Register.jsx, Navbar, Sidebar): el símbolo V + "VINCCO" en un
// solo archivo cuadrado, ya en tonos hueso/dorado — se lee bien
// tal cual sobre el fondo oscuro de esta pantalla, sin necesitar
// una versión aparte para fondo claro.
const VINCCO_LOGO = `${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`

/* ══════════════════════════════════════════════════════════════
   SOCIO VINCCO

   Todo el mundo se registra como cliente primero (Register.jsx ya
   no pregunta el tipo de cuenta). Volverse negocio o proveedor pasa
   por acá: es la única puerta de entrada a esa conversión, para que
   no haya dos lugares distintos ofreciendo lo mismo.

   Tocar "Registrarme" no abre un formulario propio: manda al mismo
   registro real de negocio/proveedor que ya existe (Register.jsx),
   pasándole el tipo por location.state — el mecanismo que ese
   formulario ya usaba para los anuncios del Home.

   El diseño de las tarjetas sigue una referencia que mandó el dueño
   (shadcn/Tailwind), pero reconstruida con lo que ya usa este
   proyecto: CSS propio con prefijo sv-, e íconos de lucide-react
   (ya está instalado y ya se usa en Home.jsx) en vez de Tailwind o
   componentes shadcn. Los colores de la referencia (amarillo/negro)
   se tradujeron a la paleta oficial — el detalle está en SocioVincco.css.
   ══════════════════════════════════════════════════════════════ */

const TARJETAS = [
  {
    id: 'negocio',
    badge: 'Negocio',
    Icono: Store,
    titulo: 'Registrar mi Negocio',
    descripcion: 'Vende tus productos o servicios directamente a clientes a través de la plataforma.',
    // Reemplazan a los chips viejos (Catálogo digital / Pagos
    // integrados / Dashboard de ventas): el dueño mandó estas seis
    // frases como el contenido real de la tarjeta, y "Gestión de
    // inventario" ya vive acá — mantener el chip viejo lo hubiera
    // duplicado. Texto exacto tal como lo escribió, sin corregir.
    beneficios: [
      'Verifica tu negocio',
      'Da visibilidad a tu negocio',
      'Reputación y reseñas para tu negocio',
      'Cotiza con proveedores',
      'Gestión de inventario',
      'Programa de fidelización',
    ],
  },
  {
    id: 'proveedor',
    badge: 'Proveedor',
    Icono: Truck,
    titulo: 'Registrarme como Proveedor',
    descripcion: 'Suministra productos a los negocios de la plataforma y expande tu red de distribución.',
    beneficios: [
      'Verificate como proveedor',
      'Recibe solicitudes de cotización',
      'Muestra tu negocio dentro de tu categoría',
      'Reputación y reseñas para tu perfil',
      'Da visibilidad a tus productos',
      'Conecta con comercios cercanos y de otros municipios',
    ],
  },
]

// Revela los elementos de la tarjeta de forma escalonada cuando
// entra en pantalla, sin librerías nuevas: un IntersectionObserver
// prende una clase y el resto (el escalonado en sí) lo hace el CSS
// con transition-delay por hijo. Se respeta prefers-reduced-motion
// en el CSS, no acá: si está activado, los estilos ya muestran todo
// de una, este hook igual prende la clase pero no se nota transición.
function useAlEntrarEnPantalla() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [visible])

  return [ref, visible]
}

function TarjetaSocio({ tarjeta, onRegistrarme }) {
  const [ref, visible] = useAlEntrarEnPantalla()
  const { Icono } = tarjeta

  return (
    // Ya no es un control: el dueño pidió que solo el botón
    // "Registrarme" navegue, ni el cuerpo ni el borde de la tarjeta.
    // Por eso es un div sin onClick/cursor/foco — el único elemento
    // interactivo de acá para abajo es el <button> del final.
    <div
      ref={ref}
      className={`sv-tarjeta sv-tarjeta--${tarjeta.id} ${visible ? 'sv-tarjeta--visible' : ''}`}
    >
      <span className={`sv-badge sv-badge--${tarjeta.id}`}>{tarjeta.badge}</span>

      <span className="sv-tarjeta-header">
        <Icono className="sv-tarjeta-icono" size={32} strokeWidth={1.5} aria-hidden="true" />
        <h2 className="sv-tarjeta-titulo">{tarjeta.titulo}</h2>
      </span>

      <p className="sv-tarjeta-desc">{tarjeta.descripcion}</p>

      <span className="sv-divisor" role="presentation" />

      <h3 className="sv-filas-titulo">Beneficios Incluidos</h3>

      <span className="sv-filas">
        {tarjeta.beneficios.map((b) => (
          <span key={b} className="sv-fila">
            <CheckCircle2 className="sv-fila-check" size={18} strokeWidth={2} aria-hidden="true" />
            <span className="sv-fila-texto">{b}</span>
          </span>
        ))}
      </span>

      <span className="sv-btn-envoltorio">
        <button
          type="button"
          className={`sv-btn sv-btn--${tarjeta.id}`}
          onClick={() => onRegistrarme(tarjeta.id)}
        >
          Registrarme
        </button>
      </span>
    </div>
  )
}

export default function SocioVincco() {
  const navigate = useNavigate()

  const registrarme = (tipo) => {
    navigate('/register', { state: { tipo } })
  }

  return (
    <div className="page-shell sv">
      {/* Fondo decorativo: capas puramente visuales, no llevan nada
          que un lector de pantalla necesite. El contenido real va
          después, con su propio z-index por encima de todo esto
          (ver .sv-header y .sv-tarjetas en el CSS). */}
      <div className="sv-fondo" aria-hidden="true">
        <div className="sv-fondo-base" />
        <div className="sv-fondo-rayo sv-fondo-rayo--1" />
        <div className="sv-fondo-rayo sv-fondo-rayo--2" />
        <div className="sv-fondo-rayo sv-fondo-rayo--3 sv-fondo-rayo--acento" />
        <div className="sv-fondo-rayo sv-fondo-rayo--4" />
        <div className="sv-fondo-rayo sv-fondo-rayo--5" />
        <div className="sv-fondo-grano" />
        <div className="sv-fondo-puntos" />
        <div className="sv-fondo-realce" />
      </div>

      {/* Vuelve a donde estaba el usuario antes de entrar (viene del
          menú hamburguesa desde cualquier pantalla) — por eso es
          navigate(-1) y no una ruta fija. */}
      <button type="button" className="sv-volver" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} strokeWidth={2} aria-hidden="true" />
        Volver
      </button>

      <header className="sv-header">
        <img src={VINCCO_LOGO} alt="Vincco" className="sv-header-logo" />
        <h1 className="sv-titulo">¡Hazte Socio Vincco!</h1>
        <p className="sv-subtitulo">
          Expande tu alcance conectando con miles de clientes. Elige cómo querés crecer con nosotros.
        </p>
      </header>

      <div className="sv-tarjetas">
        {TARJETAS.map((t) => (
          <TarjetaSocio key={t.id} tarjeta={t} onRegistrarme={registrarme} />
        ))}
      </div>
    </div>
  )
}
