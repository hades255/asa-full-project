import React from "react";
import { T_ECO_SCORE } from "./types";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { LeafIcon } from "assets/icons";
import { appColors } from "@/theme";

const EcoScore: React.FC<T_ECO_SCORE> = ({ backgroundColor, ecoScore }) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor
            ? backgroundColor
            : appColors.semantic.background.backgroundTertionary,
        },
      ]}
    >
      <View style={styles.contentWrapper}>
        <LeafIcon style={styles.leafIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.scoreHeader}>Eco Score</Text>
          <Text style={styles.scoreText}>CO₂ {ecoScore ? ecoScore : 0}</Text>
        </View>
      </View>
    </View>
  );
};

export default EcoScore;
