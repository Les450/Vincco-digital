// Datos, validadores y textos de la verificación KYC/DDC de Vincco.
// Marco legal: Ley 977 (Ley Contra el Lavado de Activos, Nicaragua),
// CONAMI, DGI y Registro Mercantil. Los textos legales que se
// muestran son paráfrasis de los artículos citados: antes de mandar
// esto a producción hay que validarlos palabra por palabra con un
// abogado. Los requisitos (cédula, comprobante de domicilio, DGI,
// escritura, poder, acta, certificaciones) son los que pide la Ley
// 977 y su reglamento para conocer al cliente.

export const PASOS_KYC = [
  { numero: 1, titulo: 'Identificación personal', corto: 'Identidad', icono: 'user' },
  { numero: 2, titulo: 'Documentos', corto: 'Documentos', icono: 'file-text' },
  { numero: 3, titulo: 'Datos tributarios', corto: 'DGI', icono: 'wallet' },
  { numero: 4, titulo: 'Datos de tu rol', corto: 'Rol', icono: 'shield' },
]

export const NACIONALIDADES = [
  'Nicaragüense',
  'Hondureña',
  'Costarricense',
  'Guatemalteca',
  'Salvadoreña',
  'Panameña',
  'Mexicana',
  'Colombiana',
  'Venezolana',
  'Estadounidense',
  'Española',
  'Otra',
]

// DGI: regímenes a los que puede pertenecer la persona natural.
export const REGIMENES_DGI = ['Cuota Fija', 'General', 'Pequeño Contribuyente']

export const GIROS_NEGOCIO = [
  'Abarrotería',
  'Ferretería',
  'Farmacia',
  'Ropa y calzado',
  'Restaurante',
  'Electrodomésticos',
  'Mueblería',
  'Papelería',
  'Materiales de construcción',
  'Otro',
]

// Clasificación MIPYME de Nicaragua (Ley 645): micro, pequeña, mediana.
export const TAMANOS_NEGOCIO = [
  'Micro (hasta 2 empleados)',
  'Pequeño (3 a 30 empleados)',
  'Mediano (31 a 160 empleados)',
  'Grande (más de 160 empleados)',
]

export const CATEGORIAS_PROVEEDOR = [
  'Alimentos',
  'Bebidas',
  'Construcción',
  'Ferretería',
  'Textiles',
  'Electrónica',
  'Limpieza',
  'Papelería y oficina',
  'Otro',
]

export const CAPACIDADES_DISTRIBUCION = [
  'Local (un municipio)',
  'Departamental',
  'Nacional',
  'Regional (Centroamérica)',
]

export const VOLUMENES_MENSUALES = [
  'Menos de 500 unidades',
  '500 a 5,000 unidades',
  '5,001 a 50,000 unidades',
  'Más de 50,000 unidades',
]

export const INTERESES_CLIENTE = [
  'Tecnología',
  'Ropa y moda',
  'Hogar',
  'Alimentos',
  'Salud y bienestar',
  'Entretenimiento',
  'Otro',
]

export const CERTIFICACIONES_PROVEEDOR = [
  'ISO 9001',
  'ISO 22000',
  'HACCP',
  'BRCGS',
  'Registro sanitario',
  'Certificado de origen',
  'Otra',
]

// ── Documentos de identidad por nacionalidad ─────────────────
// El número de identidad se valida según la nacionalidad elegida,
// no con un solo formato: cada país tiene su propio documento.
//
// Nicaragua (cédula del CSE): XXX-XXXXXX-XXXXX
//   3 dígitos del municipio · 6 de fecha DDMMAA · 4 correlativo ·
//   1 letra verificadora (alfabeto Módulo 23 del CSE).
//   Referencias: Ley N° 1241 (Ley de Identificación Ciudadana),
//   validadores públicos concordantes (módulo 23, 23 letras sin
//   I/O/Ñ/Z: ABCDEFGHJKLMNPQRSTUVWXY).
//
// El Salvador: DUI de 8 dígitos + dígito (Decreto Legislativo 203:
// desde 2022 el DUI es también el NIT de los nacionales).
// Costa Rica: cédula del TSE "P-TTTT-AAAA" (9-10 dígitos) y formato
// de Hacienda "0P-TTTT-AAAA" (ej: 01-0913-0259).
// Guatemala: CUI/DPI = 13 dígitos: 8 de registro + verificador +
// 2 departamento + 2 municipio (RENAP).
// Honduras: DNI de 13 dígitos en grupos 4-4-5 (RNP).
// Panamá: provincia-libro-folio, ej: 3-1234-5678, N/PE/E/PI.
// México: CURP alfanumérica de 18 caracteres (RENAPO).
// Colombia: cédula de ciudadanía 5-10 dígitos (NUIP de 10 desde
// 2004, sin dígito verificador).
// Venezuela: V- + 7-8 dígitos (E para extranjeros).
// Estados Unidos: SSN de 9 dígitos en grupos 3-2-4.
// España: DNI 8 dígitos + letra; NIE X/Y/Z + 7 dígitos + letra.

