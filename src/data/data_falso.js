import { numero, cordobasTexto, MONEDA } from '../utils/moneda'

export const usuario = {
  nombre: "Leslie",
  puntos: 340,
  nivel: "Bronce"
}

export const negocios = [
  { id: 1, nombre: "Ferretería Don Chico", categoria: "ferretería", rating: 4.8, puntos: 50 },
  { id: 2, nombre: "Pulpería La Esquina", categoria: "pulpería", rating: 4.2, puntos: 30 },
  { id: 3, nombre: "Agroservicios El Campo", categoria: "agro", rating: 4.5, puntos: 40 },
]

export const proveedores = [
  { id: 1, nombre: "Distribuidora Norte", categoria: "alimentos", rating: 4.7 },
  { id: 2, nombre: "Materiales La Unión", categoria: "construcción", rating: 4.3 },
]

export const categorias = [
  { id: 1, nombre: "Restaurantes", icono: "utensils" },
  { id: 2, nombre: "Ropa", icono: "shirt" },
  { id: 3, nombre: "Tiendas", icono: "store" },
  { id: 4, nombre: "Salud", icono: "heart" },
  { id: 5, nombre: "Tecnología", icono: "laptop" },
]

export const promociones = [
  { id: 1, badge: "Nuevo", categoria: "Restaurante", nombre: "La Cocina Nica", puntos: "2x puntos hoy", color: "#c05900" },
  { id: 2, badge: "Popular", categoria: "Ropa", nombre: "Boutique Alma", puntos: "150 pts por compra", color: "#00374e" },
  { id: 3, badge: "Limitado", categoria: "Cafetería", nombre: "Café del Barrio", puntos: "80 pts por visita", color: "#8f5a00" },
  { id: 4, badge: "Destacado", categoria: "Tecnología", nombre: "TechStore Managua", puntos: "500 pts por compra", color: "#005c5e" },
]

export const recompensas = [
  { id: 1, titulo: `Cupón de ${cordobasTexto(50)}`, puntos: 200, emoji: "ticket", descripcion: "Canjea por crédito en cualquier negocio afiliado", negocio: "Todos los afiliados", popular: true },
  { id: 2, titulo: "Café gratis", puntos: 80, emoji: "coffee", descripcion: "Disfruta un café artesanal en Café del Barrio", negocio: "Café del Barrio", popular: true },
  { id: 3, titulo: "Descuento 15%", puntos: 150, emoji: "tag", descripcion: "15% de descuento en productos seleccionados", negocio: "Boutique Alma", popular: false },
  { id: 4, titulo: "Entrada cine", puntos: 400, emoji: "film", descripcion: "Entrada doble para función de estreno", negocio: "Cinema Nueva Guinea", popular: false },
  { id: 5, titulo: "Cena romántica", puntos: 350, emoji: "utensils", descripcion: "Cena para dos en Soda Doña Mercedes", negocio: "Soda Doña Mercedes", popular: false },
  { id: 6, titulo: "Toolkit básico", puntos: 500, emoji: "tool", descripcion: "Kit de herramientas básicas en Ferretería Don Chico", negocio: "Ferretería Don Chico", popular: false },
]

export const niveles = [
  { nivel: "Bronce", puntosMin: 0, puntosMax: 199, color: "#cd7f32", icono: "shield" },
  { nivel: "Plata", puntosMin: 200, puntosMax: 499, color: "#a0aec0", icono: "shield" },
  { nivel: "Oro", puntosMin: 500, puntosMax: 999, color: "#fea02f", icono: "award" },
  { nivel: "VIP", puntosMin: 1000, puntosMax: Infinity, color: "#dd6600", icono: "crown" },
]

export const consejosPuntos = [
  { id: 1, icono: "map-pin", titulo: "Visita negocios afiliados", descripcion: "Gana puntos en cada compra en nuestros comercios locales" },
  { id: 2, icono: "star", titulo: "Deja reseñas", descripcion: "Califica tus compras y obtén 10 puntos por reseña" },
  { id: 3, icono: "gift", titulo: "Invita a un amigo", descripcion: "Gana 50 puntos por cada amigo que se registre" },
  { id: 4, icono: "calendar", titulo: "Promociones especiales", descripcion: "Puntos dobles en días seleccionados" },
]

