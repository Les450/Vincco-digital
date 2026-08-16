Sistema de diseño de Vincco (Impulso Digital, Nueva Guinea, Nicaragua). Usar SIEMPRE que se cree, modifique o revise cualquier interfaz de Vincco — componentes React, CSS, pantallas, botones, cards, navegación, formularios, estados vacíos o microcopy. Define la paleta oficial, la tipografía, el sistema completo de botones y las reglas no negociables de accesibilidad y voz. Si una tarea toca UI de Vincco, cargar esta skill antes de escribir código.

Sistema de diseño Vincco

Fuente de verdad: Vincco_Manual_de_Marca_v2.1.md. Tokens: src/styles/vincco-tokens.css. Si algo en el código contradice este documento, gana este documento.

Regla dura

Ningún componente escribe un color, tamaño, radio o sombra a mano. Todo sale de un token. Si un valor no existe como token, primero se agrega el token.

Paleta oficial (v2.1)
Nombre	HEX	Rol
Naranja Vincco	
#dd6600	Color de marca. Comercio, acción
Dorado	
#fea02f	Recompensa, puntos. Solo fondo, nunca texto
Turquesa	
#007a7b	Confianza, verificación, proveedores
Azul profundo	
#003f5a	Texto principal, estructura
Hueso	
#ead9c7	Fondo cálido

Color por actor: consumidor = dorado · comercio = naranja · proveedor = turquesa · plataforma = azul profundo.

Proporción: hueso/blanco 60% · azul 25% · naranja 10% · turquesa 4% · dorado 1%. El dorado es especia, no ingrediente. Tres cosas doradas en una pantalla = ninguna destaca.

Prohibido
Verdes esmeralda, morados, rosas, negro puro 
#000000
Grises fríos (
#808080, 
#6b7280). Los neutros salen de arena o tinta
Naranja pegado a turquesa sin separación — vibran
Dorado sobre naranja
Texto turquesa sobre azul profundo (2.19:1, ilegible)
Degradados, salvo el único permitido: tarjeta de puntos
Tipografía
Display: Old Standard TT — titulares y el número de puntos. Nada más.
UI: Plus Jakarta Sans — todo lo demás.
Todo número que se actualiza lleva font-variant-numeric: tabular-nums.
Sistema de botones

Alto base 48px (--size-control), radio 10px (--radius-input), Jakarta 15px/600, padding lateral 20px. Un solo botón primario por pantalla. Si hay dos que compiten, uno no es primario.

Variante	Clase	Uso	Fondo	Texto	Borde
Primario	.vc-btn--primary	Acción principal	
#c05900	blanco	—
Recompensa	.vc-btn--reward	Canjear, reclamar premio	
#fea02f	
#003f5a	—
Secundario	.vc-btn--secondary	Alternativa, navegar	transparente	
#005c5e	1.5px 
#007a7b
Suave	.vc-btn--soft	Acción de apoyo frecuente	
#fdf1e4	
#a34b00	—
Fantasma	.vc-btn--ghost	Terciario, descartar	transparente	
#005c5e	—
Peligro	.vc-btn--danger	Destructivo	transparente	
#b3261e	1.5px 
#b3261e

Estados: .is-loading (spinner + aria-busy), .is-success (confirmación momentánea, vuelve solo a los 2s), :disabled.

Un botón deshabilitado siempre dice por qué. No "Canjear" apagado: "Faltan 120 pts".

Otros controles
Selector segmentado — filtro entre 2 y 3 vistas. Contenedor arena, pastilla activa azul profundo con texto blanco.
Chips de categoría — filtro múltiple. Radio 6px, activo = azul profundo.
FAB (escanear QR) — 56px, círculo naranja, esquina inferior derecha, 16px de margen, por encima de la nav. Uno solo por pantalla.
Botón ancho de móvil — barra fija inferior, ancho completo menos márgenes, respeta env(safe-area-inset-bottom).
Microcopy de botones

Siempre verbo, sentence case, máximo 3 palabras, voseo nicaragüense. Bien: "Canjear puntos", "Pedir cotización", "Ver directorio". Mal: "Aceptar", "Enviar", "Continuar", "Click aquí".

Contexto del usuario (esto manda sobre el diseño)

Android de gama media o baja, pantalla rayada, sol directo, datos limitados, conexión intermitente, muchos nunca usaron un sistema digital, están trabajando mientras usan la app.

Consecuencias no negociables: mobile-first real · alto contraste · toques grandes · texto grande · pocas pantallas · cero jerga · todo funciona con una mano · estados de carga y error explícitos · imágenes livianas.

Accesibilidad — mínimos
Área táctil mínima 44px
Texto normal 4.5:1, texto grande 3:1
Foco visible siempre (--shadow-focus), nunca outline: none sin reemplazo
El color nunca es el único portador de información — siempre ícono o texto acompañando
Respetar prefers-reduced-motion
Toda lista carga con skeleton, no con spinner centrado
Al construir cualquier pantalla, verificar
¿Un solo primario?
¿Todos los colores salen de tokens?
¿Los estados vacío, cargando y error están resueltos?
¿Funciona a 360px de ancho?
¿El copy está en voseo y sin jerga?
¿El dorado se usó una sola vez o menos?


 VINCCO — SISTEMA DE BOTONES (complemento de vincco-tokens.css)
   Importar DESPUÉS de vincco-tokens.css:
     @import "./styles/vincco-tokens.css";
     @import "./styles/vincco-buttons.css";
 
   Portado del kit visual a la paleta oficial v2.1.
   El kit original estaba en verde esmeralda — color prohibido
   por el manual, sección 4.3.6. Aquí va en naranja/turquesa/dorado.
   ============================================================ */
 
/* ---- Variantes que faltaban en tokens.css ---- */
 
/* Recompensa — canjear, reclamar premio.
   Dorado SOLO como fondo, texto siempre azul profundo. */
.vc-btn--reward {
  background: var(--vc-gold-500);
  color: var(--vc-ink-500);
}
.vc-btn--reward:hover  { background: var(--vc-gold-600); }
.vc-btn--reward:active { background: var(--vc-gold-700); }
 
/* Suave — acción de apoyo que aparece seguido y no debe gritar */
.vc-btn--soft {
  background: var(--color-action-soft);
  color: var(--vc-orange-700);
}
.vc-btn--soft:hover { background: var(--vc-orange-100); }
 
/* Ancho completo — barra fija de móvil */
.vc-btn--block { width: 100%; }
 
/* ---- Ícono dentro del botón ---- */
.vc-btn__icon {
  width: var(--icon-md);
  height: var(--icon-md);
  stroke-width: var(--icon-stroke);
  flex-shrink: 0;
}
 
/* ---- Estado: cargando ---- */
.vc-btn.is-loading {
  pointer-events: none;
  opacity: 0.75;
}
.vc-btn.is-loading .vc-btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--radius-pill);
  animation: vc-spin 700ms linear infinite;
}
@keyframes vc-spin { to { transform: rotate(360deg); } }
 
