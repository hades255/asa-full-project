import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  mainContainer: {
    flexGrow: 1,
    rowGap: theme.units[6],
    paddingBottom: 100,
  },
  scrollContainer: {
    marginHorizontal: theme.units[4],
    marginVertical: theme.units[4],
  },
  topContainer: {
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[3],
    borderRadius: theme.units[4],
    backgroundColor: theme.colors.semantic.background.backgroundTertionary,
    rowGap: theme.units[4],
  },
  avatarMainContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[3],
  },
  avatarLeft: {},
  avatarRight: {
    flex: 1,
  },
  name: {
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  email: {
    ...theme.typography.caption1,
    color: theme.colors.semantic.content.contentInverseTertionary,
  },
  ecoScore: {
    ...theme.typography.heading4,
    color: theme.colors.semantic.content.contentPrimary,
  },
  section: {
    rowGap: theme.units[6],
  },
  sectionTitle: {
    ...theme.typography.heading4,
    color: theme.colors.semantic.content.contentPrimary,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.units[3],
  },
  sectionRowTitle: {
    ...theme.typography.body1,
    color: theme.colors.semantic.content.contentPrimary,
  },
  versionContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    bottom: 0,
    paddingHorizontal: theme.units[4],
    paddingVertical: theme.units[4],
    backgroundColor: theme.colors.semantic.background.backgroundPrimary,
  },
  appVersion: {
    ...theme.typography.caption1,
    color: theme.colors.semantic.content.contentInverseTertionary,
    textAlign: "center",
  },
  userDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userDetailsLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  userDetailsContent: {
    rowGap: 2,
    flex: 1,
    paddingHorizontal: theme.units[3],
  },
  userDetailsContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
}));
