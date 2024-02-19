/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "light": "#eef5db",
        "dark": "#4f6367",
        "accent": "#fe5f55"
      },
    },
  },
  plugins: [],
}

