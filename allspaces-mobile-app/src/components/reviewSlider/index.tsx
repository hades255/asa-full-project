import { View, Text } from "react-native";
import React from "react";
import { T_REVIEW_SLIDER } from "./types";
import { styles } from "./styles";
import AppText from "../appText";

const ReviewSlider: React.FC<T_REVIEW_SLIDER> = ({
  label,
  percentage,
  reviewCount,
}) => {
  return (
    <View style={styles.mainContainer}>
      <AppText font="caption1">{label}</AppText>
      <View style={styles.sliderBg}>
        <View style={[styles.sliderPercentage, { width: percentage }]} />
      </View>
      <AppText font="caption1">{`${reviewCount} reviews`}</AppText>
    </View>
  );
};

export default ReviewSlider;
