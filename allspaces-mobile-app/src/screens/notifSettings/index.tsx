import { View } from "react-native";
import React from "react";
import { T_NOTIF_SETTINGS_SCREEN } from "./types";
import {
  AppButton,
  AppSwitch,
  AppText,
  Header2,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import { useUnistyles } from "react-native-unistyles";

const NotifSettings: React.FC<T_NOTIF_SETTINGS_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();
  return (
    <ScreenWrapper>
      <Header2 title="Notifications" />
      <View style={styles.mainContainer}>
        <View style={{ rowGap: theme.units[4] }}>
          <View style={styles.row}>
            <AppText font={"body1"}>{`In App Notifications`}</AppText>
            <AppSwitch value={true} />
          </View>
          <View style={styles.row}>
            <AppText font={"body1"}>{`Marketing & Offers`}</AppText>
            <AppSwitch value={false} />
          </View>
          <View style={styles.row}>
            <AppText font={"body1"}>{`System Notifications`}</AppText>
            <AppSwitch value={true} />
          </View>
        </View>
        <AppButton title="Send Test Notification" />
      </View>
    </ScreenWrapper>
  );
};

export default NotifSettings;
