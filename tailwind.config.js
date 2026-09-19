/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A317B',
          navyLight: '#1e40af',
          teal: '#1A9C9B',
          tealLight: '#2dd4bf',
          orange: '#FA9C16',
          orangeLight: '#fbbf24',
          bg: '#ffffff',
          card: '#ffffff',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Fragment Mono"', 'monospace'],
      },
      boxShadow: {
        '3d': '0 20px 40px -15px rgba(10, 49, 123, 0.15), 0 10px 15px -5px rgba(10, 49, 123, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        '3d-orange': '0 20px 40px -10px rgba(250, 156, 22, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.4)',
        '3d-teal': '0 20px 40px -10px rgba(26, 156, 155, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.4)',
        '3d-navy': '0 20px 40px -10px rgba(10, 49, 123, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
