import { useState, useEffect } from 'react'
import { EventManager } from '../components/ui/event-manager'
import { Button } from '../components/ui/button'
import Icon from '../components/icons/Icon'
import './Calendario.css'
import './Calendario-tema.css'

const CATEGORIAS_CALENDARIO = ['Cita', 'Entrega', 'Promoción', 'Pago', 'Recordatorio']
const TAGS_CALENDARIO = ['Urgente', 'Cliente', 'Proveedor', 'Equipo', 'Importante']
const CLAVE_STORAGE = 'vincco_calendario'
const CLAVE_TEMA = 'vincco_tema_calendario'

function crearEventosEjemplo() {
  const enHoras = (dias, hora) => {
    const d = new Date()
    d.setDate(d.getDate() + dias)
    d.setHours(hora, 0, 0, 0)
    return d
  }
  return [
    {
      id: 'demo-1',
      title: 'Entrega a Distribuidora Norte',
      description: 'Confirmar cantidad y coordinar transporte.',
      startTime: enHoras(0, 10),
      endTime: enHoras(0, 11),
      color: 'blue',
      category: 'Entrega',
      tags: ['Cliente'],
    },
    {
      id: 'demo-2',
      title: 'Reunión con proveedor de materiales',
      description: 'Negociar precios del próximo pedido.',
      startTime: enHoras(2, 15),
      endTime: enHoras(2, 16),
      color: 'green',
      category: 'Cita',
      tags: ['Proveedor', 'Importante'],
    },
    {
      id: 'demo-3',
      title: 'Pago a proveedor',
      description: '',
      startTime: enHoras(5, 9),
      endTime: enHoras(5, 10),
      color: 'orange',
      category: 'Pago',
      tags: [],
    },
  ]
}

export default function Calendario() {
  const [eventos, setEventos] = useState(() => {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    if (guardado) {
      try {
        return JSON.parse(guardado).map((e) => ({
          ...e,
          startTime: new Date(e.startTime),
          endTime: new Date(e.endTime),
        }))
      } catch {}
    }
    return crearEventosEjemplo()
  })

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(eventos))
  }, [eventos])

  const [modoOscuro, setModoOscuro] = useState(() => localStorage.getItem(CLAVE_TEMA) !== 'claro')

  useEffect(() => {
    document.body.classList.toggle('dark', modoOscuro)
    localStorage.setItem(CLAVE_TEMA, modoOscuro ? 'oscuro' : 'claro')
  }, [modoOscuro])

  return (
    <div className="cal">
      <div className="cal-header">
        <h2>Calendario</h2>
      </div>
      <EventManager
        events={eventos}
        onEventCreate={(evento) => setEventos((prev) => [...prev, evento])}
        onEventUpdate={(id, cambios) =>
          setEventos((prev) => prev.map((e) => (e.id === id ? { ...e, ...cambios } : e)))
        }
        onEventDelete={(id) => setEventos((prev) => prev.filter((e) => e.id !== id))}
        categories={CATEGORIAS_CALENDARIO}
        availableTags={TAGS_CALENDARIO}
        extraHeaderActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cal-filter-btn gap-2 bg-transparent"
            onClick={() => setModoOscuro((prev) => !prev)}
            title={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-pressed={!modoOscuro}
          >
            <Icon name={modoOscuro ? 'sun' : 'moon'} size={16} />
            {modoOscuro ? 'Claro' : 'Oscuro'}
          </Button>
        }
      />
    </div>
  )
}
