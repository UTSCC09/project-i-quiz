/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "iquiz-blue": "#0366FF",
        "gray-150": "#EDEEF0"
      }
    },
  },
  plugins: [],
}
