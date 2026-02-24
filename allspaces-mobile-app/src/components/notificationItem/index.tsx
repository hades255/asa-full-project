import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./styles";
import { getTimeAgo } from "@/utils/essentials";
import { useUnistyles } from "react-native-unistyles";
import AppText from "../appText";

const NotificationItem = ({ isRead, description, time }: any) => {
  const { theme } = useUnistyles();
  return (
    <View
      style={[
        styles.itemContainer,
        {
          backgroundColor: !isRead
            ? theme.colors.semantic.background.backgroundSecondary
            : "transparent",
        },
      ]}
    >
      <View style={styles.topContainer}>
        <AppText font="body1">{"Lorem Ipsum"}</AppText>
        <AppText
          font="caption1"
          color={theme.colors.semantic.content.contentInverseTertionary}
        >
          {getTimeAgo(time)}
        </AppText>
      </View>
      <AppText
        font="body2"
        color={theme.colors.semantic.content.contentInverseTertionary}
      >
        {description}
      </AppText>
    </View>
  );
};

export default NotificationItem;
