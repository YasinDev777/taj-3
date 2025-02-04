/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#2c2b34",
        white: "#fff",
        text: "#000",
        blockCard: "#ae4040",
        body: "#f5f8fa",
        border: "#b6b6b6",
        otherText: "#8e8e8e",
        cardText: "#e8ebef",
        cardOtherText: "#bb1111",
        salaryPlus: "#2ecc71",
        newText: "#1a1a1a",
        alert: "#fcfcfc",
        newRed: "#a31400",
        popavText: "#ffdbd6",
      },
      screens: {
        "max-xs": { max: "475px" },   // 475px dan kichik (sm dan oldin)
        "max-sm": { max: "640px" },   // 640px dan kichik
        "max-md": { max: "768px" },   // 768px dan kichik
        "max-md-plus": { max: "867px" },
        "max-lg": { max: "1024px" },  // 1024px dan kichik
        "max-xl": { max: "1280px" },  // 1280px dan kichik
        "max-2xl": { max: "1536px" }, // 1536px dan kichik

      },
      animation: {
        float: "float 3.5s infinite",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10%)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
    },
  },
  plugins: [],
};
