import { View } from "react-native";
import React from "react";
import { T_ALL_SET_SCREEN } from "./types";
import { styles } from "./styles";
import { AppButton, AppText, ScreenWrapper } from "@/components";
import { TickCircle } from "iconsax-react-native";
import { useDispatch } from "react-redux";
import { actionSetCompleteProfile } from "@/redux/app.slice";
import { useUnistyles } from "react-native-unistyles";

const AllSet: React.FC<T_ALL_SET_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  return (
    <ScreenWrapper>
      <View style={styles.mainContainer}>
        <TickCircle
          color={theme.colors.semanticExtensions.content.contentPositive}
          size={100}
        />
        <View style={{ rowGap: theme.units[1] }}>
          <AppText
            font="heading2"
            textAlign="center"
          >{`You’re all set.`}</AppText>
          <AppText
            font="body1"
            textAlign="center"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Your profile is complete.`}</AppText>
        </View>
        <AppButton
          title="Take Me Home"
          onPress={() => {
            dispatch(actionSetCompleteProfile(false));
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default AllSet;
