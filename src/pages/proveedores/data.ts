// ── Datos de ejemplo del módulo Proveedores ────────────────────
// Sin backend: este archivo es el piso de datos. El día que exista
// API, los catálogos y solicitudes pasan a GET/POST y las pantallas
// no se enteran.

export type Disponibilidad = 'disponible' | 'ocupado' | 'nuevo'
export type TipoNegocio = 'Mayorista' | 'Minorista' | 'Servicios'

export interface ProductoProveedor {
  id: string
  nombre: string
  categoria: string
  precio: number
  unidad: string
}

export interface ResenaProveedor {
  id: string
  autor: string
  rating: number
  fecha: string
  texto: string
}

export interface Proveedor {
  id: string
  nombre: string
  categoria: string
  tipo: TipoNegocio
  // Ubicación para mostrar: "Ciudad, Departamento" (ej: "Nueva Guinea, RACCS").
  ubicacion: string
  // Departamento y municipio reales para el filtro por ubicación.
  departamento: string
  municipio: string
  descripcion: string
  rating: number
  resenasCount: number
  verificado: boolean
  disponibilidad: Disponibilidad
  // Score de confianza Vincco: sello propio de la plataforma,
  // combina verificacion, historial y cumplimiento de entregas.
  confianza: number
  color: string // tono del avatar (iniciales)
  contacto: { correo: string; telefono: string; sitio: string }
  miembroDesde: string
  productos: ProductoProveedor[]
  resenas: ResenaProveedor[]
  tags: string[]
}

export const CATEGORIAS = [
  'Alimentos',
  'Tecnología',
  'Papelería',
  'Textil',
  'Ferretería',
  'Construcción',
  'Agro',
  'Limpieza',
] as const

export const TIPOS_NEGOCIO: Array<TipoNegocio | 'todos'> = ['todos', 'Mayorista', 'Minorista', 'Servicios']