/* ---- Estado: éxito (momentáneo, vuelve solo) ---- */
.vc-btn.is-success {
  background: var(--color-success-soft);
  color: var(--color-success);
  border: var(--border-width-strong) solid var(--color-success);
}

/* ============================================================
   SELECTOR SEGMENTADO
   ============================================================ */
.vc-segmented {
  display: inline-flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--color-bg-alt);
  border-radius: var(--radius-input);
}
.vc-segmented__item {
  min-height: var(--size-touch);
  padding: 0 var(--space-4);
  border: none;
  border-radius: var(--radius-chip);
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-ui);
  font-size: var(--fs-body);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: background var(--dur-micro) var(--ease);
}
.vc-segmented__item[aria-selected="true"] {
  background: var(--vc-ink-500);
  color: var(--color-text-invert);
}
 
/* ============================================================
   BOTÓN FLOTANTE (FAB) — escanear QR
   Uno solo por pantalla.
   ============================================================ */
.vc-fab {
  position: fixed;
  right: var(--space-4);
  bottom: calc(var(--size-nav) + var(--space-4) + env(safe-area-inset-bottom));
  z-index: var(--z-nav);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-action);
  color: var(--color-on-action);
  box-shadow: var(--shadow-3);
  cursor: pointer;
  transition: background var(--dur-micro) var(--ease),
              transform var(--dur-micro) var(--ease);
}
.vc-fab:hover  { background: var(--color-action-hover); }
.vc-fab:active { transform: scale(0.96); }
 
/* ============================================================
   BARRA FIJA DE ACCIÓN (móvil)
   ============================================================ */
.vc-actionbar {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  z-index: var(--z-nav);
  padding: var(--space-3) var(--page-margin);
  padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom));
  background: var(--color-surface);
  border-top: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-3);