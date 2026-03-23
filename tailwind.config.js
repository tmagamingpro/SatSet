/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF5722",
        "primary-dark": "#E64A19",
        "primary-light": "#FF8A65",
        secondary: "#1A1A2E",
        accent: "#FFC107",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        card: "0 2px 16px rgba(26,26,46,0.08)",
        "card-lg": "0 8px 40px rgba(26,26,46,0.14)",
      },
    },
  },
  plugins: [],
};