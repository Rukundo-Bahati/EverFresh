/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4A2E21",
        accent: "#7A4A32",
        cocoa: "#2E1D16",
        cream: "#F4ECE5",
        sand: "#D7C0AF",
        mocha: "#A67C63",
      },
    },
  },
  plugins: [],
};
