import { MONEDA } from '../utils/moneda'

/* ══════════════════════════════════════════════════════════════
   Configuraciones de Vincco, definidas como datos y no como JSX.

   La pantalla /config no sabe qué ajustes existen: recorre este
   archivo y dibuja lo que encuentra. Agregar un ajuste nuevo es
   agregar un objeto acá, sin tocar componentes.

   Es el mismo patrón de camposPerfil en data_falso.js.

   Cada ajuste tiene:
     id          clave con la que se guarda en el store
     tipo        switch | opciones | numero | enlace | accion | info
     label       lo que lee el usuario
     ayuda       una línea explicando para qué sirve (opcional)
     icono       nombre de icono de components/icons/Icon.jsx
     depende     id de otro ajuste; si ese está apagado, este se
                 deshabilita. Así el usuario no configura cosas
                 que no van a pasar (ej. el horario de silencio
                 sin notificaciones activas).
     peligro     true = acción destructiva, se pinta en rojo
   ══════════════════════════════════════════════════════════════ */

/* ── Grupos que comparten los tres roles ─────────────────── */

const GRUPO_NOTIFICACIONES_CANAL = {
  id: 'canales',
  titulo: 'Cómo te avisamos',
  descripcion: 'Elegí por dónde querés recibir los avisos de Vincco',
  icono: 'bell',
  ajustes: [
    {
      id: 'canalPush',
      tipo: 'switch',
      icono: 'smartphone',
      label: 'Notificaciones en el celular',
      ayuda: 'Avisos que aparecen en la pantalla aunque tengas la app cerrada',
    },
    {
      id: 'canalCorreo',
      tipo: 'switch',
      icono: 'mail',
      label: 'Correo electrónico',
      ayuda: 'Resúmenes y avisos importantes a tu correo',
    },
    {
      id: 'canalWhatsapp',
      tipo: 'switch',
      icono: 'message-circle',
      label: 'WhatsApp',
      ayuda: 'Solo para lo urgente: cotizaciones y confirmaciones',
    },
    {
      id: 'silencio',
      tipo: 'switch',
      icono: 'bell-off',
      label: 'Horario de silencio',
      ayuda: 'No recibís avisos mientras dormís',
    },
    {
      id: 'silencioDesde',
      tipo: 'opciones',
      icono: 'clock',
      label: 'Silencio desde',
      depende: 'silencio',
      opciones: [
        { valor: '20:00', label: '8 PM' },
        { valor: '21:00', label: '9 PM' },
        { valor: '22:00', label: '10 PM' },
      ],
    },
    {
      id: 'silencioHasta',
      tipo: 'opciones',
      icono: 'clock',
      label: 'Silencio hasta',
      depende: 'silencio',
      opciones: [
        { valor: '05:00', label: '5 AM' },
        { valor: '06:00', label: '6 AM' },
        { valor: '07:00', label: '7 AM' },
      ],
    },
  ],
}

const GRUPO_APP = {
  id: 'accesibilidad',
  titulo: 'Accesibilidades',
  descripcion: 'Cómo se ve',
  icono: 'sliders',
  ajustes: [
    {
      id: 'mostrarAsistente',
      tipo: 'switch',
      icono: 'message-circle',
      label: 'Mostrar a Kiara',
      ayuda: 'La asistente que aparece al costado de la pantalla',
    },
    {
      id: 'textoGrande',
      tipo: 'switch',
      icono: 'search',
      label: 'Texto más grande',
      ayuda: 'Aumenta el tamaño de las letras en toda la página',
    },
    {
      id: 'altoContraste',
      tipo: 'switch',
      icono: 'eye',
      label: 'Alto contraste',
      ayuda: 'Colores más marcados, se lee mejor bajo el sol',
    },
  ],
}

/* Idioma y moneda.

   Vincco es Nicaragua: el idioma arranca en español y la moneda en
   córdobas, y así queda para quien no toca nada.

   El inglés está para el turista o el proveedor de afuera. Elegir
   dólar no cambia lo que se guarda (siempre son córdobas): solo
   convierte lo que se MUESTRA, con el tipo de cambio fijo de
   TIPO_CAMBIO_USD en utils/moneda.js, que se actualiza a mano hasta
   que exista un feed de tasa de cambio del día.  */