export const pasosComoFunciona = [
  { id: 1, title: "Regístrate gratis", description: "Crea tu cuenta y empieza a ganar puntos desde tu primera compra." },
  { id: 2, title: "Compra local", description: "Visita tus negocios favoritos y acumula puntos por cada compra." },
  { id: 3, title: "Acumula puntos", description: "Gana puntos por cada compra y recomendación en la plataforma." },
  { id: 4, title: "Canjea tus recompensas", description: "Obten descuentos, experiencias y más con tus puntos acumulados." },
]

export const pasosNegocios = [
  { id: 1, title: "Regístrate como negocio", description: "Crea tu perfil comercial en minutos." },
  { id: 2, title: "Publica tus productos", description: "Muestra tu catálogo a miles de usuarios." },
  { id: 3, title: "Conecta con clientes", description: "Recibe visitas y genera lealtad con puntos." },
  { id: 4, title: "Aumenta tus ventas", description: "Haz crecer tu negocio con nuestro ecosistema." },
]

export const pasosProveedores = [
  { id: 1, title: "Regístrate como proveedor", description: "Únete a la red de proveedores VINCCO." },
  { id: 2, title: "Publica productos", description: "Ofrece tus productos a los negocios locales." },
  { id: 3, title: "Conecta con negocios", description: "Encuentra nuevos canales de distribución." },
  { id: 4, title: "Genera oportunidades", description: "Aumenta tus ventas con nuevos clientes comerciales." },
]

export const categoriasFavoritos = [
  "La soda", "La fonda", "El comedero", "La ferretería", "La farmacia",
  "Restaurante", "Repostería", "Salón de belleza", "Cafetería", "Ciber",
  "Ropa", "Zapatería", "Mueblería", "Tecnología", "Bar",
  "Costurería", "Veterinaria", "Floristería", "Carnicería",
]

export const negociosFavoritos = [
  { id: 1, nombre: "Soda Doña Mercedes", categoria: "La soda", icono: "coffee", direccion: "Barrio Monseñor Lezcano, Managua", rating: 4.6, descripcion: "Comida casera nicaragüense a precios accesibles, ambiente familiar." },
  { id: 2, nombre: "Fonda El Buen Sabor", categoria: "La fonda", icono: "utensils", direccion: "Reparto Schick, Managua", rating: 4.4, descripcion: "Almuerzos ejecutivos y platillos tradicionales todos los días." },
  { id: 3, nombre: "Ferretería Don Chico", categoria: "La ferretería", icono: "tool", direccion: "Mercado Roberto Huembes, Managua", rating: 4.8, descripcion: "Herramientas, materiales de construcción y asesoría técnica." },
  { id: 4, nombre: "Farmacia San Rafael", categoria: "La farmacia", icono: "heart", direccion: "Linda Vista, Managua", rating: 4.5, descripcion: "Medicamentos genéricos y de marca, atención las 24 horas." },
  { id: 5, nombre: "Repostería Dulce Encanto", categoria: "Repostería", icono: "gift", direccion: "Altamira, Managua", rating: 4.9, descripcion: "Pasteles, postres y repostería fina para toda ocasión." },
  { id: 6, nombre: "Salón Bella Imagen", categoria: "Salón de belleza", icono: "zap", direccion: "Bolonia, Managua", rating: 4.3, descripcion: "Cortes, tintes y tratamientos de belleza con estilistas certificados." },
  { id: 7, nombre: "Café del Barrio", categoria: "Cafetería", icono: "coffee", direccion: "Los Robles, Managua", rating: 4.7, descripcion: "Café de origen nicaragüense y repostería artesanal." },
  { id: 8, nombre: "Boutique Alma", categoria: "Ropa", icono: "shirt", direccion: "Plaza Inter, Managua", rating: 4.2, descripcion: "Moda femenina y accesorios de temporada." },
  { id: 9, nombre: "TechStore Managua", categoria: "Tecnología", icono: "smartphone", direccion: "Metrocentro, Managua", rating: 4.6, descripcion: "Celulares, accesorios y reparación de equipos electrónicos." },
  { id: 10, nombre: "Veterinaria PetCare", categoria: "Veterinaria", icono: "heart", direccion: "Villa Fontana, Managua", rating: 4.8, descripcion: "Consultas, vacunación y cuidado integral para tus mascotas." },
]

export const promocionesLimitadas = [
  { id: 1, titulo: "Semana de la Moda", descripcion: "Descuentos especiales en ropa" },
  { id: 2, titulo: "Happy Hour", descripcion: "2x1 en bebidas participantes" },
  { id: 3, titulo: "Tech Days", descripcion: "Ofertas en tecnología" },
]

