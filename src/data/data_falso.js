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
  { id: 1, titulo: "Cupón C$50", puntos: 200, emoji: "ticket", descripcion: "Canjea por crédito en cualquier negocio afiliado", negocio: "Todos los afiliados", popular: true },
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

export const destacadas = [
  { id: 1, titulo: "Boutique Alma", descripcion: "Colección de temporada con los looks más pedidos por nuestras clientas.", categoria: "Ropa", likes: 128 },
  { id: 2, titulo: "Café del Barrio", descripcion: "El café de origen nicaragüense favorito del barrio, ahora con nueva carta.", categoria: "Cafetería", likes: 96 },
  { id: 3, titulo: "TechStore Managua", descripcion: "Los accesorios tecnológicos más buscados de la semana.", categoria: "Tecnología", likes: 74 },
]
