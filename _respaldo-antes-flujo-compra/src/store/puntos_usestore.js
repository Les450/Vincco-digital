import { create } from 'zustand'
import {
  negociosAsociados as negociosAsociadosIniciales,
  permisosVitrina as permisosVitrinaIniciales,
} from '../data/data_falso'

/* ── Configuraciones ──────────────────────────────────────────
   Un bloque por rol, porque los ajustes no son los mismos: el
   cliente no tiene inventario y el proveedor no da puntos.
   Los grupos que sí comparten (canales de aviso, app, cuenta)
   igual se guardan por separado, para que alguien que usa la app
   como cliente y como negocio no se pise sus propias preferencias.

   Se guarda en localStorage porque todavía no hay backend. El día
   que exista API, esto pasa a ser un GET/PATCH y la pantalla no
   se entera.
   ───────────────────────────────────────────────────────────── */

const CLAVE_CONFIG = 'vincco:configuraciones'
const CLAVE_NOTIFICACIONES = 'vincco:notificaciones'
const CLAVE_SUCURSALES = 'vincco:sucursales'
const CLAVE_SUCURSAL_ACTIVA = 'vincco:sucursal-activa'
const CLAVE_VERIFICACION = 'vincco:verificacion'
const CLAVE_KYC = 'vincco:kyc'
const CLAVE_CONSULTAS_PROMO = 'vincco:consultas-promocion'
const CLAVE_PERFILES = 'vincco:perfiles'

// Campos del perfil que no son de la cuenta sino de la sucursal
// activa: cada sucursal tiene su propio nombre, dirección, teléfono,
// horario y WhatsApp. Al cambiar de sucursal, el perfil que se ve
// es el de la sucursal elegida; lo demás (RUC, correo, propietario)
// es de la cuenta y no cambia.
const CAMPOS_SUCURSAL_PERFIL = ['nombre', 'direccion', 'telefono', 'horario', 'whatsapp']

// Fusiona el perfil base de la cuenta con los datos de una sucursal.
// Si la sucursal no tiene el campo (por ejemplo "nombre" en una
// llevada mal), se cae al valor del perfil base.
export function perfilDeSucursal(perfil, sucursal) {
  if (!sucursal) return perfil
  const fusionado = { ...perfil }
  CAMPOS_SUCURSAL_PERFIL.forEach((campo) => {
    if (sucursal[campo]) fusionado[campo] = sucursal[campo]
  })
  return fusionado
}

// Sucursales de ejemplo por rol. Cada sucursal administra su propio
// panel (inventario y publicaciones aparte). El dia que haya backend,
// esto sale de un GET /sucursales y se olvida de aqui.
// La primera de cada rol es la principal: coincide con el perfil del
// socio (Vincco Negocio / Vincco Proveedor), que es la que se ve
// activa por defecto en el selector al entrar.
// "contrasena" la define el propietario al registrar la sucursal; al
// cambiar de sucursal se pide. Las de ejemplo usan "1234" para poder
// probar el cambio sin un registro real.
const SUCURSALES_INICIALES = {
  negocio: [
    { id: 'n1', nombre: 'Vincco Negocio', direccion: 'Nueva Guinea, RACCS', principal: true, contrasena: '1234' },
    { id: 'n2', nombre: 'Sucursal El Rama', direccion: 'Calle principal, El Rama', contrasena: '1234' },
  ],
  proveedor: [
    { id: 'p1', nombre: 'Vincco Proveedor', direccion: 'Nueva Guinea, RACCS', principal: true, contrasena: '1234' },
    { id: 'p2', nombre: 'Bodega El Rama', direccion: 'El Rama, RACCS', contrasena: '1234' },
  ],
}

// Los avisos se guardan en localStorage, igual que la configuracion,
// para que lo eliminado siga eliminado y lo leído siga leído al
// recargar la pagina. Mientras no hay backend, este es el piso de datos.
function leerNotificaciones() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_NOTIFICACIONES))
    if (Array.isArray(guardado)) return guardado
  } catch {
    // Modo privado o JSON corrupto: se arranca con los generados
  }
  return generarNotificaciones().notificaciones
}

function escribirNotificaciones(notificaciones) {
  try {
    window.localStorage.setItem(CLAVE_NOTIFICACIONES, JSON.stringify(notificaciones))
  } catch {
    // Si no se puede guardar, los cambios duran solo esta sesión
  }
}

/* ── Consultas del cliente sobre una promoción ────────────────
   Lo que el cliente manda desde el Home cuando toca "Ver" en una
   promoción y decide preguntar por dentro de Vincco en vez de irse
   a WhatsApp. Se guarda igual que los avisos: mientras no hay
   backend, localStorage es el piso de datos.                    */
function leerConsultasPromocion() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_CONSULTAS_PROMO))
    if (Array.isArray(guardado)) return guardado
  } catch {
    // Modo privado o JSON corrupto: se arranca sin consultas
  }
  return []
}

function escribirConsultasPromocion(consultas) {
  try {
    window.localStorage.setItem(CLAVE_CONSULTAS_PROMO, JSON.stringify(consultas))
  } catch {
    // Si no se puede guardar, la consulta dura solo esta sesión
  }
}

function leerSucursales() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_SUCURSALES) || '{}')
    if (guardado && Array.isArray(guardado.negocio)) {
      return {
        negocio: fusionarSucursales(SUCURSALES_INICIALES.negocio, guardado.negocio),
        proveedor: fusionarSucursales(SUCURSALES_INICIALES.proveedor, guardado.proveedor || []),
      }
    }
  } catch {}
  return SUCURSALES_INICIALES
}

// Las sucursales iniciales (n1/p1, n2/p2) siempre usan el nombre y la
// dirección que define el código: el día que el demo cambie nombres,
// los guardados viejos se migran solos. Las que el dueño agregó con
// "+ Agregar sucursal" (id `s<timestamp>`) se conservan tal cual.
function fusionarSucursales(iniciales, guardadas) {
  const idsIniciales = new Set(iniciales.map((s) => s.id))
  const extra = guardadas.filter((s) => !idsIniciales.has(s.id))
  return [...iniciales, ...extra]
}

function escribirSucursales(sucursales) {
  try {
    window.localStorage.setItem(CLAVE_SUCURSALES, JSON.stringify(sucursales))
  } catch {}
}

function leerSucursalActiva() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_SUCURSAL_ACTIVA) || '{}')
    // Se valida contra las sucursales reales (iniciales + las agregadas
    // por el dueño), para que una sucursal propia siga activa al recargar.
    const sucursales = leerSucursales()
    const validoNegocio = guardado?.negocio && sucursales.negocio.some((s) => s.id === guardado.negocio)
    const validoProveedor = guardado?.proveedor && sucursales.proveedor.some((s) => s.id === guardado.proveedor)
    return {
      negocio: validoNegocio ? guardado.negocio : sucursales.negocio[0].id,
      proveedor: validoProveedor ? guardado.proveedor : sucursales.proveedor[0].id,
    }
  } catch {}
  return {
    negocio: SUCURSALES_INICIALES.negocio[0].id,
    proveedor: SUCURSALES_INICIALES.proveedor[0].id,
  }
}