export const PROVEEDORES: Proveedor[] = [
  {
    id: 'prov-01',
    nombre: 'Distribuidora del Norte',
    categoria: 'Alimentos',
    tipo: 'Mayorista',
    ubicacion: 'Managua, Managua',
    departamento: 'Managua',
    municipio: 'Managua',
    descripcion: 'Abasto mayorista de granos básicos, lácteos y enlatados con cadena de frío propia y entregas a 24 horas.',
    rating: 4.8,
    resenasCount: 132,
    verificado: true,
    disponibilidad: 'disponible',
    confianza: 98,
    color: '#0F2C59',
    contacto: { correo: 'ventas@distnorte.com.ni', telefono: '+505 8801 2345', sitio: 'distribuidoradelnorte.com.ni' },
    miembroDesde: 'marzo 2025',
    productos: [
      { id: 'p1', nombre: 'Arroz Premium 50kg', categoria: 'Granos', precio: 14.5, unidad: 'saco' },
      { id: 'p2', nombre: 'Frijol negro 45kg', categoria: 'Granos', precio: 18.2, unidad: 'saco' },
      { id: 'p3', nombre: 'Aceite vegetal 20L', categoria: 'Abarrotes', precio: 32.0, unidad: 'bidón' },
      { id: 'p4', nombre: 'Leche entera UHT 1L ×12', categoria: 'Lácteos', precio: 21.6, unidad: 'caja' },
    ],
    resenas: [
      { id: 'r1', autor: 'Supermercado El Refugio', rating: 5, fecha: 'hace 2 días', texto: 'Precios estables y nunca nos ha fallado una entrega. Referencia en la región.' },
      { id: 'r2', autor: 'Ferretería San Marcos', rating: 4, fecha: 'hace 3 semanas', texto: 'Muy buen surtido de abarrotes; a veces demoran con facturas, pero todo llega bien.' },
      { id: 'r3', autor: 'Pulpería La Bendición', rating: 5, fecha: 'hace 1 mes', texto: 'El trato es directo y los precios de mayorista se notan. Recomendados.' },
    ],
    tags: ['Entrega 24h', 'Cadena de frío', 'Crédito 15 días'],
  },
  {
    id: 'prov-02',
    nombre: 'Suministros García',
    categoria: 'Ferretería',
    tipo: 'Mayorista',
    ubicacion: 'Matagalpa, Matagalpa',
    departamento: 'Matagalpa',
    municipio: 'Matagalpa',
    descripcion: 'Herramientas, fijaciones y materiales de ferretería para obra y comercio. Surtido completo con precio por volumen.',
    rating: 4.6,
    resenasCount: 98,
    verificado: true,
    disponibilidad: 'disponible',
    confianza: 95,
    color: '#B98F2F',
    contacto: { correo: 'pedidos@suministrosgarcia.com.ni', telefono: '+505 8802 3456', sitio: 'suministrosgarcia.com.ni' },
    miembroDesde: 'junio 2025',
    productos: [
      { id: 'p1', nombre: 'Martillo cuadrante 600g', categoria: 'Herramientas', precio: 6.8, unidad: 'unidad' },
      { id: 'p2', nombre: 'Cemento gris CPC 40kg', categoria: 'Materiales', precio: 7.2, unidad: 'saco' },
      { id: 'p3', nombre: 'Tornillería mixta 10kg', categoria: 'Fijaciones', precio: 24.0, unidad: 'caja' },
      { id: 'p4', nombre: 'Taladro percutor 650W', categoria: 'Herramientas', precio: 58.0, unidad: 'unidad' },
    ],
    resenas: [
      { id: 'r1', autor: 'Constructora Veyra', rating: 5, fecha: 'hace 5 días', texto: 'El albarán siempre cuadra con lo pedido. Los créditos por volumen ayudan mucho.' },
      { id: 'r2', autor: 'Ferretería Don Chico', rating: 4, fecha: 'hace 2 semanas', texto: 'Buen surtido de herrajes, los pedidos chicos tardan un poco más.' },
    ],
    tags: ['Precio por volumen', 'Facturación local', 'Entrega a obra'],
  },
  {
    id: 'prov-03',
    nombre: 'TechPro Nicaragua',
    categoria: 'Tecnología',
    tipo: 'Servicios',
    ubicacion: 'León, León',
    departamento: 'León',
    municipio: 'León',
    descripcion: 'Distribución de equipos de cómputo, redes y punto de venta, con soporte técnico incluido para comercios.',
    rating: 4.7,
    resenasCount: 74,
    verificado: true,
    disponibilidad: 'ocupado',
    confianza: 92,
    color: '#14356E',
    contacto: { correo: 'ventas@techpromi.com.ni', telefono: '+505 8803 4567', sitio: 'techpromi.com.ni' },
    miembroDesde: 'enero 2026',
    productos: [
      { id: 'p1', nombre: 'Impresora térmica 80mm', categoria: 'POS', precio: 45.0, unidad: 'unidad' },
      { id: 'p2', nombre: 'Router dual band AC1200', categoria: 'Redes', precio: 28.5, unidad: 'unidad' },
      { id: 'p3', nombre: 'Lector de código QR', categoria: 'POS', precio: 12.0, unidad: 'unidad' },
    ],
    resenas: [
      { id: 'r1', autor: 'Café del Barrio', rating: 5, fecha: 'hace 1 semana', texto: 'Nos armaron todo el punto de venta y el soporte responde el mismo día.' },
      { id: 'r2', autor: 'Minimarket Express', rating: 4, fecha: 'hace 1 mes', texto: 'Buenos precios de hardware; la instalación se cobra aparte.' },
    ],
    tags: ['Soporte en sitio', 'Garantía 12 meses', 'Financiamiento'],
  },
  {
    id: 'prov-04',
    nombre: 'Papelería Central',
    categoria: 'Papelería',
    tipo: 'Minorista',
    ubicacion: 'Estelí, Estelí',
    departamento: 'Estelí',
    municipio: 'Estelí',
    descripcion: 'Útiles escolares, papelería comercial y suministros de oficina con reposición semanal y descuentos por caja.',
    rating: 4.5,
    resenasCount: 61,
    verificado: true,
    disponibilidad: 'disponible',
    confianza: 90,
    color: '#1B468C',
    contacto: { correo: 'ventas@papeleriacentral.com.ni', telefono: '+505 8804 5678', sitio: 'papeleriacentral.com.ni' },
    miembroDesde: 'septiembre 2025',
    productos: [
      { id: 'p1', nombre: 'Resma carta 500 hojas', categoria: 'Papel', precio: 4.2, unidad: 'resma' },
      { id: 'p2', nombre: 'Bolígrafo azul ×50', categoria: 'Escritura', precio: 11.5, unidad: 'caja' },
      { id: 'p3', nombre: 'Cuaderno profesional ×10', categoria: 'Escolar', precio: 15.0, unidad: 'paquete' },
    ],
    resenas: [
      { id: 'r1', autor: 'Colegio San José', rating: 5, fecha: 'hace 3 días', texto: 'Atención rápida y los precios por caja sí rinden para el ciclo escolar.' },
    ],
    tags: ['Reposición semanal', 'Pedidos escolares'],
  },
  {
    id: 'prov-05',
    nombre: 'Textiles del Valle',
    categoria: 'Textil',
    tipo: 'Mayorista',
    ubicacion: 'Masaya, Masaya',
    departamento: 'Masaya',
    municipio: 'Masaya',
    descripcion: 'Telas, hilos e insumos para costura al mayoreo. Despacho en 48 horas a todo el país.',
    rating: 4.3,
    resenasCount: 45,
    verificado: false,
    disponibilidad: 'disponible',
    confianza: 86,
    color: '#A87F28',
    contacto: { correo: 'pedidos@textilesdelvalle.com.ni', telefono: '+505 8805 6789', sitio: 'textilesdelvalle.com.ni' },
    miembroDesde: 'noviembre 2025',
    productos: [
      { id: 'p1', nombre: 'Tela jersey algodón (rollo 45m)', categoria: 'Telas', precio: 96.0, unidad: 'rollo' },
      { id: 'p2', nombre: 'Hilo poliéster ×24', categoria: 'Insumos', precio: 18.0, unidad: 'caja' },
    ],
    resenas: [
      { id: 'r1', autor: 'Costura Doña Mela', rating: 4, fecha: 'hace 2 semanas', texto: 'La tela es buena y el precio justo. Podrían mejorar la comunicación de envíos.' },
    ],
    tags: ['Despacho 48h', 'Cortes a medida'],
  },
  {
    id: 'prov-06',
    nombre: 'Grupo Alimentario La Esperanza',
    categoria: 'Alimentos',
    tipo: 'Mayorista',
    ubicacion: 'Chinandega, Chinandega',
    departamento: 'Chinandega',
    municipio: 'Chinandega',
    descripcion: 'Productos de despensa, bebidas y conservas para tiendas y restaurantes. Rutas de reparto fijas semanales.',
    rating: 4.9,
    resenasCount: 156,
    verificado: true,
    disponibilidad: 'nuevo',
    confianza: 99,
    color: '#0B2348',
    contacto: { correo: 'ventas@laesperanza.com.ni', telefono: '+505 8806 7890', sitio: 'grupoesperanza.com.ni' },
    miembroDesde: 'febrero 2026',
    productos: [
      { id: 'p1', nombre: 'Refrescos surtidos ×24', categoria: 'Bebidas', precio: 18.6, unidad: 'caja' },
      { id: 'p2', nombre: 'Atún en lata ×48', categoria: 'Conservas', precio: 54.0, unidad: 'caja' },
      { id: 'p3', nombre: 'Harina de trigo 25kg', categoria: 'Granos', precio: 16.8, unidad: 'saco' },
    ],
    resenas: [
      { id: 'r1', autor: 'Restaurante La Fonda', rating: 5, fecha: 'hace 4 días', texto: 'Rutas fijas que nunca fallan. Se volvieron nuestro principal proveedor.' },
      { id: 'r2', autor: 'Tienda La Esquina', rating: 5, fecha: 'hace 2 semanas', texto: 'Excelente variedad y el repartidor es puntual.' },
    ],
    tags: ['Ruta fija', 'Nuevo en Vincco', '1ra entrega gratis'],
  },
  {
    id: 'prov-07',
    nombre: 'Distribuidora AgroSan Pablo',
    categoria: 'Agro',
    tipo: 'Mayorista',
    ubicacion: 'Jinotega, Jinotega',
    departamento: 'Jinotega',
    municipio: 'Jinotega',
    descripcion: 'Insumos agrícolas: semillas, fertilizantes y agroquímicos con registro oficial y asesoría técnica.',
    rating: 4.4,
    resenasCount: 38,
    verificado: true,
    disponibilidad: 'disponible',
    confianza: 88,
    color: '#14356E',
    contacto: { correo: 'agro@agrosanpablo.com.ni', telefono: '+505 8807 8901', sitio: 'agrosanpablo.com.ni' },
    miembroDesde: 'octubre 2025',
    productos: [
      { id: 'p1', nombre: 'Fertilizante NPK 16-16-16 (50kg)', categoria: 'Fertilizantes', precio: 22.0, unidad: 'saco' },
      { id: 'p2', nombre: 'Semilla de maíz híbrida (10kg)', categoria: 'Semillas', precio: 34.0, unidad: 'bolsa' },
    ],
    resenas: [
      { id: 'r1', autor: 'Vivero El Rosal', rating: 5, fecha: 'hace 1 semana', texto: 'Asesoría técnica real, no solo venden: te explican la dosis.' },
    ],
    tags: ['Asesoría técnica', 'Registro oficial'],
  },
  {
    id: 'prov-08',
    nombre: 'Comercializadora Pacífico',
    categoria: 'Limpieza',
    tipo: 'Mayorista',
    ubicacion: 'Granada, Granada',
    departamento: 'Granada',
    municipio: 'Granada',
    descripcion: 'Línea completa de aseo industrial y doméstico: químicos concentrados, dispensadores y pañuelos.',
    rating: 4.2,
    resenasCount: 29,
    verificado: false,
    disponibilidad: 'ocupado',
    confianza: 83,
    color: '#2357A6',
    contacto: { correo: 'ventas@pacifico.com.ni', telefono: '+505 8808 9012', sitio: 'comercializadorapacifico.com.ni' },
    miembroDesde: 'julio 2025',
    productos: [
      { id: 'p1', nombre: 'Limpiapisos concentrado 5L', categoria: 'Químicos', precio: 9.5, unidad: 'garrafa' },
      { id: 'p2', nombre: 'Aromatizante dispensador ×12', categoria: 'Accesorios', precio: 27.0, unidad: 'caja' },
    ],
    resenas: [
      { id: 'r1', autor: 'Hotel Bahía Dorada', rating: 4, fecha: 'hace 1 mes', texto: 'Buen rendimiento del químico concentrado; el surtido de dispensadores es completo.' },
    ],
    tags: ['Químicos certificados', 'Áreas comunes'],
  },
  {
    id: 'prov-09',
    nombre: 'Imprenta Moderna',
    categoria: 'Papelería',
    tipo: 'Servicios',
    ubicacion: 'Jinotepe, Carazo',
    departamento: 'Carazo',
    municipio: 'Jinotepe',
    descripcion: 'Impresión comercial: tarjetas, volantes, empaques y papelería corporativa con acabados de alta calidad.',
    rating: 4.7,
    resenasCount: 52,
    verificado: true,
    disponibilidad: 'nuevo',
    confianza: 91,
    color: '#A87F28',
    contacto: { correo: 'hola@imprentamoderna.com.ni', telefono: '+505 8809 0123', sitio: 'imprentamoderna.com.ni' },
    miembroDesde: 'diciembre 2025',
    productos: [
      { id: 'p1', nombre: 'Tarjetas de presentación ×500', categoria: 'Impresión', precio: 25.0, unidad: 'lote' },
      { id: 'p2', nombre: 'Volantes full color ×1000', categoria: 'Impresión', precio: 40.0, unidad: 'lote' },
    ],
    resenas: [
      { id: 'r1', autor: 'Estudio Contable Torres', rating: 5, fecha: 'hace 6 días', texto: 'Acabados impecables y entrega antes de lo prometido.' },
    ],
    tags: ['Diseño incluido', 'Entrega express'],
  },
]