const GRUPO_REGION = {
  id: 'region',
  titulo: 'Idioma y moneda',
  descripcion: 'Vincco opera en Nicaragua',
  icono: 'globe',
  ajustes: [
    {
      id: 'idioma',
      tipo: 'opciones',
      icono: 'globe',
      label: 'Idioma',
      opciones: [
        { valor: 'es', label: 'Español' },
        { valor: 'en', label: 'English' },
      ],
    },
    {
      id: 'moneda',
      tipo: 'opciones',
      icono: 'wallet',
      label: 'Moneda',
      ayuda: `Los montos se guardan en ${MONEDA.nombrePlural}; elegir dólares solo cambia como se muestran, con un tipo de cambio fijo de referencia`,
      opciones: [
        { valor: 'NIO', label: 'Córdobas (C$)' },
        { valor: 'USD', label: 'Dólares (US$)' },
      ],
    },
  ],
}

const GRUPO_CUENTA = {
  id: 'cuenta',
  titulo: 'Cuenta y seguridad',
  descripcion: 'Tus credenciales de acceso',
  icono: 'lock',
  ajustes: [
    { id: 'cambiarClave', tipo: 'enlace', icono: 'key', label: 'Cambiar contraseña', ruta: '/perfil' },
    { id: 'datosCuenta', tipo: 'enlace', icono: 'user', label: 'Correo y teléfono de recuperación', ruta: '/perfil' },
    { id: 'cerrarSesion', tipo: 'accion', icono: 'log-out', label: 'Cerrar sesión', accion: 'cerrarSesion' },
    {
      id: 'eliminarCuenta',
      tipo: 'accion',
      icono: 'trash-2',
      label: 'Eliminar mi cuenta',
      ayuda: 'Se borran tus datos y perdés los puntos acumulados. No se puede deshacer',
      accion: 'eliminarCuenta',
      peligro: true,
    },
  ],
}

const GRUPO_ACERCA = {
  id: 'acerca',
  titulo: 'Acerca de Vincco',
  icono: 'info',
  ajustes: [
    { id: 'version', tipo: 'info', icono: 'info', label: 'Versión', valor: '1.0.0 · piloto Nueva Guinea' },
    { id: 'ayuda', tipo: 'enlace', icono: 'help-circle', label: 'Centro de ayuda', ruta: '/ayuda' },
    { id: 'terminos', tipo: 'enlace', icono: 'file-text', label: 'Términos y condiciones', ruta: '/ayuda' },
    { id: 'privacidadLegal', tipo: 'enlace', icono: 'shield', label: 'Política de privacidad', ruta: '/ayuda' },
  ],
}

/* ── Cliente ─────────────────────────────────────────────── */

