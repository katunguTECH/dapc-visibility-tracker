import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
theme: {
  extend: {},
},
safelist: [
  "rounded-[32px]",
  "rounded-[24px]",
  "bg-blue-600",
  "hover:bg-blue-700",
  "text-blue-600",
  "text-slate-950",
],