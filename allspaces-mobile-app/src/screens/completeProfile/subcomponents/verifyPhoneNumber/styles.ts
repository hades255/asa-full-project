import { appSpacings, verticalScale } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bodyContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  topContainer: {
    rowGap: verticalScale(appSpacings[9]),
  },
  otpContainer: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: verticalScale(appSpacings[4]),
  },
});