const CLIENTE = [
  {
    id: 'privacidad',
    titulo: 'Privacidad',
    descripcion: 'Qué ve de vos el resto del ecosistema',
    icono: 'shield',
    ajustes: [
      {
        id: 'ocultarDatos',
        tipo: 'switch',
        icono: 'eye-off',
        label: 'Ocultar mis datos al entrar al perfil',
        ayuda: 'Teléfono, correo y dirección salen tapados hasta que toques el ojo',
      },
      {
        id: 'resenasAnonimas',
        tipo: 'switch',
        icono: 'star',
        label: 'Publicar mis reseñas sin mi nombre',
        ayuda: 'Aparecen como "Cliente verificado". Sirve para opinar con confianza',
      },
      {
        id: 'aparecerRanking',
        tipo: 'switch',
        icono: 'award',
        label: 'Aparecer en rankings de clientes',
        ayuda: 'Si lo apagás seguís sumando puntos, solo que no salís en las listas públicas',
      },
    ],
  },
  {
    id: 'canje',
    titulo: 'Seguridad al canjear',
    descripcion: 'Tus puntos valen plata: protegelos',
    icono: 'gift',
    ajustes: [
      {
        id: 'pinCanje',
        tipo: 'switch',
        icono: 'lock',
        label: 'Pedir PIN para canjear puntos',
        ayuda: 'Si te prestan o te roban el celular, nadie puede usar tus puntos',
      },
      {
        id: 'confirmarCanje',
        tipo: 'switch',
        icono: 'check-circle',
        label: 'Confirmar antes de canjear',
        ayuda: 'Te muestra un resumen para que no canjees por error',
      },
    ],
  },
  {
    id: 'puntos',
    titulo: 'Mis puntos',
    descripcion: 'Avisos para que no se te venzan',
    icono: 'star',
    ajustes: [
      {
        id: 'avisoVencimiento',
        tipo: 'switch',
        icono: 'clock',
        label: 'Avisarme si mis puntos están por vencer',
      },
      {
        id: 'diasVencimiento',
        tipo: 'opciones',
        icono: 'calendar',
        label: 'Con cuánta anticipación',
        depende: 'avisoVencimiento',
        opciones: [
          { valor: 3, label: '3 días' },
          { valor: 7, label: '7 días' },
          { valor: 15, label: '15 días' },
        ],
      },
      {
        id: 'avisoRecompensa',
        tipo: 'switch',
        icono: 'gift',
        label: 'Avisarme cuando alcance para una recompensa',
      },
    ],
  },
  {
    id: 'descubrimiento',
    titulo: 'Qué negocios veo',
    descripcion: 'Ajusta el inicio y las recomendaciones',
    icono: 'map-pin',
    ajustes: [
      {
        id: 'radioBusqueda',
        tipo: 'opciones',
        icono: 'map-pin',
        label: 'Radio de negocios cercanos',
        ayuda: 'En Nueva Guinea con 5 km cubrís casi todo el casco urbano',
        opciones: [
          { valor: 1, label: '1 km' },
          { valor: 5, label: '5 km' },
          { valor: 0, label: 'Todo el municipio' },
        ],
      },
      {
        id: 'promosCercanas',
        tipo: 'opciones',
        icono: 'megaphone',
        label: 'Avisos de promociones',
        opciones: [
          { valor: 'todas', label: 'Todas' },
          { valor: 'favoritos', label: 'Solo favoritos' },
          { valor: 'ninguna', label: 'Ninguna' },
        ],
      },
      {
        id: 'avisoPrecioFavoritos',
        tipo: 'switch',
        icono: 'tag',
        label: 'Avisarme si baja de precio algo en mis favoritos',
      },
    ],
  },
  GRUPO_NOTIFICACIONES_CANAL,
  GRUPO_APP,
  GRUPO_REGION,
  GRUPO_CUENTA,
  GRUPO_ACERCA,
]

/* ── Negocio ─────────────────────────────────────────────── */

