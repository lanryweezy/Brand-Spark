/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "brand-primary": "var(--brand-primary-dynamic, #5c22d9)",
        "brand-primary-light": "#ede9fe",
        "brand-accent": "#10b981",
        "brand-secondary": "#1f2937",
        "brand-light": "#f8fafc",
        "brand-text": "#0f172a",
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e2937",
          900: "#0f172a",
        },
      },
      boxShadow: {
        subtle: "0 4px 12px rgba(0, 0, 0, 0.05)",
        medium: "0 8px 24px rgba(0, 0, 0, 0.07)",
        lifted: "0 10px 30px -5px rgba(0, 0, 0, 0.09), 0 4px 6px -4px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};