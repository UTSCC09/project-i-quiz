/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "logo-tile": "url('/src/media/iquiz_logo_tile.png')"
      },
      colors: {
        "iquiz-blue": "#0366FF"
      }
    },
  },
  plugins: [],
}

