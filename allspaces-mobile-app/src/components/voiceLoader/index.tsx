import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useUnistyles } from "react-native-unistyles";

const BAR_WIDTH = 8;
const BAR_HEIGHT_MIN = 4;
const BAR_HEIGHT_MAX = 48;
const BAR_GAP = 20;
const DURATION = 300;

type TVoiceLoader = {
  color?: string;
  size?: number;
};

const VoiceLoader: React.FC<TVoiceLoader> = ({
  color,
  size = 1,
}) => {
  const { theme } = useUnistyles();
  const barColor = color ?? theme.colors.core.accent;
  const left = useRef(new Animated.Value(1)).current;
  const center = useRef(new Animated.Value(1)).current;
  const right = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const run = (animVal: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animVal, {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: false,
          }),
          Animated.timing(animVal, {
            toValue: 1,
            duration: DURATION,
            useNativeDriver: false,
          }),
        ])
      );

    const a1 = run(left, 0);
    const a2 = run(center, 300);
    const a3 = run(right, 450);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [left, center, right]);

  const barStyle = (animVal: Animated.Value) => ({
    width: BAR_WIDTH * size,
    height: animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [BAR_HEIGHT_MIN, BAR_HEIGHT_MAX],
    }),
    borderRadius: 4 * size,
    backgroundColor: barColor,
  });

  return (
    <View style={[styles.container, { gap: BAR_GAP * size }]}>
      <Animated.View style={[styles.bar, barStyle(left)]} />
      <Animated.View style={[styles.bar, barStyle(center)]} />
      <Animated.View style={[styles.bar, barStyle(right)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bar: {
    alignSelf: "center",
  },
});

export default VoiceLoader;
