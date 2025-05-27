const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...fontFamily.sans],
      },
      borderRadius: {
        DEFAULT: "12px",
        secondary: "8px",
        container: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        DEFAULT: "0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.04)",
        hover: "0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 2px 6px rgba(0, 0, 0, 0.10), 0 1px 3px rgba(0, 0, 0, 0.06)",
        inner: "inset 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
      },
      colors: {
        // Apple-inspired warm color palette
        primary: {
          50: "#fef7ee",
          100: "#fdedd3",
          200: "#fbd7a5",
          300: "#f8bc6d",
          400: "#f59532",
          500: "#f37a0a", // Main orange
          600: "#e45e07",
          700: "#bd460a",
          800: "#973710",
          900: "#7a2e11",
        },
        secondary: {
          50: "#fdf4f3",
          100: "#fce7e6",
          200: "#fad2d1",
          300: "#f6b2b0",
          400: "#f08480",
          500: "#e85d55", // Warm red
          600: "#d53f35",
          700: "#b32f26",
          800: "#942923",
          900: "#7c2622",
        },
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15", // Warm yellow
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        neutral: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
        // Dark mode colors
        dark: {
          50: "#18181b",
          100: "#27272a",
          200: "#3f3f46",
          300: "#52525b",
          400: "#71717a",
          500: "#a1a1aa",
          600: "#d4d4d8",
          700: "#e4e4e7",
          800: "#f4f4f5",
          900: "#fafafa",
        },
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #f37a0a 0%, #e85d55 100%)",
        "gradient-sunset":
          "linear-gradient(135deg, #facc15 0%, #f37a0a 50%, #e85d55 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(243, 122, 10, 0.1) 0%, rgba(232, 93, 85, 0.1) 100%)",
        "gradient-dark": "linear-gradient(135deg, #292524 0%, #1c1917 100%)",
      },
      spacing: {
        "form-field": "16px",
        section: "32px",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover", "active", "dark"],
      backgroundImage: ["dark"],
    },
  },
};
