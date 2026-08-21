import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, LayoutGrid, List, MapPin, X, FilterX, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Proveedor } from './data'
import { CATEGORIAS, TIPOS_NEGOCIO, type TipoNegocio } from './data'
import { DEPARTAMENTOS, ciudadesDeDepartamento } from '@/data/departamentos_ciudades'
import { TarjetaGrid, TarjetaLista, EmptyState } from './TarjetaProveedor'
import { cn } from '@/lib/utils'

const RATINGS = [
  { valor: 0, label: 'Cualquier rating' },
  { valor: 4.5, label: '4.5 o más' },
  { valor: 4, label: '4.0 o más' },
  { valor: 3.5, label: '3.5 o más' },
]

interface CatalogoProps {
  datos: Proveedor[]
  // Sustantivo del rol que se está listando (proveedores o negocios),
  // para que el catálogo sea la misma interfaz para ambos.
  textos: { uno: string; muchos: string }
  favoritos: Set<string>
  enFavorito: (p: Proveedor) => void
  enVerPerfil: (p: Proveedor) => void
  enSolicitar: (p: Proveedor) => void
}

function SelectFiltro({
  label, icono, valor, opciones, onChange, disabled = false,
}: {
  label: string
  icono?: ReactNode
  valor: string
  opciones: Array<{ valor: string; label: string }>
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <label className={`relative flex items-center ${disabled ? 'cursor-not-allowed' : ''}`}>
      {icono && <span className={`pointer-events-none absolute left-3 z-10 ${disabled ? 'text-vincco-slate2/50' : 'text-vincco-slate2'}`}>{icono}</span>}
      <select
        aria-label={label}
        value={valor}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-[42px] w-full appearance-none rounded-xl border border-vincco-line bg-white pl-9 pr-8 text-[13px] font-medium text-vincco-ink shadow-sm outline-none transition focus:border-vincco-navy-600/50 focus:ring-2 focus:ring-vincco-navy-600/20 sm:w-auto',
          icono ? '' : 'pl-3.5',
          disabled ? 'cursor-not-allowed opacity-60' : ''
        )}
      >
        {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.label}</option>)}
      </select>
      <span className={`pointer-events-none absolute right-3 ${disabled ? 'text-vincco-slate2/50' : 'text-vincco-slate2'}`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
      </span>
    </label>
  )
}

