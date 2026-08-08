import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion'
import useStore from '../../store/puntos_usestore'
import './KiaraFlotante.css'

/* ══════════════════════════════════════════════════════════════
   KIARA FLOTANTE — la mascota que vive encima de toda la app

   Al entrar aparece al centro de la pantalla con una animación de
   entrada. Un instante después se corre sola hasta el borde más
   cercano para no estorbar la vista, y ahí muestra su saludo.

   El usuario la puede arrastrar a donde quiera. Cada vez que la
   suelta, se acomoda sola al borde más cercano (izquierda o
   derecha) y vuelve a mostrar el mensaje: el mismo comportamiento
   de la entrada, repetido en cada movimiento.

   Tocarla (sin arrastrar) abre el panel de chat. Mientras el panel
   está abierto, la mascota se esconde para no taparlo.
   ══════════════════════════════════════════════════════════════ */

const RUTA_IMG = `${process.env.PUBLIC_URL || ''}/assets/images/kiara.png`
const SALUDO = 'Hola, soy Kiara tu asistente de VINCCO'

// Márgenes contra los bordes de la pantalla. El de abajo es más
// grande porque ahí vive la barra de navegación inferior.
const MARGEN_LADO = 14
const MARGEN_ARRIBA = 20
const MARGEN_ABAJO = 104

const RESORTE = { type: 'spring', stiffness: 260, damping: 22, mass: 0.9 }
const RESORTE_ENTRADA = { type: 'spring', stiffness: 230, damping: 16 }

export default function KiaraFlotante() {
  const abrirChat = useStore((s) => s.abrirChat)
  const chatAbierto = useStore((s) => s.chat.abierto)

  const avatarRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const [lista, setLista] = useState(false)
  const [mensajeVisible, setMensajeVisible] = useState(false)
  const [lado, setLado] = useState('derecha')

  const tiempoMensaje = useRef(null)

  // Tamaño y límites reales del avatar. Se leen del DOM en vez de
  // repetir los breakpoints acá: el CSS es la única fuente del tamaño.
  const medir = useCallback(() => {
    const tam = avatarRef.current?.offsetWidth || 90
    return {
      tam,
      minX: MARGEN_LADO,
      maxX: Math.max(MARGEN_LADO, window.innerWidth - tam - MARGEN_LADO),
      minY: MARGEN_ARRIBA,
      maxY: Math.max(MARGEN_ARRIBA, window.innerHeight - tam - MARGEN_ABAJO),
    }
  }, [])

  const mostrarSaludo = useCallback(() => {
    setMensajeVisible(true)
    clearTimeout(tiempoMensaje.current)
    tiempoMensaje.current = setTimeout(() => setMensajeVisible(false), 4200)
  }, [])

  // Se acomoda al borde izquierdo o derecho, el que quede más
  // cerca del punto donde se soltó, y ahí saluda.
  const acomodarAlBorde = useCallback((centroX) => {
    const { maxX, minX, minY, maxY } = medir()
    const irADerecha = centroX > window.innerWidth / 2
    const destinoX = irADerecha ? maxX : minX
    const destinoY = Math.min(Math.max(y.get(), minY), maxY)

    setLado(irADerecha ? 'derecha' : 'izquierda')
    animate(x, destinoX, RESORTE)
    animate(y, destinoY, { ...RESORTE, onComplete: mostrarSaludo })
  }, [medir, mostrarSaludo, x, y])

  // Entrada: nace al centro de la pantalla y, tras un instante,
  // se va sola hacia el borde derecho.
  useEffect(() => {
    const { tam } = medir()
    x.set(window.innerWidth / 2 - tam / 2)
    y.set(window.innerHeight / 2 - tam / 2)
    setLista(true)

    const t = setTimeout(() => acomodarAlBorde(window.innerWidth), 1150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => clearTimeout(tiempoMensaje.current), [])

  // Si la pantalla cambia de tamaño (girar el celular, redimensionar
  // la ventana) la mantiene dentro de los límites nuevos.
  useEffect(() => {
    const alRedimensionar = () => {
      const { minX, maxX, minY, maxY } = medir()
      x.set(Math.min(Math.max(x.get(), minX), maxX))
      y.set(Math.min(Math.max(y.get(), minY), maxY))
    }
    window.addEventListener('resize', alRedimensionar)
    return () => window.removeEventListener('resize', alRedimensionar)
  }, [medir, x, y])

  const alIniciarArrastre = useCallback(() => {
    setMensajeVisible(false)
    clearTimeout(tiempoMensaje.current)
  }, [])

  const alSoltarArrastre = useCallback(() => {
    const { tam } = medir()
    acomodarAlBorde(x.get() + tam / 2)
  }, [medir, acomodarAlBorde, x])

  const alTocar = useCallback(() => {
    setMensajeVisible(false)
    abrirChat()
  }, [abrirChat])

  // Con el panel de chat abierto, Kiara se esconde para no taparlo.
  if (chatAbierto) return null

  const { minX, maxX, minY, maxY } = medir()

  return (
    <motion.div
      ref={avatarRef}
      className={`kf-mascota kf-mascota--${lado}`}
      style={{ x, y }}
      drag
      dragMomentum={false}
      dragElastic={0.12}
      dragConstraints={{ left: minX, right: maxX, top: minY, bottom: maxY }}
      onDragStart={alIniciarArrastre}
      onDragEnd={alSoltarArrastre}
      onTap={alTocar}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={lista ? { opacity: 1, scale: 1 } : {}}
      transition={RESORTE_ENTRADA}
      role="button"
      tabIndex={0}
      aria-label="Kiara, la asistente de Vincco. Arrastrala para moverla o tocala para abrir el chat"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          abrirChat()
        }
      }}
    >
      <AnimatePresence>
        {mensajeVisible && (
          <motion.div
            className="kf-burbuja"
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            {SALUDO}
          </motion.div>
        )}
      </AnimatePresence>

      <img src={RUTA_IMG} alt="" className="kf-img" draggable={false} />
    </motion.div>
  )
}
