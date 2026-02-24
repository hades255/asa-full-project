// linking.ts
import * as Linking from "expo-linking";

export const linking = {
  prefixes: [Linking.createURL("/")], // e.g. myapp://
  config: {
    screens: {
      SSOCallback: "SSOCallback",
    },
  },
};
