import { create } from 'zustand'

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
  agregarPuntos: (cantidad) => set((state) => ({
    usuario: {
      ...state.usuario,
      puntos: state.usuario.puntos + cantidad
    }
  })),
  setLoggedIn: (val) => set({ isLoggedIn: val }),
  setUserType: (tipo) => set({ userType: tipo }),
  setNegocio: (data) => set({ negocio: data }),
}))

export default useStore