// Códigos de los 153 municipios de Nicaragua (y 888 = nacido en el
// exterior) usados como prefijo de la cédula.
const MUNICIPIOS_NI = [
  '001','002','003','004','005','006','007','008','009',
  '041','042','043','044','045','046','047','048',
  '081','082','083','084','085','086','087','088','089','090','091','092','093',
  '121','122','123','124','125','126','127','128','129','130',
  '161','162','163','164','165','166',
  '201','202','203','204',
  '241','242','243','244','245','246','247',
  '281','283','284','285','286','287','288','289','290','291',
  '321','322','323','324','325','326','327','328','329',
  '361','362','363','364','365','366',
  '401','402','403','404','405','406','407','408','409',
  '441','442','443','444','445','446','447','448','449','450','451','452','453','454',
  '481','482','483','484','485','486','487','488','489','490','491','492','493',
  '521','522','523','524','525','526',
  '561','562','563','564','565','566','567','568','569','570',
  '601','602','603','604','605','606','607','608','610','611','612',
  '615','616','619','624','626','627','628',
  '888',
]

// Alfabeto de 23 letras del CSE para la letra verificadora.
const LETRAS_CEDULA_NI = 'ABCDEFGHJKLMNPQRSTUVWXY'

// Fecha DDMMAA real (meses, días y años bisiestos).
function esFechaValida(ddmmaa) {
  const dia = Number(ddmmaa.slice(0, 2))
  const mes = Number(ddmmaa.slice(2, 4))
  const anio = Number(ddmmaa.slice(4, 6))
  if (mes < 1 || mes > 12) return false
  const bisiesto = anio % 4 === 0
  const diasMes = [31, bisiesto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return dia >= 1 && dia <= diasMes[mes - 1]
}

// Devuelve '' si la cédula es válida o un mensaje con el motivo.
export function validarCedulaNI(valor) {
  const v = String(valor || '').trim().toUpperCase()
  if (!/^\d{3}-\d{6}-\d{4}[A-Z]$/.test(v)) {
    return 'Formato de cédula nicaragüense: 001-000000-0000X (3 de municipio, 6 de fecha DDMMAA, 4 correlativo y letra)'
  }
  const municipio = v.slice(0, 3)
  const fecha = v.slice(4, 10)
  const letra = v.slice(-1)
  if (municipio !== '888' && !MUNICIPIOS_NI.includes(municipio)) {
    return `El código ${municipio} no corresponde a un municipio de Nicaragua`
  }
  if (!esFechaValida(fecha)) {
    return 'La fecha de nacimiento que lleva la cédula no es válida'
  }
  const numeros = v.replace(/-/g, '').slice(0, 13)
  // eslint-disable-next-line no-undef -- BigInt literal global (ES2020)
  const letraEsperada = LETRAS_CEDULA_NI[Number(BigInt(numeros) % 23n)]
  if (letra !== letraEsperada) {
    return `La letra de verificación no coincide: para estos dígitos la letra correcta es ${letraEsperada}`
  }
  return ''
}

// Los demás países: 'regex' es la forma del documento; 'mascara'
// define cómo se auto-insertan los guiones mientras se escribe
// (null = sin máscara); 'verificar' permite validación extra.
export const FORMATOS_ID = {
  'Nicaragüense': {
    nombre: 'cédula de identidad',
    ejemplo: '001-000000-0000X',
    mascara: { grupos: [3, 6, 4], letra: true },
    verificar: validarCedulaNI,
  },
  Hondureña: {
    nombre: 'DNI',
    ejemplo: '0801-1990-12345',
    mascara: { grupos: [4, 4, 5] },
    regex: /^\d{4}-\d{4}-\d{5}$/,
  },
  Costarricense: {
    nombre: 'cédula',
    ejemplo: '1-1234-5678',
    mascara: null,
    regex: /^(0\d-\d{4}-\d{4}|\d-\d{4}-\d{4})$/,
  },
  Guatemalteca: {
    nombre: 'CUI (DPI)',
    ejemplo: '1234-56789-0101',
    mascara: { grupos: [4, 5, 4] },
    regex: /^\d{4}-\d{5}-\d{4}$/,
  },
  Salvadoreña: {
    nombre: 'DUI',
    ejemplo: '01234567-8',
    mascara: { grupos: [8, 1] },
    regex: /^\d{8}-\d$/,
  },
  Panameña: {
    nombre: 'cédula',
    ejemplo: '3-1234-5678',
    mascara: null,
    regex: /^(?:[0-9]{1,2}|N|E|PE|PI)(?:AV|PI)?-\d{4}-\d{4,6}$/,
  },
  Mexicana: {
    nombre: 'CURP',
    ejemplo: 'ABCD112233MGHIJL90',
    mascara: null,
    regex: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i,
  },
  Colombiana: {
    nombre: 'cédula de ciudadanía',
    ejemplo: '1020304050',
    mascara: null,
    regex: /^\d{5,10}$/,
  },
  Venezolana: {
    nombre: 'cédula de identidad',
    ejemplo: 'V-12345678',
    mascara: null,
    regex: /^(V|E)-?\d{7,8}$/i,
  },
  Estadounidense: {
    nombre: 'SSN',
    ejemplo: '123-45-6789',
    mascara: { grupos: [3, 2, 4] },
    regex: /^\d{3}-\d{2}-\d{4}$/,
  },
  Española: {
    nombre: 'DNI / NIE',
    ejemplo: '12345678X',
    mascara: null,
    regex: /^[XYZ0-9]\d{7}[A-Z]$/i,
  },
  Otra: {
    nombre: 'pasaporte u otro documento',
    ejemplo: 'A12345678',
    mascara: null,
    regex: /^[A-Z0-9-]{6,20}$/i,
  },
}

// Valida el documento según la nacionalidad elegida: devuelve ''
// si es válido o el mensaje de error correspondiente.
export function validarIdentidad(valor, nacionalidad) {
  const formato = FORMATOS_ID[nacionalidad]
  if (!formato) return 'Seleccioná tu nacionalidad para validar el documento'
  const v = String(valor || '').trim()
  if (formato.verificar) return formato.verificar(v)
  return formato.regex.test(v) ? '' : `Ingresá tu ${formato.nombre} con el formato ${formato.ejemplo}`
}

// Teléfono: +505 y 8 dígitos (se toleran espacios, se normalizan).
export function validarTelefono(valor) {
  const limpio = (valor || '').replace(/[\s-]/g, '')
  return /^\+505[2-8]\d{7}$/.test(limpio)
}

export function validarCorreo(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((valor || '').trim())
}

// RUC nicaragüense (DGI):
//  - persona jurídica: J + 12 o 13 dígitos
//  - persona natural: la cédula (13 dígitos + letra, con o sin
//    guiones) o un número numérico de 10 a 14 dígitos (NIT).
export function validarRUC(valor) {
  const limpio = (valor || '').trim().replace(/[\s-]/g, '')
  return /^(J\d{12,13}|\d{13}[A-Za-z]|\d{10,14})$/.test(limpio)
}

// Mayor de 18 años en la fecha dada (formato aaaa-mm-dd).
export function validarMayorEdad(valor) {
  if (!valor) return false
  const nacimiento = new Date(`${valor}T00:00:00`)
  if (Number.isNaN(nacimiento.getTime())) return false
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1
  return edad >= 18
}

// Archivos: JPG, PNG o PDF de hasta 5 MB (máximo del expediente KYC).
export function validarArchivo(archivo) {
  if (!archivo) return { ok: false, motivo: '' }
  if (!['image/jpeg', 'image/png', 'application/pdf'].includes(archivo.type)) {
    return { ok: false, motivo: 'Solo se aceptan JPG, PNG o PDF' }
  }
  if (archivo.size > 5 * 1024 * 1024) {
    return { ok: false, motivo: 'El archivo supera los 5 MB' }
  }
  return { ok: true, motivo: '' }
}

// Reduce el archivo a lo que se guarda en localStorage: metadatos +
// dataURL solo si es liviano (una imagen chica entra; un PDF de
// varios MB no, por el tope de ~5 MB del navegador).
export function archivoParaGuardar(archivo, dataURL) {
  const base = {
    nombre: archivo.name,
    tipo: archivo.type,
    tamano: archivo.size,
  }
  if (dataURL && archivo.size <= 700 * 1024) base.dataURL = dataURL
  return base
}

// ── Esquema de los pasos por rol ────────────────────────────
// tipo: 'text' | 'number' | 'date' | 'email' | 'tel' | 'select' |
//       'archivo'
// Cada paso 2 y 4 incluye sus campos de archivo en el mismo arreglo.
export const PASOS_CAMPOS = {
  usuario: {
    1: [
      { clave: 'nombres', etiqueta: 'Nombres', tipo: 'text', icono: 'user', req: true, placeholder: 'Ej: María José' },
      { clave: 'apellidos', etiqueta: 'Apellidos', tipo: 'text', icono: 'user', req: true, placeholder: 'Ej: López García' },
      { clave: 'cedula', etiqueta: 'Cédula de identidad', tipo: 'text', icono: 'key', req: true, placeholder: '001-000000-0000X', mask: 'cedula' },
      { clave: 'fechaNacimiento', etiqueta: 'Fecha de nacimiento', tipo: 'date', icono: 'calendar', req: true },
      { clave: 'nacionalidad', etiqueta: 'Nacionalidad', tipo: 'select', opciones: NACIONALIDADES, icono: 'globe', req: true },
      { clave: 'correo', etiqueta: 'Correo electrónico', tipo: 'email', icono: 'mail', req: true, placeholder: 'nombre@correo.com' },
      { clave: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', icono: 'smartphone', req: true, placeholder: '+505 8844 2200' },
      { clave: 'direccion', etiqueta: 'Dirección de residencia', tipo: 'text', icono: 'home', req: true, placeholder: 'Barrio, municipio, departamento' },
    ],
    2: [
      { clave: 'cedulaFrente', etiqueta: 'Cédula (frente)', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'cedulaReverso', etiqueta: 'Cédula (reverso)', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'selfieCedula', etiqueta: 'Selfie sosteniendo la cédula', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'comprobanteDomicilio', etiqueta: 'Comprobante de domicilio (menos de 3 meses)', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'imagen o PDF' },
    ],
    3: [
      { clave: 'ruc', etiqueta: 'RUC (cédula si no está inscrito en DGI)', tipo: 'text', icono: 'wallet', req: true, placeholder: 'Ej: J0310000998877', nota: 'Si no tenés RUC, usá tu cédula sin guiones.' },
      { clave: 'regimen', etiqueta: 'Régimen DGI', tipo: 'select', opciones: REGIMENES_DGI, icono: 'sliders', req: true },
      { clave: 'constanciaDGI', etiqueta: 'Constancia de situación fiscal (DGI)', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'PDF' },
    ],
    4: [
      { clave: 'ocupacion', etiqueta: 'Ocupación', tipo: 'text', icono: 'user', req: true, placeholder: 'Ej: Comerciante' },
      { clave: 'ingresoMensual', etiqueta: 'Ingreso mensual (C$)', tipo: 'number', icono: 'wallet', req: true, placeholder: 'Ej: 15000' },
      { clave: 'intereses', etiqueta: 'Intereses de compra', tipo: 'select', opciones: INTERESES_CLIENTE, icono: 'gift', req: true },
    ],
  },
  negocio: {
    1: [
      { clave: 'nombres', etiqueta: 'Nombres del representante', tipo: 'text', icono: 'user', req: true, placeholder: 'Ej: Carlos' },
      { clave: 'apellidos', etiqueta: 'Apellidos del representante', tipo: 'text', icono: 'user', req: true, placeholder: 'Ej: Martínez' },
      { clave: 'cedula', etiqueta: 'Cédula del representante', tipo: 'text', icono: 'key', req: true, placeholder: '001-000000-0000X', mask: 'cedula' },
      { clave: 'fechaNacimiento', etiqueta: 'Fecha de nacimiento', tipo: 'date', icono: 'calendar', req: true },
      { clave: 'nacionalidad', etiqueta: 'Nacionalidad', tipo: 'select', opciones: NACIONALIDADES, icono: 'globe', req: true },
      { clave: 'correo', etiqueta: 'Correo electrónico', tipo: 'email', icono: 'mail', req: true, placeholder: 'nombre@correo.com' },
      { clave: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', icono: 'smartphone', req: true, placeholder: '+505 8844 2200' },
      { clave: 'direccion', etiqueta: 'Dirección de residencia', tipo: 'text', icono: 'home', req: true, placeholder: 'Barrio, municipio, departamento' },
    ],
    2: [
      { clave: 'cedulaFrente', etiqueta: 'Cédula del representante (frente)', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'cedulaReverso', etiqueta: 'Cédula del representante (reverso)', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'selfieCedula', etiqueta: 'Selfie del representante con la cédula', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'comprobanteDomicilio', etiqueta: 'Comprobante de domicilio (menos de 3 meses)', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'imagen o PDF' },
    ],
    3: [
      { clave: 'ruc', etiqueta: 'RUC de la persona natural', tipo: 'text', icono: 'wallet', req: true, placeholder: 'Ej: J0310000998877' },
      { clave: 'regimen', etiqueta: 'Régimen DGI', tipo: 'select', opciones: REGIMENES_DGI, icono: 'sliders', req: true },
      { clave: 'constanciaDGI', etiqueta: 'Constancia de situación fiscal (DGI)', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'PDF' },
    ],
    4: [
      { clave: 'razonSocial', etiqueta: 'Razón social del negocio', tipo: 'text', icono: 'store', req: true, placeholder: 'Ej: Ferretería El Constructor S.A.' },
      { clave: 'rucNegocio', etiqueta: 'RUC del negocio', tipo: 'text', icono: 'wallet', req: true, placeholder: 'J-xxxxxxx' },
      { clave: 'giro', etiqueta: 'Giro comercial', tipo: 'select', opciones: GIROS_NEGOCIO, icono: 'tag', req: true },
      { clave: 'matricula', etiqueta: 'N° de matrícula (Registro Mercantil)', tipo: 'text', icono: 'file-text', req: true },
      { clave: 'tamano', etiqueta: 'Tamaño', tipo: 'select', opciones: TAMANOS_NEGOCIO, icono: 'users', req: true },
      { clave: 'anios', etiqueta: 'Años de operación', tipo: 'number', icono: 'clock', req: true, placeholder: 'Ej: 5' },
      { clave: 'web', etiqueta: 'Sitio web o redes (opcional)', tipo: 'text', icono: 'globe', req: false, placeholder: 'https://...' },
      { clave: 'direccionFiscal', etiqueta: 'Dirección fiscal', tipo: 'text', icono: 'home', req: true, placeholder: 'Barrio, municipio, departamento' },
      { clave: 'escritura', etiqueta: 'Escritura de constitución', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'PDF o imagen' },
      { clave: 'poder', etiqueta: 'Poder del representante legal', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'PDF o imagen' },
      { clave: 'acta', etiqueta: 'Acta de junta directiva', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'PDF o imagen' },
    ],
  },
  proveedor: {
    1: [
      { clave: 'nombres', etiqueta: 'Nombres del representante', tipo: 'text', icono: 'user', req: true, placeholder: 'Ej: Roberto' },
      { clave: 'apellidos', etiqueta: 'Apellidos del representante', tipo: 'text', icono: 'user', req: true, placeholder: 'Ej: Sánchez' },
      { clave: 'cedula', etiqueta: 'Cédula del representante', tipo: 'text', icono: 'key', req: true, placeholder: '001-000000-0000X', mask: 'cedula' },
      { clave: 'fechaNacimiento', etiqueta: 'Fecha de nacimiento', tipo: 'date', icono: 'calendar', req: true },
      { clave: 'nacionalidad', etiqueta: 'Nacionalidad', tipo: 'select', opciones: NACIONALIDADES, icono: 'globe', req: true },
      { clave: 'correo', etiqueta: 'Correo electrónico', tipo: 'email', icono: 'mail', req: true, placeholder: 'nombre@correo.com' },
      { clave: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', icono: 'smartphone', req: true, placeholder: '+505 8844 2200' },
      { clave: 'direccion', etiqueta: 'Dirección de residencia', tipo: 'text', icono: 'home', req: true, placeholder: 'Barrio, municipio, departamento' },
    ],
    2: [
      { clave: 'cedulaFrente', etiqueta: 'Cédula del representante (frente)', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'cedulaReverso', etiqueta: 'Cédula del representante (reverso)', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'selfieCedula', etiqueta: 'Selfie del representante con la cédula', tipo: 'archivo', icono: 'camera', req: true },
      { clave: 'comprobanteDomicilio', etiqueta: 'Comprobante de domicilio (menos de 3 meses)', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'imagen o PDF' },
    ],
    3: [
      { clave: 'ruc', etiqueta: 'RUC de la persona natural', tipo: 'text', icono: 'wallet', req: true, placeholder: 'J-xxxxxxx' },
      { clave: 'regimen', etiqueta: 'Régimen DGI', tipo: 'select', opciones: REGIMENES_DGI, icono: 'sliders', req: true },
      { clave: 'constanciaDGI', etiqueta: 'Constancia de situación fiscal (DGI)', tipo: 'archivo', icono: 'file-text', req: true, acepta: 'PDF' },
    ],
    4: [
      { clave: 'nombreEmpresa', etiqueta: 'Nombre de la empresa', tipo: 'text', icono: 'truck', req: true },
      { clave: 'rucEmpresa', etiqueta: 'RUC de la empresa', tipo: 'text', icono: 'wallet', req: true, placeholder: 'J-xxxxxxx' },
      { clave: 'categoria', etiqueta: 'Categoría de productos', tipo: 'select', opciones: CATEGORIAS_PROVEEDOR, icono: 'tag', req: true },
      { clave: 'capacidadDistribucion', etiqueta: 'Capacidad de distribución', tipo: 'select', opciones: CAPACIDADES_DISTRIBUCION, icono: 'truck', req: true },
      { clave: 'volumenMensual', etiqueta: 'Volumen mensual', tipo: 'select', opciones: VOLUMENES_MENSUALES, icono: 'box', req: true },
      { clave: 'certificaciones', etiqueta: 'Certificación principal', tipo: 'archivo', icono: 'award', req: false, acepta: 'PDF o imagen' },
      { clave: 'cert1', etiqueta: 'Certificado 1 (opcional)', tipo: 'archivo', icono: 'file-text', req: false, acepta: 'PDF o imagen' },
      { clave: 'cert2', etiqueta: 'Certificado 2 (opcional)', tipo: 'archivo', icono: 'file-text', req: false, acepta: 'PDF o imagen' },
      { clave: 'cert3', etiqueta: 'Certificado 3 (opcional)', tipo: 'archivo', icono: 'file-text', req: false, acepta: 'PDF o imagen' },
      { clave: 'cert4', etiqueta: 'Certificado 4 (opcional)', tipo: 'archivo', icono: 'file-text', req: false, acepta: 'PDF o imagen' },
      { clave: 'cert5', etiqueta: 'Certificado 5 (opcional)', tipo: 'archivo', icono: 'file-text', req: false, acepta: 'PDF o imagen' },
    ],
  },
}

// ── Textos legales (paráfrasis; validar con abogado) ─────────
export const TEXTOS_LEGALES = {
  paso1: 'Ley 977, Art. 17: los sujetos obligados deben identificar plenamente a sus clientes antes de iniciar cualquier relación comercial.',
  paso2: 'Ley 977, Art. 22: la debida diligencia incluye verificar la identidad con documentos oficiales vigentes y comprobante de domicilio.',
  paso3: 'Los datos tributarios se cotejan con la Dirección General de Ingresos (DGI) para confirmar la situación fiscal del solicitante.',
  paso4: {
    usuario: 'Ley 977: la información ocupacional y financiera complementa su perfil de debida diligencia.',
    negocio: 'Ley 977, Art. 15: a las personas jurídicas se les exige la documentación constitutiva, el poder del representante y el acta de junta directiva.',
    proveedor: 'Ley 977, Art. 15, numerales 2.3, 5, 6 y 10, y Ley 1238: requisitos reforzados de debida diligencia para empresas proveedoras de bienes y servicios.',
  },
  art25: 'Art. 25 de la Ley 977: esta información se conserva de forma confidencial, protegida y disponible por al menos cinco (5) años ante los entes de control.',
  autorizacion:
    'Declaro que la información y los documentos proporcionados son veraces, y autorizo a VINCCO a verificar mis datos ante la DGI, el Registro Mercantil y demás entes de control, conforme a la Ley 977.',
  exito:
    'Su verificación será revisada en 24-48 horas hábiles conforme a la Ley 977. Recibirá la confirmación en su correo electrónico.',
}