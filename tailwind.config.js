/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        line: "1px",
        76: "312px",
        "form-1": "360px",
        "form-2": "640px",
        "form-3": "",
      },
      borderWidth: {
        line: "1px",
      },
      colors: {
        primary: {
          50: "#F2F3F7",
          100: "#E7EAF1",
          200: "#CED1DB",
          300: "#B5B8C4",
          400: "#828697",
          500: "#4F546A",
          600: "#4F546A",
          700: "#363B53",
          800: "#1C213C",
          DEFAULT: "#171A2B",
        },
        secundary: {
          50: "#FFFBC5",
          100: "#FDF3AF",
          200: "#FAEA99",
          300: "#F7E283",
          400: "#F4D96D",
          500: "#F4D96D",
          600: "#F1D157",
          700: "#EEC841",
          800: "#EBBF2B",
          DEFAULT: "#E8B615",
        },
      },
    },
  },
  plugins: [],
});