export const categoriasNegocioAsociado = [
  "Pulpería", "Ferretería", "Farmacia", "Boutique", "Restaurante", "Cafetería", "Agroservicio", "Tecnología", "Otro",
]

export const negociosAsociados = [
  { id: 1, nombre: "Pulpería El Buen Precio", categoria: "Pulpería", propietario: "María Gutiérrez", whatsapp: "+505 8811 2233", correo: "pulperiabuenprecio@gmail.com", direccion: "Barrio San Pedro, contiguo a la escuela", municipio: "Nueva Guinea", departamento: "RACCS", descripcion: "Pulpería de barrio con productos de primera necesidad y abarrotes.", imagen: null, estado: "Activo", color: "#007a7b" },
  { id: 2, nombre: "Ferretería Central", categoria: "Ferretería", propietario: "Carlos Espinoza", whatsapp: "+505 8822 3344", correo: "ferreteriacentral@gmail.com", direccion: "Frente al parque central", municipio: "Nueva Guinea", departamento: "RACCS", descripcion: "Herramientas, materiales de construcción y accesorios eléctricos.", imagen: null, estado: "Activo", color: "#c05900" },
  { id: 3, nombre: "Farmacia San José", categoria: "Farmacia", propietario: "Ana Lucía Morales", whatsapp: "+505 8833 4455", correo: "farmaciasanjose@gmail.com", direccion: "Del mercado municipal, 1c al norte", municipio: "Nueva Guinea", departamento: "RACCS", descripcion: "Medicamentos genéricos y de marca, atención todos los días.", imagen: null, estado: "Pendiente", color: "#005c5e" },
  { id: 4, nombre: "Boutique Estilo", categoria: "Boutique", propietario: "Jennifer Rocha", whatsapp: "+505 8844 5566", correo: "boutiqueestilo@gmail.com", direccion: "Barrio Rigoberto López, calle principal", municipio: "Nueva Guinea", departamento: "RACCS", descripcion: "Ropa y accesorios de moda para toda la familia.", imagen: null, estado: "Activo", color: "#a34b00" },
  { id: 5, nombre: "Restaurante La Terraza", categoria: "Restaurante", propietario: "Roberto Sánchez", whatsapp: "+505 8855 6677", correo: "laterraza.restaurante@gmail.com", direccion: "Salida hacia El Rama, km 1", municipio: "Nueva Guinea", departamento: "RACCS", descripcion: "Comida típica nicaragüense y platillos a la carta.", imagen: null, estado: "Activo", color: "#dd6600" },
]

/* ── Centro de ayuda ──────────────────────────────────────── */

export const canalesSoporte = [
  {
    id: 'chat',
    icono: 'message-circle',
    titulo: 'Chat en vivo',
    descripcion: 'Habla con un agente en tiempo real para resolver tu problema al instante.',
    disponibilidad: 'Disponible 8AM - 6PM',
    accion: 'Iniciar chat',
    color: '#003f5a',
  },
  {
    id: 'correo',
    icono: 'mail',
    titulo: 'Correo electrónico',
    descripcion: 'Envía tu consulta detallada y recibirás respuesta en máximo 24 horas.',
    disponibilidad: 'Respuesta en 24h',
    accion: 'Enviar correo',
    color: '#005c5e',
    href: 'mailto:soporte@vincco.local',
  },
  {
    id: 'whatsapp',
    icono: 'smartphone',
    titulo: 'WhatsApp',
    descripcion: 'Mensaje instantáneo con nuestro equipo de soporte disponible.',
    disponibilidad: 'Disponible 8AM - 8PM',
    accion: 'Enviar mensaje',
    color: '#007a7b',
    href: 'https://wa.me/50557178100',
  },
  {
    id: 'llamada',
    icono: 'phone',
    titulo: 'Llamada telefónica',
    descripcion: 'Habla directamente con nuestro equipo de atención al cliente.',
    disponibilidad: 'Disponible 8AM - 6PM',
    accion: 'Llamar ahora',
    color: '#c05900',
    href: 'tel:+50557178100',
  },
]

export const rolesAyuda = [
  { id: 'usuarios', label: 'Usuarios', icono: 'users' },
  { id: 'comercios', label: 'Comercios', icono: 'store' },
  { id: 'proveedores', label: 'Proveedores', icono: 'truck' },
]

