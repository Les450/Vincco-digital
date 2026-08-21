import { negociosFavoritos } from './data_falso'
import { claveInventario } from './inventario'

/* ==========================================================================
   CATÁLOGO PÚBLICO DE UN NEGOCIO
   --------------------------------------------------------------------------
   Es lo que ve el CLIENTE cuando entra a "Ver inventario" desde sus
   favoritos: los productos que ese negocio subió, en modo lectura.

   De dónde salen los productos, en este orden:

   1. Del panel del propio negocio. El panel guarda su inventario en
      localStorage con la clave `pn_inventario:<idSucursal>` (ver
      data/inventario.js). Si el negocio favorito tiene un `sucursalId`,
      acá se lee ESA misma clave: lo que el dueño sube en su panel
      aparece del lado del cliente sin backend de por medio.

   2. Vitrina de ejemplo. Los otros favoritos son negocios de demo que
      nadie administra desde este navegador, así que traen su propio
      catálogo de muestra. El día que exista backend, esta parte se
      cambia por un GET /negocios/:id/productos y la pantalla no se toca.

   Los productos usan la MISMA forma que los del panel de negocio
   ({ id, nombre, categoria, cantidad, unidad, precio, stockMinimo, ... }),
   por eso la pantalla del cliente puede reutilizar las tarjetas del panel
   tal cual.
   ========================================================================== */

// Lee el inventario que el negocio administra desde su panel.
// Devuelve null solo si esa sucursal nunca abrió el panel; si el dueño
// dejó el inventario vacío a propósito, devuelve [] y se respeta.
function leerInventarioDelPanel(sucursalId) {
  try {
    const crudo = window.localStorage.getItem(claveInventario(sucursalId))
    if (crudo === null) return null
    const guardado = JSON.parse(crudo)
    return Array.isArray(guardado) ? guardado : null
  } catch {
    return null
  }
}

const p = (id, nombre, categoria, cantidad, unidad, precio, stockMinimo, extra = {}) => ({
  id, nombre, categoria, cantidad, unidad, precio, stockMinimo, ...extra,
})

// Las promociones del negocio. `limitada` es el mismo tipo que el dueño
// elige en su panel (Publicaciones → Promoción → Normal / Limitada); en
// las limitadas la cantidad son las unidades que quedan de la oferta.
const promo = (id, nombre, cantidad, unidad, precio, descuento, limitada, validoHasta) => ({
  id, nombre, categoria: 'Promociones', cantidad, unidad, precio, stockMinimo: 0,
  tipoPublicacion: 'promocion',
  subtipoPromocion: limitada ? 'limitada' : 'normal',
  descuento, validoHasta,
})

