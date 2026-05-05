// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brew-brown': '#3B1F0A',
        'brew-caramel': '#C07A3A',
        'brew-cream': '#F5ECD7',
        'brew-dark': '#1A0F05',
        'brew-light': '#FBF6EE',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}