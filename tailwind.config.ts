import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'rgba(94, 82, 64, 0.2)',
        input: 'rgba(94, 82, 64, 0.2)',
        ring: 'rgba(33, 128, 141, 0.4)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'rgb(33, 128, 141)',
          hover: 'rgb(29, 116, 128)',
          active: 'rgb(26, 104, 115)',
          foreground: 'rgb(252, 252, 249)',
          50: '#E6F7F8',
          100: '#CCF0F2',
          200: '#99E0E5',
          300: '#32B8C6',
          400: '#2697A3',
          500: '#21808D',
          600: '#1D7480',
          700: '#1A6873',
          800: '#165259',
          900: '#133B40',
        },
        secondary: {
          DEFAULT: 'rgba(94, 82, 64, 0.12)',
          hover: 'rgba(94, 82, 64, 0.2)',
          active: 'rgba(94, 82, 64, 0.25)',
          foreground: 'rgb(19, 52, 59)',
        },
        destructive: {
          DEFAULT: 'rgb(192, 21, 47)',
          hover: 'rgb(172, 19, 42)',
          foreground: 'rgb(252, 252, 249)',
        },
        success: {
          DEFAULT: 'rgb(34, 197, 94)',
          light: 'rgb(74, 222, 128)',
          foreground: 'rgb(252, 252, 249)',
        },
        muted: {
          DEFAULT: 'rgb(245, 245, 245)',
          foreground: 'rgb(98, 108, 113)',
        },
        accent: {
          DEFAULT: 'rgba(94, 82, 64, 0.12)',
          foreground: 'rgb(19, 52, 59)',
        },
        popover: {
          DEFAULT: 'rgb(255, 255, 253)',
          foreground: 'rgb(19, 52, 59)',
        },
        card: {
          DEFAULT: 'rgb(255, 255, 253)',
          foreground: 'rgb(19, 52, 59)',
        },
        surface: 'rgb(255, 255, 253)',
        cream: {
          50: 'rgb(252, 252, 249)',
          100: 'rgb(255, 255, 253)',
        },
        charcoal: {
          700: 'rgb(31, 33, 33)',
          800: 'rgb(38, 40, 40)',
        },
        slate: {
          500: 'rgb(98, 108, 113)',
        },
        teal: {
          300: 'rgb(50, 184, 198)',
          500: 'rgb(33, 128, 141)',
          600: 'rgb(29, 116, 128)',
          700: 'rgb(26, 104, 115)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.5' }],
        sm: ['12px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.5' }],
        lg: ['16px', { lineHeight: '1.5' }],
        xl: ['18px', { lineHeight: '1.5' }],
        '2xl': ['20px', { lineHeight: '1.2' }],
        '3xl': ['24px', { lineHeight: '1.2' }],
        '4xl': ['30px', { lineHeight: '1.2' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '550',
        bold: '600',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '10': '10px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
