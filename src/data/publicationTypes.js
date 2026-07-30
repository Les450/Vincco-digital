// Registro central de tipos de publicación.
// Agregar un tipo nuevo aquí (+ su tarjeta en Home.jsx) es lo único
// necesario para que el panel y el Home lo reconozcan automáticamente.
export const TIPOS_PUBLICACION = [
  {
    id: 'promocion',
    label: 'Promociones',
    icon: 'flame',
    color: '#c05900',
    desc: 'Ofertas y descuentos temporales',
    storageKey: 'pn_promociones',
    homeSort: 'recent',
  },
  {
    id: 'producto',
    label: 'Productos nuevos',
    icon: 'package',
    color: '#007a7b',
    desc: 'Novedades en tu catálogo',
    storageKey: 'pn_productos',
    homeSort: 'recent',
  },
  {
    id: 'limitada',
    label: 'Promociones limitadas',
    icon: 'zap',
    color: '#8b5cf6',
    desc: 'Ofertas exclusivas por tiempo',
    storageKey: 'pn_limitadas',
    homeSort: 'recent',
  },
  {
    id: 'destacada',
    label: 'Destacadas',
    icon: 'trending-up',
    color: '#e11d48',
    desc: 'Se posicionan según los likes de los usuarios',
    storageKey: 'pn_destacadas',
    homeSort: 'likes',
  },
]