// ── Solicitudes de asociación ──────────────────────────────────

export type EstadoSolicitud = 'pendiente' | 'aceptada' | 'rechazada' | 'cancelada'
export type TipoSolicitud = 'enviada' | 'recibida' | 'historial'

export interface Solicitud {
  id: string
  tipo: TipoSolicitud
  proveedorNombre: string
  proveedorCategoria: string
  proveedorColor: string
  asunto: string
  mensaje: string
  fecha: string
  estado: EstadoSolicitud
  // Etapa del recorrido: 1 enviada, 2 en revisión, 3 respondida.
  etapa: number
}

export const ETAPAS = ['Enviada', 'En revisión', 'Respuesta']

export const ASUNTOS = [
  'Solicitud de cotización',
  'Acuerdo de suministro',
  'Compra por volumen',
  'Alianza comercial',
  'Otro',
]

export const SOLICITUDES_INICIALES: Solicitud[] = [
  {
    id: 'sol-01',
    tipo: 'enviada',
    proveedorNombre: 'Distribuidora del Norte',
    proveedorCategoria: 'Alimentos',
    proveedorColor: '#0F2C59',
    asunto: 'Acuerdo de suministro',
    mensaje: 'Buscamos un proveedor estable para nuestra sucursal central. Necesitamos cotización semanal de granos y lácteos.',
    fecha: 'hace 1 día',
    estado: 'pendiente',
    etapa: 2,
  },
  {
    id: 'sol-02',
    tipo: 'enviada',
    proveedorNombre: 'Suministros García',
    proveedorCategoria: 'Ferretería',
    proveedorColor: '#B98F2F',
    asunto: 'Solicitud de cotización',
    mensaje: 'Estimados, requerimos listado de precios por volumen para herramientas y cemento. ¿Manejan crédito?',
    fecha: 'hace 3 días',
    estado: 'aceptada',
    etapa: 3,
  },
  {
    id: 'sol-03',
    tipo: 'enviada',
    proveedorNombre: 'TechPro Latinoamérica',
    proveedorCategoria: 'Tecnología',
    proveedorColor: '#14356E',
    asunto: 'Compra por volumen',
    mensaje: 'Nos interesa equipar nuestro punto de venta con impresoras térmicas y lectores QR. ¿Cuál es su mínimo de compra?',
    fecha: 'hace 5 días',
    estado: 'rechazada',
    etapa: 3,
  },
  {
    id: 'sol-04',
    tipo: 'recibida',
    proveedorNombre: 'Grupo Alimentario La Esperanza',
    proveedorCategoria: 'Alimentos',
    proveedorColor: '#0B2348',
    asunto: 'Alianza comercial',
    mensaje: 'Tenemos disponibilidad de rutas en tu zona y nos gustaría incluir tu negocio en nuestro circuito semanal.',
    fecha: 'hace 6 horas',
    estado: 'pendiente',
    etapa: 1,
  },
  {
    id: 'sol-05',
    tipo: 'recibida',
    proveedorNombre: 'Distribuidora AgroSan Pablo',
    proveedorCategoria: 'Agro',
    proveedorColor: '#14356E',
    asunto: 'Compra por volumen',
    mensaje: 'Ofrecemos condiciones especiales a comercios asociados Vincco para fertilizantes y semilla.',
    fecha: 'hace 2 días',
    estado: 'aceptada',
    etapa: 3,
  },
  {
    id: 'sol-06',
    tipo: 'historial',
    proveedorNombre: 'Papelería Central',
    proveedorCategoria: 'Papelería',
    proveedorColor: '#1B468C',
    asunto: 'Acuerdo de suministro',
    mensaje: 'Convenio de reposición semanal de papelería para oficina. La propuesta quedó registrada el mes pasado.',
    fecha: 'hace 30 días',
    estado: 'cancelada',
    etapa: 1,
  },
  {
    id: 'sol-07',
    tipo: 'historial',
    proveedorNombre: 'Comercializadora Pacífico',
    proveedorCategoria: 'Limpieza',
    proveedorColor: '#2357A6',
    asunto: 'Solicitud de cotización',
    mensaje: 'Solicitud de precios de línea de aseo industrial. Cerrada sin respuesta en su momento.',
    fecha: 'hace 45 días',
    estado: 'rechazada',
    etapa: 3,
  },
]

