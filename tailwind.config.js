import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",       // app folder
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",     // pages folder
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;