function escribirSucursalActiva(sucursalActiva) {
  try {
    window.localStorage.setItem(CLAVE_SUCURSAL_ACTIVA, JSON.stringify(sucursalActiva))
  } catch {}
}

/* ── Verificación de cuenta ───────────────────────────────────
   Un estado por rol: 'sin_solicitar' | 'pendiente' | 'aprobada'.
   Los tres roles arrancan en la cuenta demo ya "aprobada" (son las
   cuentas de ejemplo que ya venían usando la app). Un registro
   nuevo (Register.jsx) pisa el estado del rol que eligió: queda en
   "pendiente" si pidió verificarse o en "sin_solicitar" si eligió
   continuar sin hacerlo.

   Sin backend, nadie puede aprobar una solicitud de verdad: queda
   en "pendiente" hasta que exista un panel de administración o un
   proceso de revisión real que la apruebe. Está separado del resto
   de "perfiles" a propósito, para no tocar esa forma existente. */
const ESTADOS_VERIFICACION_INICIALES = {
  usuario: 'aprobada',
  negocio: 'aprobada',
  proveedor: 'aprobada',
}

function leerVerificacion() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_VERIFICACION) || '{}')
    return { ...ESTADOS_VERIFICACION_INICIALES, ...guardado }
  } catch {}
  return ESTADOS_VERIFICACION_INICIALES
}

function escribirVerificacion(estadosVerificacion) {
  try {
    window.localStorage.setItem(CLAVE_VERIFICACION, JSON.stringify(estadosVerificacion))
  } catch {}
}

// Expediente KYC (Ley 977): el borrador de la verificación completa,
// guardado por paso para poder retomarla después. El flag "abierto"
// no se persiste: cada visita arranca con el wizard cerrado.
const KYC_INICIAL = { abierto: false, rol: null, desde: 'perfil', paso: 1, formulario: {} }

function leerKYC() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_KYC) || '{}')
    return {
      ...KYC_INICIAL,
      rol: guardado.rol || null,
      desde: guardado.desde || 'perfil',
      paso: guardado.paso || 1,
      formulario: guardado.formulario || {},
    }
  } catch {}
  return KYC_INICIAL
}

function escribirKYC(kyc) {
  try {
    window.localStorage.setItem(
      CLAVE_KYC,
      JSON.stringify({ rol: kyc.rol, desde: kyc.desde, paso: kyc.paso, formulario: kyc.formulario })
    )
  } catch {}
}

// Valores con los que arranca alguien que nunca tocó nada.
// Criterio: lo que protege al usuario va encendido de fábrica
// (PIN de canje, confirmar antes de canjear); lo que puede
// molestar va apagado (WhatsApp, reseñas anónimas).
const CONFIG_INICIAL = {
  usuario: {
    ocultarDatos: false,
    resenasAnonimas: false,
    aparecerRanking: true,
    pinCanje: true,
    confirmarCanje: true,
    avisoVencimiento: true,
    diasVencimiento: 7,
    avisoRecompensa: true,
    radioBusqueda: 5,
    promosCercanas: 'todas',
    avisoPrecioFavoritos: true,
    canalPush: true,
    canalCorreo: false,
    canalWhatsapp: false,
    silencio: true,
    silencioDesde: '21:00',
    silencioHasta: '06:00',
    mostrarAsistente: true,
    textoGrande: false,
    altoContraste: false,
    idioma: 'es',
    moneda: 'NIO',
  },
  negocio: {
    mostrarPrecios: 'publicos',
    puntosPorCompra: 10,
    puntosDobles: false,
    diaPuntosDobles: 'viernes',
    umbralStock: 10,
    recordatorioPrecios: 15,
    tiempoRespuesta: 2,
    montoMinimo: 0,
    respuestaAutomatica: true,
    avisoResenas: true,
    canalPush: true,
    canalCorreo: true,
    canalWhatsapp: true,
    silencio: true,
    silencioDesde: '21:00',
    silencioHasta: '06:00',
    mostrarAsistente: true,
    textoGrande: false,
    altoContraste: false,
    idioma: 'es',
    moneda: 'NIO',
  },
  proveedor: {
    formaPago: 'ambas',
    catalogoPublico: 'registrados',
    recibirSolicitudes: true,
    validezCotizacion: 15,
    pedidoMinimoProv: 5000,
    plantillaCotizacion: true,
    frecuenciaEntrega: 'semanal',
    recordatorioCatalogo: 15,
    canalPush: true,
    canalCorreo: true,
    canalWhatsapp: true,
    silencio: true,
    silencioDesde: '21:00',
    silencioHasta: '06:00',
    mostrarAsistente: true,
    textoGrande: false,
    altoContraste: false,
    idioma: 'es',
    moneda: 'NIO',
  },
}

function leerConfig() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_CONFIG) || '{}')
    // Se mezcla con los valores iniciales para que, si mañana agregás
    // un ajuste nuevo, quien ya tenía config guardada igual lo reciba
    // con su valor por defecto en vez de undefined.
    return {
      usuario: { ...CONFIG_INICIAL.usuario, ...(guardado.usuario || {}) },
      negocio: { ...CONFIG_INICIAL.negocio, ...(guardado.negocio || {}) },
      proveedor: { ...CONFIG_INICIAL.proveedor, ...(guardado.proveedor || {}) },
    }
  } catch {
    // Modo privado del navegador o JSON corrupto: se arranca de cero
    return CONFIG_INICIAL
  }
}

function escribirConfig(configuraciones) {
  try {
    window.localStorage.setItem(CLAVE_CONFIG, JSON.stringify(configuraciones))
  } catch {
    // Si no se puede guardar, la preferencia dura solo esta sesión
  }
}

