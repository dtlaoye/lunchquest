// tailwind.config.js
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"], // ✅ Crucial for class scanning
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2D5702", // ✅ Your custom deep green
        },
      },
    },
  },
};
