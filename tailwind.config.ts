import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        // ─── PolymerHub v3 — Bold CN-Industrial Palette ──────────────────
        // High-contrast, domain-coded color system
        // White/Black base + 5 domain accent colors

        // Base
        canvas: 'var(--canvas)',          // primary page background
        ink: {
          DEFAULT: 'var(--ink)',          // headlines, body text
          muted: 'var(--ink-muted)',      // secondary text
          soft: 'var(--ink-soft)',        // captions, metadata
        },

        // Domain: Chemistry / Trust / Navigation
        blue: {
          DEFAULT: '#1D4ED8',       // primary blue
          hover: '#1E40AF',
          light: '#EFF6FF',
          border: '#BFDBFE',
          dark: '#1e3a8a',
          600: '#2563EB',
        },

        // Domain: Sustainability / Recycling / Bioplastics
        green: {
          DEFAULT: '#15803D',       // bio green
          hover: '#166534',
          light: '#F0FDF4',
          border: '#BBF7D0',
          dark: '#14532D',
          400: '#4ADE80',
          500: '#22C55E',
        },

        // Domain: Processing / Machinery / Mould Design
        orange: {
          DEFAULT: '#EA580C',       // melt orange
          hover: '#C2410C',
          light: '#FFF7ED',
          border: '#FED7AA',
          dark: '#7C2D12',
          400: '#FB923C',
        },

        // Domain: News / Market / Daily Pulse
        yellow: {
          DEFAULT: '#CA8A04',       // golden yellow (text-safe)
          hover: '#A16207',
          light: '#FEFCE8',
          border: '#FEF08A',
          bright: '#FACC15',        // for dark backgrounds
          dark: '#713F12',
        },

        // Domain: Future Tech / Advanced / Careers / Medical
        violet: {
          DEFAULT: '#7C3AED',       // advanced violet
          hover: '#6D28D9',
          light: '#F5F3FF',
          border: '#DDD6FE',
          dark: '#4C1D95',
          400: '#A78BFA',
        },

        // Legacy warm palette aliases (backward compat for existing pages)
        background: {
          DEFAULT: '#FFFFFF',
          card: '#F9FAFB',
        },
        sage: {
          DEFAULT: '#15803D',
          hover: '#166534',
          light: '#F0FDF4',
          50: '#F0FDF4',
          100: '#DCFCE7',
        },
        amber: {
          DEFAULT: '#EA580C',
          hover: '#C2410C',
          light: '#FFF7ED',
          bg: '#FFF7ED',
          border: '#FED7AA',
        },
        teal: {
          DEFAULT: '#1D4ED8',
          hover: '#1E40AF',
          light: '#EFF6FF',
        },
        primary: {
          DEFAULT: '#1D4ED8',
          hover: '#1E40AF',
          light: '#EFF6FF',
        },
        accent: {
          DEFAULT: '#EA580C',
          hover: '#C2410C',
        },
        surface: '#FFFFFF',
        dark: '#0A0A0A',
        muted: '#6B7280',

        // shadcn compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },


      fontSize: {
        // Larger scale for bold editorial feel
        'display-xl': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '900' }],
        'display-lg': ['3.75rem', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-md': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
      },

      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
      },

      boxShadow: {
        // Neobrutalist hard shadows
        'hard-sm': '2px 2px 0px 0px var(--ink)',
        'hard': '4px 4px 0px 0px var(--ink)',
        'hard-lg': '6px 6px 0px 0px var(--ink)',
        'hard-xl': '8px 8px 0px 0px var(--ink)',
        'hard-blue': '4px 4px 0px 0px #1D4ED8',
        'hard-orange': '4px 4px 0px 0px #EA580C',
        'hard-green': '4px 4px 0px 0px #15803D',
        'hard-violet': '4px 4px 0px 0px #7C3AED',
        'hard-yellow': '4px 4px 0px 0px #CA8A04',
      },

      borderRadius: {
        DEFAULT: '0px',   // neobrutalism: no rounding by default
        sm: '2px',
        md: '4px',
        lg: '4px',
        xl: '6px',
        '2xl': '8px',
        '3xl': '12px',
        full: '9999px',
      },

      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        blobPulse: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.05) rotate(3deg)' },
        },
      },
      animation: {
        ticker: 'ticker 35s linear infinite',
        'fade-up': 'fadeUp 0.4s ease-out both',
        'slide-in': 'slideIn 0.3s ease-out both',
        'blob-pulse': 'blobPulse 8s ease-in-out infinite',
      },

      typography: {
        DEFAULT: {
          css: {
            color: '#0A0A0A',
            maxWidth: 'none',
            h2: { color: '#1D4ED8', fontWeight: '700', fontFamily: 'Fraunces, serif' },
            h3: { color: '#0A0A0A', fontWeight: '600' },
            strong: { color: '#0A0A0A' },
            code: {
              color: '#7C3AED',
              backgroundColor: '#F5F3FF',
              padding: '0.2em 0.4em',
              borderRadius: '2px',
              fontWeight: '500',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            blockquote: {
              borderLeftColor: '#EA580C',
              borderLeftWidth: '4px',
              backgroundColor: '#FFF7ED',
              padding: '0.75rem 1rem',
              fontStyle: 'normal',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}

export default config