function generarNotificaciones() {
  const ahora = Date.now()
  const h = (horas) => new Date(ahora - horas * 3600000).toISOString()

  const cliente = [
    { id: 1, tipo: 'cotizacion_recibida', icono: 'package', titulo: 'Cotización recibida', descripcion: 'Ferretería Don Chico respondió a tu solicitud de cotización.', fecha: h(1), leida: false, ruta: '/home', userType: 'usuario' },
    { id: 2, tipo: 'cambio_precio', icono: 'dollar-sign', titulo: 'Cambio de precio', descripcion: 'Martillo Stanley bajó de precio: ahora 180 córdobas.', fecha: h(4), leida: false, ruta: '/favoritos', userType: 'usuario' },
    { id: 3, tipo: 'puntos_obtenidos', icono: 'gift', titulo: 'Puntos obtenidos', descripcion: 'Recibiste 50 puntos por tu compra en Pulpería La Esquina.', fecha: h(8), leida: true, ruta: '/puntos', userType: 'usuario' },
    { id: 4, tipo: 'recompensa_disponible', icono: 'award', titulo: 'Recompensa disponible', descripcion: 'Ya puedes canjear tus 200 puntos por un Cupón de 50 córdobas.', fecha: h(12), leida: false, ruta: '/puntos', userType: 'usuario' },
    { id: 5, tipo: 'nuevo_negocio_categoria', icono: 'megaphone', titulo: 'Nuevo negocio registrado', descripcion: 'Un nuevo negocio de ferretería se registró en tu zona.', fecha: h(20), leida: false, ruta: '/directorio', userType: 'usuario' },
    { id: 6, tipo: 'nuevos_productos', icono: 'shopping-bag', titulo: 'Nuevos productos', descripcion: 'Ferretería Don Chico publicó 3 nuevos productos.', fecha: h(30), leida: false, ruta: '/home', userType: 'usuario' },
    { id: 7, tipo: 'solicitud_resena', icono: 'star', titulo: 'Deja tu reseña', descripcion: 'Califica tu compra en Agroservicios El Campo.', fecha: h(36), leida: true, ruta: '/home', userType: 'usuario' },
    { id: 8, tipo: 'promocion_cercana', icono: 'map-pin', titulo: 'Promoción cercana', descripcion: 'Café del Barrio tiene 2x1 en bebidas hoy.', fecha: h(48), leida: false, ruta: '/home', userType: 'usuario' },
    { id: 9, tipo: 'producto_disponible', icono: 'heart', titulo: 'Producto disponible', descripcion: 'El producto Taladro Bosch ya está disponible en inventario.', fecha: h(60), leida: true, ruta: '/favoritos', userType: 'usuario' },
    { id: 10, tipo: 'recordatorio_cotizacion', icono: 'bell', titulo: 'Cotización pendiente', descripcion: 'Tienes una cotización pendiente de respuesta en Ferretería Don Chico.', fecha: h(72), leida: false, ruta: '/home', userType: 'usuario' },
    { id: 11, tipo: 'confirmacion_compra', icono: 'check-circle', titulo: 'Compra confirmada', descripcion: 'Tu pedido en Agroservicios El Campo fue confirmado.', fecha: h(80), leida: true, ruta: '/home', userType: 'usuario' },
  ]

  const negocio = [
    { id: 12, tipo: 'cliente_solicito_cotizacion', icono: 'mail', titulo: 'Solicitud de cotización', descripcion: 'Un cliente solicitó una cotización de tus productos.', fecha: h(1), leida: false, ruta: '/panel-negocio', userType: 'negocio' },
    { id: 13, tipo: 'stock_bajo', icono: 'package', titulo: 'Alerta de stock bajo', descripcion: 'Cemento Holcim tiene menos de 10 unidades en inventario.', fecha: h(3), leida: false, ruta: '/panel-negocio', userType: 'negocio' },
    { id: 14, tipo: 'recordatorio_precios', icono: 'dollar-sign', titulo: 'Actualiza tus precios', descripcion: 'Tus precios no se actualizan desde hace 15 días.', fecha: h(10), leida: false, ruta: '/panel-negocio', userType: 'negocio' },
    { id: 15, tipo: 'nuevo_proveedor_categoria', icono: 'truck', titulo: 'Nuevo proveedor disponible', descripcion: 'Distribuidora Norte se registró como proveedor de ferretería.', fecha: h(18), leida: true, ruta: '/panel-negocio', userType: 'negocio' },
    { id: 16, tipo: 'respuesta_proveedor', icono: 'file-text', titulo: 'Respuesta de proveedor', descripcion: 'Materiales La Unión respondió a tu solicitud de cotización.', fecha: h(24), leida: false, ruta: '/panel-negocio', userType: 'negocio' },
    { id: 17, tipo: 'pedido_confirmado_proveedor', icono: 'check-circle', titulo: 'Pedido confirmado', descripcion: 'El pedido a Distribuidora Norte fue confirmado.', fecha: h(30), leida: false, ruta: '/panel-negocio', userType: 'negocio' },
    { id: 18, tipo: 'recordatorio_inventario', icono: 'package', titulo: 'Actualiza tu inventario', descripcion: 'Revisa tu inventario, hay productos sin stock desde hace una semana.', fecha: h(40), leida: true, ruta: '/panel-negocio', userType: 'negocio' },
    { id: 19, tipo: 'nueva_resena', icono: 'star', titulo: 'Nueva reseña recibida', descripcion: 'Un cliente te dejó una reseña de 5 estrellas.', fecha: h(50), leida: false, ruta: '/panel-negocio', userType: 'negocio' },
    { id: 20, tipo: 'cambio_ranking', icono: 'award', titulo: 'Cambio en el ranking', descripcion: 'Subiste al puesto #3 del ranking mensual de ferreterías.', fecha: h(60), leida: true, ruta: '/dashboard', userType: 'negocio' },
    { id: 21, tipo: 'cliente_siguio_negocio', icono: 'heart', titulo: 'Nuevo seguidor', descripcion: 'Leslie comenzó a seguir tu negocio.', fecha: h(72), leida: false, ruta: '/panel-negocio', userType: 'negocio' },
  ]

  const proveedor = [
    { id: 22, tipo: 'nuevo_negocio_categoria_prov', icono: 'store', titulo: 'Nuevo negocio registrado', descripcion: 'Ferretería Don Chico se registró en tu categoría de construcción.', fecha: h(2), leida: false, ruta: '/recompensas', userType: 'proveedor' },
    { id: 23, tipo: 'negocio_solicito_cotizacion_prov', icono: 'mail', titulo: 'Solicitud de cotización', descripcion: 'Un negocio solicitó una cotización de tus productos.', fecha: h(6), leida: false, ruta: '/recompensas', userType: 'proveedor' },
    { id: 24, tipo: 'cotizacion_aceptada_rechazada', icono: 'check-circle', titulo: 'Cotización actualizada', descripcion: 'Ferretería Don Chico aceptó tu cotización.', fecha: h(14), leida: false, ruta: '/recompensas', userType: 'proveedor' },
    { id: 25, tipo: 'recordatorio_cotizaciones_pendientes', icono: 'clock', titulo: 'Cotizaciones pendientes', descripcion: 'Tienes 2 cotizaciones pendientes de responder.', fecha: h(22), leida: true, ruta: '/recompensas', userType: 'proveedor' },
    { id: 26, tipo: 'negocio_interesado', icono: 'handshake', titulo: 'Negocio interesado', descripcion: 'Un negocio mostró interés en tus productos de construcción.', fecha: h(28), leida: false, ruta: '/recompensas', userType: 'proveedor' },
    { id: 27, tipo: 'cambio_estado_pedido', icono: 'truck', titulo: 'Estado de pedido actualizado', descripcion: 'El pedido #1023 cambió a "En tránsito".', fecha: h(38), leida: false, ruta: '/recompensas', userType: 'proveedor' },
    { id: 28, tipo: 'recordatorio_catalogo_precios', icono: 'dollar-sign', titulo: 'Actualiza tu catálogo', descripcion: 'Tu catálogo no se actualiza desde hace 20 días.', fecha: h(50), leida: true, ruta: '/recompensas', userType: 'proveedor' },
    { id: 29, tipo: 'resumen_semanal', icono: 'bar-chart-2', titulo: 'Resumen semanal', descripcion: 'Recibiste 5 solicitudes de cotización esta semana.', fecha: h(70), leida: false, ruta: '/recompensas', userType: 'proveedor' },
  ]

  const todas = [...cliente, ...negocio, ...proveedor]
  todas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  return { notificaciones: todas }
}

