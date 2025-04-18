/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#f0f4f8', // Light mode background (used in globals.css)
          text: '#1f2937', // Light mode text
        },
        dark: {
          background: '#1f2937', // Dark mode background
          text: '#f3f4f6', // Dark mode text
        },
      },
    },
  },
  plugins: [],
};
