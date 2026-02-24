import React from "react";
import { T_REVIEW_CONTAINER } from "./types";
import { styles } from "./styles";
import { View } from "react-native";
import { appColors } from "@/theme";
import { StarIcon } from "assets/icons";

const ReviewStars: React.FC<T_REVIEW_CONTAINER> = ({ reviews }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index + 1 <= Math.floor(reviews);
        return (
          <View
            key={index}
            style={[
              styles.ratingStar,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <StarIcon
              fill={
                filled
                  ? appColors.semantic.content.contentPrimary
                  : appColors.semantic.content.contentInversePrimary
              }
            />
          </View>
        );
      })}
    </View>
  );
};

export default ReviewStars;
