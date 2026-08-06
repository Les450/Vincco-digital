/* ══════════════════════════════════════════════════════════════
   Traduce la configuración del usuario a "esta notificación se
   muestra o no".

   Existe para que los ajustes de /config no sean decorativos: si
   alguien apaga "avisos de promociones", las promociones tienen
   que dejar de aparecer de verdad.

   Vive aparte de la pantalla porque el día que haya push del
   servidor, el backend va a necesitar exactamente esta misma
   regla para decidir qué envía.
   ══════════════════════════════════════════════════════════════ */

// Qué ajuste apaga qué tipo de notificación. La clave es el "tipo"
// que ya traen las notificaciones del store.
const REGLAS = {
  usuario: {
    promocion_cercana: (c) => c.promosCercanas !== 'ninguna',
    nuevo_negocio_categoria: (c) => c.promosCercanas === 'todas',
    nuevos_productos: (c) => c.promosCercanas !== 'ninguna',
    cambio_precio: (c) => c.avisoPrecioFavoritos,
    recompensa_disponible: (c) => c.avisoRecompensa,
    solicitud_resena: (c) => c.aparecerRanking,
  },
  negocio: {
    nueva_resena: (c) => c.avisoResenas,
    stock_bajo: (c) => c.umbralStock > 0,
    recordatorio_precios: (c) => c.recordatorioPrecios !== 0,
  },
  proveedor: {
    negocio_solicito_cotizacion_prov: (c) => c.recibirSolicitudes,
    recordatorio_cotizaciones_pendientes: (c) => c.recibirSolicitudes,
    recordatorio_catalogo_precios: (c) => c.recordatorioCatalogo !== 0,
  },
}

// Decide si una notificación suelta pasa el filtro de la config.
// Si no hay regla para ese tipo, se muestra: lo que no está
// explícitamente apagado, se ve.
export function notificacionPermitida(notificacion, config, rol) {
  const reglasDelRol = REGLAS[rol]
  if (!reglasDelRol || !config) return true

  const regla = reglasDelRol[notificacion.tipo]
  if (!regla) return true

  return Boolean(regla(config))
}

// Filtra la lista completa. Se usa en la pantalla de notificaciones
// y en el contador de no leídas, para que el número del badge
// coincida con lo que el usuario ve en la lista.
export function filtrarPorConfig(notificaciones, config, rol) {
  return notificaciones.filter((n) => notificacionPermitida(n, config, rol))
}
