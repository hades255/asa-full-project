import { ScrollView, useWindowDimensions, View } from "react-native";
import React from "react";
import { T_PRIVACY_POLICY_SCREEN } from "./types";
import { AppLoader, Header2, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import { useGetPrivacyPolicyAPI } from "@/apis";
import RenderHtml from "react-native-render-html";

const PrivacyScreen: React.FC<T_PRIVACY_POLICY_SCREEN> = ({ navigation }) => {
  const { data, isLoading } = useGetPrivacyPolicyAPI();
  const { width } = useWindowDimensions();

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Privacy Policy" />
      <View style={styles.mainContainer}>
        {!isLoading && data ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <RenderHtml
              contentWidth={width}
              source={{ html: data?.content }}
              baseStyle={{ width: "100%" }}
            />
          </ScrollView>
        ) : (
          <AppLoader visible={isLoading} />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default PrivacyScreen;
