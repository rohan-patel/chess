import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "light-square": "#F0D9B5",
        "dark-square": "#B58863",
        "selected-square": "#829769",
        "valid-move": "#646F40",
        "valid-move-square": "#AEB187",
        "capture-outer": "#A60000",
        "capture-inner": "#FF5555",
      },
    },
  },
  plugins: [],
};
export default config;
