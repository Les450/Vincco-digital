/* ── Datos del modulo "Premios" (vista cliente) ────────────────
   Datos mock centralizados mientras no haya backend. Los tipos
   definen el contrato: el dia que exista una API, solo cambia
   este archivo y las secciones no se tocan. ─────────────────── */

import { negociosFavoritos } from './data_falso'

export type NivelId = 'bronce' | 'plata' | 'oro' | 'vip'

export type IconoRecompensa =
  | 'coffee'
  | 'cup-soda'
  | 'croissant'
  | 'tag'
  | 'ticket'
  | 'wrench'
  | 'scissors'
  | 'cake'
  | 'film'

export interface UsuarioPremios {
  nombre: string
  handle: string
  iniciales: string
  miembroDesde: string
  foto: string | null
  puntos: number
}

export interface Nivel {
  id: NivelId
  nombre: string
  puntosMin: number
  puntosMax: number
  beneficio: string
  icono: 'medal' | 'award' | 'crown' | 'gem'
}

export interface Recompensa {
  id: number
  nombre: string
  categoria: string
  puntos: number
  negocio: string
  icono: IconoRecompensa
}

export interface AnuncioSubirNivel {
  id: string
  titulo: string
  descripcion: string
  chip: string
  tile: 'naranja' | 'dorado' | 'turquesa'
  icono: 'store' | 'gift' | 'sparkles'
  detalles: string[]
}

export interface Actividad {
  id: number
  tipo: 'ganado' | 'reclamado'
  concepto: string
  negocio: string
  fecha: string
  puntos: number
}

export interface NegocioAfiliado {
  id: number
  nombre: string
  categoria: string
  direccion: string
  rating: number
  puntos: number
}

/* ── Niveles del programa ─────────────────────────────────────
   Mismos umbrales que data/data_falso.js (Bronce 0, Plata 200,
   Oro 500, VIP 1000) para que la pantalla y el resto de la app
   cuenten la misma historia. ────────────────────────────────── */

export const NIVELES: Nivel[] = [
  {
    id: 'bronce',
    nombre: 'Bronce',
    puntosMin: 0,
    puntosMax: 199,
    beneficio: 'Acceso al catalogo completo de recompensas',
    icono: 'medal',
  },
  {
    id: 'plata',
    nombre: 'Plata',
    puntosMin: 200,
    puntosMax: 499,
    beneficio: 'Puntos dobles en promociones especiales',
    icono: 'award',
  },
  {
    id: 'oro',
    nombre: 'Oro',
    puntosMin: 500,
    puntosMax: 999,
    beneficio: 'Cupones exclusivos y canje prioritario',
    icono: 'crown',
  },
  {
    id: 'vip',
    nombre: 'VIP',
    puntosMin: 1000,
    puntosMax: Infinity,
    beneficio: 'Beneficios premium y atencion personalizada',
    icono: 'gem',
  },
]

/* ── Recompensas canjeables ───────────────────────────────────
   Las 6 primeras son las que se ven de entrada (grid 3x2); el
   resto aparece al tocar "Ver todas las recompensas". Con 340
   puntos de demo quedan 8 disponibles, el numero del badge.
   ──────────────────────────────────────────────────────────── */

export const RECOMPENSAS: Recompensa[] = [
  { id: 1, nombre: 'Cafe artesanal gratis', categoria: 'Cafeteria', puntos: 80, negocio: 'Cafe del Barrio', icono: 'coffee' },
  { id: 2, nombre: 'Refresco de cebada', categoria: 'La soda', puntos: 60, negocio: 'Soda Dona Mercedes', icono: 'cup-soda' },
  { id: 3, nombre: 'Empanada de queso', categoria: 'La fonda', puntos: 90, negocio: 'Fonda El Buen Sabor', icono: 'croissant' },
  { id: 4, nombre: 'Descuento 15%', categoria: 'Ropa', puntos: 150, negocio: 'Boutique Alma', icono: 'tag' },
  { id: 5, nombre: 'Cupon C$50', categoria: 'General', puntos: 200, negocio: 'Todos los afiliados', icono: 'ticket' },
  { id: 6, nombre: 'Descuento en herramientas', categoria: 'Ferreteria', puntos: 250, negocio: 'Ferreteria Don Chico', icono: 'wrench' },
  { id: 7, nombre: 'Corte de cabello', categoria: 'Salon', puntos: 300, negocio: 'Salon Bella Imagen', icono: 'scissors' },
  { id: 8, nombre: 'Pastel pequeno', categoria: 'Reposteria', puntos: 320, negocio: 'Reposteria Dulce Encanto', icono: 'cake' },
  { id: 9, nombre: 'Entrada doble al cine', categoria: 'Experiencia', puntos: 400, negocio: 'Cinema Nueva Guinea', icono: 'film' },
]

