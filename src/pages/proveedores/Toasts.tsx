import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastTipo = 'exito' | 'error' | 'info'

export interface ToastData {
  id: number
  tipo: ToastTipo
  titulo: string
  mensaje?: string
  accion?: { label: string; onClick: () => void }
}

interface ToastCtx {
  exito: (titulo: string, mensaje?: string) => void
  error: (titulo: string, mensaje?: string, accion?: ToastData['accion']) => void
  info: (titulo: string, mensaje?: string) => void
}

const ToastContext = createContext<ToastCtx | null>(null)

const ICONOS: Record<ToastTipo, ReactNode> = {
  exito: <CheckCircle2 className="h-5 w-5 text-vincco-success" strokeWidth={1.75} />,
  error: <XCircle className="h-5 w-5 text-vincco-danger" strokeWidth={1.75} />,
  info: <Info className="h-5 w-5 text-vincco-navy-600" strokeWidth={1.75} />,
}

const COLORES: Record<ToastTipo, string> = {
  exito: 'border-vincco-success/25',
  error: 'border-vincco-danger/25',
  info: 'border-vincco-line',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const nextId = useRef(1)

  const quitar = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const agregar = useCallback(
    (tipo: ToastTipo, titulo: string, mensaje?: string, accion?: ToastData['accion']) => {
      const id = nextId.current++
      setToasts((prev) => [...prev.slice(-3), { id, tipo, titulo, mensaje, accion }])
      window.setTimeout(() => quitar(id), 5000)
    },
    [quitar]
  )

  const api: ToastCtx = {
    exito: (titulo, mensaje) => agregar('exito', titulo, mensaje),
    error: (titulo, mensaje, accion) => agregar('error', titulo, mensaje, accion),
    info: (titulo, mensaje) => agregar('info', titulo, mensaje),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={cn(
                'pointer-events-auto relative flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-lg shadow-vincco-navy-900/10',
                COLORES[t.tipo]
              )}
            >
              <span className="mt-0.5 shrink-0">{ICONOS[t.tipo]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-vincco-ink">{t.titulo}</p>
                {t.mensaje && <p className="mt-0.5 text-[13px] leading-snug text-vincco-slate2">{t.mensaje}</p>}
                {t.accion && (
                  <button
                    onClick={() => {
                      t.accion?.onClick()
                      quitar(t.id)
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-vincco-navy-700 underline-offset-2 hover:underline"
                  >
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {t.accion.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => quitar(t.id)}
                aria-label="Cerrar notificación"
                className="shrink-0 rounded-md p-1 text-vincco-slate2 transition-colors hover:bg-vincco-mist hover:text-vincco-ink"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToasts(): ToastCtx {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToasts debe usarse dentro de <ToastProvider>')
  return ctx
}