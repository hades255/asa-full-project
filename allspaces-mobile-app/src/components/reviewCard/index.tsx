import { View } from "react-native";
import React from "react";
import { styles } from "./styles";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";
import { T_REVIEW_CARD } from "./types";
import { getTimeAgo } from "@/utils/essentials";

const ReviewCard: React.FC<T_REVIEW_CARD> = ({ review }) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.rightContent}>
        <View style={styles.rightTopRow}>
          <AppText
            font="body2"
            style={{ flex: 1 }}
          >{`${review.user.firstName} ${review.user.lastName}`}</AppText>
          <AppText
            font="caption2"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >
            {getTimeAgo(review.createdAt)}
          </AppText>
        </View>
        <AppText
          font="caption2"
          color={theme.colors.semantic.content.contentTertionary}
        >{`${review.comment}`}</AppText>
      </View>
    </View>
  );
};

export default ReviewCard;
