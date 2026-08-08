# Vincco Digital — convenciones del proyecto

Reglas que valen para todo el proyecto. Leer esto antes de tocar código.

---

## Kiara vive en `src/Chatbot/`

**Kiara** es la asistente de IA de Vincco. **Todo lo que sea de Kiara va dentro
de `src/Chatbot/`.** Sin excepciones: código, guía, script compilador y la
pantalla de la guía.

```
src/Chatbot/
├── guiausuario.md                  ← LA FUENTE DE VERDAD (se escribe acá)
├── generar-guia.mjs                ← la compila (npm run guia)
│
├── conocimiento/
│   ├── guia_generada.js            GENERADO — no editar a mano
│   ├── parsearGuia.mjs             Markdown → estructura (Node y navegador)
│   ├── cargarGuia.js               incorporada + en vivo
│   └── index.js                    buscar() — la puerta a RAG
│
├── orquestador/
│   ├── orquestador.js              preguntar() — la única entrada
│   ├── alcance.js                  ¿esto es de Vincco?
│   └── normalizar.js               minúsculas, tildes, palabras vacías
│
├── motores/
│   ├── tipos.js                    CONTRATO que todo motor cumple
│   └── motorLocal.js               motor actual, sin IA
│
├── ui/
│   ├── PanelChat.jsx               panel lateral
│   ├── Mensaje.jsx                 burbuja de conversación
│   └── Chat.css
│
└── pagina-guia/
    ├── Guia.jsx                    pantalla /guia
    └── Guia.css
```

Lo único de Kiara que vive fuera de esa carpeta:

- `public/guiausuario.md` — copia publicada, **generada** por el script
- el montaje en `src/components/AppRouter.jsx`
- el bloque `chat` en `src/store/puntos_usestore.js`
- el ítem "Guía de Usuario" en `src/components/Sidebar.jsx`
- el ajuste "Mostrar a Kiara" en `src/data/config_opciones.js`

### Reglas de Kiara

1. **La guía es la única fuente.** Kiara responde con lo que dice
   `guiausuario.md` y nada más. Si algo no está escrito ahí, responde que no lo
   sabe. **Nunca inventa funciones que no existen.**
2. **No es ChatGPT.** Fuera de Vincco responde siempre:
   *"Puedo ayudarte únicamente con dudas relacionadas con la plataforma Vincco."*
3. **`guia_generada.js` no se edita a mano.** Se pisa en cada compilación. Lo
   que se edita es `guiausuario.md`, y después `npm run guia`.
4. **El motor va detrás de un contrato** (`motores/tipos.js`). Cambiar de motor
   local a remoto es cambiar un import en `orquestador.js`.

---

## Moneda: SIEMPRE córdobas

Vincco es Nicaragua. **Todo monto va en córdobas nicaragüenses (NIO).** Nunca
en dólares, y nunca con el ícono `dollar-sign`.

- Usar los helpers de `src/utils/moneda.js`: `numero()`, `cordobasTexto()`,
  `cordobas()`
- En montos grandes y destacados va la palabra completa: **"1,240 córdobas"**,
  no "C$1,240". El símbolo `C$` se lee como dólar canadiense fuera de Nicaragua
  y los traductores del navegador lo traducen así
- El símbolo corto solo para precios en línea dentro de listas densas
- Separador de miles con **coma**: `1,240`. Nunca punto

---

## Idioma

**Todo en español**, con voseo nicaragüense: *"tocá", "entrá", "elegí",
"podés"*. Nunca "toca", "entra", "elige".

El código, los comentarios y los nombres de variables también en español.

---

## Responsive siempre

Vincco es multiplataforma: celular, tablet, laptop y escritorio. Toda pantalla
nueva tiene que funcionar en los cuatro.

Breakpoints del proyecto:

| Tamaño | Ancho |
|---|---|
| Celular angosto | ≤380px |
| Celular | ≤480px |
| Tablet | 481–1024px |
| Laptop | ≥1025px |
| Escritorio ancho | ≥1280px |

---

## Estilos

- **Un archivo CSS por pantalla**, en la misma carpeta que el componente
- Cada archivo usa **su propio prefijo** de clase: `pf-` perfil, `cfg-`
  configuración, `gui-` guía, `chat-` Kiara, `vc-` landing
- Lo **global** va en `src/App.css` (accesibilidad, clases del `<body>`)
- No usar `:has()` ni selectores que no funcionen en navegadores viejos: el
  público objetivo usa celulares de gama baja

---

## Patrón dominante: los datos se declaran, la UI los dibuja

Ningún componente sabe qué contenido existe: recorre un arreglo.

- `camposPerfil` → `BloqueDatos` dibuja los campos del perfil
- `configPorRol` → `Config.jsx` dibuja las opciones de configuración
- `ENTRADAS` → `Guia.jsx` y Kiara

**Agregar contenido tiene que ser agregar un objeto a un arreglo.** Si hay que
tocar un `if`, el diseño falló.

---

## Una ruta, tres pantallas

`/perfil`, `/config` y `/guia` son **una sola ruta** que se adapta según
`userType` del store (`usuario` | `negocio` | `proveedor`). El cliente no tiene
inventario y el proveedor no da puntos: mostrarles eso solo los confunde.

---

## Estado

Un solo store de Zustand: `src/store/puntos_usestore.js`. Es el único canal
transversal. Un módulo nuevo que necesite hablar con el resto pasa por el
store, no inventa otro mecanismo.

---

## Todavía no hay backend

El frontend lo trabaja Lesbin; el backend lo trabaja otra persona. Hoy todo el
dato es mock (`src/data/data_falso.js`) y la persistencia es `localStorage`.

**La llave de una API de IA nunca puede vivir en el frontend.** Las variables
`REACT_APP_*` de Create React App se compilan dentro del bundle y cualquiera
las extrae. El motor remoto de Kiara solo se conecta cuando exista servidor.

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm start` | Compila la guía de Kiara y arranca |
| `npm run build` | Compila la guía y construye para producción |
| `npm run guia` | Solo compila `src/Chatbot/guiausuario.md` |
| `npm run deploy` | Publica en GitHub Pages |

---

## Antes de terminar cualquier cambio

1. Que compile
2. Que no queden imports sin usar (CRA los vuelve errores al construir)
3. Que las rutas que se mencionen existan en `AppRouter.jsx`
4. Que funcione en celular, tablet y laptop
