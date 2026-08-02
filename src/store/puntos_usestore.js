import { create } from 'zustand'
import { negociosAsociados as negociosAsociadosIniciales } from '../data/data_falso'

function generarNotificaciones() {
  const ahora = Date.now()
  const h = (horas) => new Date(ahora - horas * 3600000).toISOString()

  const cliente = [
    { id: 1, tipo: 'cotizacion_recibida', icono: 'package', titulo: 'Cotización recibida', descripcion: 'Ferretería Don Chico respondió a tu solicitud de cotización.', fecha: h(1), leida: false, ruta: '/home', userType: 'usuario' },
    { id: 2, tipo: 'cambio_precio', icono: 'dollar-sign', titulo: 'Cambio de precio', descripcion: 'Martillo Stanley bajó de precio: ahora C$180.', fecha: h(4), leida: false, ruta: '/favoritos', userType: 'usuario' },
    { id: 3, tipo: 'puntos_obtenidos', icono: 'gift', titulo: 'Puntos obtenidos', descripcion: 'Recibiste 50 puntos por tu compra en Pulpería La Esquina.', fecha: h(8), leida: true, ruta: '/puntos', userType: 'usuario' },
    { id: 4, tipo: 'recompensa_disponible', icono: 'award', titulo: 'Recompensa disponible', descripcion: 'Ya puedes canjear tus 200 puntos por un Cupón de C$50.', fecha: h(12), leida: false, ruta: '/puntos', userType: 'usuario' },
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

const useStore = create((set) => ({
  usuario: {
    nombre: 'Leslie',
    puntos: 340,
    nivel: 'Bronce'
  },
  negocio: {
    nombre: 'Ferretería Don Chico',
    categoria: 'ferretería',
    telefono: '1234-5678',
    direccion: 'Managua, Nicaragua',
  },
  isLoggedIn: false,
  userType: 'usuario',
  negociosAsociados: negociosAsociadosIniciales,
  // Redes que el comercio o proveedor conecto a su perfil.
  // La clave es el id de la red y el valor es el usuario o telefono.
  redesNegocio: {
    whatsapp: '+505 8855 6677',
    facebook: 'vinccolocal',
  },
  // Codigo con el que el usuario invita a otros. En produccion
  // deberia venir del backend al crear la cuenta.
  codigoInvitacion: 'VINCCO-A4K9',
  ...generarNotificaciones(),
  ...generarEventosCalendario(),
  agregarPuntos: (cantidad) => set((state) => ({
    usuario: {
      ...state.usuario,
      puntos: state.usuario.puntos + cantidad
    }
  })),
  setLoggedIn: (val) => set({ isLoggedIn: val }),
  setUserType: (tipo) => set({ userType: tipo }),
  setNegocio: (data) => set({ negocio: data }),
  marcarNotificacionLeida: (id) => set((state) => ({
    notificaciones: state.notificaciones.map((n) =>
      n.id === id ? { ...n, leida: true } : n
    )
  })),
  marcarTodasLeidas: () => set((state) => ({
    notificaciones: state.notificaciones.map((n) => ({ ...n, leida: true }))
  })),
  agregarNegocioAsociado: (datos) => {
    const nuevo = { id: Date.now(), estado: 'Activo', ...datos }
    set((state) => ({ negociosAsociados: [nuevo, ...state.negociosAsociados] }))
    return nuevo.id
  },
  // Actualiza solo los campos que vienen en datos y conserva el resto
  // (id, estado y color no se tocan desde el formulario)
  editarNegocioAsociado: (id, datos) => set((state) => ({
    negociosAsociados: state.negociosAsociados.map((n) =>
      n.id === id ? { ...n, ...datos } : n
    )
  })),
  // Conecta o actualiza una red del negocio
  guardarRed: (id, valor) => set((state) => ({
    redesNegocio: { ...state.redesNegocio, [id]: valor.trim() }
  })),
  // Desconecta una red quitandola del objeto
  quitarRed: (id) => set((state) => {
    const { [id]: _quitada, ...resto } = state.redesNegocio
    return { redesNegocio: resto }
  }),
  enviarNotificacionCompra: () => set((state) => ({
    notificaciones: [
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
    ],
  })),
}))

export default useStore