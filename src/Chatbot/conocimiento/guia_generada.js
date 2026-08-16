/* ══════════════════════════════════════════════════════════════
   ARCHIVO GENERADO — NO EDITAR A MANO

   Se genera a partir de src/Chatbot/guiausuario.md con:
       npm run guia

   Cualquier cambio hecho acá se pierde en la próxima compilación.
   Para cambiar lo que sabe Kiara, editá src/Chatbot/guiausuario.md.

   Generado: 2026-08-16
   43 entradas · 10 secciones
   ══════════════════════════════════════════════════════════════ */

export const SECCIONES = [
  {
    "id": "primeros-pasos",
    "titulo": "Primeros pasos",
    "descripcion": "Crear tu cuenta y entrar por primera vez",
    "icono": "party-popper",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ]
  },
  {
    "id": "puntos",
    "titulo": "Puntos y recompensas",
    "descripcion": "Cómo se ganan, cómo se canjean y cómo subís de nivel",
    "icono": "star",
    "roles": [
      "usuario"
    ]
  },
  {
    "id": "descubrir",
    "titulo": "Encontrar negocios",
    "descripcion": "Directorio, favoritos y búsqueda",
    "icono": "search",
    "roles": [
      "usuario"
    ]
  },
  {
    "id": "mi-negocio",
    "titulo": "Administrar mi negocio",
    "descripcion": "Publicaciones, inventario y precios",
    "icono": "store",
    "roles": [
      "negocio"
    ]
  },
  {
    "id": "cotizaciones",
    "titulo": "Cotizaciones",
    "descripcion": "Pedir y responder cotizaciones entre negocios y proveedores",
    "icono": "file-text",
    "roles": [
      "negocio",
      "proveedor"
    ]
  },
  {
    "id": "proveedores",
    "titulo": "Ser proveedor",
    "descripcion": "Cobertura, catálogo y vitrina de clientes",
    "icono": "truck",
    "roles": [
      "proveedor",
      "negocio"
    ]
  },
  {
    "id": "reputacion",
    "titulo": "Reputación y ranking",
    "descripcion": "Reseñas, insignias y posición en el directorio",
    "icono": "award",
    "roles": [
      "negocio",
      "proveedor"
    ]
  },
  {
    "id": "verificacion",
    "titulo": "Verificación de cuentas",
    "descripcion": "Qué significa estar verificado y qué cambia mientras no lo estás",
    "icono": "shield-check",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ]
  },
  {
    "id": "cuenta",
    "titulo": "Mi cuenta",
    "descripcion": "Perfil, configuración, privacidad y contraseña",
    "icono": "user",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ]
  },
  {
    "id": "la-app",
    "titulo": "Moverte por la app",
    "descripcion": "Qué hace cada pantalla y cada opción del menú",
    "icono": "home",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ]
  }
]

