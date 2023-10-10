/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "big-q": "url('/src/media/big_q_bg.png')"
      }
    },
  },
  plugins: [],
}

