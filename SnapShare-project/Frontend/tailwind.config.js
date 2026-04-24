/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#a855f7",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(0, 0, 0, 0.1)",
        "medium": "0 4px 12px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
