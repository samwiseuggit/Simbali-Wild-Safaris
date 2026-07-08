/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        belleza: ['Belleza', 'serif'],
        work: ['Work Sans', 'sans-serif'],
      },
      colors: {
        olive: {
          DEFAULT: '#4a5c2a',
          dark: '#3d4d22',
        },
        sage: {
          DEFAULT: '#d4e6c3',
          light: '#d4e6c3a0',
        },
        gold: '#d4a843',
      },
    },
  },
  plugins: [],
};
