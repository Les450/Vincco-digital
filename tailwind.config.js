/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // "dark" solo se usa vía class="dark" en public/index.html, fuera del
  // glob de `content` de arriba. Sin este safelist, Tailwind purga la
  // regla .dark de @layer base por no encontrar la clase en el código
  // escaneado, y el tema oscuro de los componentes shadcn se rompe.
  safelist: ["dark"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // El blanco de la interfaz es hueso cálido de marca (#ead9c7),
        // no blanco frío: lo aplican todos los `*-white` de Tailwind.
        white: '#ead9c7',
        // Paleta de marca oficial de Vincco, según la guía de identidad:
        //   naranja #dd6600 · dorado #fea02f · turquesa #007a7b
        //   tinta (azul profundo) #003f5a · hueso (fondo cálido) #ead9c7
        // Declaradas como escalas 50-900 para trabajar con tintes.
        naranja: {
          50: '#fff5ec',
          100: '#ffe8d2',
          200: '#ffd0a3',
          300: '#fdb06a',
          400: '#f78a33',
          500: '#dd6600',
          600: '#c05900',
          700: '#a34b00',
          800: '#803a00',
          900: '#5c2a00',
        },
        dorado: {
          50: '#fff6e8',
          100: '#ffedc9',
          200: '#ffd99a',
          300: '#ffc46a',
          400: '#feab45',
          500: '#fea02f',
          600: '#de8b27',
          700: '#b96e1c',
          800: '#8f5214',
          900: '#6b3c0e',
        },
        turquesa: {
          50: '#e8f6f6',
          100: '#cdecec',
          200: '#a2dcdc',
          300: '#6fc6c6',
          400: '#3aa8a8',
          500: '#0d8d8e',
          600: '#007a7b',
          700: '#005c5e',
          800: '#004e50',
          900: '#003b3c',
        },
        tinta: {
          50: '#eef6fa',
          100: '#d9ecf4',
          200: '#b4d9e8',
          300: '#86bed5',
          400: '#4f9cba',
          500: '#1f7499',
          600: '#0d5a7c',
          700: '#064966',
          800: '#003f5a',
          900: '#002e43',
          950: '#001d2a',
        },
        hueso: {
          50: '#fbf7f0',
          100: '#f7efe3',
          200: '#f1e4d4',
          300: '#ead9c7',
          400: '#ddc5ab',
          500: '#d0b28f',
          600: '#bd9870',
          700: '#a37c58',
          800: '#856143',
          900: '#684a33',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // Identidad Vincco: azul marino profundo + dorado suave.
        // Se usa en las pantallas que adoptan shadcn/ui (modulo
        // Proveedores, Avisos).
        vincco: {
          navy: {
            50: '#EEF2F9',
            500: '#2357A6',
            600: '#1B468C',
            700: '#14356E',
            800: '#0F2C59',
            900: '#0B2348',
            950: '#081B36'
          },
          gold: {
            DEFAULT: '#D4A843',
            700: '#A87F28',
            600: '#B98F2F',
            500: '#D4A843',
            100: '#F1E3C0',
            50: '#FBF4E5'
          },
          ink: '#1A1A2E',
          slate2: '#5B6472',
          mist: '#FAFAFA',
          line: '#E7E9F0',
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        // Display serif con carácter para títulos y cifras grandes
        display: ['Fraunces', 'Georgia', 'serif'],
        // Sans geométrica legible para la interfaz
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' }
        }
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 1.6s linear infinite'
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}