export const preguntasFrecuentes = {
  usuarios: [
    {
      id: 'u1',
      categoria: 'Cuenta',
      pregunta: '¿Cómo creo mi cuenta en Vincco?',
      respuesta: 'Descarga la app o entra desde la web, toca "Registrarme" y elige el perfil de Usuario. Solo necesitas tu nombre, un correo y un número de teléfono. La verificación llega por WhatsApp en menos de un minuto.',
    },
    {
      id: 'u2',
      categoria: 'Puntos',
      pregunta: '¿Cómo gano puntos en cada compra?',
      respuesta: 'Cada comercio afiliado tiene su propia tasa de puntos. Al pagar, muestra tu código de Vincco y el comercio lo registra. Los puntos aparecen en tu cuenta al instante y puedes verlos en la sección Mis Puntos.',
    },
    {
      id: 'u3',
      categoria: 'Puntos',
      pregunta: '¿Cómo canjeo mis puntos?',
      respuesta: 'Entra a Mis Puntos, elige la recompensa que quieras y toca Canjear. Se genera un código que mostrás en el comercio. Las recompensas no tienen fecha de vencimiento mientras el comercio siga activo en la plataforma.',
    },
    {
      id: 'u4',
      categoria: 'Puntos',
      pregunta: '¿Mis puntos se vencen?',
      respuesta: 'Los puntos se mantienen activos mientras uses tu cuenta al menos una vez cada 12 meses. Si pasa más de un año sin actividad, te avisamos por notificación antes de cualquier ajuste.',
    },
    {
      id: 'u5',
      categoria: 'Seguridad',
      pregunta: '¿Es segura mi información personal?',
      respuesta: 'Sí. Tus datos viajan cifrados y solo compartimos con los comercios la información mínima para validar tu compra. Nunca vendemos tu información a terceros y podés pedir que se elimine tu cuenta cuando quieras.',
    },
    {
      id: 'u6',
      categoria: 'Cuenta',
      pregunta: 'Olvidé mi contraseña, ¿qué hago?',
      respuesta: 'En la pantalla de inicio de sesión toca "Olvidé mi contraseña" y te enviamos un código al número registrado. Si ya no tenés acceso a ese número, escribinos por cualquiera de los canales de soporte.',
    },
  ],
  comercios: [
    {
      id: 'c1',
      categoria: 'Registro',
      pregunta: '¿Qué necesito para afiliar mi negocio?',
      respuesta: 'Registrate eligiendo el perfil de Comercio. Pedimos el nombre del negocio, la dirección, un número de WhatsApp y la categoría. No necesitás estar formalizado para empezar, pero sí para acceder al ranking mensual.',
    },
    {
      id: 'c2',
      categoria: 'Puntos',
      pregunta: '¿Cómo defino cuántos puntos doy por compra?',
      respuesta: 'Desde tu Panel de Negocio, en la sección de configuración de puntos, establecés cuántos puntos entregás por cada compra o por monto gastado. Podés cambiarlo cuando quieras y aplica desde la siguiente venta.',
    },
    {
      id: 'c3',
      categoria: 'Inventario',
      pregunta: '¿Cómo funcionan las alertas de stock?',
      respuesta: 'En Inventario cargás tus productos y definís un stock mínimo para cada uno. Cuando la cantidad baja de ese número, Vincco te manda una notificación para que puedas cotizar con tus proveedores a tiempo.',
    },
    {
      id: 'c4',
      categoria: 'Proveedores',
      pregunta: '¿Puedo cotizar con proveedores desde la app?',
      respuesta: 'Sí. En el directorio de proveedores elegís uno y le enviás una solicitud de cotización con los productos que necesitás. El proveedor responde desde su panel y te llega la respuesta como notificación.',
    },
    {
      id: 'c5',
      categoria: 'Publicaciones',
      pregunta: '¿Cómo publico una promoción?',
      respuesta: 'Desde Publicaciones creás una promoción con imagen, descripción y vigencia. Aparece en el inicio de los usuarios cercanos a tu negocio y en tu perfil dentro del directorio.',
    },
    {
      id: 'c6',
      categoria: 'Costos',
      pregunta: '¿Tiene algún costo estar en Vincco?',
      respuesta: 'El registro y las herramientas básicas de gestión son gratuitas. Más adelante habrá planes con funciones adicionales, pero siempre vas a poder seguir usando la versión gratuita.',
    },
  ],
  proveedores: [
    {
      id: 'p1',
      categoria: 'Registro',
      pregunta: '¿Cómo me registro como proveedor?',
      respuesta: 'Elegí el perfil de Proveedor al registrarte. Vas a necesitar el nombre de la empresa, las categorías de productos que distribuís y la zona de cobertura. Un miembro del equipo valida tu perfil antes de publicarlo.',
    },
    {
      id: 'p2',
      categoria: 'Negocios',
      pregunta: '¿Qué son los negocios asociados?',
      respuesta: 'Son los comercios a los que ya abastecés. Los agregás desde el menú, en Negocios Asociados, y con su consentimiento podés mostrarlos públicamente en tu perfil como respaldo de tu trayectoria.',
    },
    {
      id: 'p3',
      categoria: 'Cotizaciones',
      pregunta: '¿Cómo respondo una cotización?',
      respuesta: 'Cuando un comercio te solicita una cotización te llega una notificación. Desde tu panel ves los productos pedidos, cargás precios y disponibilidad, y enviás la respuesta. El comercio la recibe al instante.',
    },
    {
      id: 'p4',
      categoria: 'Reputación',
      pregunta: '¿Cómo construyo mi reputación en la plataforma?',
      respuesta: 'Tu posición en el ranking mensual depende de las reseñas de los comercios que abastecés, la rapidez con que respondés cotizaciones y la cantidad de negocios asociados verificados.',
    },
    {
      id: 'p5',
      categoria: 'Negocios',
      pregunta: '¿Puedo editar la información de un negocio asociado?',
      respuesta: 'Sí. En Negocios Asociados seleccioná el negocio y tocá el botón Editar. Podés actualizar contacto, dirección, descripción e imagen. Los cambios se guardan al instante.',
    },
    {
      id: 'p6',
      categoria: 'Cobertura',
      pregunta: '¿Puedo atender más de un municipio?',
      respuesta: 'Sí. En tu perfil definís todas las zonas donde distribuís. Los comercios de esos municipios te van a ver en su directorio de proveedores cercanos.',
    },
  ],
}

