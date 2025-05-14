/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Dark Theme Palette
        'dark': {
          // Backgrounds - from darkest to lightest
          '900': '#0a0a0b',  // Main background
          '800': '#131416',  // Secondary background
          '700': '#1a1d21',  // Elevated surfaces
          '600': '#21262d',  // Cards/panels
          '500': '#30363d',  // Hover states
          '400': '#484f58',  // Borders
          '300': '#656c76',  // Muted text
          '200': '#8b949e',  // Secondary text
          '100': '#b1bac4',  // Primary text (muted)
          '50': '#f0f6fc',   // Primary text (bright)
        },
        // Professional Blue Accents
        'accent': {
          '900': '#0c1929',
          '800': '#1c2e4a',
          '700': '#2c3e50',
          '600': '#3b4c63',
          '500': '#4a90e2',  // Primary accent
          '400': '#64a3f0', 
          '300': '#7fb3f3',
          '200': '#99c3f7',
          '100': '#b3d4fb',
          '50': '#cce4fd',
        },
        // Success/Error colors for dark theme
        'success-dark': '#28a745',
        'warning-dark': '#ffc107',
        'error-dark': '#dc3545',
      },
      // Professional shadows for dark theme
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      // Updated font family for better readability
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      // Professional animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(74, 144, 226, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(74, 144, 226, 0.6)' 
          },
        },
      },
    },
  },
  plugins: [],
}