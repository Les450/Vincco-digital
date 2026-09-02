import { useRef, useState } from 'react'
import Icon from '../../icons/Icon'
import { validarArchivo, archivoParaGuardar } from '../../../data/kyc_options'

// Subida de archivos del expediente: click o arrastrar y soltar.
// Acepta JPG, PNG y PDF de hasta 5 MB. Muestra una miniatura para
// imágenes, el nombre y el tamaño para PDFs, y un spinner mientras
// "carga". El resultado (metadatos + dataURL liviano) va al
// formulario del wizard con onChange.
export default function FileUploader({ campo, valor, onChange, error, rol }) {
  const inputRef = useRef(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [cargando, setCargando] = useState(false)

  const acepta = campo.acepta || 'JPG, PNG o PDF'

  const leerArchivo = (archivo) => {
    if (!archivo) return
    const { ok, motivo } = validarArchivo(archivo)
    if (!ok) {
      // Vuelve a lanzar el error de validación en el campo.
      onChange(campo.clave, { error: motivo })
      return
    }
    setCargando(true)
    const lector = new FileReader()
    lector.onload = () => {
      // Pequeña pausa para que se alcance a ver el estado de carga.
      setTimeout(() => {
        setCargando(false)
        onChange(campo.clave, archivoParaGuardar(archivo, lector.result))
      }, 700)
    }
    lector.readAsDataURL(archivo)
  }

  const esImagen = valor?.tipo?.startsWith('image/') && valor.dataURL

  return (
    <div className="kyc-campo">
      <span className="kyc-label">
        {campo.icono && <Icon name={campo.icono} size={13} />}
        {campo.etiqueta}
        {!campo.req && <span className="kyc-opcional">opcional</span>}
      </span>

      <div
        className={`kyc-drop ${arrastrando ? 'kyc-drop--arrastrando' : ''} ${
          error ? 'kyc-drop--err' : ''
        } ${valor && !error ? 'kyc-drop--tiene' : ''} kyc-drop--${rol}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setArrastrando(true)
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault()
          setArrastrando(false)
          leerArchivo(e.dataTransfer.files?.[0])
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="kyc-drop-input"
          onChange={(e) => {
            leerArchivo(e.target.files?.[0])
            e.target.value = ''
          }}
          tabIndex={-1}
        />

        {cargando ? (
          <div className="kyc-drop-cargando">
            <span className="kyc-spinner" aria-hidden="true" />
            <span>Subiendo archivo…</span>
          </div>
        ) : valor ? (
          <div className="kyc-drop-preview">
            {esImagen ? (
              <img src={valor.dataURL} alt={`Vista previa de ${valor.nombre}`} className="kyc-drop-thumb" loading="lazy" />
            ) : (
              <span className="kyc-drop-pdf">
                <Icon name="file-text" size={22} />
              </span>
            )}
            <span className="kyc-drop-meta">
              <strong>{valor.nombre}</strong>
              <span>{Math.max(1, Math.round(valor.tamano / 1024))} KB — listo</span>
            </span>
            <button
              type="button"
              className="kyc-drop-quitar"
              onClick={(e) => {
                e.stopPropagation()
                onChange(campo.clave, null)
              }}
              aria-label={`Quitar ${valor.nombre}`}
            >
              <Icon name="trash-2" size={15} />
            </button>
          </div>
        ) : (
          <div className="kyc-drop-vacio">
            <span className="kyc-drop-icono">
              <Icon name={esImagen ? 'image' : 'inbox'} size={20} />
            </span>
            <strong>Hacé clic o arrastrá el archivo</strong>
            <span>{acepta} · máximo 5 MB</span>
          </div>
        )}
      </div>

      {error && (
        <p className="kyc-error">
          <Icon name="alert-triangle" size={12} /> {error}
        </p>
      )}
    </div>
  )
}