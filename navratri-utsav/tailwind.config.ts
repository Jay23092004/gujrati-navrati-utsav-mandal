import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        maroon: "#5c0a1e",
        pink: "#d9247e",
        gold: "#c8951f",
        cream: "#fff8f0"
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"]
      }
    }
  },
  plugins: []
};
export default config;
