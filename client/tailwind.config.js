/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        titilliumWeb: ["Titillium Web", "sans-serif"],
      },
      colors: {
        backgroundLight: "#ffffff",
        backgroundDark: "#202123",
        containerLight: "#f1f4f6",
        containerDark: "#18191a",
        primaryTextLight: "#1f2937",
        primaryTextDark: "#fbfaf9",
        secondaryTextLight: "#ffffff",
        secondaryTextDark: "#000000",
        errorText: "#dc2626",
        button: "#3b82f6",
        banana: "#facc15",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
