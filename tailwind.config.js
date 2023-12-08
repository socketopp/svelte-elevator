/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        elevator: ['Inter', 'ui-sans-serif'],
        noir: ['Oswald']
      }
    }
  },
  plugins: []
};