export const articulosAyuda = [
  {
    id: 'a1',
    icono: 'star',
    rol: 'Usuarios',
    minutos: 5,
    titulo: 'Cómo maximizar tus puntos Vincco',
    resumen: 'Estrategias y consejos para acumular puntos más rápido y aprovechar al máximo tu membresía.',
    color: '#fea02f',
  },
  {
    id: 'a2',
    icono: 'store',
    rol: 'Comercios',
    minutos: 12,
    titulo: 'Guía completa para comerciantes',
    resumen: 'Todo lo que necesitás saber para gestionar tu comercio en Vincco y aumentar tus ventas.',
    color: '#007a7b',
  },
  {
    id: 'a3',
    icono: 'package',
    rol: 'Comercios',
    minutos: 8,
    titulo: 'Conectar tu inventario automáticamente',
    resumen: 'Sincronizá tu inventario en tiempo real y mantené tu stock siempre actualizado.',
    color: '#003f5a',
  },
  {
    id: 'a4',
    icono: 'megaphone',
    rol: 'Comercios',
    minutos: 6,
    titulo: 'Crear promociones efectivas',
    resumen: 'Tips para diseñar ofertas que atraigan clientes y aumenten tu conversión.',
    color: '#c05900',
  },
  {
    id: 'a5',
    icono: 'file-text',
    rol: 'Proveedores',
    minutos: 7,
    titulo: 'Cómo cotizar en Vincco',
    resumen: 'Proceso paso a paso para responder cotizaciones y cerrar negocios con comercios.',
    color: '#005c5e',
  },
  {
    id: 'a6',
    icono: 'award',
    rol: 'Proveedores',
    minutos: 6,
    titulo: 'Construir tu reputación',
    resumen: 'Estrategias para obtener reseñas positivas y aumentar tu credibilidad en la plataforma.',
    color: '#8f5a00',
  },
]

/* ── Redes sociales ───────────────────────────────────────── */

// Cuentas oficiales de Vincco. Cambiar por las reales antes de publicar.
export const redesVincco = [
  { id: 'facebook', usuario: 'vinccolocal', url: 'https://facebook.com/vinccolocal', seguidores: '2.4k' },
  { id: 'instagram', usuario: 'vinccolocal', url: 'https://instagram.com/vinccolocal', seguidores: '1.8k' },
  { id: 'whatsapp', usuario: '+505 5717 8100', url: 'https://wa.me/50557178100', seguidores: 'Canal' },
  { id: 'tiktok', usuario: 'vinccolocal', url: 'https://tiktok.com/@vinccolocal', seguidores: '960' },
  { id: 'youtube', usuario: 'vinccolocal', url: 'https://youtube.com/@vinccolocal', seguidores: '340' },
  { id: 'threads', usuario: 'vinccolocal', url: 'https://threads.net/@vinccolocal', seguidores: '210' },
]

