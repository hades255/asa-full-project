import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.semantic.background.backgroundPrimary,
  },
  sliderContainer: {
    width: theme.mobileWidth,
    height: 300,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayIconsHeader: {
    width: theme.mobileWidth,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.units[4],
    zIndex: 2,
  },
  overlayRightIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: theme.units[3],
  },
  ecoContainer: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[2],
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 100,
    overflow: "hidden",
    paddingHorizontal: theme.units[3],
  },
  bodyScrollContainer: {
    rowGap: theme.units[4],
    paddingVertical: theme.units[4],
  },
  section: {
    rowGap: theme.units[1],
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: theme.units[3],
  },
  rightAlignRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: theme.units[1],
  },
  leftAlignRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: theme.units[1],
  },
  sectionHPadding: {
    paddingHorizontal: theme.units[4],
  },
  separator: {
    height: 1,
    borderRadius: 100,
    backgroundColor: theme.colors.semantic.background.backgroundTertionary,
    marginHorizontal: theme.units[4],
  },
  wrappedView: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    rowGap: theme.units[3],
    columnGap: theme.units[3],
  },
  actionContainer: {
    paddingHorizontal: theme.units[4],
    paddingBottom: theme.units[6],
    paddingTop: theme.units[4],
  },
  linearGrad: {
    position: "absolute",
    top: 0,
    left: 0,
    width: theme.mobileWidth,
    height: 300,
    zIndex: 1,
  },
}));