const NEGOCIO = [
  {
    id: 'vitrina',
    titulo: 'Mi perfil público',
    descripcion: 'Lo que ve un cliente al entrar a tu negocio',
    icono: 'store',
    ajustes: [
      {
        id: 'mostrarPrecios',
        tipo: 'opciones',
        icono: 'wallet',
        label: 'Precios de mi inventario',
        ayuda: `Todos los montos van en ${MONEDA.nombrePlural}`,
        opciones: [
          { valor: 'publicos', label: 'Públicos' },
          { valor: 'consultar', label: 'Consultar' },
        ],
      },
      {
        id: 'horarioAtencion',
        tipo: 'enlace',
        icono: 'clock',
        label: 'Horario de atención',
        ayuda: 'Es lo que permite mostrar "Abierto ahora" en el directorio',
        ruta: '/perfil',
      },
    ],
  },
  {
    id: 'puntosNegocio',
    titulo: 'Puntos que doy',
    descripcion: 'Tu palanca para que el cliente vuelva',
    icono: 'award',
    ajustes: [
      {
        id: 'puntosPorCompra',
        tipo: 'numero',
        icono: 'star',
        label: 'Puntos por cada 100 córdobas de compra',
        ayuda: 'Mientras más puntos des, más te conviene al cliente elegirte',
        min: 1,
        max: 100,
        sufijo: 'pts',
      },
      {
        id: 'puntosDobles',
        tipo: 'switch',
        icono: 'flame',
        label: 'Activar días de puntos dobles',
      },
      {
        id: 'diaPuntosDobles',
        tipo: 'opciones',
        icono: 'calendar',
        label: 'Qué día',
        depende: 'puntosDobles',
        opciones: [
          { valor: 'lunes', label: 'Lunes' },
          { valor: 'viernes', label: 'Viernes' },
          { valor: 'sabado', label: 'Sábado' },
        ],
      },
    ],
  },
  {
    id: 'inventario',
    titulo: 'Inventario',
    descripcion: 'Cuándo querés que te avisemos',
    icono: 'package',
    ajustes: [
      {
        id: 'umbralStock',
        tipo: 'numero',
        icono: 'alert-triangle',
        label: 'Avisarme cuando queden menos de',
        ayuda: 'Una ferretería y una pulpería no manejan los mismos volúmenes',
        min: 1,
        max: 200,
        sufijo: 'unidades',
      },
      {
        id: 'recordatorioPrecios',
        tipo: 'opciones',
        icono: 'edit-3',
        label: 'Recordarme actualizar precios',
        opciones: [
          { valor: 15, label: 'Cada 15 días' },
          { valor: 30, label: 'Cada mes' },
          { valor: 0, label: 'Nunca' },
        ],
      },
    ],
  },
  {
    id: 'cotizacionesNegocio',
    titulo: 'Cotizaciones',
    descripcion: 'Cómo respondés a los clientes',
    icono: 'file-text',
    ajustes: [
      {
        id: 'tiempoRespuesta',
        tipo: 'opciones',
        icono: 'zap',
        label: 'Me comprometo a responder en',
        ayuda: 'Cumplirlo te da la insignia de Respuesta rápida',
        opciones: [
          { valor: 2, label: '2 horas' },
          { valor: 24, label: '1 día' },
          { valor: 72, label: '3 días' },
        ],
      },
      {
        id: 'montoMinimo',
        tipo: 'numero',
        icono: 'wallet',
        label: 'Monto mínimo de pedido',
        min: 0,
        max: 100000,
        sufijo: 'córdobas',
      },
      {
        id: 'respuestaAutomatica',
        tipo: 'switch',
        icono: 'message-circle',
        label: 'Responder automático fuera de horario',
        ayuda: 'Manda un "te respondo mañana a las 8" en vez de dejar al cliente esperando',
      },
    ],
  },
  {
    id: 'resenasNegocio',
    titulo: 'Reseñas',
    descripcion: 'Tu reputación en el directorio',
    icono: 'star',
    ajustes: [
      { id: 'avisoResenas', tipo: 'switch', icono: 'star', label: 'Avisarme de reseñas nuevas' },
    ],
  },
  GRUPO_NOTIFICACIONES_CANAL,
  GRUPO_APP,
  GRUPO_REGION,
  GRUPO_CUENTA,
  GRUPO_ACERCA,
]

/* ── Proveedor ───────────────────────────────────────────── */