export const ENTRADAS = [
  {
    "id": "crear-cuenta",
    "seccion": "primeros-pasos",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Cómo creo una cuenta en Vincco?",
    "resumen": "Entrás a Registrarme, elegís qué tipo de cuenta querés y completás los pasos.",
    "pasos": [
      "Tocá \"Registrarme\" en la pantalla de inicio de sesión",
      "Elegí tu perfil: Cliente, Negocio o Proveedor",
      "Completá tu nombre, correo y teléfono",
      "Seguí los pasos que te va pidiendo el formulario"
    ],
    "ruta": "/register",
    "rutaLabel": "Registro",
    "claves": [
      "crear cuenta",
      "registrarme",
      "registro",
      "nueva cuenta",
      "inscribirme",
      "darme de alta"
    ],
    "nota": "Cliente lleva menos pasos que Negocio o Proveedor, porque a esos dos se les piden datos del comercio.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "quien-es-el-dueno-de-vincco",
    "seccion": "primeros-pasos",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿quien es el dueño de vincco?",
    "resumen": "Vincco es desarrolada por Impulso Digital.",
    "pasos": [],
    "ruta": null,
    "rutaLabel": null,
    "claves": [],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "registrar-negocio",
    "seccion": "primeros-pasos",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cómo registro mi negocio?",
    "resumen": "En el registro elegís el perfil de Negocio y agregás los datos de tu comercio.",
    "pasos": [
      "Tocá \"Registrarme\" y elegí el perfil Negocio",
      "Completá tus datos personales como propietario",
      "Agregá el nombre del negocio, la categoría y la dirección",
      "Cargá tu RUC o cédula si ya lo tenés",
      "Revisá el resumen y confirmá"
    ],
    "ruta": "/register",
    "rutaLabel": "Registro",
    "claves": [
      "registrar negocio",
      "registrar comercio",
      "dar de alta mi negocio",
      "inscribir negocio",
      "mi comercio"
    ],
    "nota": "El RUC no es obligatorio para empezar, pero sin él no se desbloquea la insignia de Formalizado.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "registrar-proveedor",
    "seccion": "primeros-pasos",
    "roles": [
      "proveedor"
    ],
    "titulo": "¿Cómo me registro como proveedor?",
    "resumen": "Elegís el perfil de Proveedor y cargás tu empresa, tu rubro y tu zona de cobertura.",
    "pasos": [
      "Tocá \"Registrarme\" y elegí el perfil Proveedor",
      "Completá los datos de la empresa y la persona de contacto",
      "Indicá qué rubro abastecés",
      "Definí tu zona de cobertura: en qué municipios entregás",
      "Confirmá el registro"
    ],
    "ruta": "/register",
    "rutaLabel": "Registro",
    "claves": [
      "registrar proveedor",
      "ser proveedor",
      "distribuidora",
      "inscribir empresa",
      "abastecer"
    ],
    "nota": "La zona de cobertura es lo que permite que un negocio te encuentre cuando filtra por su municipio.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "recuperar-contrasena",
    "seccion": "primeros-pasos",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Cómo recupero mi contraseña?",
    "resumen": "Todavía no está disponible la recuperación automática de contraseña.",
    "pasos": [],
    "ruta": "/ayuda",
    "rutaLabel": "Centro de ayuda",
    "claves": [
      "recuperar contrasena",
      "olvide mi contrasena",
      "perdi la clave",
      "restablecer contrasena",
      "no puedo entrar"
    ],
    "nota": "Mientras tanto, escribí a soporte desde el Centro de ayuda.",
    "pendiente": true,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "ganar-puntos",
    "seccion": "puntos",
    "roles": [
      "usuario"
    ],
    "titulo": "¿Cómo gano puntos?",
    "resumen": "Ganás puntos comprando en los negocios afiliados usando Vincco.",
    "pasos": [
      "Comprá en cualquier negocio afiliado a Vincco",
      "Mostrá tu cuenta al momento de pagar",
      "Los puntos se suman a tu cuenta después de la compra"
    ],
    "ruta": "/puntos",
    "rutaLabel": "Mis puntos",
    "claves": [
      "ganar puntos",
      "acumular puntos",
      "sumar puntos",
      "conseguir puntos",
      "como funcionan los puntos"
    ],
    "nota": "Cada negocio decide cuántos puntos da por compra, así que no todos dan lo mismo.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "canjear-recompensas",
    "seccion": "puntos",
    "roles": [
      "usuario"
    ],
    "titulo": "¿Cómo canjeo mis puntos por recompensas?",
    "resumen": "Entrás a Mis puntos, elegís la recompensa que te alcance y la canjeás.",
    "pasos": [
      "Entrá a Mis puntos desde la barra de abajo",
      "Mirá la lista de recompensas disponibles",
      "Elegí una que puedas pagar con los puntos que tenés",
      "Confirmá el canje"
    ],
    "ruta": "/puntos",
    "rutaLabel": "Mis puntos",
    "claves": [
      "canjear",
      "canje",
      "cambiar puntos",
      "recompensas",
      "premios",
      "usar mis puntos"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "niveles",
    "seccion": "puntos",
    "roles": [
      "usuario"
    ],
    "titulo": "¿Qué son los niveles y cómo subo?",
    "resumen": "El nivel mide cuánto comprás usando Vincco. Son cuatro: Bronce, Plata, Oro y VIP.",
    "pasos": [
      "Bronce: desde 0 puntos",
      "Plata: desde 200 puntos",
      "Oro: desde 500 puntos",
      "VIP: desde 1000 puntos"
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "nivel",
      "niveles",
      "bronce",
      "plata",
      "oro",
      "vip",
      "subir de nivel",
      "categoria"
    ],
    "nota": "El nivel es interno de Vincco: se mide por los puntos que ganás comprando con la plataforma, no por antigüedad.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "vencimiento-puntos",
    "seccion": "puntos",
    "roles": [
      "usuario"
    ],
    "titulo": "¿Se vencen mis puntos?",
    "resumen": "Sí, los puntos tienen vencimiento y Vincco te avisa antes de que pase.",
    "pasos": [
      "Entrá a Configuración",
      "Buscá la sección Mis puntos",
      "Activá \"Avisarme si mis puntos están por vencer\"",
      "Elegí con cuánta anticipación querés el aviso: 3, 7 o 15 días"
    ],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "vencen los puntos",
      "vencimiento",
      "expiran",
      "caducan",
      "perder puntos"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "buscar-negocios",
    "seccion": "descubrir",
    "roles": [
      "usuario"
    ],
    "titulo": "¿Dónde busco negocios?",
    "resumen": "En el Directorio, donde podés filtrar por categoría.",
    "pasos": [
      "Entrá al Directorio",
      "Elegí una categoría o escribí lo que buscás",
      "Tocá un negocio para ver su perfil"
    ],
    "ruta": "/directorio",
    "rutaLabel": "Directorio",
    "claves": [
      "buscar negocio",
      "directorio",
      "encontrar comercio",
      "donde comprar",
      "categorias"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "favoritos",
    "seccion": "descubrir",
    "roles": [
      "usuario"
    ],
    "titulo": "¿Dónde veo mis favoritos?",
    "resumen": "En la pestaña Favoritos de la barra de abajo.",
    "pasos": [
      "Tocá Favoritos en la barra de abajo",
      "Ahí están todos los negocios que marcaste con el corazón"
    ],
    "ruta": "/favoritos",
    "rutaLabel": "Favoritos",
    "claves": [
      "favoritos",
      "guardados",
      "corazon",
      "mis negocios favoritos"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "negocios-cercanos",
    "seccion": "descubrir",
    "roles": [
      "usuario"
    ],
    "titulo": "¿Cómo cambio el radio de negocios cercanos?",
    "resumen": "Desde Configuración, en la sección Qué negocios veo.",
    "pasos": [
      "Entrá a Configuración",
      "Buscá \"Qué negocios veo\"",
      "Elegí el radio: 1 km, 5 km o todo el municipio"
    ],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "negocios cercanos",
      "radio",
      "distancia",
      "cerca de mi",
      "kilometros"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "publicar-producto",
    "seccion": "mi-negocio",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cómo publico un producto?",
    "resumen": "Desde el Panel de negocio, en la sección de publicaciones.",
    "pasos": [
      "Entrá al Panel de negocio",
      "Buscá la sección de Publicaciones",
      "Tocá el botón de agregar",
      "Completá nombre, precio en córdobas y descripción",
      "Guardá la publicación"
    ],
    "ruta": "/panel-negocio",
    "rutaLabel": "Panel de negocio",
    "claves": [
      "publicar producto",
      "publicacion",
      "subir producto",
      "agregar producto",
      "anunciar"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "editar-inventario",
    "seccion": "mi-negocio",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cómo edito mi inventario?",
    "resumen": "En el Panel de negocio, en la sección de inventario, tocás el producto que querés cambiar.",
    "pasos": [
      "Entrá al Panel de negocio",
      "Bajá a la sección de Inventario",
      "Tocá el producto que querés editar",
      "Cambiá la cantidad, el precio o la unidad",
      "Guardá"
    ],
    "ruta": "/panel-negocio",
    "rutaLabel": "Panel de negocio",
    "claves": [
      "inventario",
      "editar inventario",
      "stock",
      "existencias",
      "cantidad",
      "productos"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "alerta-stock",
    "seccion": "mi-negocio",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cómo cambio cuándo me avisan de stock bajo?",
    "resumen": "Desde Configuración, en la sección Inventario, elegís a partir de cuántas unidades querés el aviso.",
    "pasos": [
      "Entrá a Configuración",
      "Buscá la sección Inventario",
      "Cambiá \"Avisarme cuando queden menos de\""
    ],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "stock bajo",
      "alerta de stock",
      "aviso de inventario",
      "se me acaba",
      "umbral"
    ],
    "nota": "Una ferretería y una pulpería no manejan los mismos volúmenes, por eso cada quien pone su número.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "actualizar-precios",
    "seccion": "mi-negocio",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cómo actualizo mis precios?",
    "resumen": "Editás cada producto desde el inventario del Panel de negocio.",
    "pasos": [
      "Entrá al Panel de negocio",
      "Abrí la sección de Inventario",
      "Tocá el producto",
      "Cambiá el precio y guardá"
    ],
    "ruta": "/panel-negocio",
    "rutaLabel": "Panel de negocio",
    "claves": [
      "actualizar precios",
      "cambiar precio",
      "subir precio",
      "precios"
    ],
    "nota": "Todos los precios en Vincco van en córdobas.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "puntos-que-doy",
    "seccion": "mi-negocio",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cuántos puntos le doy a mis clientes?",
    "resumen": "Lo decidís vos desde Configuración: cuántos puntos das por cada 100 córdobas de compra.",
    "pasos": [
      "Entrá a Configuración",
      "Buscá la sección \"Puntos que doy\"",
      "Ajustá los puntos por cada 100 córdobas",
      "Si querés, activá un día de puntos dobles"
    ],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "puntos que doy",
      "dar puntos",
      "cuantos puntos",
      "puntos dobles",
      "recompensar clientes"
    ],
    "nota": "Mientras más puntos das, más le conviene al cliente elegirte a vos.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "pedir-cotizacion",
    "seccion": "cotizaciones",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cómo le pido una cotización a un proveedor?",
    "resumen": "Buscás el proveedor en el directorio y le enviás la solicitud desde su perfil.",
    "pasos": [
      "Entrá al Directorio y buscá el proveedor",
      "Abrí su perfil",
      "Tocá la opción de solicitar cotización",
      "Escribí qué productos necesitás y en qué cantidad",
      "Enviá la solicitud"
    ],
    "ruta": "/directorio",
    "rutaLabel": "Directorio",
    "claves": [
      "pedir cotizacion",
      "cotizar",
      "solicitar precio",
      "contactar proveedor",
      "cotizacion"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "responder-cotizacion",
    "seccion": "cotizaciones",
    "roles": [
      "proveedor"
    ],
    "titulo": "¿Cómo respondo una cotización?",
    "resumen": "Las solicitudes te llegan al panel y ahí mismo respondés con tus precios.",
    "pasos": [
      "Entrá a tu panel",
      "Abrí la solicitud de cotización que te llegó",
      "Cargá los precios y las condiciones",
      "Enviá la respuesta al negocio"
    ],
    "ruta": "/recompensas",
    "rutaLabel": "Mi panel",
    "claves": [
      "responder cotizacion",
      "contestar cotizacion",
      "enviar precios",
      "solicitudes"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "tiempo-respuesta",
    "seccion": "cotizaciones",
    "roles": [
      "negocio",
      "proveedor"
    ],
    "titulo": "¿En cuánto tiempo tengo que responder?",
    "resumen": "Lo elegís vos en Configuración, y cumplirlo te da la insignia de Respuesta rápida.",
    "pasos": [
      "Entrá a Configuración",
      "Buscá la sección Cotizaciones",
      "Elegí en cuánto te comprometés a responder"
    ],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "tiempo de respuesta",
      "cuanto tardo",
      "responder rapido",
      "insignia respuesta"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "zona-cobertura",
    "seccion": "proveedores",
    "roles": [
      "proveedor"
    ],
    "titulo": "¿Cómo defino mi zona de cobertura?",
    "resumen": "Desde tu perfil indicás en qué municipios entregás.",
    "pasos": [
      "Entrá a Mi perfil",
      "Editá el campo de zona de cobertura",
      "Escribí los municipios donde llegás",
      "Guardá los cambios"
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "cobertura",
      "zona",
      "municipios",
      "donde entrego",
      "a donde llego"
    ],
    "nota": "Sin cobertura definida no aparecés cuando un negocio filtra por su zona.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "vitrina-clientes",
    "seccion": "proveedores",
    "roles": [
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Qué es la vitrina de clientes?",
    "resumen": "Es la lista de negocios que un proveedor puede mostrar públicamente como clientes suyos, pero solo con permiso de cada uno.",
    "pasos": [
      "El proveedor le pide permiso al negocio",
      "El negocio ve la solicitud en Configuración, en \"Quién puede mostrarme\"",
      "El negocio autoriza o rechaza",
      "Solo los autorizados aparecen en el perfil público del proveedor"
    ],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "vitrina",
      "permiso",
      "mostrar clientes",
      "quien puede mostrarme",
      "consentimiento",
      "autorizar proveedor"
    ],
    "nota": "Un proveedor no puede autorizarse solo: la decisión es siempre del negocio.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "negocios-asociados",
    "seccion": "proveedores",
    "roles": [
      "proveedor"
    ],
    "titulo": "¿Dónde veo los negocios que abastezco?",
    "resumen": "En la pantalla de Negocios asociados. Ahí ves los que ya te aceptaron y los que todavía no respondieron tu solicitud.",
    "pasos": [],
    "ruta": "/negocios-asociados",
    "rutaLabel": "Negocios asociados",
    "claves": [
      "negocios asociados",
      "mis clientes",
      "a quien abastezco",
      "negocios que atiendo"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "agregar-negocio-asociado",
    "seccion": "proveedores",
    "roles": [
      "proveedor"
    ],
    "titulo": "¿Cómo agrego un negocio a mis asociados?",
    "resumen": "Le mandás una solicitud de asociación, no lo agregás directo: el negocio tiene que aceptarla primero.",
    "pasos": [
      "Andá a Negocios asociados y tocá \"Solicitar asociación\"",
      "Completá los datos del negocio (nombre y WhatsApp son obligatorios)",
      "Enviá la solicitud: le llega un aviso al negocio",
      "Esperá a que el negocio la acepte o la rechace desde sus Avisos"
    ],
    "ruta": "/negocios-asociados",
    "rutaLabel": "Negocios asociados",
    "claves": [
      "agregar negocio asociado",
      "solicitar asociacion",
      "nuevo negocio asociado",
      "pedir asociacion"
    ],
    "nota": "Mientras está pendiente, no le podés mandar otra solicitud al mismo negocio ni enviarle una cotización — recién se habilita cuando la acepta. Si te rechaza, podés volver a intentar más adelante. Necesitás tu cuenta verificada para solicitar asociaciones.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "ranking",
    "seccion": "reputacion",
    "roles": [
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Cómo funciona el ranking?",
    "resumen": "Es una posición mensual dentro de tu categoría, que sube según tus ventas, tus reseñas y qué tan rápido respondés.",
    "pasos": [],
    "ruta": "/dashboard",
    "rutaLabel": "Dashboard",
    "claves": [
      "ranking",
      "posicion",
      "puesto",
      "top",
      "mejor negocio",
      "clasificacion"
    ],
    "nota": "El ranking se calcula por categoría, así que competís con negocios parecidos al tuyo.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "resenas",
    "seccion": "reputacion",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cómo veo y respondo las reseñas?",
    "resumen": "Las reseñas aparecen en tu perfil de negocio y podés activar el aviso desde Configuración.",
    "pasos": [
      "Entrá a Mi perfil para ver las reseñas que te dejaron",
      "Para que te avisen de las nuevas, andá a Configuración",
      "Activá \"Avisarme de reseñas nuevas\""
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "resenas",
      "opiniones",
      "calificaciones",
      "estrellas",
      "comentarios"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "insignias",
    "seccion": "reputacion",
    "roles": [
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Qué son las insignias?",
    "resumen": "Son logros que se muestran en tu perfil y le dicen al cliente que sos confiable.",
    "pasos": [
      "Negocio verificado: cuando Vincco valida tu documentación",
      "Respuesta rápida: si respondés cotizaciones en menos de 2 horas",
      "Top 3 del mes: si estás entre los mejores de tu categoría",
      "Formalizado: cuando cargás tu RUC"
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "insignias",
      "logros",
      "medallas",
      "verificado",
      "badge"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "verificacion-menu",
    "seccion": "verificacion",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Cómo hago para estar verificado en Vincco?",
    "resumen": "Depende de qué tipo de cuenta tenés. ¿Cuál de estas sos?",
    "pasos": [],
    "ruta": null,
    "rutaLabel": null,
    "claves": [
      "verificado",
      "verificacion",
      "estar verificado",
      "cuenta verificada",
      "verificar mi cuenta",
      "ser verificado",
      "como me verifico",
      "quiero verificarme",
      "miembro verificado",
      "revision de cuenta",
      "solicitar verificacion",
      "verificacion pendiente",
      "continuar sin verificacion",
      "que puedo hacer sin verificar",
      "cuenta sin verificar"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "menu",
    "opciones": [
      {
        "id": "verificacion-cliente",
        "texto": "Quiero ser cliente verificado de Vincco"
      },
      {
        "id": "verificacion-negocio",
        "texto": "Quiero ser negocio verificado de Vincco"
      },
      {
        "id": "verificacion-proveedor",
        "texto": "Quiero ser proveedor verificado de Vincco"
      }
    ]
  },
  {
    "id": "verificacion-cliente",
    "seccion": "verificacion",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "Quiero ser cliente verificado de Vincco",
    "resumen": "Al terminar tu registro, Vincco te muestra la pantalla \"Felicidades, ya eres parte de VINCCO\" con un botón para solicitar la verificación de tu cuenta. Como cliente no se te pide RUC ni ningún documento: es un solo botón.",
    "pasos": [
      "Al completar el registro, tocá \"Solicitar verificación\" en esa pantalla",
      "Si en ese momento preferís entrar de una vez, tocá \"Continuar sin verificación\": podés pedirla después",
      "Para pedirla más tarde, andá a Mi perfil y tocá \"Solicitar verificación\" en el aviso que aparece ahí",
      "Esperá la revisión del equipo de Vincco"
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "cliente verificado",
      "verificado como cliente",
      "solicitar verificacion cliente",
      "verificacion pendiente cliente",
      "que pasa si no soy cliente verificado"
    ],
    "nota": "La revisión tarda entre 24 y 48 horas y te llega la confirmación a tu correo electrónico. Mientras no estés verificado podés seguir usando la app y agregar productos a favoritos sin ningún límite, pero no participás en los rankings de clientes, no sumás puntos y tu perfil no muestra la insignia de verificado.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "verificacion-negocio",
    "seccion": "verificacion",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "Quiero ser negocio verificado de Vincco",
    "resumen": "Al terminar tu registro, Vincco te muestra la pantalla \"Felicidades, ya eres parte de VINCCO\" con un botón para solicitar la verificación de tu negocio. Ahí se te pide tu número de RUC.",
    "pasos": [
      "Al completar el registro, tocá \"Solicitar verificación\" en esa pantalla",
      "Cargá tu número de RUC si ya lo tenés",
      "Si todavía no tenés RUC, tocá \"No tengo RUC, continuar igual\": la solicitud se envía igual y el equipo de Vincco te contacta para ver cómo verificarte",
      "Si preferís entrar de una vez sin pedir nada, tocá \"Continuar sin verificación\": podés solicitarla después desde Mi perfil",
      "Esperá la revisión del equipo de Vincco"
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "negocio verificado",
      "verificar mi negocio",
      "solicitar verificacion negocio",
      "verificacion pendiente negocio",
      "ruc negocio",
      "que pasa si no verifico mi negocio",
      "no puedo publicar",
      "no recibo cotizaciones"
    ],
    "nota": "La revisión tarda entre 24 y 48 horas y te llega la confirmación a tu correo electrónico. Mientras no estés verificado podés ver y usar todo tu Panel, el Calendario, los Avisos y el menú — nada de eso se bloquea —, pero no podés publicar productos ni promociones, ni recibir y responder cotizaciones de tus proveedores.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "verificacion-proveedor",
    "seccion": "verificacion",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "Quiero ser proveedor verificado de Vincco",
    "resumen": "Al terminar tu registro, Vincco te muestra la pantalla \"Felicidades, ya eres parte de VINCCO\" con un botón para solicitar la verificación de tu empresa. Ahí se te pide tu número de RUC.",
    "pasos": [
      "Al completar el registro, tocá \"Solicitar verificación\" en esa pantalla",
      "Cargá tu número de RUC si ya lo tenés",
      "Si todavía no tenés RUC, tocá \"No tengo RUC, continuar igual\": la solicitud se envía igual y el equipo de Vincco te contacta para ver cómo verificarte",
      "Si preferís entrar de una vez sin pedir nada, tocá \"Continuar sin verificación\": podés solicitarla después desde Mi perfil",
      "Esperá la revisión del equipo de Vincco"
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "proveedor verificado",
      "verificar mi empresa",
      "solicitar verificacion proveedor",
      "verificacion pendiente proveedor",
      "ruc proveedor",
      "que pasa si no verifico mi empresa",
      "no puedo enviar cotizaciones",
      "no puedo agregar negocios asociados"
    ],
    "nota": "La revisión tarda entre 24 y 48 horas y te llega la confirmación a tu correo electrónico. Mientras no estés verificado podés ver y usar todo tu Panel, el Calendario, los Avisos y el menú — nada de eso se bloquea —, pero no podés publicar tus productos, no podés enviar cotizaciones a los negocios ni agregar negocios nuevos en Negocios Asociados.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "editar-perfil",
    "seccion": "cuenta",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Cómo edito mi perfil?",
    "resumen": "Entrás a Mi perfil y tocás Editar en la ficha de datos.",
    "pasos": [
      "Abrí el menú y entrá a Mi perfil",
      "En \"Datos personales\" tocá Editar",
      "Cambiá lo que necesités",
      "Tocá Guardar cambios"
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "editar perfil",
      "cambiar mis datos",
      "actualizar informacion",
      "mi perfil",
      "foto de perfil"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "ocultar-datos",
    "seccion": "cuenta",
    "roles": [
      "usuario"
    ],
    "titulo": "¿Cómo oculto mis datos personales?",
    "resumen": "Con el botón de ojo que está en la ficha de datos de tu perfil.",
    "pasos": [
      "Entrá a Mi perfil",
      "En \"Datos personales\" tocá el botón con forma de ojo",
      "Tu teléfono, correo y dirección se tapan con puntos",
      "Tocá el ojo otra vez para volver a mostrarlos"
    ],
    "ruta": "/perfil",
    "rutaLabel": "Mi perfil",
    "claves": [
      "ocultar datos",
      "esconder informacion",
      "privacidad",
      "ojo",
      "tapar mis datos"
    ],
    "nota": "Vincco recuerda tu elección: si los dejás ocultos, siguen ocultos la próxima vez que entrés.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "cambiar-contrasena",
    "seccion": "cuenta",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Cómo cambio mi contraseña?",
    "resumen": "Todavía no está disponible el cambio de contraseña desde la app.",
    "pasos": [],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "cambiar contrasena",
      "nueva clave",
      "modificar contrasena"
    ],
    "nota": null,
    "pendiente": true,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "configuracion",
    "seccion": "cuenta",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Qué puedo cambiar en Configuración?",
    "resumen": "Privacidad, avisos, cómo se ve la app, idioma, moneda y tu cuenta. Las opciones cambian según tu tipo de perfil.",
    "pasos": [
      "Abrí el menú lateral",
      "Entrá a Configuraciones",
      "Usá el panel de la izquierda para saltar a la sección que buscás"
    ],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "configuracion",
      "ajustes",
      "opciones",
      "preferencias",
      "settings"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "cerrar-sesion",
    "seccion": "cuenta",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Cómo cierro sesión?",
    "resumen": "Desde el menú lateral o desde Configuración, en Cuenta y seguridad.",
    "pasos": [],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "cerrar sesion",
      "salir",
      "desconectarme",
      "logout"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "barra-abajo",
    "seccion": "la-app",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Qué es cada botón de la barra de abajo?",
    "resumen": "Es el acceso rápido a las cinco pantallas que más usás. Cambia según tu tipo de cuenta.",
    "pasos": [
      "Inicio: el feed principal con promociones y negocios",
      "Favoritos: los negocios que marcaste",
      "Premios o Panel: tus puntos si sos cliente, tu panel si sos negocio o proveedor",
      "Calendario y Avisos: eventos y notificaciones"
    ],
    "ruta": "/home",
    "rutaLabel": "Inicio",
    "claves": [
      "barra de abajo",
      "menu inferior",
      "botones",
      "navegacion",
      "pestanas",
      "tabs"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "menu-hamburguesa",
    "seccion": "la-app",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Qué hay en el menú del costado?",
    "resumen": "Perfil, Inicio, Guía de usuario, Ayuda y soporte, Configuraciones y Redes sociales. Los negocios y proveedores ven además su sección propia.",
    "pasos": [],
    "ruta": "/guia",
    "rutaLabel": "Guía de usuario",
    "claves": [
      "menu",
      "hamburguesa",
      "menu lateral",
      "opciones del menu",
      "tres rayas"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "notificaciones",
    "seccion": "la-app",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Dónde veo mis notificaciones?",
    "resumen": "En Avisos, el último botón de la barra de abajo.",
    "pasos": [
      "Tocá Avisos en la barra de abajo",
      "Filtrá entre todas, no leídas y leídas",
      "Tocá una notificación para ir a la pantalla que le corresponde"
    ],
    "ruta": "/notificaciones",
    "rutaLabel": "Notificaciones",
    "claves": [
      "notificaciones",
      "avisos",
      "alertas",
      "campanita",
      "mensajes"
    ],
    "nota": "Si apagaste un tipo de aviso en Configuración, esas notificaciones dejan de aparecer acá.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "responder-asociacion",
    "seccion": "la-app",
    "roles": [
      "negocio"
    ],
    "titulo": "¿Cómo acepto o rechazo una solicitud de asociación de un proveedor?",
    "resumen": "Cuando un proveedor quiere asociarse con tu negocio, te llega un aviso a Avisos con dos botones: Aceptar y Rechazar. Se responde ahí mismo, sin ir a ninguna otra pantalla.",
    "pasos": [
      "Tocá Avisos en la barra de abajo",
      "Buscá el aviso de \"Solicitud de asociación\"",
      "Tocá Aceptar si querés trabajar con ese proveedor, o Rechazar si no",
      "Al proveedor le llega un aviso avisándole tu respuesta"
    ],
    "ruta": "/notificaciones",
    "rutaLabel": "Notificaciones",
    "claves": [
      "solicitud de asociacion",
      "proveedor quiere asociarse",
      "aceptar proveedor",
      "rechazar proveedor",
      "nueva solicitud"
    ],
    "nota": "Solo al aceptar quedan asociados de verdad: recién ahí el proveedor te puede enviar cotizaciones y aparecés en su lista de negocios asociados. Nadie queda asociado a la fuerza ni sin que lo apruebes vos.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "calendario",
    "seccion": "la-app",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Para qué sirve el Calendario?",
    "resumen": "Muestra tus fechas importantes: promociones que terminan, puntos por vencer, entregas y pedidos.",
    "pasos": [],
    "ruta": "/calendario",
    "rutaLabel": "Calendario",
    "claves": [
      "calendario",
      "fechas",
      "eventos",
      "agenda",
      "recordatorios"
    ],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "moneda",
    "seccion": "la-app",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿En qué moneda están los precios?",
    "resumen": "Todos los montos de Vincco están en córdobas nicaragüenses.",
    "pasos": [],
    "ruta": "/config",
    "rutaLabel": "Configuración",
    "claves": [
      "moneda",
      "cordobas",
      "precios",
      "dolares",
      "en que moneda"
    ],
    "nota": "Vincco opera en Nicaragua. Aunque en Configuración podés elegir ver dólares, los montos se siguen mostrando en córdobas hasta que haya un tipo de cambio del día.",
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  },
  {
    "id": "quien-creo-vincco",
    "seccion": "la-app",
    "roles": [
      "usuario",
      "negocio",
      "proveedor"
    ],
    "titulo": "¿Quien  creo VINCCO?",
    "resumen": "> VINCCO fue creada por el grupo de desarrolladores Impulso Digital.",
    "pasos": [],
    "ruta": null,
    "rutaLabel": null,
    "claves": [],
    "nota": null,
    "pendiente": false,
    "tipo": "pregunta",
    "opciones": []
  }
]

/* ── Ayudantes que usan la pantalla y Kiara ──────────────── */

// Devuelve solo lo que le sirve a ese rol. El cliente no tiene
// inventario y el proveedor no da puntos: mostrarles eso solo
// los confunde.
export function entradasDelRol(rol, entradas = ENTRADAS) {
  return entradas.filter((e) => e.roles.includes(rol))
}

export function seccionesDelRol(rol, secciones = SECCIONES) {
  return secciones.filter((s) => s.roles.includes(rol))
}

export function entradaPorId(id, entradas = ENTRADAS) {
  return entradas.find((e) => e.id === id) || null
}
