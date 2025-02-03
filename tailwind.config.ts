import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // Supports both "class" and "media" approaches
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "move-pattern": {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(20%, 20%)" },
        },
      },
      animation: {
        "move-pattern": "move-pattern 8s linear infinite",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "blue-gl": "#09A5E8",
        "blue-gl-hover": "#0d8abf",
        "user-pink": "#EC5E84",
        customPink: "#FFEAEF",
        customYellow: "#FFFCEA",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
