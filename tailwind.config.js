/** @type {import('tailwindcss').Config} */

const { heroui } = require("@heroui/react");

module.exports = {
  darkMode: "class",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: {
          50: "#fefcea",
          100: "#fefcea",
          200: "#fefcea",
          300: "#000",
          400: "#9ca3af",
          500: "#fefcea",
          600: "#000",
          700: "#000",
          800: "#000",
          900: "#000",
          DEFAULT: "#000",
          foreground: "#ffffff",
        },
      },

      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },

      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
    },
  },

  plugins: [heroui(), require("tailwindcss-animate")],
};
