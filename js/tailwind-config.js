// Tema Lumina — dark + roxo
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#100d1a",
        surface: "#1a1626",
        "surface-2": "#221d33",
        border: "#2a2440",
        muted: "#1f1a2e",
        "muted-fg": "#8b85a3",
        primary: "#7c5cff",
        "primary-hover": "#6b4cf5",
        destructive: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(124, 92, 255, 0.5)",
      },
    },
  },
};
