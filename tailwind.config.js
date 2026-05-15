/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a7ea4',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#dc3545',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6c757d',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f8f9fa',
          foreground: '#687076',
        },
        accent: {
          DEFAULT: '#f8f9fa',
          foreground: '#11181C',
        },
        background: '#ffffff',
        foreground: '#11181C',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#11181C',
        },
        border: '#e1e4e8',
        input: '#e1e4e8',
        ring: '#0a7ea4',
      },
    },
  },
  plugins: [],
}
