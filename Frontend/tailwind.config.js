/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        spice: {
          50:  '#fdf8f0',
          100: '#faefd8',
          200: '#f5dcaf',
          300: '#efc27d',
          400: '#e8a04a',
          500: '#e08a28',
          600: '#c96f1d',
          700: '#a7541a',
          800: '#88431c',
          900: '#6e3819',
        },
        terra: {
          50:  '#fdf5f3',
          100: '#fae8e3',
          200: '#f5d0c6',
          300: '#ecad9d',
          400: '#e07d68',
          500: '#d05c44',
          600: '#bc4632',
          700: '#9d3929',
          800: '#833226',
          900: '#6e2d24',
        },
        cream: {
          50:  '#fffdf8',
          100: '#fef9ed',
          200: '#fdf0d0',
          300: '#fbe3a8',
          400: '#f7ce72',
          500: '#f2b640',
        },
        leaf: {
          500: '#4a7c59',
          600: '#3d6849',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease forwards',
        fadeIn: 'fadeIn 0.4s ease forwards',
        scaleIn: 'scaleIn 0.3s ease forwards',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}
