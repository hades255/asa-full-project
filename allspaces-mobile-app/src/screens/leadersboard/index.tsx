import { View, Text } from "react-native";
import React from "react";
import { T_LEADER_BOARD_SCREEN } from "./types";
import { styles } from "./styles";
import { Header2, ScreenWrapper } from "@/components";

const Leaderboard: React.FC<T_LEADER_BOARD_SCREEN> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <Header2 title="Leaderboard" />
      <View style={styles.mainContainer}></View>
    </ScreenWrapper>
  );
};

export default Leaderboard;
