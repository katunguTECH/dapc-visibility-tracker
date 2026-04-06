/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // This tells Tailwind to look at every file inside your src folder
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}