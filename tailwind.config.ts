import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        pretendard: ["Pretendard"],
      },
      lineHeight: {
        snug: "1.4",
        normal: "1.5",
      },
      height: {
        header: "64px",
        footer: "72px",
        menubar: "72px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          subtle: "var(--primary-subtle)",
          hover: "var(--primary-hover)",
          pressed: "var(--primary-pressed)",
          fg: "var(--primary-fg)",
          inverse: "var(--primary-inverse)",
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
        warning: {
          DEFAULT: "var(--warning)",
        },
        error: {
          DEFAULT: "var(--error)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        disabled: {
          DEFAULT: "var(--neutral-300)",
          foreground: "var(--white)",
        },
        layer: {
          fill: "var(--my-colors-layer-fill)",
          hover: "var(--my-colors-layer-hover)",
          pressed: "var(--my-colors-layer-pressed)",
        },
        boundary: {
          DEFAULT: "var(--my-colors-boundary)",
        },
      },
      borderRadius: {
        "2xl": "calc(var(--radius) + 4px)",
        xl: "calc(var(--radius) + 2px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "fade-out": {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
        ripple: {
          from: {
            opacity: "1",
            transform: "scale(0)",
          },
          to: {
            opacity: "0",
            transform: "scale(10)",
          },
        },
      },
      screen: {
        "no-hover": { raw: "(hover: none)" },
        hoverable: {
          raw: "(hover: hover) and (pointer: fine)",
        },
      },
      boxShadow: {
        "1": "0px 4px 12px 0px rgba(52, 52, 52, 0.2)",
        cta: "0 10px 15px -3px rgba(255, 127, 87, 0.30)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-in",
        "fade-out": "fade-out 0.3s ease-out",
        ripple: "ripple 1s ease-out",
      },
    },
    variants: {
      extend: {
        backgroundColor: ["hover", "active", "no-hover", "hoverable"],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
