import { ScrollView, useWindowDimensions } from "react-native";
import React from "react";
import { T_TERMS_CONDITIONS_SCREEN } from "./types";
import { AppLoader, Header2, ScreenWrapper } from "@/components";
import { styles } from "./styles";
import { useGetTermsConditionsAPI } from "@/apis";
import { View } from "react-native";
import RenderHTML from "react-native-render-html";

const TermsConditions: React.FC<T_TERMS_CONDITIONS_SCREEN> = ({
  navigation,
}) => {
  const { data, isLoading } = useGetTermsConditionsAPI();
  const { width } = useWindowDimensions();

  return (
    <ScreenWrapper>
      <Header2 title="Terms & Conditions" />
      <View style={styles.mainContainer}>
        {!isLoading && data ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <RenderHTML
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

export default TermsConditions;
