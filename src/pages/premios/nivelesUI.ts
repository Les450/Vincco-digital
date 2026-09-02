import { Award, Crown, Gem, Medal } from 'lucide-react'
import { NIVELES, type Nivel } from '../../data/premios'

/* Fuente unica para pintar niveles en la pantalla de Premios.
 * El hero (MisPremios) y la progresion de "Como subir tu nivel"
 * (SubirNivel) leen de aca: si cambia el nivel del cliente, cambian
 * las dos secciones juntas porque comparten el mismo calculo. */

// Icono y acentos de cada nivel. `acento` va sobre el hero oscuro;
// `acentoOscuro` es la variante con mas contraste para fondos claros
// como la progresion de "Como subir tu nivel".
export const META_NIVEL: Record<
  Nivel['id'],
  { icono: typeof Medal; acento: string; acentoOscuro: string; badge: string }
> = {
  bronce: {
    icono: Medal,
    acento: 'text-naranja-300',
    acentoOscuro: 'text-naranja-600',
    badge: 'bg-hueso-300 text-tinta-900',
  },
  plata: {
    icono: Award,
    acento: 'text-tinta-200',
    acentoOscuro: 'text-tinta-400',
    badge: 'bg-tinta-200 text-tinta-900',
  },
  oro: {
    icono: Crown,
    acento: 'text-dorado-400',
    acentoOscuro: 'text-dorado-600',
    badge: 'bg-dorado-500 text-tinta-900',
  },
  vip: {
    icono: Gem,
    acento: 'text-naranja-400',
    acentoOscuro: 'text-naranja-600',
    badge: 'bg-naranja-500 text-hueso-50',
  },
}

export function nivelActual(puntos: number): Nivel {
  return [...NIVELES].reverse().find((n) => puntos >= n.puntosMin) ?? NIVELES[0]
}

export function siguienteNivel(puntos: number): Nivel | null {
  return NIVELES.find((n) => puntos < n.puntosMin) ?? null
}

// Etiqueta de cada nivel respecto al saldo. Mismo copy en el hero y
// en la progresion para que nunca cuenten historias distintas.
export function estadoNivel(n: Nivel, puntos: number): string {
  if (n.puntosMax < puntos) return 'Superado'
  if (n.id === nivelActual(puntos).id) return 'Tu nivel actual'
  return `Desde ${n.puntosMin.toLocaleString('es')} pts`
}

export { NIVELES }
