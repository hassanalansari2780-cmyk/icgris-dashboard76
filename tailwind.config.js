/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pkgA:  '#2563EB', // Blue
        pkgB:  '#059669', // Emerald
        pkgC:  '#D97706', // Amber
        pkgD:  '#DC2626', // Red
        pkgF:  '#7C3AED', // Violet
        pkgG:  '#0D9488', // Teal
        pkgI2: '#EA580C', // Orange
        pkgPMEC: '#9333EA', // Purple
      },
    },
  },
  plugins: [],
};

