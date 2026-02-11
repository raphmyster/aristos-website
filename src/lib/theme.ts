/**
 * Aristos Theme Configuration
 *
 * Single source of truth for all visual customization.
 * To re-theme for a new client: update the values below and
 * the corresponding CSS custom properties in globals.css.
 *
 * See docs/reference/DESIGN-GUIDE.md for full design rationale.
 */

export const theme = {
  colors: {
    primary: "#1E3A8A",          // Greek blue — logo color, CTAs, accents
    "primary-light": "#DBEAFE",  // Soft blue — hover states, tag backgrounds
    secondary: "#78716C",        // Warm stone — secondary text, captions
    accent: "#4D7C0F",           // Olive/herb green — dietary tags, success
    background: "#FAF9F6",       // Warm white — page base
    foreground: "#1C1917",       // Near-black — primary text
    muted: "#F0EEEB",            // Warm gray — cards, alternating sections
    "muted-foreground": "#78716C", // Medium gray — secondary text
    border: "#E5E2DD",           // Warm edge — dividers, card borders
    destructive: "#DC2626",      // Error red
  },
  fonts: {
    heading: "'DM Serif Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
  },
  radii: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
} as const;

export type Theme = typeof theme;
