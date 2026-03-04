/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2E252A",
        accent: "#5B5560",
        cocoa: "#2C2830",
        cream: "#FFFFFF",
        sand: "#ECECEC",
        mocha: "#7A7480",
      },
    },
  },
  plugins: [],
};
