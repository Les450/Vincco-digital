#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════
   COMPILA LA GUÍA DE USUARIO DE KIARA

   Lee src/Chatbot/guiausuario.md (la fuente que escribís vos) y
   produce:

     1. src/Chatbot/conocimiento/guia_generada.js
        La copia incorporada al bundle. Es la que usa Kiara cuando
        no hay red o cuando el archivo publicado no carga.
        ESTE ARCHIVO SE GENERA: no lo edites a mano.

     2. public/guiausuario.md
        La copia publicada. Kiara la lee en vivo al abrirse, así
        podés actualizar la guía en el servidor sin recompilar.

   Se corre solo con `npm start` y con `npm run build`. También a
   mano con `npm run guia`.
   ══════════════════════════════════════════════════════════════ */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsearGuia } from './conocimiento/parsearGuia.mjs'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const raiz = path.resolve(aqui, '..', '..')

const ORIGEN = path.join(aqui, 'guiausuario.md')
const DESTINO_JS = path.join(aqui, 'conocimiento', 'guia_generada.js')
const DESTINO_PUBLICO = path.join(raiz, 'public', 'guiausuario.md')

const gris = (t) => `\x1b[90m${t}\x1b[0m`
const rojo = (t) => `\x1b[31m${t}\x1b[0m`
const amarillo = (t) => `\x1b[33m${t}\x1b[0m`
const verde = (t) => `\x1b[32m${t}\x1b[0m`

if (!fs.existsSync(ORIGEN)) {
  console.error(rojo(`\n  No encuentro src/Chatbot/guiausuario.md.`))
  console.error(gris(`  Kiara se queda con la guía que ya estaba compilada.\n`))
  // No se corta el build: sin guía nueva, sigue sirviendo la vieja
  process.exit(0)
}

const markdown = fs.readFileSync(ORIGEN, 'utf8')
const { secciones, entradas, problemas } = parsearGuia(markdown)

if (!entradas.length) {
  console.error(rojo(`\n  guiausuario.md no tiene ninguna pregunta ("### ...").`))
  console.error(gris(`  Se conserva la guía anterior para no dejar a Kiara muda.\n`))
  process.exit(0)
}

/* ── Avisos ─────────────────────────────────────────────────
   No cortan el build: una entrada sin "Buscar por" igual sirve,
   solo se encuentra peor. Pero se avisa para que se arregle. */
if (problemas.length) {
  console.log(amarillo(`\n  ${problemas.length} aviso(s) en guiausuario.md:`))
  problemas.slice(0, 12).forEach((p) => console.log(gris(`    · ${p}`)))
  if (problemas.length > 12) console.log(gris(`    · … y ${problemas.length - 12} más`))
}

/* ── Rutas que no existen ───────────────────────────────────
   Si la guía manda a una pantalla que no está en AppRouter, Kiara
   lleva a la gente a una pantalla en blanco. Se revisa acá porque
   es el error más caro de todos. */
const router = path.join(raiz, 'src', 'components', 'AppRouter.jsx')
if (fs.existsSync(router)) {
  const fuente = fs.readFileSync(router, 'utf8')
  const existentes = new Set(
    [...fuente.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1])
      .concat(['/login', '/register'])
  )
  const rotas = [...new Set(
    entradas.map((e) => e.ruta).filter((r) => r && !existentes.has(r))
  )]
  if (rotas.length) {
    console.log(amarillo(`\n  Rutas de la guía que no existen en AppRouter:`))
    rotas.forEach((r) => console.log(rojo(`    · ${r}`)))
    console.log(gris(`    Kiara mandaría al usuario a una pantalla en blanco.`))
  }
}

/* ── Opciones de menú que apuntan a un id que no existe ─────
   Un menú roto es un botón que no lleva a ninguna parte. Se avisa
   igual que con las rutas: es barato de revisar y caro de dejar
   pasar. */
const idsExistentes = new Set(entradas.map((e) => e.id))
const opcionesRotas = entradas.flatMap((e) =>
  (e.opciones || [])
    .filter((o) => !idsExistentes.has(o.id))
    .map((o) => `"${e.titulo}" -> Opción "${o.texto}" apunta a "${o.id}", que no existe`)
)
if (opcionesRotas.length) {
  console.log(amarillo(`\n  Opciones de menú rotas en guiausuario.md:`))
  opcionesRotas.forEach((o) => console.log(rojo(`    · ${o}`)))
}

/* ── Escribe el archivo incorporado ─────────────────────── */

const fecha = new Date().toISOString().slice(0, 10)

const js = `/* ══════════════════════════════════════════════════════════════
   ARCHIVO GENERADO — NO EDITAR A MANO

   Se genera a partir de src/Chatbot/guiausuario.md con:
       npm run guia

   Cualquier cambio hecho acá se pierde en la próxima compilación.
   Para cambiar lo que sabe Kiara, editá src/Chatbot/guiausuario.md.

   Generado: ${fecha}
   ${entradas.length} entradas · ${secciones.length} secciones
   ══════════════════════════════════════════════════════════════ */

export const SECCIONES = ${JSON.stringify(secciones, null, 2)}

export const ENTRADAS = ${JSON.stringify(entradas, null, 2)}

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
`

fs.mkdirSync(path.dirname(DESTINO_JS), { recursive: true })
fs.writeFileSync(DESTINO_JS, js)

// Copia publicada, para la lectura en vivo
fs.mkdirSync(path.dirname(DESTINO_PUBLICO), { recursive: true })
fs.copyFileSync(ORIGEN, DESTINO_PUBLICO)

const porRol = { usuario: 0, negocio: 0, proveedor: 0 }
entradas.forEach((e) => e.roles.forEach((r) => { porRol[r] = (porRol[r] || 0) + 1 }))

console.log(verde(`\n  Guía de Kiara compilada`))
console.log(gris(`    ${entradas.length} entradas en ${secciones.length} secciones`))
console.log(gris(`    cliente ${porRol.usuario} · negocio ${porRol.negocio} · proveedor ${porRol.proveedor}`))
console.log(gris(`    -> src/Chatbot/conocimiento/guia_generada.js`))
console.log(gris(`    -> public/guiausuario.md\n`))