// Vitrina de ejemplo por negocio favorito (la llave es el id del favorito
// en data_falso.js). Cada negocio maneja sus propias categorías: un salón
// vende servicios y una ferretería vende libras de clavos, y las dos cosas
// entran en la misma tarjeta.
export const CATALOGO_EJEMPLO = {
  // 1 · Soda Doña Mercedes
  1: [
    p(101, 'Gallo pinto con huevo', 'Desayunos', 40, 'plato', 70, 8),
    p(102, 'Nacatamal', 'Desayunos', 12, 'unidad', 80, 10),
    p(103, 'Carne asada con tajadas', 'Platos fuertes', 25, 'plato', 150, 5),
    p(104, 'Sopa de res', 'Platos fuertes', 18, 'plato', 130, 5),
    p(105, 'Fresco natural de cacao', 'Bebidas', 60, 'vaso', 25, 15),
    promo(106, 'Almuerzo del día', 30, 'plato', 110, 15, false, '30/09/2026'),
    promo(107, 'Combo nacatamal + fresco', 20, 'combo', 95, 20, true, '05/09/2026'),
  ],
  // 2 · Fonda El Buen Sabor
  2: [
    p(201, 'Almuerzo ejecutivo', 'Platos fuertes', 50, 'plato', 110, 10),
    p(202, 'Pollo asado entero', 'Platos fuertes', 8, 'unidad', 320, 4),
    p(203, 'Indio viejo', 'Platos fuertes', 22, 'plato', 120, 6),
    p(204, 'Baho (solo sábados)', 'Especiales', 0, 'plato', 160, 5),
    p(205, 'Refresco de tamarindo 1L', 'Bebidas', 35, 'litro', 60, 10),
    promo(206, 'Almuerzo + refresco', 45, 'combo', 125, 10, false, '30/09/2026'),
    promo(207, 'Pollo asado del viernes', 15, 'unidad', 320, 25, true, '12/09/2026'),
  ],
  // 3 · Ferretería Don Chico — este es el negocio conectado al panel.
  // Si el dueño abre su panel, lo de acá deja de usarse.
  3: [
    p(301, 'Martillo de uña 16 oz', 'Herramientas', 25, 'unidad', 180, 5),
    p(302, 'Juego de destornilladores', 'Herramientas', 9, 'juego', 280, 3),
    p(303, 'Cemento gris', 'Materiales', 60, 'bolsa', 420, 15),
    p(304, 'Clavos de 2 pulgadas', 'Materiales', 120, 'lb', 45, 30),
    p(305, 'Pintura blanca', 'Pinturas', 4, 'galón', 650, 5),
    p(306, 'Cinta métrica 5 m', 'Herramientas', 14, 'unidad', 150, 4),
    promo(307, 'Pintura + brocha', 10, 'combo', 720, 10, false, '30/09/2026'),
    promo(308, 'Cemento por bolsa, cierre de mes', 30, 'bolsa', 420, 12, true, '30/08/2026'),
  ],
  // 4 · Farmacia San Rafael
  4: [
    p(401, 'Acetaminofén 500 mg', 'Medicamentos', 200, 'tableta', 5, 50),
    p(402, 'Ibuprofeno 400 mg', 'Medicamentos', 150, 'tableta', 7, 50),
    p(403, 'Suero oral', 'Medicamentos', 40, 'sobre', 25, 10),
    p(404, 'Alcohol gel 250 ml', 'Higiene', 18, 'unidad', 60, 6),
    p(405, 'Vitamina C 1 g', 'Suplementos', 26, 'unidad', 120, 8),
    p(406, 'Mascarilla quirúrgica', 'Higiene', 5, 'caja', 90, 6),
    promo(407, 'Vitaminas del mes', 30, 'unidad', 120, 20, false, '30/09/2026'),
    promo(408, 'Kit de primeros auxilios', 10, 'kit', 450, 15, true, '20/09/2026'),
  ],
  // 5 · Repostería Dulce Encanto
  5: [
    p(501, 'Pastel de chocolate (8 porciones)', 'Pasteles', 6, 'unidad', 550, 2),
    p(502, 'Tres leches', 'Pasteles', 4, 'unidad', 480, 2),
    p(503, 'Cupcakes surtidos', 'Repostería', 10, 'docena', 300, 3),
    p(504, 'Pan de coco', 'Panadería', 45, 'unidad', 25, 10),
    p(505, 'Galletas decoradas', 'Repostería', 32, 'unidad', 40, 12),
    promo(506, 'Docena de cupcakes surtidos', 12, 'docena', 300, 10, false, '30/09/2026'),
    promo(507, 'Pastel de cumpleaños por encargo', 8, 'unidad', 600, 15, true, '15/09/2026'),
  ],
  // 6 · Salón Bella Imagen — un negocio de servicios: la "cantidad" son
  // los cupos que quedan en la agenda de la semana.
  6: [
    p(601, 'Corte de cabello', 'Cortes', 20, 'cupo', 150, 5),
    p(602, 'Peinado para eventos', 'Cortes', 6, 'cupo', 400, 3),
    p(603, 'Tinte completo', 'Color', 8, 'cupo', 700, 3),
    p(604, 'Tratamiento capilar', 'Color', 10, 'cupo', 350, 3),
    p(605, 'Manicure', 'Uñas', 15, 'cupo', 180, 5),
    p(606, 'Pedicure', 'Uñas', 2, 'cupo', 220, 5),
    promo(607, 'Corte + peinado', 12, 'cupo', 480, 15, false, '30/09/2026'),
    promo(608, 'Tinte de temporada', 8, 'cupo', 700, 20, true, '18/09/2026'),
  ],
  // 7 · Café del Barrio
  7: [
    p(701, 'Café americano', 'Bebidas calientes', 80, 'taza', 45, 20),
    p(702, 'Capuchino', 'Bebidas calientes', 60, 'taza', 70, 20),
    p(703, 'Latte', 'Bebidas calientes', 55, 'taza', 75, 20),
    p(704, 'Croissant', 'Repostería', 24, 'unidad', 55, 8),
    p(705, 'Café molido de altura', 'Para llevar', 12, 'lb', 220, 4),
    promo(706, 'Combo café + repostería', 40, 'combo', 100, 20, false, '31/08/2026'),
    promo(707, 'Café molido edición especial', 12, 'lb', 220, 18, true, '10/09/2026'),
  ],
  // 8 · Boutique Alma
  8: [
    p(801, 'Blusa casual', 'Damas', 14, 'unidad', 450, 4),
    p(802, 'Vestido de verano', 'Damas', 7, 'unidad', 780, 3),
    p(803, 'Jeans de dama', 'Damas', 11, 'unidad', 650, 4),
    p(804, 'Bolso de mano', 'Accesorios', 5, 'unidad', 520, 3),
    p(805, 'Aretes artesanales', 'Accesorios', 28, 'par', 180, 6),
    promo(806, 'Segunda prenda con descuento', 25, 'prenda', 450, 30, false, '30/09/2026'),
    promo(807, 'Vestidos de temporada', 6, 'unidad', 780, 25, true, '14/09/2026'),
  ],
  // 9 · TechStore Managua
  9: [
    p(901, 'Cargador tipo C 20 W', 'Accesorios', 30, 'unidad', 250, 8),
    p(902, 'Audífonos bluetooth', 'Audio', 12, 'unidad', 650, 4),
    p(903, 'Funda para celular', 'Accesorios', 45, 'unidad', 180, 10),
    p(904, 'Power bank 10 000 mAh', 'Accesorios', 3, 'unidad', 850, 4),
    p(905, 'Memoria microSD 64 GB', 'Almacenamiento', 20, 'unidad', 400, 6),
    p(906, 'Cambio de pantalla', 'Servicio técnico', 5, 'servicio', 1200, 2),
    promo(907, 'Funda + protector de pantalla', 20, 'combo', 260, 20, false, '30/09/2026'),
    promo(908, 'Power bank, últimas unidades', 5, 'unidad', 850, 15, true, '08/09/2026'),
  ],
  // 10 · Veterinaria PetCare
  10: [
    p(1001, 'Consulta general', 'Consultas', 18, 'cupo', 300, 4),
    p(1002, 'Vacuna antirrábica', 'Vacunas', 25, 'dosis', 250, 6),
    p(1003, 'Concentrado para perro', 'Alimentos', 22, 'lb', 320, 8),
    p(1004, 'Shampoo antipulgas', 'Higiene', 9, 'unidad', 180, 4),
    p(1005, 'Desparasitante', 'Medicamentos', 30, 'tableta', 120, 8),
    p(1006, 'Baño y corte', 'Estética', 0, 'cupo', 350, 3),
    promo(1007, 'Consulta + desparasitante', 15, 'combo', 380, 10, false, '30/09/2026'),
    promo(1008, 'Jornada de vacunación', 20, 'cupo', 250, 30, true, '22/09/2026'),
  ],
}

// Ficha del negocio favorito (nombre, categoría, dirección, rating).
export function getNegocioPublico(id) {
  if (id === undefined || id === null) return null
  return negociosFavoritos.find((n) => String(n.id) === String(id)) || null
}

// Devuelve los productos publicados por el negocio y de dónde salieron:
//   'panel'   → los subió el dueño desde su panel de negocio
//   'ejemplo' → vitrina de demostración
export function getCatalogoNegocio(negocio) {
  if (!negocio) return { productos: [], origen: 'ninguno' }

  if (negocio.sucursalId) {
    const delPanel = leerInventarioDelPanel(negocio.sucursalId)
    if (delPanel) return { productos: delPanel, origen: 'panel' }
  }

  return { productos: CATALOGO_EJEMPLO[negocio.id] || [], origen: 'ejemplo' }
}
