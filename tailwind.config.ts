import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // Or "media" if you prefer media query-based dark mode
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
        "blue-gl": "#09A5E8",
        "blue-gl-hover" : "#0d8abf",
        "user-pink": "#EC5E84",
        customPink: "#FFEAEF",
        customYellow: "#FFFCEA",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        xs: { max: "391px" }, 
        xxs: { max: "366px" },
        xxxs: { max: "350px" },
        xsm: { max: "368px" },
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"),
  ],
  
} satisfies Config;
