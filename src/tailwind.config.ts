import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        success: "#33ff77",
        danger: "#ff3355",
        warning: "#ffaa00",
      },
    },
  },
  plugins: [],
};

export default config;