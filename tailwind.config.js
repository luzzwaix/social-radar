/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        radar: {
          bg: "#0a0f14",
          surface: "#111821",
          line: "rgba(255,255,255,0.08)"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "SFMono-Regular", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
};