export default function Catalogo({ datos, textos, favoritos, enFavorito, enVerPerfil, enSolicitar }: CatalogoProps) {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [departamento, setDepartamento] = useState('todas')
  const [ciudad, setCiudad] = useState('todas')
  const [ratingMin, setRatingMin] = useState('0')
  const [tipo, setTipo] = useState<TipoNegocio | 'todos'>('todos')
  const [vista, setVista] = useState<'grid' | 'lista'>('grid')

  // Ciudades del departamento elegido; se limpia la ciudad si el
  // departamento cambia (no puede quedar seleccionada una ciudad que
  // no pertenezca al nuevo departamento).
  const ciudades = departamento === 'todas'
    ? []
    : ciudadesDeDepartamento(departamento)

  const hayFiltros = busqueda !== '' || categoria !== 'todas' || departamento !== 'todas' || ciudad !== 'todas' || ratingMin !== '0' || tipo !== 'todos'

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    const rating = Number(ratingMin)
    return datos.filter((p) => {
      if (texto && !`${p.nombre} ${p.categoria} ${p.municipio} ${p.departamento} ${p.ubicacion} ${p.descripcion}`.toLowerCase().includes(texto)) return false
      if (categoria !== 'todas' && p.categoria !== categoria) return false
      if (departamento !== 'todas' && p.departamento !== departamento) return false
      if (ciudad !== 'todas' && p.municipio !== ciudad) return false
      if (rating > 0 && p.rating < rating) return false
      if (tipo !== 'todos' && p.tipo !== tipo) return false
      return true
    })
  }, [datos, busqueda, categoria, departamento, ciudad, ratingMin, tipo])

  const cambiarDepartamento = (v: string) => {
    setDepartamento(v)
    setCiudad('todas')
  }

  const limpiar = () => {
    setBusqueda(''); setCategoria('todas'); setDepartamento('todas'); setCiudad('todas'); setRatingMin('0'); setTipo('todos')
  }

  const contenedor = {
    oculto: {},
    visible: { transition: { staggerChildren: 0.05 } },
  }

  return (
    <div className="space-y-5">
      {/* Barra de herramientas */}
      <div className="rounded-2xl border border-vincco-line bg-white p-4 shadow-[0_1px_2px_rgba(11,35,72,0.05)] sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-vincco-slate2" strokeWidth={1.75} />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, categoría, ciudad o departamento..."
              aria-label={`Buscar ${textos.muchos}`}
              className="h-[42px] rounded-xl border-vincco-line bg-vincco-mist pl-11 pr-4 text-sm shadow-sm placeholder:text-vincco-slate2/70 focus:border-vincco-navy-600/50 focus:bg-white focus:ring-2 focus:ring-vincco-navy-600/20"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-vincco-slate2 transition hover:bg-white hover:text-vincco-ink"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SelectFiltro
              label="Filtrar por categoría"
              icono={<SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />}
              valor={categoria}
              onChange={setCategoria}
              opciones={[{ valor: 'todas', label: 'Todas las categorías' }, ...CATEGORIAS.map((c) => ({ valor: c, label: c }))]}
            />
            <SelectFiltro
              label="Filtrar por departamento"
              icono={<MapPin className="h-4 w-4" strokeWidth={1.75} />}
              valor={departamento}
              onChange={cambiarDepartamento}
              opciones={[{ valor: 'todas', label: 'Todos los departamentos' }, ...DEPARTAMENTOS.map((d) => ({ valor: d.nombre, label: d.nombre }))]}
            />
            <SelectFiltro
              label="Filtrar por ciudad"
              icono={<MapPin className="h-4 w-4" strokeWidth={1.75} />}
              valor={ciudad}
              onChange={setCiudad}
              disabled={departamento === 'todas'}
              opciones={[
                { valor: 'todas', label: departamento === 'todas' ? 'Primero elige departamento' : 'Todas las ciudades' },
                ...ciudades.map((c) => ({ valor: c, label: c })),
              ]}
            />
            <SelectFiltro
              label="Filtrar por rating mínimo"
              icono={<Star className="h-4 w-4" strokeWidth={1.75} />}
              valor={ratingMin}
              onChange={setRatingMin}
              opciones={RATINGS.map((r) => ({ valor: String(r.valor), label: r.label }))}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {/* Tipo de negocio */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar por tipo de negocio">
            {TIPOS_NEGOCIO.map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors',
                  tipo === t
                    ? 'border-vincco-navy-800 bg-vincco-navy-800 text-white shadow-sm'
                    : 'border-vincco-line bg-white text-vincco-slate2 hover:border-vincco-navy-600/40 hover:text-vincco-navy-700'
                )}
              >
                {t === 'todos' ? 'Todos' : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-medium text-vincco-slate2">
              {filtrados.length} {textos.muchos}
            </span>

            <div className="flex overflow-hidden rounded-lg border border-vincco-line bg-white shadow-sm" role="group" aria-label="Cambiar vista">
              <button
                onClick={() => setVista('grid')}
                aria-label="Vista de cuadrícula"
                aria-pressed={vista === 'grid'}
                className={cn('flex h-9 w-9 items-center justify-center transition-colors', vista === 'grid' ? 'bg-vincco-navy-800 text-white' : 'text-vincco-slate2 hover:text-vincco-navy-700')}
              >
                <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => setVista('lista')}
                aria-label="Vista de lista"
                aria-pressed={vista === 'lista'}
                className={cn('flex h-9 w-9 items-center justify-center transition-colors', vista === 'lista' ? 'bg-vincco-navy-800 text-white' : 'text-vincco-slate2 hover:text-vincco-navy-700')}
              >
                <List className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {hayFiltros && (
          <div className="mt-3 flex items-center gap-2 border-t border-dashed border-vincco-line pt-3">
            <span className="text-[12px] font-medium text-vincco-slate2">Filtros activos</span>
            <button
              onClick={limpiar}
              className="inline-flex items-center gap-1.5 rounded-full bg-vincco-navy-50 py-1 pl-2.5 pr-3 text-[12px] font-semibold text-vincco-navy-700 transition hover:bg-vincco-navy-800 hover:text-white"
            >
              <FilterX className="h-3.5 w-3.5" strokeWidth={1.75} />
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Resultados */}
      {filtrados.length === 0 ? (
        <EmptyState
          icono="lupa"
          titulo="Sin resultados para tu búsqueda"
          descripcion={
            hayFiltros
              ? 'Ajustá alguno de tus filtros o probá con otro término.'
              : `Aún no hay ${textos.muchos} en esta categoría. Prueba ajustando tus filtros.`
          }
          accion={{ label: 'Limpiar filtros', onClick: limpiar }}
        />
      ) : vista === 'grid' ? (
        <motion.div
          key="grid"
          variants={contenedor}
          initial="oculto"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtrados.map((p) => (
            <TarjetaGrid
              key={p.id}
              proveedor={p}
              favorito={favoritos.has(p.id)}
              enFavorito={enFavorito}
              enVerPerfil={enVerPerfil}
              enSolicitar={enSolicitar}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="lista"
          variants={contenedor}
          initial="oculto"
          animate="visible"
          className="space-y-3"
        >
          {filtrados.map((p) => (
            <TarjetaLista
              key={p.id}
              proveedor={p}
              favorito={favoritos.has(p.id)}
              enFavorito={enFavorito}
              enVerPerfil={enVerPerfil}
              enSolicitar={enSolicitar}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}