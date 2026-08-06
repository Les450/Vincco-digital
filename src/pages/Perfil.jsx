import useStore from '../store/puntos_usestore'
import PerfilUsuario from './PerfilUsuario'
import PerfilNegocio from './PerfilNegocio'
import PerfilProveedor from './PerfilProveedor'
import './Perfil.css'

// Una sola ruta (/perfil) que decide que pantalla mostrar segun el
// rol. Cada perfil vive en su propio archivo porque no comparten ni
// los datos ni las secciones; lo unico comun son las piezas visuales
// de components/perfil/PerfilUI.jsx.

const PERFILES = {
  usuario: PerfilUsuario,
  negocio: PerfilNegocio,
  proveedor: PerfilProveedor,
}

export default function Perfil() {
  const userType = useStore((s) => s.userType)
  const Pantalla = PERFILES[userType] || PerfilUsuario

  return <Pantalla />
}
