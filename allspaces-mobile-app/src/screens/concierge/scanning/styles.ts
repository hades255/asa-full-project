import {
  appColors,
  appSpacings,
  appTypography,
  horizontalScale,
  verticalScale,
} from "@/theme";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bodyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    ...appTypography.body1,
    color: appColors.semantic.content.contentPrimary,
    textAlign: "center",
  },
  cameraView: {
    flex: 1,
    backgroundColor: appColors.semantic.background.backgroundInversePrimary,
  },
  qrPlaceholderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutContainer: {
    position: "absolute",
    zIndex: 99,
    right: horizontalScale(appSpacings[4]),
    top:
      Platform.OS === "android"
        ? verticalScale(appSpacings[6])
        : verticalScale(56),
  },
});
