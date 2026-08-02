/* ── Colores de Vincco ─────────────────────────────────────────
   Fuente unica de los valores hex que se usan desde JavaScript
   (estilos inline de Home y Mis Puntos).

   IMPORTANTE: los valores de este archivo son exactamente los que
   ya estaban escritos en cada pagina. No se modifico ninguno.

   Ojo con dos cosas:

   1. Home y Mis Puntos usan la misma palabra para colores distintos:
        Home    -> orange: #c05900
        Puntos  -> orange: #dd6600
      Por eso se exportan dos mapas separados en vez de uno solo.
      Fusionarlos cambiaria el aspecto de una de las dos pantallas.

   2. App.css tiene su propio set de variables CSS parecido pero no
      identico (ej. --slate-600 es #4d6273 y aca se usa #3d5164).
      Unificar ambos mundos si cambiaria colores en pantalla, asi que
      se dejo como esta. Es una decision de diseno pendiente.        */

/* Valores base del manual de identidad */
export const TOKENS = {
  navy950: '#001d2a',
  navy900: '#002e43',
  navy800: '#003f5a',
  navy600: '#3f6f84',

  orange500: '#dd6600',
  orange600: '#c05900',
  orange700: '#a34b00',

  gold500: '#fea02f',
  gold600: '#de8b27',
  goldSoft: '#fff3de',

  teal600: '#007a7b',
  teal700: '#005c5e',
  tealSoft: '#e3f3f3',

  ink: '#0b1b26',
  textBody: '#3d5164',
  textMuted: '#64798a',
  border: '#e4eaef',

  surface: '#ffffff',
  surfaceAlt: '#f4f8fb',
  navySoft: '#e6eff4',

  successBg: '#ecfdf5',
  successText: '#166534',

  onDark: '#ffffff',
  onDarkMuted: 'rgba(255,255,255,0.72)',
  onDarkFaint: 'rgba(255,255,255,0.5)',
}

/* Mapa que usa Home.jsx. Mismas claves y valores que antes. */
export const COLORES_HOME = {
  primary: TOKENS.navy800,
  primaryLight: TOKENS.navySoft,
  primaryDark: TOKENS.navy900,
  bg: TOKENS.navy800,
  subtleBg: TOKENS.surfaceAlt,
  card: TOKENS.surface,
  textDark: TOKENS.ink,
  textBody: TOKENS.textBody,
  textMuted: TOKENS.textMuted,
  border: TOKENS.border,
  orange: TOKENS.orange600,
  orangeDark: TOKENS.orange700,
  accent: TOKENS.teal600,
  accentDark: TOKENS.teal700,
  accentLight: TOKENS.tealSoft,
  greenBg: TOKENS.successBg,
  greenText: TOKENS.successText,
  gold: TOKENS.gold500,
  goldDark: TOKENS.gold600,
  goldLight: TOKENS.goldSoft,
  onDark: TOKENS.onDark,
  onDarkMuted: TOKENS.onDarkMuted,
  onDarkFaint: TOKENS.onDarkFaint,
}

/* Mapa que usa Mispuntos.jsx. Mismas claves y valores que antes. */
export const COLORES_PUNTOS = {
  navy900: TOKENS.navy900,
  navy800: TOKENS.navy800,
  navy600: TOKENS.navy600,
  orange: TOKENS.orange500,
  orangeDark: TOKENS.orange600,
  gold: TOKENS.gold500,
  goldDark: TOKENS.gold600,
  teal: TOKENS.teal600,
  ink: TOKENS.ink,
  textBody: TOKENS.textBody,
  textMuted: TOKENS.textMuted,
  border: TOKENS.border,
  card: TOKENS.surface,
  subtleBg: TOKENS.surfaceAlt,
  surface: TOKENS.surface,
}