export const tiposConsulta = [
  'Problema técnico',
  'Puntos y recompensas',
  'Mi cuenta',
  'Comercios',
  'Proveedores',
  'Alianzas',
  'Otro',
]

export const destacadas = [
  { id: 1, titulo: "Boutique Alma", descripcion: "Colección de temporada con los looks más pedidos por nuestras clientas.", categoria: "Ropa", likes: 128 },
  { id: 2, titulo: "Café del Barrio", descripcion: "El café de origen nicaragüense favorito del barrio, ahora con nueva carta.", categoria: "Cafetería", likes: 96 },
  { id: 3, titulo: "TechStore Managua", descripcion: "Los accesorios tecnológicos más buscados de la semana.", categoria: "Tecnología", likes: 74 },
]

/* ── Perfil ───────────────────────────────────────────────── */

// Cada rol tiene su propia ficha porque la informacion que importa
// es distinta: al cliente le interesan sus puntos, al comercio su
// ficha publica y ventas, al proveedor su cobertura y cotizaciones.

// Campos editables del perfil, por rol. El tipo define que input
// se dibuja y "ancho" marca los que ocupan la fila completa.
export const camposPerfil = {
  // "privado: true" = el boton de ojo del perfil esconde este campo.
  // El nombre no se marca porque ya sale en grande en el encabezado.
  usuario: [
    { id: 'nombre', label: 'Nombre completo', tipo: 'text', icono: 'user' },
    { id: 'telefono', label: 'Teléfono', tipo: 'tel', icono: 'smartphone', privado: true },
    { id: 'correo', label: 'Correo electrónico', tipo: 'email', icono: 'mail', ancho: true, privado: true },
    { id: 'municipio', label: 'Municipio', tipo: 'text', icono: 'map-pin', privado: true },
    { id: 'barrio', label: 'Barrio o zona', tipo: 'text', icono: 'home', privado: true },
  ],
  negocio: [
    { id: 'nombre', label: 'Nombre del negocio', tipo: 'text', icono: 'store' },
    { id: 'categoria', label: 'Categoría', tipo: 'text', icono: 'tag' },
    { id: 'propietario', label: 'Propietario', tipo: 'text', icono: 'user' },
    { id: 'telefono', label: 'Teléfono / WhatsApp', tipo: 'tel', icono: 'smartphone' },
    { id: 'correo', label: 'Correo electrónico', tipo: 'email', icono: 'mail' },
    { id: 'ruc', label: 'RUC o cédula', tipo: 'text', icono: 'file-text' },
    { id: 'direccion', label: 'Dirección', tipo: 'text', icono: 'map-pin', ancho: true },
    { id: 'descripcion', label: 'Descripción del negocio', tipo: 'textarea', icono: 'book-open', ancho: true },
  ],
  proveedor: [
    { id: 'nombre', label: 'Nombre de la empresa', tipo: 'text', icono: 'truck' },
    { id: 'categoria', label: 'Rubro que abastece', tipo: 'text', icono: 'box' },
    { id: 'contacto', label: 'Persona de contacto', tipo: 'text', icono: 'user' },
    { id: 'telefono', label: 'Teléfono / WhatsApp', tipo: 'tel', icono: 'smartphone' },
    { id: 'correo', label: 'Correo electrónico', tipo: 'email', icono: 'mail' },
    { id: 'ruc', label: 'RUC', tipo: 'text', icono: 'file-text' },
    { id: 'cobertura', label: 'Zona de cobertura', tipo: 'text', icono: 'map-pin', ancho: true },
    { id: 'descripcion', label: 'Qué distribuye', tipo: 'textarea', icono: 'book-open', ancho: true },
  ],
}

