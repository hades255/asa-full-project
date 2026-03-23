import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainWrapper: {
    rowGap: theme.units[3],
  },
  mainContainer: {
    paddingHorizontal: theme.units[4],
    columnGap: theme.units[4],
  },
  title: {
    marginLeft: theme.units[5],
  },
  itemContainer: {
    rowGap: theme.units[1],
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 64,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  imgStyle: {
    width: 64,
    height: 64,
    borderRadius: 64,
  },
}));
