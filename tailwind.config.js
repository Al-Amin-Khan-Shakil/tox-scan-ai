/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14B8A6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a'
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#8B5CF6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#4c1d95'
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#F97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#9a3412'
        },
        success: {
          50: '#f0fdf4',
          500: '#22C55E',
          600: '#16a34a',
          700: '#15803d'
        },
        warning: {
          50: '#fffbeb',
          500: '#F59E0B',
          600: '#d97706',
          700: '#b45309'
        },
        error: {
          50: '#fef2f2',
          500: '#EF4444',
          600: '#dc2626',
          700: '#b91c1c'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #14B8A6 0%, #8B5CF6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      }
    },
  },
  plugins: [],
};