const PROVEEDOR = [
  {
    id: 'perfilProveedor',
    titulo: 'Mi perfil público',
    descripcion: 'Lo que ve un negocio antes de pedirte cotización',
    icono: 'truck',
    ajustes: [
      {
        id: 'coberturaVisible',
        tipo: 'enlace',
        icono: 'map-pin',
        label: 'Municipios que cubro',
        ayuda: 'Sin esto no aparecés cuando un negocio filtra por su zona',
        ruta: '/perfil',
      },
      {
        id: 'formaPago',
        tipo: 'opciones',
        icono: 'wallet',
        label: 'Formas de pago que acepto',
        opciones: [
          { valor: 'contado', label: 'Contado' },
          { valor: 'credito15', label: 'Crédito 15 días' },
          { valor: 'ambas', label: 'Ambas' },
        ],
      },
      {
        id: 'catalogoPublico',
        tipo: 'opciones',
        icono: 'book-open',
        label: 'Quién ve mis precios',
        opciones: [
          { valor: 'todos', label: 'Todos' },
          { valor: 'registrados', label: 'Solo negocios' },
        ],
      },
    ],
  },
  {
    id: 'cotizacionesProveedor',
    titulo: 'Cotizaciones',
    descripcion: 'Qué solicitudes recibís y cómo respondés',
    icono: 'file-text',
    ajustes: [
      {
        id: 'recibirSolicitudes',
        tipo: 'switch',
        icono: 'inbox',
        label: 'Recibir solicitudes de cotización',
      },
      {
        id: 'validezCotizacion',
        tipo: 'opciones',
        icono: 'clock',
        label: 'Mis cotizaciones vencen a los',
        ayuda: 'Un precio de cemento de hace tres semanas ya no sirve',
        depende: 'recibirSolicitudes',
        opciones: [
          { valor: 7, label: '7 días' },
          { valor: 15, label: '15 días' },
          { valor: 30, label: '30 días' },
        ],
      },
      {
        id: 'pedidoMinimoProv',
        tipo: 'numero',
        icono: 'wallet',
        label: 'Pedido mínimo',
        depende: 'recibirSolicitudes',
        min: 0,
        max: 500000,
        sufijo: 'córdobas',
      },
      {
        id: 'plantillaCotizacion',
        tipo: 'switch',
        icono: 'edit-3',
        label: 'Usar mi plantilla guardada',
        ayuda: 'Carga solas tus condiciones habituales al cotizar',
        depende: 'recibirSolicitudes',
      },
    ],
  },
  {
    id: 'entregas',
    titulo: 'Entregas',
    descripcion: 'Para que el negocio sepa cuándo pedirte',
    icono: 'truck',
    ajustes: [
      {
        id: 'frecuenciaEntrega',
        tipo: 'opciones',
        icono: 'calendar',
        label: 'Salgo a repartir',
        opciones: [
          { valor: 'diario', label: 'A diario' },
          { valor: 'semanal', label: '2 veces por semana' },
          { valor: 'quincenal', label: 'Quincenal' },
        ],
      },
      {
        id: 'diasEntrega',
        tipo: 'enlace',
        icono: 'map-pin',
        label: 'Días de entrega por municipio',
        ayuda: 'Ej: a Nueva Guinea los martes y viernes',
        ruta: '/negocios-asociados',
      },
      {
        id: 'recordatorioCatalogo',
        tipo: 'opciones',
        icono: 'book-open',
        label: 'Recordarme actualizar catálogo',
        opciones: [
          { valor: 15, label: 'Cada 15 días' },
          { valor: 30, label: 'Cada mes' },
          { valor: 0, label: 'Nunca' },
        ],
      },
    ],
  },
  GRUPO_NOTIFICACIONES_CANAL,
  GRUPO_APP,
  GRUPO_REGION,
  GRUPO_CUENTA,
  GRUPO_ACERCA,
]

export const configPorRol = {
  usuario: CLIENTE,
  negocio: NEGOCIO,
  proveedor: PROVEEDOR,
}

// Encabezado de la pantalla: cambia de color y de texto segun el rol,
// igual que el hero del perfil.
export const cabeceraConfig = {
  usuario: {
    rol: 'Cliente',
    titulo: 'Configuración',
    subtitulo: 'Administrá tu privacidad, tus puntos y los avisos que recibís de Vincco.',
    acento: '#c05900',
  },
  negocio: {
    rol: 'Negocio',
    titulo: 'Configuración',
    subtitulo: 'Administrá tu vitrina, tu inventario y cómo respondés las cotizaciones.',
    acento: '#007a7b',
  },
  proveedor: {
    rol: 'Proveedor',
    titulo: 'Configuración',
    subtitulo: 'Administrá tu cobertura, tus cotizaciones y tus días de entrega.',
    acento: '#00374e',
  },
}
