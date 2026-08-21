import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import NegociosCarousel from '../components/NegociosCarousel'
import { proveedoresAsociados } from '../data/data_falso'
import './NegociosAsociados.css'

// Pantalla gemela de Negocios Asociados pero del lado del negocio:
// el menú hamburguesa "Proveedores" abre esta vista de proveedores
// asociados, y desde acá se sale a buscar más en el directorio de
// proveedores (/proveedores), que es la misma interfaz del módulo.
// Son pantallas independientes aunque compartan diseño.

function soloDigitos(valor) {
  return (valor || '').replace(/\D/g, '')
}

export default function ProveedoresAsociados() {
  const navigate = useNavigate()
  const userType = useStore((s) => s.userType)

  const [busqueda, setBusqueda] = useState('')
  const [seleccionadoId, setSeleccionadoId] = useState(proveedoresAsociados[0]?.id ?? null)

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return proveedoresAsociados
    return proveedoresAsociados.filter((p) =>
      p.nombre.toLowerCase().includes(texto) || p.categoria.toLowerCase().includes(texto)
    )
  }, [busqueda])

  useEffect(() => {
    if (filtrados.length === 0) return
    if (!filtrados.some((p) => p.id === seleccionadoId)) {
      setSeleccionadoId(filtrados[0].id)
    }
  }, [filtrados, seleccionadoId])

  const seleccionado = proveedoresAsociados.find((p) => p.id === seleccionadoId) || null

  const whatsappHref = seleccionado && soloDigitos(seleccionado.whatsapp)
    ? `https://wa.me/${soloDigitos(seleccionado.whatsapp)}`
    : null

  const hayProveedores = proveedoresAsociados.length > 0

  if (userType !== 'negocio') {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="na">
      <div className="na-header">
        <button className="na-header-btn" onClick={() => navigate('/inicio')} type="button" aria-label="Volver">
          <Icon name="arrow-left" size={18} />
        </button>
        <div className="na-header-info">
          <h1>Proveedores Asociados</h1>
          <p>Administra los proveedores con los que trabaja tu negocio</p>
        </div>
        <div className="na-header-acciones">
          <button className="na-btn-agregar" onClick={() => navigate('/proveedores')} type="button">
            <Icon name="search" size={14} /> Buscar proveedores
          </button>
        </div>
      </div>

      {!hayProveedores ? (
        <div className="na-vacio">
          <div className="na-vacio-icono"><Icon name="store" size={30} /></div>
          <h3>Todavía no tenés proveedores asociados.</h3>
          <p>Buscá en el directorio y pedí la asociación con tus primeros proveedores.</p>
          <button className="na-vacio-btn" onClick={() => navigate('/proveedores')} type="button">
            <Icon name="search" size={16} /> Buscar proveedores
          </button>
        </div>
      ) : (
        <NegociosCarousel
          negocios={filtrados}
          seleccionadoId={seleccionadoId}
          onSeleccionar={setSeleccionadoId}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          whatsappHref={whatsappHref}
          proveedor={null}
          verificado={false}
          // Este lado es el que recibe y responde: no se cotiza ni se
          // "espera aceptación" aquí, eso vive en Avisos del negocio.
          ocultarCotizacion
          textoPendiente="Recibiste una solicitud: respondela desde Avisos"
          pausado={busqueda.trim().length > 0}
        />
      )}
    </div>
  )
}