const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        core: {
          primaryA: "black",
          primaryB: "white",
          accent: "#F0BB4F",
          negative: "#DE1135",
          warning: "#F6BC2F",
          positive: "#0E8345",
        },
        semantic: {
          background: {
            backgroundPrimary: "#FFFFFF",
            backgroundSecondary: "#F3F3F3",
            backgroundTertionary: "#E8E8E8",
            backgroundInversePrimary: "#000000",
            backgroundInverseSecondary: "#282828",
          },
          content: {
            contentPrimary: "#000000",
            contentSecondary: "#4B4B4B",
            contentTertionary: "#5E5E5E",
            contentInversePrimary: "#FFFFFF",
            contentInverseSecondary: "#DDDDDD",
            contentInverseTertionary: "#A6A6A6",
          },
          border: {
            borderOpacue: "#E8E8E8",
            borderTransparent: "rgba(0,0,0,0.08)",
            borderSelected: "#000000",
            borderInverseOpacue: "#4B4B4B",
            borderInverseTransparent: "#5C5C5C",
            borderInverseSelected: "#FFFFFF",
          },
        },
        semanticExtensions: {
          background: {
            backgroundStateDisabled: "#F3F3F3",
            backgroundOverlayArt: "rgba(0,0,0,0)",
            backgroundOverlayDark: "rgba(0,0,0,0.5)",
            backgroundOverlayElevation: "rgba(0,0,0,0)",
            backgroundAccent: "#F0BB4F",
            backgroundNegative: "#DE1135",
            backgroundWarning: "#F6BC2F",
            backgroundPositive: "#0E8345",
            backgroundLightAccent: "#FFFEE5",
            backgroundLightNegative: "#FFF0EE",
            backgroundLightWarning: "#FDF2DC",
            backgroundLightPositive: "#EAF6ED",
            backgroundAlwaysLight: "#FFFFFF",
            backgroundAlwaysDark: "#000000",
          },
          content: {
            contentStateDisabled: "#A6A6A6",
            contentOnColor: "#FFFFFF",
            contentOnColorInverse: "#000000",
            contentAccent: "#F0BB4F",
            contentNegative: "#DE1135",
            contentWarning: "#9F6402",
            contentPositive: "#0E8345",
          },
          border: {
            borderStateDisabled: "#F3F3F3",
            borderAccent: "#F0BB4F",
            borderNegative: "#DE1135",
            borderWarning: "#9F6402",
            borderPositive: "#0E8345",
            borderAccentLight: "#FFFEE5",
          },
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontSize: {
        heading1: "2.25rem", // 36px
        heading2: "1.75rem", // 28px
        heading3: "1.375rem", // 22px
        heading4: "1rem", // 16px
        body1: "0.875rem", // 14px
        body2: "0.75rem", // 12px
        caption1: "0.75rem", // 12px
        caption2: "0.625rems", // 10px
        button1: "1rem", // 16px
        button2: "0.875rem", // 14px
      },
      screens: {
        sm: "40rem",
        md: "48rem",
        lg: "64rem",
        xl: "80rem",
        "2xl": "96rem",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require("@tailwindcss/forms"),
    // add custom variant for expanding sidebar
    plugin(({ addVariant, e }) => {
      addVariant("sidebar-expanded", ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) =>
            `.sidebar-expanded .${e(
              `sidebar-expanded${separator}${className}`
            )}`
        );
      });
    }),
  ],
};
