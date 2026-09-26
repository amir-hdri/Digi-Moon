/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Core Brand Palette */
        emerald: {
          50: "#ecfdf5",
          100: "#d0fae5",
          200: "#a4f4cf",
          300: "#5ee9b5",
          400: "#00d294",
          500: "#00bb7f",
          600: "#009767",
          700: "#007956",
          800: "#005f46",
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#b9f8cf",
          300: "#7bf1a8",
          400: "#05df72",
          500: "#00c758",
          600: "#00a544",
          700: "#008138",
          800: "#016630",
        },
        teal: {
          300: "#46ecd5",
          500: "#00baa7",
          600: "#009588",
        },
        orange: {
          400: "#ff8b1a",
          500: "#fe6e00",
          600: "#f05100",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c6",
          500: "#f99c00",
          600: "#dd7400",
          700: "#b75000",
          900: "#7b3306",
          950: "#461901",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5dc",
          400: "#99a1af",
          500: "#6a7282",
          600: "#4a5565",
          700: "#364153",
          800: "#1e2939",
          900: "#101828",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cad5e2",
          400: "#90a1b9",
          500: "#62748e",
          600: "#45556c",
          700: "#314158",
          800: "#1d293d",
          900: "#0f172b",
        },
        zinc: {
          100: "#f4f4f5",
          300: "#d4d4d8",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
        },
      },
      fontFamily: {
        sans: ["IRANSans", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",       // 16px - standard product card and action button
        "3xl": "1.5rem",     // 24px - category cards, banners
        "4xl": "2rem",       // 32px - container shells
      },
      spacing: {
        "15": "3.75rem",
        "25": "6.25rem",
        "30": "7.5rem",
        "50": "12.5rem",
        "80": "20rem",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        xl: "24px",
        "2xl": "40px",
      },
      dropShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.15)",
        md: "0 3px 3px rgba(0, 0, 0, 0.12)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glass-header": "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
        "glass-nav": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        floating: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        floating: "floating 2s ease-in-out infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".glass-effect": {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        },
        ".dark .glass-effect": {
          backgroundColor: "rgba(24, 24, 27, 0.8)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        ".gradient-text": {
          backgroundImage: "linear-gradient(to right, #009767, #00baa7)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          display: "inline-block",
        },
      });
    },
  ],
};
