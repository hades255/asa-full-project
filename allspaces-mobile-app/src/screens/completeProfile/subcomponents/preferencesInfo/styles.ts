import { appSpacings, verticalScale } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    rowGap: verticalScale(appSpacings[4]),
  },
  middleContainer: {
    flex: 1,
  },
});
