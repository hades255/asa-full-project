import { Dimensions } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { moderateScale, verticalScale } from "./responsive";

const fontFamily = {
  regular: `Poppins-Regular`,
  medium: `Poppins-Medium`,
  semiBold: `Poppins-SemiBold`,
  bold: `Poppins-Bold`,
};

export const lightTheme = {
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
  units: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    9: 36,
    10: 40,
    11: 42,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
    40: 160,
    48: 192,
    56: 224,
    64: 256,
  },
  typography: {
    heading1: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(36),
      lineHeight: verticalScale(44),
    },
    heading2: {
      fontFamily: fontFamily.semiBold,
      fontSize: moderateScale(28),
      lineHeight: verticalScale(34),
    },
    heading3: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(22),
      lineHeight: verticalScale(28),
    },
    heading4: {
      fontFamily: fontFamily.semiBold,
      fontSize: moderateScale(16),
      lineHeight: verticalScale(28),
    },
    body1: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(16),
      lineHeight: verticalScale(24),
    },
    body2: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(14),
    },
    body3: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(14),
    },
    caption1: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(12),
      lineHeight: verticalScale(16),
    },
    caption2: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(10),
    },
    button1: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
    },
    button2: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(14),
    },
  },
  mobileWidth: Dimensions.get("window").width,
  mobileHeight: Dimensions.get("window").height,
} as const;

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
  },
} as const;

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

const appThemes = {
  light: lightTheme,
  dark: lightTheme,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    initialTheme: "light",
  },
  breakpoints,
  themes: appThemes,
});