// Bloque de metricas que encabeza cada perfil.
export const metricasPerfil = {
  usuario: [
    { id: 'compras', icono: 'shopping-bag', valor: '34', label: 'Compras con Vincco', detalle: '6 este mes' },
    // Los montos van SIEMPRE en cordobas nicaraguenses, nunca en dolares.
    // Se escribe la palabra completa ("1,240 córdobas") y no el simbolo,
    // porque "C$" se lee como dolar canadiense.
    { id: 'ahorro', icono: 'wallet', valor: numero(1240), unidad: MONEDA.nombrePlural, label: 'Ahorrado en canjes', detalle: 'desde marzo' },
    { id: 'favoritos', icono: 'heart', valor: '12', label: 'Negocios favoritos', detalle: '3 nuevos', enlace: '/favoritos', enlaceLabel: 'Ver favoritos' },
    { id: 'canjes', icono: 'gift', valor: '7', label: 'Recompensas canjeadas', detalle: '1 pendiente' },
  ],
  negocio: [
    { id: 'ventas', icono: 'trending-up', valor: numero(48600), unidad: MONEDA.nombrePlural, label: 'Ventas del mes', detalle: '+18% vs. julio' },
    { id: 'clientes', icono: 'users', valor: '186', label: 'Clientes con puntos', detalle: '24 nuevos' },
    { id: 'ranking', icono: 'award', valor: '#3', label: 'Ranking de ferreterías', detalle: 'subió 2 puestos' },
    { id: 'resenas', icono: 'star', valor: '4.8', label: 'Calificación', detalle: '52 reseñas' },
  ],
  proveedor: [
    { id: 'negocios', icono: 'store', valor: '23', label: 'Negocios abastecidos', detalle: '4 este trimestre' },
    { id: 'cotizaciones', icono: 'file-text', valor: '68', label: 'Cotizaciones enviadas', detalle: '9 pendientes' },
    { id: 'aceptacion', icono: 'check-circle', valor: '74%', label: 'Tasa de aceptación', detalle: '+6% vs. julio' },
    { id: 'entregas', icono: 'truck', valor: '96%', label: 'Entregas a tiempo', detalle: 'último trimestre' },
  ],
}

// Insignias: logros visibles en la ficha, distintos por rol.
export const insigniasPerfil = {
  usuario: [
    { id: 'u1', icono: 'medal', label: 'Cliente frecuente', descripcion: '20+ compras registradas', activa: true },
    { id: 'u2', icono: 'flame', label: 'Racha de 4 semanas', descripcion: 'Compraste local 4 semanas seguidas', activa: true },
    { id: 'u3', icono: 'users', label: 'Embajador', descripcion: 'Invitá a 5 personas para desbloquearla', activa: false },
  ],
  negocio: [
    { id: 'n1', icono: 'check-circle', label: 'Negocio verificado', descripcion: 'Documentación validada por Vincco', activa: true },
    { id: 'n2', icono: 'zap', label: 'Respuesta rápida', descripcion: 'Responde cotizaciones en menos de 2 horas', activa: true },
    { id: 'n3', icono: 'crown', label: 'Top 3 del mes', descripcion: 'Entre los mejores de su categoría', activa: true },
    { id: 'n4', icono: 'shield', label: 'Formalizado', descripcion: 'Subí tu RUC para desbloquearla', activa: false },
  ],
  proveedor: [
    { id: 'p1', icono: 'check-circle', label: 'Proveedor verificado', descripcion: 'Documentación validada por Vincco', activa: true },
    { id: 'p2', icono: 'truck', label: 'Entrega puntual', descripcion: '95%+ de entregas a tiempo', activa: true },
    { id: 'p3', icono: 'handshake', label: 'Aliado del año', descripcion: 'Abastecé 30 negocios para desbloquearla', activa: false },
  ],
}

