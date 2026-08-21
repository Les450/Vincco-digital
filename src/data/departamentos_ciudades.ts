// División política-administrativa de Nicaragua: 15 departamentos +
// 2 regiones autónomas (RACCN y RACCS), 153 municipios en total.
// Fuente: INIFOM / INETER (división política administrativa).
// Se usa para filtrar por departamento y ciudad en el catálogo y en
// el paso de ubicación del registro.

export interface DepartamentoCiudad {
  nombre: string
  ciudades: string[]
}

export const DEPARTAMENTOS: DepartamentoCiudad[] = [
  {
    nombre: 'Boaco',
    ciudades: ['Boaco', 'Camoapa', 'San José de los Remates', 'San Lorenzo', 'Santa Lucía', 'Teustepe'],
  },
  {
    nombre: 'Carazo',
    ciudades: ['Diriamba', 'Dolores', 'El Rosario', 'Jinotepe', 'La Conquista', 'La Paz de Carazo', 'San Marcos', 'Santa Teresa'],
  },
  {
    nombre: 'Chinandega',
    ciudades: ['Chichigalpa', 'Chinandega', 'Cinco Pinos', 'Corinto', 'El Realejo', 'El Viejo', 'Posoltega', 'Puerto Morazán', 'San Francisco del Norte', 'San Pedro del Norte', 'Somotillo', 'Santo Tomás del Norte', 'Villanueva'],
  },
  {
    nombre: 'Chontales',
    ciudades: ['Acoyapa', 'Comalapa', 'El Coral', 'Juigalpa', 'La Libertad', 'San Francisco de Cuapa', 'San Pedro de Lóvago', 'Santo Domingo', 'Santo Tomás', 'Villa Sandino'],
  },
  {
    nombre: 'Estelí',
    ciudades: ['Condega', 'Estelí', 'La Trinidad', 'Pueblo Nuevo', 'San Juan de Limay', 'San Nicolás'],
  },
  {
    nombre: 'Granada',
    ciudades: ['Diriá', 'Diriomo', 'Granada', 'Nandaime'],
  },
  {
    nombre: 'Jinotega',
    ciudades: ['El Cuá', 'Jinotega', 'La Concordia', 'San José de Bocay', 'San Rafael del Norte', 'San Sebastián de Yalí', 'Santa María de Pantasma', 'Wiwilí de Jinotega'],
  },
  {
    nombre: 'León',
    ciudades: ['Achuapa', 'El Jicaral', 'El Sauce', 'La Paz Centro', 'Larreynaga', 'León', 'Nagarote', 'Quezalguaque', 'Santa Rosa del Peñón', 'Telica'],
  },
  {
    nombre: 'Madriz',
    ciudades: ['Las Sabanas', 'Palacagüina', 'San José de Cusmapa', 'San Juan del Río Coco', 'San Lucas', 'Somoto', 'Telpaneca', 'Totogalpa', 'Yalagüina'],
  },
  {
    nombre: 'Managua',
    ciudades: ['Ciudad Sandino', 'El Crucero', 'Managua', 'Mateare', 'San Francisco Libre', 'San Rafael del Sur', 'Ticuantepe', 'Tipitapa', 'Villa El Carmen'],
  },
  {
    nombre: 'Masaya',
    ciudades: ['Catarina', 'La Concepción', 'Masatepe', 'Masaya', 'Nandasmo', 'Nindirí', 'Niquinohomo', 'San Juan de Oriente', 'Tisma'],
  },
  {
    nombre: 'Matagalpa',
    ciudades: ['Ciudad Darío', 'Esquipulas', 'Matagalpa', 'Matiguás', 'Muy Muy', 'Rancho Grande', 'Río Blanco', 'San Dionisio', 'San Isidro', 'San Ramón', 'Sébaco', 'Terrabona', 'Tuma-La Dalia'],
  },
  {
    nombre: 'Nueva Segovia',
    ciudades: ['Ciudad Antigua', 'Dipilto', 'El Jícaro', 'Jalapa', 'Macuelizo', 'Mozonte', 'Murra', 'Ocotal', 'Quilalí', 'San Fernando', 'Santa María', 'Wiwilí de Nueva Segovia'],
  },
  {
    nombre: 'RACCN',
    ciudades: ['Bonanza', 'Mulukukú', 'Prinzapolka', 'Puerto Cabezas', 'Rosita', 'Siuna', 'Waslala', 'Waspán'],
  },
  {
    nombre: 'RACCS',
    ciudades: ['Bluefields', 'Corn Island', 'Desembocadura de la Cruz de Río Grande', 'El Ayote', 'El Rama', 'El Tortuguero', 'Kukra Hill', 'La Cruz de Río Grande', 'Laguna de Perlas', 'Muelle de los Bueyes', 'Nueva Guinea', 'Paiwas'],
  },
  {
    nombre: 'Río San Juan',
    ciudades: ['El Almendro', 'El Castillo', 'Morrito', 'San Carlos', 'San Juan de Nicaragua', 'San Miguelito'],
  },
  {
    nombre: 'Rivas',
    ciudades: ['Altagracia', 'Belén', 'Buenos Aires', 'Cárdenas', 'Moyogalpa', 'Potosí', 'Rivas', 'San Jorge', 'San Juan del Sur', 'Tola'],
  },
]

// Devuelve las ciudades (municipios) de un departamento, o [] si no existe.
export function ciudadesDeDepartamento(nombre: string): string[] {
  const dep = DEPARTAMENTOS.find((d) => d.nombre === nombre)
  return dep ? dep.ciudades : []
}