// ── Directorio de negocios (modo proveedor) ─────────────────
// El proveedor busca negocios a los que abastecer con la misma
// interfaz del módulo; los datos son el espejo de proveedoresDirectorio.

export interface NegocioDirectorio extends Proveedor {
  propietario: string
  direccion: string
  municipio: string
  departamento: string
}

export const NEGOCIOS: NegocioDirectorio[] = [
  {
    id: 'neg-01',
    nombre: 'Pulpería El Buen Precio',
    categoria: 'Pulpería',
    tipo: 'Minorista',
    ubicacion: 'Nueva Guinea, RACCS',
    descripcion: 'Pulpería de barrio con productos de primera necesidad y abarrotes.',
    rating: 4.8,
    resenasCount: 47,
    verificado: true,
    disponibilidad: 'disponible',
    confianza: 96,
    color: '#007a7b',
    contacto: { correo: 'pulperiabuenprecio@gmail.com', telefono: '+505 8811 2233', sitio: '' },
    miembroDesde: 'mayo 2025',
    productos: [],
    resenas: [],
    tags: ['Compra diaria', 'Abarrotes de barrio'],
    propietario: 'María Gutiérrez',
    direccion: 'Barrio San Pedro, contiguo a la escuela',
    municipio: 'Nueva Guinea',
    departamento: 'RACCS',
  },
  {
    id: 'neg-02',
    nombre: 'Ferretería Central',
    categoria: 'Ferretería',
    tipo: 'Minorista',
    ubicacion: 'Nueva Guinea, RACCS',
    descripcion: 'Herramientas, materiales de construcción y accesorios eléctricos.',
    rating: 4.7,
    resenasCount: 38,
    verificado: true,
    disponibilidad: 'disponible',
    confianza: 94,
    color: '#c05900',
    contacto: { correo: 'ferreteriacentral@gmail.com', telefono: '+505 8822 3344', sitio: '' },
    miembroDesde: 'junio 2025',
    productos: [],
    resenas: [],
    tags: ['Construcción', 'Venta por mayor'],
    propietario: 'Carlos Espinoza',
    direccion: 'Frente al parque central',
    municipio: 'Nueva Guinea',
    departamento: 'RACCS',
  },
  {
    id: 'neg-03',
    nombre: 'Farmacia San José',
    categoria: 'Farmacia',
    tipo: 'Minorista',
    ubicacion: 'León, León',
    descripcion: 'Medicamentos genéricos y de marca, atención todos los días.',
    rating: 4.3,
    resenasCount: 21,
    verificado: false,
    disponibilidad: 'ocupado',
    confianza: 76,
    color: '#005c5e',
    contacto: { correo: '', telefono: '+505 8833 4455', sitio: '' },
    miembroDesde: 'agosto 2025',
    productos: [],
    resenas: [],
    tags: ['Salud', 'Farmacia comunitaria'],
    propietario: 'Ana Lucía Morales',
    direccion: 'Del mercado municipal, 1c al norte',
    municipio: 'León',
    departamento: 'León',
  },
  {
    id: 'neg-04',
    nombre: 'Boutique Estilo',
    categoria: 'Boutique',
    tipo: 'Minorista',
    ubicacion: 'Granada, Granada',
    descripcion: 'Ropa y accesorios de moda para toda la familia.',
    rating: 4.2,
    resenasCount: 16,
    verificado: false,
    disponibilidad: 'nuevo',
    confianza: 71,
    color: '#a34b00',
    contacto: { correo: 'boutiqueestilo@gmail.com', telefono: '+505 8844 5566', sitio: '' },
    miembroDesde: 'septiembre 2025',
    productos: [],
    resenas: [],
    tags: ['Moda', 'Accesorios'],
    propietario: 'Jennifer Rocha',
    direccion: 'Barrio Rigoberto López, calle principal',
    municipio: 'Granada',
    departamento: 'Granada',
  },
  {
    id: 'neg-05',
    nombre: 'Restaurante La Terraza',
    categoria: 'Restaurante',
    tipo: 'Servicios',
    ubicacion: 'Rivas, Rivas',
    descripcion: 'Comida típica nicaragüense y platillos a la carta.',
    rating: 4.9,
    resenasCount: 64,
    verificado: true,
    disponibilidad: 'disponible',
    confianza: 97,
    color: '#dd6600',
    contacto: { correo: 'laterraza.restaurante@gmail.com', telefono: '+505 8855 6677', sitio: '' },
    miembroDesde: 'abril 2025',
    productos: [],
    resenas: [],
    tags: ['Gastronomía', 'Comida típica'],
    propietario: 'Roberto Sánchez',
    direccion: 'Salida hacia El Rama, km 1',
    municipio: 'Rivas',
    departamento: 'Rivas',
  },
  {
    id: 'neg-06',
    nombre: 'Supermercado La Colonia',
    categoria: 'Supermercado',
    tipo: 'Minorista',
    ubicacion: 'Managua, Managua',
    descripcion: 'Abarrotes, lácteos, limpieza y más.',
    rating: 4.6,
    resenasCount: 58,
    verificado: true,
    disponibilidad: 'disponible',
    confianza: 92,
    color: '#003f5a',
    contacto: { correo: 'compras@lacolonia.com.ni', telefono: '+505 2255 0099', sitio: '' },
    miembroDesde: 'marzo 2025',
    productos: [],
    resenas: [],
    tags: ['Supermercado', 'Alto volumen'],
    propietario: 'Eddy Castillo',
    direccion: 'Rotonda El Periodista, 2c al sur',
    municipio: 'Managua',
    departamento: 'Managua',
  },
  {
    id: 'neg-07',
    nombre: 'Barbería El Corte',
    categoria: 'Barbería',
    tipo: 'Servicios',
    ubicacion: 'Bluefields, RACCS',
    descripcion: 'Cortes clásicos y modernos, barba y afeitado tradicional.',
    rating: 4.1,
    resenasCount: 12,
    verificado: false,
    disponibilidad: 'nuevo',
    confianza: 68,
    color: '#6b4226',
    contacto: { correo: '', telefono: '+505 8899 1122', sitio: '' },
    miembroDesde: 'octubre 2025',
    productos: [],
    resenas: [],
    tags: ['Estética', 'Servicios personales'],
    propietario: 'Kevin Salinas',
    direccion: 'Frente al muelle municipal',
    municipio: 'Bluefields',
    departamento: 'RACCS',
  },
]

// Persistencia mínima mientras no hay backend.
export const CLAVE_SOLICITUDES = 'vincco:solicitudes'
export const CLAVE_FAVORITOS = 'vincco:prov-favoritos'