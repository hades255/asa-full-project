import React from "react";
import { T_SCREEN_WRAPPER } from "./types";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import { styles } from "./styles";
import { useUnistyles } from "react-native-unistyles";

const ScreenWrapper: React.FC<T_SCREEN_WRAPPER> = ({
  children,
  bgColor,
  withtoutTopPadding,
  withoutBottomPadding,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  return (
    <SafeAreaProvider style={styles.mainContainer}>
      <Animated.View
        entering={FadeInRight}
        exiting={FadeOutLeft}
        layout={LinearTransition}
        style={[
          styles.mainContainer,
          {
            paddingTop: withtoutTopPadding ? 0 : insets.top,
            paddingBottom: withoutBottomPadding ? 0 : insets.bottom,
            backgroundColor:
              bgColor ?? theme.colors.semantic.background.backgroundPrimary,
          },
        ]}
      >
        {children}
      </Animated.View>
    </SafeAreaProvider>
  );
};

export default ScreenWrapper;
