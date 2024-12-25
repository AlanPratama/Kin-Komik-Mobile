module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: "#121212",
        accent: "#f9cb55",
        gray: "#c1c1c1",
        white: "#f8f8f8"
      },
      fontFamily: {
        go: ['Go']
      }
    }
  },
  plugins: []
}