function dia(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function generarEventosCalendario() {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const CAT = {
    cotizacion: 'cotizacion',
    pedido: 'pedido',
    promocion: 'promocion',
    inventario: 'inventario',
    evento: 'evento',
    recordatorio: 'recordatorio',
    mantenimiento: 'mantenimiento',
  }

  const cliente = [
    { id: 1, categoria: CAT.promocion, icono: 'calendar', titulo: 'Promoción por finalizar', descripcion: 'La promoción 2x1 en Café del Barrio termina mañana.', fecha: dia(1), hora: '23:59', estado: 'pendiente', ruta: '/home', userType: 'usuario' },
    { id: 2, categoria: CAT.recordatorio, icono: 'gift', titulo: 'Vencimiento de puntos', descripcion: 'Tus 150 puntos de Pulpería La Esquina vencen en 3 días.', fecha: dia(3), estado: 'pendiente', ruta: '/puntos', userType: 'usuario' },
    { id: 3, categoria: CAT.recordatorio, icono: 'shopping-bag', titulo: 'Compra frecuente', descripcion: '¿Ya visitaste Ferretería Don Chico? Tienes una compra pendiente.', fecha: dia(0), estado: 'pendiente', ruta: '/home', userType: 'usuario' },
    { id: 4, categoria: CAT.pedido, icono: 'package', titulo: 'Entrega de pedido', descripcion: 'Tu pedido de Agroservicios El Campo llegará hoy.', fecha: dia(0), estado: 'pendiente', ruta: '/home', userType: 'usuario' },
    { id: 5, categoria: CAT.recordatorio, icono: 'star', titulo: 'Deja tu reseña', descripcion: 'Califica tu compra en Ferretería Don Chico.', fecha: dia(2), estado: 'pendiente', ruta: '/home', userType: 'usuario' },
    { id: 6, categoria: CAT.evento, icono: 'party-popper', titulo: 'Feria de emprendedores', descripcion: 'Feria local en Managua con descuentos especiales.', fecha: dia(5), hora: '09:00', estado: 'pendiente', ruta: '/home', userType: 'usuario' },
    { id: 7, categoria: CAT.promocion, icono: 'megaphone', titulo: 'Promoción en Ferretería Don Chico', descripcion: '30% de descuento en herramientas de mano.', fecha: dia(4), estado: 'pendiente', ruta: '/home', userType: 'usuario' },
    { id: 8, categoria: CAT.evento, icono: 'heart', titulo: 'Nuevos productos disponibles', descripcion: 'TechStore Managua lanzó su nueva línea de accesorios.', fecha: dia(7), estado: 'pendiente', ruta: '/home', userType: 'usuario' },
  ]

  const negocio = [
    { id: 9, categoria: CAT.inventario, icono: 'package', titulo: 'Reabastecer inventario', descripcion: 'Cemento Holcim y Varilla corrugada están por agotarse.', fecha: dia(1), estado: 'pendiente', ruta: '/panel-negocio', userType: 'negocio' },
    { id: 10, categoria: CAT.recordatorio, icono: 'dollar-sign', titulo: 'Actualizar precios', descripcion: 'Tus precios no se actualizan desde hace 15 días.', fecha: dia(2), hora: '10:00', estado: 'pendiente', ruta: '/panel-negocio', userType: 'negocio' },
    { id: 11, categoria: CAT.pedido, icono: 'truck', titulo: 'Entrega de proveedor', descripcion: 'Distribuidora Norte entregará materiales mañana.', fecha: dia(1), hora: '14:00', estado: 'pendiente', ruta: '/panel-negocio', userType: 'negocio' },
    { id: 12, categoria: CAT.cotizacion, icono: 'file-text', titulo: 'Cotización por vencer', descripcion: 'La cotización enviada a Cliente vence en 2 días.', fecha: dia(2), estado: 'pendiente', ruta: '/panel-negocio', userType: 'negocio' },
    { id: 13, categoria: CAT.promocion, icono: 'trending-up', titulo: 'Publicar promoción', descripcion: 'Tu promoción de fin de mes está programada para publicarse.', fecha: dia(6), estado: 'pendiente', ruta: '/panel-negocio', userType: 'negocio' },
    { id: 14, categoria: CAT.evento, icono: 'bar-chart-2', titulo: 'Cierre de ranking mensual', descripcion: 'El ranking mensual cierra en 5 días. Revisa tu posición.', fecha: dia(5), estado: 'pendiente', ruta: '/dashboard', userType: 'negocio' },
    { id: 15, categoria: CAT.inventario, icono: 'edit-3', titulo: 'Actualizar productos', descripcion: 'Tienes 3 productos sin stock desde hace una semana.', fecha: dia(3), estado: 'pendiente', ruta: '/panel-negocio', userType: 'negocio' },
    { id: 16, categoria: CAT.recordatorio, icono: 'star', titulo: 'Responder reseñas', descripcion: 'Tienes 2 reseñas nuevas sin responder.', fecha: dia(0), estado: 'pendiente', ruta: '/panel-negocio', userType: 'negocio' },
  ]

  const proveedor = [
    { id: 17, categoria: CAT.pedido, icono: 'truck', titulo: 'Entrega comprometida', descripcion: 'Entrega de materiales a Ferretería Don Chico.', fecha: dia(1), hora: '08:00', estado: 'pendiente', ruta: '/recompensas', userType: 'proveedor' },
    { id: 18, categoria: CAT.pedido, icono: 'package', titulo: 'Pedido programado', descripcion: 'Pedido #1023 programado para distribución.', fecha: dia(3), estado: 'pendiente', ruta: '/recompensas', userType: 'proveedor' },
    { id: 19, categoria: CAT.cotizacion, icono: 'clock', titulo: 'Cotización por vencer', descripcion: 'Cotización enviada a Materiales La Unión vence pronto.', fecha: dia(2), estado: 'pendiente', ruta: '/recompensas', userType: 'proveedor' },
    { id: 20, categoria: CAT.recordatorio, icono: 'dollar-sign', titulo: 'Actualizar catálogo', descripcion: 'Tu catálogo no se actualiza desde hace 20 días.', fecha: dia(4), estado: 'pendiente', ruta: '/recompensas', userType: 'proveedor' },
    { id: 21, categoria: CAT.evento, icono: 'bar-chart-2', titulo: 'Resumen semanal', descripcion: 'Recibiste 5 solicitudes de cotización esta semana.', fecha: dia(6), estado: 'pendiente', ruta: '/recompensas', userType: 'proveedor' },
    { id: 22, categoria: CAT.inventario, icono: 'package', titulo: 'Abastecimiento planificado', descripcion: 'Revisar stock de materiales para próxima semana.', fecha: dia(5), estado: 'pendiente', ruta: '/recompensas', userType: 'proveedor' },
    { id: 23, categoria: CAT.recordatorio, icono: 'bell', titulo: 'Cotizaciones pendientes', descripcion: 'Tienes 2 cotizaciones pendientes por responder.', fecha: dia(0), estado: 'pendiente', ruta: '/recompensas', userType: 'proveedor' },
  ]

  const generales = [
    { id: 24, categoria: CAT.evento, icono: 'megaphone', titulo: 'Nueva funcionalidad', descripcion: 'Ya está disponible el módulo de Calendario Inteligente.', fecha: dia(-1), estado: 'completado', ruta: '/calendario', userType: 'general' },
    { id: 25, categoria: CAT.evento, icono: 'party-popper', titulo: 'Campaña de Navidad', descripcion: 'Prepárate para la campaña navideña. Promociones especiales para todos.', fecha: dia(20), estado: 'pendiente', ruta: '/home', userType: 'general' },
    { id: 26, categoria: CAT.evento, icono: 'store', titulo: 'Feria de emprendedores', descripcion: 'Feria local en Managua con descuentos especiales.', fecha: dia(5), hora: '09:00', estado: 'pendiente', ruta: '/home', userType: 'general' },
    { id: 27, categoria: CAT.evento, icono: 'trending-up', titulo: 'Inicio de ranking mensual', descripcion: 'El ranking mensual comienza hoy. ¡Participa!', fecha: dia(-3), estado: 'completado', ruta: '/dashboard', userType: 'general' },
    { id: 28, categoria: CAT.mantenimiento, icono: 'tool', titulo: 'Mantenimiento programado', descripcion: 'La plataforma estará en mantenimiento el domingo de 2:00 AM a 4:00 AM.', fecha: dia(7), hora: '02:00', estado: 'pendiente', ruta: '/home', userType: 'general' },
    { id: 29, categoria: CAT.evento, icono: 'calendar', titulo: 'Capacitación plataforma', descripcion: 'Capacitación virtual sobre nuevas funcionalidades.', fecha: dia(10), hora: '15:00', estado: 'pendiente', ruta: '/home', userType: 'general' },
  ]

  const todos = [...cliente, ...negocio, ...proveedor, ...generales]
  return { eventosCalendario: todos }
}

// Ficha editable del perfil. Se guarda una por rol porque los
// campos no son los mismos: el cliente no tiene RUC ni cobertura,
// y el proveedor no tiene "propietario" sino persona de contacto.
// La foto se guarda como dataURL (base64) porque no hay backend
// todavía: así sobrevive a la recarga mientras se prueba en local.
const PERFILES_INICIALES = {
  usuario: {
    nombre: 'Lesbin Leonardo Díaz Medina',
    cedula: '616-151206-1006K',
    edad: 19,
    telefono: '+505 5717 8100',
    correo: 'lesbinleonardo@gmail.com',
    municipio: 'Nueva Guinea',
    barrio: 'Barrio Rigoberto López',
    miembroDesde: 'agosto 2026',
    foto: null,
  },
  negocio: {
    nombre: 'Vincco Negocio',
    categoria: 'Ferretería',
    propietario: 'Lesbin Leonardo Díaz Medina',
    cedula: '616-151206-1006K',
    edad: 19,
    telefono: '+505 5717 8100',
    correo: 'lesbinleonardo@gmail.com',
    ruc: 'J0310000456789',
    direccion: 'Nueva Guinea, RACCS',
    descripcion: 'Negocio de prueba en Nueva Guinea, parte de la red de comercios asociados a Vincco.',
    miembroDesde: 'agosto 2026',
    foto: null,
  },
  proveedor: {
    nombre: 'Vincco Proveedor',
    categoria: 'Construcción',
    contacto: 'Lesbin Leonardo Díaz Medina',
    cedula: '616-151206-1006K',
    edad: 19,
    telefono: '+505 5717 8100',
    correo: 'lesbinleonardo@gmail.com',
    ruc: 'J0310000456790',
    cobertura: 'Nueva Guinea y alrededores, RACCS',
    descripcion: 'Proveedor de prueba en Nueva Guinea, RACCS, parte de la red de proveedores asociados a Vincco.',
    miembroDesde: 'agosto 2026',
    foto: null,
  },
}

function leerPerfiles() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_PERFILES) || '{}')
    if (guardado && typeof guardado === 'object') {
      return {
        usuario: { ...PERFILES_INICIALES.usuario, ...(guardado.usuario || {}) },
        negocio: { ...PERFILES_INICIALES.negocio, ...(guardado.negocio || {}) },
        proveedor: { ...PERFILES_INICIALES.proveedor, ...(guardado.proveedor || {}) },
      }
    }
  } catch {
    // Modo privado o JSON corrupto: se arranca con los de ejemplo
  }
  return PERFILES_INICIALES
}

