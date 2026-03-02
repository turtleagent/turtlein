export const tokens = {
  radius: {
    card: 12,
    pill: 999,
    button: 999,
    dialog: 16,
    input: 8,
    comment: 18,
  },

  shadow: {
    card: "none",
    dropdown: "0 8px 30px rgba(0,0,0,0.12)",
    hover: "0 0 0 1px rgba(0,0,0,0.08)",
    header: "none",
  },

  transition: {
    fast: "0.12s ease",
    normal: "0.18s ease",
    slow: "0.25s ease",
  },

  type: {
    family: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    size: { xs: 11, sm: 12, body: 14, md: 15, lg: 20, xl: 24 },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  },

  color: {
    primary: "#057642",
    primaryLight: "#0a9154",
    primaryDark: "#004d2c",
    primarySubtle: "rgba(5,118,66,0.07)",

    light: {
      bg: "#f4f2ee",
      surface: "#ffffff",
      textPrimary: "#191919",
      textSecondary: "#5e5e5e",
      textTertiary: "#8e8e8e",
      hoverBg: "rgba(0,0,0,0.04)",
      activeBg: "rgba(0,0,0,0.08)",
      divider: "rgba(0,0,0,0.08)",
      cardBorder: "rgba(0,0,0,0.08)",
    },

    dark: {
      bg: "#1b1f23",
      surface: "#1d2226",
      textPrimary: "#ffffffe6",
      textSecondary: "#ffffffa3",
      textTertiary: "#ffffff66",
      hoverBg: "rgba(255,255,255,0.06)",
      activeBg: "rgba(255,255,255,0.1)",
      divider: "rgba(255,255,255,0.1)",
      cardBorder: "rgba(255,255,255,0.1)",
    },
  },
};
