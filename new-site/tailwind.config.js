/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-secondary': '#1E1E1E',
        'accent': '#00af1a',
        'accent-light': '#00c91f',
        'accent-dark': '#008a14'
      }
    },
  },
  plugins: [],
}
