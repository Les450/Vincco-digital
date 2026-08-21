/* Comprime una imagen elegida por el usuario antes de guardarla en
   localStorage. Una foto de celular pesa 2-5 MB y en base64 un tercio
   mas; el almacenamiento del navegador topa en ~5 MB por sitio, asi
   que sin este paso una o dos publicaciones con foto revientan la
   cuota (QuotaExceededError al guardar la promocion).

   La dibuja en un canvas escalado a un lado maximo y la re-exporta
   como JPEG (fondo blanco, para que los PNG con transparencia no
   salgan negros). Devuelve una promesa con el data URL listo. */
export function comprimirImagen(archivo, maxLado = 900, calidad = 0.72) {
  return new Promise((resolve, reject) => {
    if (!archivo || !archivo.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen'))
      return
    }
    const url = URL.createObjectURL(archivo)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const escala = Math.min(1, maxLado / Math.max(img.width, img.height))
      const ancho = Math.max(1, Math.round(img.width * escala))
      const alto = Math.max(1, Math.round(img.height * escala))
      const canvas = document.createElement('canvas')
      canvas.width = ancho
      canvas.height = alto
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, ancho, alto)
      ctx.drawImage(img, 0, 0, ancho, alto)
      resolve(canvas.toDataURL('image/jpeg', calidad))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}
