/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B192C",
          "navy-dark": "#060D17",
          "navy-light": "#1E3E62",
          orange: "#FF6B35",
          "orange-light": "#FFA07A",
          "orange-dark": "#E8590C",
          amber: "#FFB703",
          red: "#DC2626",
          "red-dark": "#991B1B",
          charcoal: "#1E293B",
          surface: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        telugu: ["Noto Sans Telugu", "Mandali", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