// Ultimos movimientos de la cuenta. El campo "tono" pinta el punto
// de color de la linea de tiempo.
export const actividadPerfil = {
  usuario: [
    { id: 'a1', icono: 'gift', tono: 'positivo', titulo: 'Canjeaste Café gratis', detalle: 'Café del Barrio · -80 pts', fecha: 'Hoy, 10:24' },
    { id: 'a2', icono: 'shopping-bag', tono: 'neutro', titulo: 'Compra registrada', detalle: 'Ferretería Don Chico · +50 pts', fecha: 'Ayer, 16:40' },
    { id: 'a3', icono: 'star', tono: 'neutro', titulo: 'Dejaste una reseña', detalle: 'Agroservicios El Campo · 5 estrellas', fecha: '29 jul, 09:15' },
    { id: 'a4', icono: 'award', tono: 'positivo', titulo: 'Subiste a nivel Plata', detalle: 'Alcanzaste los 200 puntos', fecha: '24 jul, 12:02' },
    { id: 'a5', icono: 'heart', tono: 'neutro', titulo: 'Agregaste un favorito', detalle: 'Boutique Alma', fecha: '21 jul, 18:30' },
  ],
  negocio: [
    { id: 'b1', icono: 'mail', tono: 'alerta', titulo: 'Cotización recibida', detalle: 'Cliente pidió precio de 12 productos', fecha: 'Hoy, 11:05' },
    { id: 'b2', icono: 'package', tono: 'alerta', titulo: 'Stock bajo', detalle: 'Cemento Holcim: 8 unidades', fecha: 'Hoy, 08:30' },
    { id: 'b3', icono: 'star', tono: 'positivo', titulo: 'Nueva reseña de 5 estrellas', detalle: '"Buen precio y atención" — María G.', fecha: 'Ayer, 17:12' },
    { id: 'b4', icono: 'truck', tono: 'neutro', titulo: 'Pedido a proveedor confirmado', detalle: 'Distribuidora Norte · entrega el jueves', fecha: '30 jul, 14:20' },
    { id: 'b5', icono: 'award', tono: 'positivo', titulo: 'Subiste en el ranking', detalle: 'Del puesto #5 al #3 en ferreterías', fecha: '28 jul, 09:00' },
  ],
  proveedor: [
    { id: 'c1', icono: 'mail', tono: 'alerta', titulo: 'Solicitud de cotización', detalle: 'Ferretería Don Chico · 8 productos', fecha: 'Hoy, 09:47' },
    { id: 'c2', icono: 'check-circle', tono: 'positivo', titulo: 'Cotización aceptada', detalle: `Materiales La Unión · ${cordobasTexto(32400)}`, fecha: 'Ayer, 15:03' },
    { id: 'c3', icono: 'truck', tono: 'neutro', titulo: 'Pedido en tránsito', detalle: 'Pedido #1023 · llega mañana', fecha: 'Ayer, 07:15' },
    { id: 'c4', icono: 'store', tono: 'positivo', titulo: 'Nuevo negocio abastecido', detalle: 'Pulpería La Esquina se sumó', fecha: '29 jul, 13:40' },
    { id: 'c5', icono: 'dollar-sign', tono: 'neutro', titulo: 'Catálogo actualizado', detalle: '14 precios modificados', fecha: '26 jul, 10:10' },
  ],
}

// Horario de atencion: solo aplica a negocio y proveedor.
export const horarioPerfil = [
  { dia: 'Lunes a viernes', horas: '7:00 AM - 6:00 PM', abierto: true },
  { dia: 'Sábado', horas: '7:00 AM - 4:00 PM', abierto: true },
  { dia: 'Domingo', horas: 'Cerrado', abierto: false },
]

// Negocios que el cliente marco como favoritos (vista resumida).
export const favoritosPerfil = [
  { id: 1, nombre: 'Ferretería Don Chico', categoria: 'Ferretería', puntos: '50 pts', color: '#c05900' },
  { id: 2, nombre: 'Café del Barrio', categoria: 'Cafetería', puntos: '80 pts', color: '#8f5a00' },
  { id: 3, nombre: 'Boutique Alma', categoria: 'Ropa', puntos: '150 pts', color: '#00374e' },
  { id: 4, nombre: 'Agroservicios El Campo', categoria: 'Agro', puntos: '40 pts', color: '#005c5e' },
]

// Ultimas reseñas que recibio el comercio.
export const resenasPerfil = [
  { id: 1, autor: 'María Gutiérrez', estrellas: 5, texto: 'Buen precio y siempre tienen lo que busco. La atención es rápida.', fecha: 'hace 2 días' },
  { id: 2, autor: 'Carlos Espinoza', estrellas: 5, texto: 'Me resolvieron una compra grande sin problema. Recomendado.', fecha: 'hace 1 semana' },
  { id: 3, autor: 'Ana Lucía Morales', estrellas: 4, texto: 'Todo bien, aunque los sábados se llena bastante.', fecha: 'hace 2 semanas' },
]

// Rubros que el proveedor distribuye, con su nivel de stock.
export const lineasProveedor = [
  { id: 1, nombre: 'Cemento y agregados', negocios: 14, stock: 'alto' },
  { id: 2, nombre: 'Hierro y varilla', negocios: 11, stock: 'medio' },
  { id: 3, nombre: 'Herramienta manual', negocios: 9, stock: 'alto' },
  { id: 4, nombre: 'Material eléctrico', negocios: 6, stock: 'bajo' },
]