function escribirPerfiles(perfiles) {
  try {
    window.localStorage.setItem(CLAVE_PERFILES, JSON.stringify(perfiles))
  } catch {
    // Si no se puede guardar, el cambio dura solo esta sesión
  }
}

const useStore = create((set) => ({
  usuario: {
    nombre: 'Lesbin',
    puntos: 340,
    nivel: 'Bronce'
  },
  negocio: {
    nombre: 'Vincco Negocio',
    categoria: 'ferretería',
    telefono: '+505 5717 8100',
    direccion: 'Nueva Guinea, RACCS',
  },
  isLoggedIn: false,
  userType: 'usuario',
  negociosAsociados: negociosAsociadosIniciales,
  configuraciones: leerConfig(),
  permisosVitrina: permisosVitrinaIniciales,
  // Conversación con Kiara. Vive en el store y no dentro del
  // componente para que no se borre al cambiar de pantalla: podés
  // preguntar algo, ir a verlo y volver con el hilo intacto.
  // No se persiste a propósito: cada visita arranca limpia.
  chat: {
    abierto: false,
    mensajes: [],
    pensando: false,
  },
  // Redes que el comercio o proveedor conecto a su perfil.
  // La clave es el id de la red y el valor es el usuario o telefono.
  redesNegocio: {
    whatsapp: '+505 8855 6677',
    facebook: 'vinccolocal',
  },
  // Codigo con el que el usuario invita a otros. En produccion
  // deberia venir del backend al crear la cuenta.
  codigoInvitacion: 'VINCCO-A4K9',
  perfiles: leerPerfiles(),
  estadosVerificacion: leerVerificacion(),
  kyc: leerKYC(),
  notificaciones: leerNotificaciones(),
  // Consultas que los clientes mandaron sobre una promoción del Home
  consultasPromocion: leerConsultasPromocion(),
  sucursales: leerSucursales(),
  sucursalActiva: leerSucursalActiva(),
  ...generarEventosCalendario(),
  // Un cliente sin verificar no suma puntos: es la regla antifraude
  // que pidió el dueño de Vincco, para que crear cuentas falsas no
  // sirva para acumular puntos. Todavía no hay ninguna pantalla que
  // llame a esto (no hay una acción real de "comprar" conectada),
  // pero el freno queda puesto acá para cuando la haya.
  agregarPuntos: (cantidad) => set((state) => {
    if (state.estadosVerificacion.usuario !== 'aprobada') return {}
    return {
      usuario: {
        ...state.usuario,
        puntos: state.usuario.puntos + cantidad
      }
    }
  }),
  setLoggedIn: (val) => set({ isLoggedIn: val }),
  setUserType: (tipo) => set({ userType: tipo }),
  setNegocio: (datos) => set((state) => ({ negocio: { ...state.negocio, ...datos } })),
  // Cambia la sucursal activa de un rol. El dato vive por rol porque
  // un proveedor y un comercio administran sucursales distintas.
  cambiarSucursal: (rol, id) => set((state) => {
    if (!state.sucursales[rol]?.some((s) => s.id === id)) return {}
    const sucursalActiva = { ...state.sucursalActiva, [rol]: id }
    escribirSucursalActiva(sucursalActiva)
    return { sucursalActiva }
  }),
  // Agrega una sucursal nueva y la deja activa: el dueño puede
  // empezar a cargar el panel de esa sucursal de inmediato.
  agregarSucursal: (rol, datos) => {
    const id = `s${Date.now()}`
    set((state) => {
      const sucursales = {
        ...state.sucursales,
        [rol]: [...(state.sucursales[rol] || []), { id, ...datos }],
      }
      escribirSucursales(sucursales)
      const sucursalActiva = { ...state.sucursalActiva, [rol]: id }
      escribirSucursalActiva(sucursalActiva)
      return { sucursales, sucursalActiva }
    })
    return id
  },
  marcarNotificacionLeida: (id) => set((state) => {
    const notificaciones = state.notificaciones.map((n) =>
      n.id === id ? { ...n, leida: true } : n
    )
    escribirNotificaciones(notificaciones)
    return { notificaciones }
  }),
  marcarTodasLeidas: () => set((state) => {
    const notificaciones = state.notificaciones.map((n) => ({ ...n, leida: true }))
    escribirNotificaciones(notificaciones)
    return { notificaciones }
  }),
  // Elimina los avisos cuyos id vienen en el arreglo. La pagina solo
  // le pasa ids del propio usuario, asi nadie puede borrar ajenos.
  eliminarNotificaciones: (ids) => set((state) => {
    const aEliminar = new Set(ids)
    const notificaciones = state.notificaciones.filter((n) => !aEliminar.has(n.id))
    escribirNotificaciones(notificaciones)
    return { notificaciones }
  }),
  /* ── Negocios asociados: pedido y aceptación ─────────────────
     Asociarse no es un acto unilateral del proveedor: es una
     solicitud que el negocio tiene que aceptar. Por eso pedir uno
     nuevo no lo agrega a la lista como asociado — lo agrega en
     estado "pendiente" y avisa al negocio por Avisos, que ya existe
     y es donde el negocio la acepta o la rechaza (Notificaciones.jsx).
     Recién con "aceptada" es una asociación de verdad. */
  solicitarAsociacionNegocio: (datos) => {
    const id = Date.now()
    const nuevo = { id, estado: 'pendiente', ...datos }
    set((state) => {
      const nombreProveedor = state.perfiles.proveedor?.nombre || 'Un proveedor'
      const notificaciones = [
        {
          id: `sol-asoc-${id}`,
          tipo: 'solicitud_asociacion',
          icono: 'handshake',
          titulo: 'Solicitud de asociación',
          descripcion: `${nombreProveedor} quiere asociarse con tu negocio como proveedor.`,
          fecha: new Date().toISOString(),
          leida: false,
          ruta: '/avisos',
          userType: 'negocio',
          negocioAsociadoId: id,
        },
        ...state.notificaciones,
      ]
      escribirNotificaciones(notificaciones)
      return {
        negociosAsociados: [nuevo, ...state.negociosAsociados],
        notificaciones,
      }
    })
    return id
  },
  // El negocio responde una solicitud desde Avisos. Al proveedor le
  // llega de vuelta un aviso con el resultado, así no tiene que
  // quedarse revisando la lista para enterarse.
  responderAsociacionNegocio: (id, aceptar) => set((state) => {
    const solicitud = state.negociosAsociados.find((n) => n.id === id)
    if (!solicitud || solicitud.estado !== 'pendiente') return {}

    const negociosAsociados = state.negociosAsociados.map((n) =>
      n.id === id ? { ...n, estado: aceptar ? 'aceptada' : 'rechazada' } : n
    )
    const notificaciones = [
      {
        id: `resp-asoc-${id}`,
        tipo: 'respuesta_asociacion',
        icono: aceptar ? 'check-circle' : 'x',
        titulo: aceptar ? 'Asociación aceptada' : 'Asociación rechazada',
        descripcion: aceptar
          ? `${solicitud.nombre} aceptó tu solicitud de asociación. Ya podés cotizarle.`
          : `${solicitud.nombre} rechazó tu solicitud de asociación.`,
        fecha: new Date().toISOString(),
        leida: false,
        ruta: '/negocios-asociados',
        userType: 'proveedor',
      },
      ...state.notificaciones,
    ]
    escribirNotificaciones(notificaciones)
    return { negociosAsociados, notificaciones }
  }),
  /* ── Consulta de un cliente sobre una promoción ──────────────
     El cliente ve una promoción en su Home, toca "Ver" y desde el
     detalle decide preguntar por dentro de Vincco. Eso no es un
     mensaje suelto: queda como un registro con estado, igual que
     una solicitud de asociación, y le llega al negocio a Avisos,
     que es donde el negocio ya está acostumbrado a responder.

     Es a propósito la misma forma que solicitarAsociacionNegocio:
     un registro en 'pendiente' + un aviso al otro rol. Cuando esto
     pase a backend, las dos van a ser el mismo endpoint con distinto
     cuerpo.                                                       */
  enviarConsultaPromocion: ({ promocion, cantidad, mensaje }) => {
    const id = `cons-${Date.now()}`

    set((state) => {
      const cliente = state.perfiles.usuario || {}
      const negocio = promocion.negocio || {}
      const unidades = Number(cantidad) > 0 ? Number(cantidad) : null

      const consulta = {
        id,
        estado: 'pendiente',
        promocionId: promocion.id,
        promocionTitulo: promocion.titulo,
        promocionPuntos: promocion.puntos || null,
        promocionDescuento: promocion.descuento ?? null,
        negocio: {
          id: negocio.id || null,
          rol: negocio.rol || 'negocio',
          nombre: negocio.nombre || '',
          telefono: negocio.telefono || '',
        },
        cliente: {
          nombre: cliente.nombre || state.usuario.nombre || 'Un cliente',
          telefono: cliente.telefono || '',
        },
        cantidad: unidades,
        mensaje: (mensaje || '').trim(),
        creadaEn: new Date().toISOString(),
        respondidaEn: null,
        respuesta: '',
      }

      const nombreCliente = consulta.cliente.nombre
      const detalleCantidad = unidades ? ` · ${unidades} ${unidades === 1 ? 'unidad' : 'unidades'}` : ''

      const notificaciones = [
        {
          id: `consulta-promo-${id}`,
          tipo: 'consulta_promocion',
          icono: 'message-circle',
          titulo: 'Consulta sobre una promoción',
          descripcion: `${nombreCliente} pregunta por "${promocion.titulo}"${detalleCantidad}.`,
          fecha: consulta.creadaEn,
          leida: false,
          ruta: '/notificaciones',
          // Casi siempre es un negocio, pero un proveedor también
          // puede publicar promociones: el aviso tiene que llegarle
          // a quien la publicó, no al rol que supongamos nosotros.
          userType: negocio.rol || 'negocio',
          consultaId: id,
        },
        ...state.notificaciones,
      ]

      escribirNotificaciones(notificaciones)
      const consultasPromocion = [consulta, ...state.consultasPromocion]
      escribirConsultasPromocion(consultasPromocion)

      return { consultasPromocion, notificaciones }
    })

    return id
  },

  /* El negocio contesta desde Avisos. Al cliente le vuelve el
     resultado por la misma vía, así no tiene que quedarse
     revisando la pantalla para enterarse.

     Los puntos NO se acreditan acá a propósito. Confirmar una
     consulta significa "sí, te lo tengo" — la compra todavía no
     ocurrió. La acreditación va cuando esté definido cómo se
     cierra la compra; el enganche es agregarPuntos(), que ya
     existe y ya trae el freno de cuenta verificada.              */
  responderConsultaPromocion: (id, aceptar, respuesta = '') => set((state) => {
    const consulta = state.consultasPromocion.find((c) => c.id === id)
    if (!consulta || consulta.estado !== 'pendiente') return {}

    const consultasPromocion = state.consultasPromocion.map((c) =>
      c.id === id
        ? {
            ...c,
            estado: aceptar ? 'confirmada' : 'rechazada',
            respondidaEn: new Date().toISOString(),
            respuesta: (respuesta || '').trim(),
          }
        : c
    )

    const nombreNegocio = consulta.negocio.nombre || 'El negocio'

    const notificaciones = [
      {
        id: `resp-consulta-${id}`,
        tipo: 'respuesta_consulta_promocion',
        icono: aceptar ? 'check-circle' : 'x',
        titulo: aceptar ? 'Tu consulta fue confirmada' : 'Tu consulta no pudo atenderse',
        descripcion: aceptar
          ? `${nombreNegocio} te confirmó "${consulta.promocionTitulo}". Pasá al local para retirarla.`
          : `${nombreNegocio} no puede atender tu consulta sobre "${consulta.promocionTitulo}" por ahora.`,
        fecha: new Date().toISOString(),
        leida: false,
        ruta: '/notificaciones',
        userType: 'usuario',
        consultaId: id,
      },
      ...state.notificaciones,
    ]

    escribirNotificaciones(notificaciones)
    escribirConsultasPromocion(consultasPromocion)

    return { consultasPromocion, notificaciones }
  }),

  // Termina una asociación ya aceptada. No hace falta la ceremonia
  // de aviso y respuesta: es reversible con solo volver a pedirla.
  quitarAsociacionNegocio: (id) => set((state) => ({
    negociosAsociados: state.negociosAsociados.filter((n) => n.id !== id),
  })),
  // Actualiza solo los campos que vienen en datos y conserva el resto
  // (id, estado y color no se tocan desde el formulario)
  editarNegocioAsociado: (id, datos) => set((state) => ({
    negociosAsociados: state.negociosAsociados.map((n) =>
      n.id === id ? { ...n, ...datos } : n
    )
  })),
  // Guarda los cambios del formulario de perfil sin pisar los
  // campos que no vienen en "datos" (por ejemplo miembroDesde).
  guardarPerfil: (rol, datos) => set((state) => {
    const perfiles = {
      ...state.perfiles,
      [rol]: { ...state.perfiles[rol], ...datos },
    }
    escribirPerfiles(perfiles)
    return { perfiles }
  }),
  // Guarda los datos editados de la ficha del socio repartiéndolos:
  // los campos de la sucursal activa (nombre, dirección, teléfono,
  // horario, WhatsApp) van a la sucursal; el resto (RUC, correo,
  // propietario, descripción...) queda en el perfil de la cuenta.
  // Así, al cambiar de sucursal, cada una muestra su propia ficha.
  guardarPerfilConSucursal: (rol, datos) => set((state) => {
    const cambios = {}
    const datosSucursal = {}
    const datosPerfil = {}
    Object.entries(datos || {}).forEach(([campo, valor]) => {
      if (CAMPOS_SUCURSAL_PERFIL.includes(campo)) datosSucursal[campo] = valor
      else datosPerfil[campo] = valor
    })
    if (Object.keys(datosSucursal).length) {
      const sucursalId = state.sucursalActiva[rol]
      const sucursales = {
        ...state.sucursales,
        [rol]: (state.sucursales[rol] || []).map((s) =>
          s.id === sucursalId ? { ...s, ...datosSucursal } : s
        ),
      }
      escribirSucursales(sucursales)
      cambios.sucursales = sucursales
    }
    if (Object.keys(datosPerfil).length) {
      const perfiles = {
        ...state.perfiles,
        [rol]: { ...state.perfiles[rol], ...datosPerfil },
      }
      escribirPerfiles(perfiles)
      cambios.perfiles = perfiles
    }
    return cambios
  }),
  // La foto se guarda como dataURL (base64) porque no hay backend
  // todavia. Al conectar la API esto pasaria a ser la URL del archivo
  // subido; el resto de la pantalla no cambia.
  guardarFoto: (rol, foto) => set((state) => {
    const perfiles = {
      ...state.perfiles,
      [rol]: { ...state.perfiles[rol], foto },
    }
    escribirPerfiles(perfiles)
    return { perfiles }
  }),
  quitarFoto: (rol) => set((state) => {
    const perfiles = {
      ...state.perfiles,
      [rol]: { ...state.perfiles[rol], foto: null },
    }
    escribirPerfiles(perfiles)
    return { perfiles }
  }),
  // Pide la verificación de la cuenta: se usa al terminar el
  // registro, desde el perfil para quien la pospuso, y desde
  // cualquier acción bloqueada (publicar, cotizar, etc). Sin backend
  // no hay quién la apruebe todavía: queda "pendiente" hasta que
  // exista un panel de administración que la revise.
  //
  // datos.ruc es opcional: negocio y proveedor lo cargan acá si ya
  // lo tienen. Si no lo tienen, igual pueden solicitar — el equipo
  // de Vincco los contacta para ver cómo verificarlos.
  solicitarVerificacion: (rol, datos = {}) => set((state) => {
    const estadosVerificacion = { ...state.estadosVerificacion, [rol]: 'pendiente' }
    escribirVerificacion(estadosVerificacion)
    const cambios = { estadosVerificacion }
    if (datos.ruc && (rol === 'negocio' || rol === 'proveedor')) {
      cambios.perfiles = {
        ...state.perfiles,
        [rol]: { ...state.perfiles[rol], ruc: datos.ruc },
      }
      escribirPerfiles(cambios.perfiles)
    }
    return cambios
  }),
  // "Continuar sin verificación" al terminar el registro. Deja
  // explícito que todavía no la pidió (distinto de "pendiente"),
  // para que el perfil pueda ofrecerle solicitarla más adelante.
  continuarSinVerificar: (rol) => set((state) => {
    const estadosVerificacion = { ...state.estadosVerificacion, [rol]: 'sin_solicitar' }
    escribirVerificacion(estadosVerificacion)
    return { estadosVerificacion }
  }),
  // Accion de prueba/demo: no existe en un flujo real (ahi la
  // aprobacion la da el equipo de Vincco), pero sin backend hace
  // falta una forma de resetear las cuentas de prueba a "aprobada"
  // sin editar localStorage a mano.
  marcarVerificadoDemo: (rol) => set((state) => {
    const estadosVerificacion = { ...state.estadosVerificacion, [rol]: 'aprobada' }
    escribirVerificacion(estadosVerificacion)
    return { estadosVerificacion }
  }),

  /* ── Expediente KYC (Ley 977) ─────────────────────────────
     La verificación ya no es solo el RUC: es un expediente de
     4 pasos que se arma en VerificacionKYC (identificación,
     documentos, datos tributarios y datos según el rol). El
     borrador se guarda por paso en "vincco:kyc" para retomarlo;
     al enviar, se apoya en solicitarVerificacion y el rol queda
     "pendiente" (24-48 horas hábiles de revisión). */
  abrirKYC: (rol, desde = 'perfil') => set((state) => ({
    kyc: {
      ...state.kyc,
      abierto: true,
      rol,
      desde,
      // Si ya hay un borrador para este rol, se retoma en el paso
      // donde quedó; si es otro rol, se arranca de cero.
      paso: state.kyc.rol === rol ? state.kyc.paso : 1,
    },
  })),
  cerrarKYC: () => set((state) => ({ kyc: { ...state.kyc, abierto: false } })),
  // Guarda los campos del expediente al cambiar de paso o de
  // campo: el wizard la llama en cada cambio para no perder nada.
  guardarKYC: (datos) => set((state) => {
    const kyc = {
      ...state.kyc,
      formulario: { ...state.kyc.formulario, ...datos },
    }
    escribirKYC(kyc)
    return { kyc }
  }),
  guardarPasoKYC: (paso) => set((state) => {
    const kyc = { ...state.kyc, paso }
    escribirKYC(kyc)
    return { kyc }
  }),
  // Cambió de rol dentro del wizard: el expediente es por rol
  // (cada uno pide datos distintos), así que se arranca de cero.
  cambiarRolKYC: (rol) => set((state) => {
    if (state.kyc.rol === rol) return {}
    const kyc = { ...state.kyc, rol, paso: 1, formulario: {} }
    escribirKYC(kyc)
    return { kyc }
  }),
  // Envía la solicitud: igual que solicitarVerificacion, marca el
  // rol en "pendiente" y copia el RUC al perfil si lo hay. El
  // borrador se conserva por si la revisión pide correcciones.
  enviarKYC: () => set((state) => {
    const { rol, formulario } = state.kyc
    if (!rol) return {}
    const estadosVerificacion = { ...state.estadosVerificacion, [rol]: 'pendiente' }
    escribirVerificacion(estadosVerificacion)
    const cambios = { estadosVerificacion }
    const ruc = formulario.rucNegocio || formulario.ruc
    if (ruc && (rol === 'negocio' || rol === 'proveedor')) {
      cambios.perfiles = {
        ...state.perfiles,
        [rol]: { ...state.perfiles[rol], ruc },
      }
      escribirPerfiles(cambios.perfiles)
    }
    return cambios
  }),
  // Conecta o actualiza una red del negocio
  guardarRed: (id, valor) => set((state) => ({
    redesNegocio: { ...state.redesNegocio, [id]: valor.trim() }
  })),
  // Desconecta una red quitandola del objeto
  quitarRed: (id) => set((state) => {
    const { [id]: _quitada, ...resto } = state.redesNegocio
    return { redesNegocio: resto }
  }),
  // Cambia un ajuste y lo persiste. Se guarda al vuelo, sin botón
  // de "Guardar": es lo que espera la gente en una pantalla de
  // configuración de celular.
  guardarConfig: (rol, clave, valor) => set((state) => {
    const configuraciones = {
      ...state.configuraciones,
      [rol]: { ...state.configuraciones[rol], [clave]: valor },
    }
    escribirConfig(configuraciones)
    return { configuraciones }
  }),

  // Vuelve un grupo a sus valores de fábrica (el botón "Restablecer"
  // de cada sección). Solo toca las claves de ese grupo, no las demás.
  restablecerConfig: (rol, claves) => set((state) => {
    const restaurado = {}
    claves.forEach((clave) => {
      if (clave in CONFIG_INICIAL[rol]) restaurado[clave] = CONFIG_INICIAL[rol][clave]
    })
    const configuraciones = {
      ...state.configuraciones,
      [rol]: { ...state.configuraciones[rol], ...restaurado },
    }
    escribirConfig(configuraciones)
    return { configuraciones }
  }),

  /* ── Kiara ────────────────────────────────────────────────
     El store solo guarda los mensajes. Quién responde y con qué
     información es asunto de src/Chatbot, no del store: así el
     día que cambie el motor, esto no se toca. */
  alternarChat: () => set((state) => ({
    chat: { ...state.chat, abierto: !state.chat.abierto },
  })),

  abrirChat: () => set((state) => ({ chat: { ...state.chat, abierto: true } })),
  cerrarChat: () => set((state) => ({ chat: { ...state.chat, abierto: false } })),

  agregarMensajeChat: (mensaje) => set((state) => ({
    chat: {
      ...state.chat,
      mensajes: [...state.chat.mensajes, { id: `${Date.now()}-${Math.random()}`, ...mensaje }],
    },
  })),

  setChatPensando: (pensando) => set((state) => ({
    chat: { ...state.chat, pensando },
  })),

  limpiarChat: () => set((state) => ({
    chat: { ...state.chat, mensajes: [] },
  })),

  // Consentimiento de vitrina: el negocio autoriza o rechaza que un
  // proveedor lo muestre públicamente como cliente suyo.
  responderPermisoVitrina: (id, estado) => set((state) => ({
    permisosVitrina: state.permisosVitrina.map((p) =>
      p.id === id ? { ...p, estado } : p
    ),
  })),

  enviarNotificacionCompra: () => set((state) => {
    const notificaciones = [
      {
        id: Date.now(),
        tipo: 'notificacion_compra_proveedor',
        icono: 'bell',
        titulo: 'Notificación de compra',
        descripcion: 'Tu proveedor te envió una notificación de compra disponible.',
        fecha: new Date().toISOString(),
        leida: false,
        ruta: '/panel-negocio',
        userType: 'negocio',
      },
      ...state.notificaciones,
    ]
    escribirNotificaciones(notificaciones)
    return { notificaciones }
  }),
}))

export default useStore