export const RECOMPENSAS_VISIBLES = 6

/* ── Anuncios: como subir de nivel ──────────────────────────── */

export const ANUNCIOS_SUBIR_NIVEL: AnuncioSubirNivel[] = [
  {
    id: 'visitas',
    titulo: 'Visita negocios',
    descripcion: 'Cada compra en un negocio afiliado suma puntos a tu saldo. Mientras mas frecuente, mas rapido subis.',
    chip: 'Hasta +120 pts / visita',
    tile: 'naranja',
    icono: 'store',
    detalles: [
      'Compras desde C$50 en cualquier negocio afiliado',
      'Se cuentan hasta 3 visitas por dia por negocio',
      'Los puntos del dia se suman a tu saldo al cierre',
    ],
  },
  {
    id: 'amigos',
    titulo: 'Invita a tus amigos',
    descripcion: 'Comparti tu codigo de invitacion y gana puntos cuando tus amigos se sumen a Vincco.',
    chip: '+500 pts por amigo',
    tile: 'dorado',
    icono: 'gift',
    detalles: [
      'Tu amigo debe completar el registro y la verificacion',
      'Los +500 pts se acreditan cuando hace su primera compra',
      'No hay limite de amigos invitados',
    ],
  },
  {
    id: 'promos',
    titulo: 'Promociones especiales',
    descripcion: 'En dias de campana los puntos se multiplican. Enterate de cada promo desde Avisos y el Calendario.',
    chip: 'Puntos x2 en campanas',
    tile: 'turquesa',
    icono: 'sparkles',
    detalles: [
      'Puntos x2 los viernes y en campanas de fin de mes',
      'El multiplicador tambien aplica a las resenas',
      'Las promos activas se avisan por Avisos y Calendario',
    ],
  },
]

/* ── Actividad reciente ─────────────────────────────────────── */

export const ACTIVIDAD_RECIENTE: Actividad[] = [
  { id: 1, tipo: 'ganado', concepto: 'Compra registrada', negocio: 'Ferreteria Don Chico', fecha: 'Hoy', puntos: 120 },
  { id: 2, tipo: 'ganado', concepto: 'Visita con compra', negocio: 'Cafe del Barrio', fecha: 'Ayer', puntos: 60 },
  { id: 3, tipo: 'reclamado', concepto: 'Canjeaste Cupon C$50', negocio: 'Todos los afiliados', fecha: 'Hace 3 dias', puntos: 450 },
  { id: 4, tipo: 'ganado', concepto: 'Invitacion aceptada', negocio: 'Carlos M. se sumo a Vincco', fecha: 'Hace 5 dias', puntos: 500 },
  { id: 5, tipo: 'ganado', concepto: 'Resena publicada', negocio: 'Boutique Alma', fecha: 'Hace 6 dias', puntos: 10 },
  { id: 6, tipo: 'reclamado', concepto: 'Canjeaste Descuento 15%', negocio: 'Boutique Alma', fecha: 'Hace 8 dias', puntos: 150 },
]

/* ── Negocios afiliados (¿Dónde ganas?) ───────────────────────
   Son los negocios VERIFICADOS dentro de Vincco. Por eso se
   referencian por el id de negociosFavoritos (data_falso.js):
   la ruta /negocio/:id/inventario resuelve su ficha y su catálogo
   contra esa lista, igual que "Ver inventario" en Favoritos. Si
   no existieran ahí, el cliente vería "Negocio no encontrado".

   "puntos" es el beneficio que muestra el anuncio: los puntos
   que ese comercio da por compra. ───────────────────────────── */

const AFILIADOS_REFERENCIA = [
  { id: 3, puntos: 120 }, // Ferretería Don Chico
  { id: 1, puntos: 90 }, // Soda Doña Mercedes
  { id: 7, puntos: 60 }, // Café del Barrio
  { id: 4, puntos: 100 }, // Farmacia San Rafael
  { id: 5, puntos: 80 }, // Repostería Dulce Encanto
  { id: 8, puntos: 75 }, // Boutique Alma
]

export const NEGOCIOS_AFILIADOS: NegocioAfiliado[] = AFILIADOS_REFERENCIA
  .map((ref) => {
    const n = negociosFavoritos.find((f) => f.id === ref.id)
    if (!n) return null
    return {
      id: n.id,
      nombre: n.nombre,
      categoria: n.categoria,
      direccion: n.direccion,
      rating: n.rating,
      puntos: ref.puntos,
    }
  })
  .filter((n): n is NegocioAfiliado => n !== null)