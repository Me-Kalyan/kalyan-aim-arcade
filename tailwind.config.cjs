/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand / primary
        brand: {
          pink: {
            500: "#E6257E", // main brand pink
            400: "#FD5888", // lighter pink (gradient end)
          },
        },
        // Supporting "game category" colors (for gradients, dots, etc.)
        game: {
          valorant: {
            from: "#FF4655",
            to: "#C4314B",
          },
          league: {
            from: "#E6257E",
            to: "#C41C6D",
          },
          csgo: {
            from: "#FA6400",
            to: "#CC5200",
          },
          fortnite: {
            from: "#4DD9F5",
            to: "#5BEBE5",
          },
        },
        // Background / surfaces - Light mode
        surface: {
          base: "#F5F5F5", // page background
          card: "#FFFFFF", // card background
          subtle: "#FAFAFA", // table header / subtle blocks
          border: "#E5E5E5", // main border
          borderSoft: "#F3F4F6", // table row borders, subtle outlines
        },
        // Text - Light mode
        ink: {
          primary: "#171717",
          muted: "#525252",
          soft: "#737373",
          subtle: "#A3A3A3",
        },
        // Status / utility
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        // Accent dots
        accent: {
          indigo: "#6366F1",
          cyan: "#22D3EE",
          orange: "#FB923C",
          purple: "#A855F7",
          cyanSoft: "#4DD9F5",
        },
      },
      borderRadius: {
        card: "1.75rem", // card radius used everywhere
        pill: "999px",   // fully rounded pills
      },
      boxShadow: {
        card: "0 4px 16px rgba(15, 23, 42, 0.08)", // soft default card
        elevated: "0 18px 40px rgba(15, 23, 42, 0.16)", // for special cards
        brand: "0 0 20px rgba(230, 37, 126, 0.35)", // logo glow
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

