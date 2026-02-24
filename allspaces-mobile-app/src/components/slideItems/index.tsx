import { Props } from "./types";
import React, { useMemo } from "react";
import { ImageBackground, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import styles from "./styles";

const SlideItem: React.FC<Props> = (props) => {
  const { style, index = 0, rounded = false, testID, totalItems } = props;

  const source = useMemo(() => props.source, [props.source]);

  return (
    <ImageBackground
      style={[style, styles.container]}
      source={source}
      resizeMode="cover"
    >
      {totalItems && (
        <View style={styles.overlay}>
          <View style={{ flexDirection: "row" }}>
            {Array.from({ length: totalItems }).map((_, i) => (
              <View
                key={`dot-${i}`}
                style={[
                  styles.paginationDot,
                  i === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

export default SlideItem;
