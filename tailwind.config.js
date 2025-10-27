/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pkgA:  "#2563EB",
        pkgB:  "#059669",
        pkgC:  "#D97706",
        pkgD:  "#DC2626",
        pkgF:  "#7C3AED",
        pkgG:  "#0D9488",
        pkgI2: "#EA580C",
        pkgPMEC: "#9333EA"
      }
    }
  },
  plugins: []
};
