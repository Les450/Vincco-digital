import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Truck, Mail } from 'lucide-react'
import useStore, { perfilDeSucursal } from '@/store/puntos_usestore'
import { cn } from '@/lib/utils'

export type SeccionModulo = 'proveedores' | 'solicitudes'

const VINCCO_LOGO = `${process.env.PUBLIC_URL}/assets/logos/vincco-logo-nav.png`

export type ModoModulo = 'negocio' | 'proveedor'

interface HeaderProps {
  seccion: SeccionModulo
  onCambiarSeccion: (s: SeccionModulo) => void
  totalSolicitudes: number
  modo?: ModoModulo
}

// El módulo es el mismo para ambos roles: la etiqueta de la sección
// cambia según quién lo abre, pero el diseño es idéntico. El acceso
// al panel vive solo en la barra inferior, así que acá no se repite.
const MODOS = {
  negocio: {
    seccionPrincipal: { label: 'Proveedores', seccion: 'proveedores' as const },
  },
  proveedor: {
    seccionPrincipal: { label: 'Negocios', seccion: 'proveedores' as const },
  },
}

export default function Header({ seccion, onCambiarSeccion, totalSolicitudes, modo = 'negocio' }: HeaderProps) {
  const navigate = useNavigate()
  const rol = modo === 'proveedor' ? 'proveedor' : 'negocio'
  const perfilBase = useStore((s) => s.perfiles[rol])
  // El avatar muestra el nombre de la sucursal activa: al cambiar de
  // sucursal, el módulo pasa a administrar esa cuenta.
  const sucursal = useStore((s) => s.sucursales[rol]?.find((x: { id: string }) => x.id === s.sucursalActiva[rol]))
  const perfil = perfilDeSucursal(perfilBase, sucursal)
  const textos = MODOS[modo]

  const iniciales = (perfil?.nombre || 'N').split(' ').slice(0, 2).map((p: string) => p[0]).join('').toUpperCase()

  const NAV = [
    { id: 'proveedores', label: textos.seccionPrincipal.label, icon: Truck, seccion: 'proveedores' as const },
    { id: 'solicitudes', label: 'Solicitudes', icon: Mail, seccion: 'solicitudes' as const },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-vincco-line/70 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <button
          onClick={() => navigate('/home')}
          aria-label="Volver al inicio"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-vincco-line bg-white text-vincco-ink shadow-sm transition hover:-translate-y-px hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="flex items-center">
          <img src={VINCCO_LOGO} alt="Vincco" className="h-8 w-auto" />
        </div>

        {/* Navegación principal: desktop */}
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {NAV.map((item) => {
            const activo = item.seccion === seccion
            return (
              <button
                key={item.id}
                onClick={() => onCambiarSeccion(item.seccion)}
                className={cn(
                  'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  activo
                    ? 'text-vincco-navy-800'
                    : 'text-vincco-slate2 hover:bg-vincco-mist hover:text-vincco-navy-700'
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
                {item.seccion === 'solicitudes' && totalSolicitudes > 0 && (
                  <span className="ml-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-vincco-navy-800 px-1 text-[10px] font-bold text-white">
                    {totalSolicitudes}
                  </span>
                )}
                {activo && (
                  <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-vincco-gold" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => navigate('/perfil')}
            aria-label="Perfil"
            className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-0.5 transition hover:opacity-90"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-vincco-navy-800 text-xs font-bold text-white shadow-sm ring-1 ring-vincco-line">
              {perfil?.foto ? (
                <img src={perfil.foto} alt="" className="h-full w-full object-cover" />
              ) : (
                iniciales
              )}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-vincco-success" />
            </span>
            <span className="text-[11px] font-semibold text-vincco-slate2">Perfil</span>
          </button>
        </div>
      </div>

      {/* Selector de sección: mobile */}
      <div className="border-t border-vincco-line/50 px-4 py-2 md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-1 rounded-xl border border-vincco-line bg-white p-1 shadow-sm">
          {(['proveedores', 'solicitudes'] as SeccionModulo[]).map((s) => (
            <button
              key={s}
              onClick={() => onCambiarSeccion(s)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors',
                seccion === s ? 'bg-vincco-navy-800 text-white shadow-sm' : 'text-vincco-slate2 hover:text-vincco-navy-700'
              )}
            >
              {s === 'proveedores' ? (
                <Truck className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Mail className="h-4 w-4" strokeWidth={1.75} />
              )}
              {s === 'proveedores' ? textos.seccionPrincipal.label : 'Solicitudes'}
              {s === 'solicitudes' && totalSolicitudes > 0 && (
                <span className={cn(
                  'flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
                  seccion === s ? 'bg-vincco-gold text-vincco-navy-950' : 'bg-vincco-mist text-vincco-slate2'
                )}>
                  {totalSolicitudes}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}