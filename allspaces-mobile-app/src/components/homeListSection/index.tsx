import { View, ScrollView } from "react-native";
import React from "react";
import { T_HOME_LIST_SECTION } from "./types";
import { styles } from "./styles";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";
import SpaceCard from "../spaceCard";
import { useSearchProfilesAPI } from "@/apis";
import { useNavigation } from "@react-navigation/native";
import { T_PROFILE_ITEM } from "@/components/cards/bookingCardWithReviews/types";

const HomeListSection: React.FC<T_HOME_LIST_SECTION> = ({ title }) => {
  const { theme } = useUnistyles();
  const { data } = useSearchProfilesAPI(10);
  const profiles = data?.pages.flatMap((page) => page.data) ?? [];
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <AppText font="heading3">{title}</AppText>
        <AppText
          font="button2"
          color={theme.colors.semanticExtensions.content.contentAccent}
          style={{ textDecorationLine: "underline" }}
          textProps={{
            onPress: () => {
              // @ts-ignore
              navigation.navigate("SearchScreen");
            },
          }}
        >
          {`see all`}
        </AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.listScroll}
      >
        {profiles.map((item, index) =>
          item.source === "SPACE" ? (
            <SpaceCard key={index.toString()} space={item as T_PROFILE_ITEM} />
          ) : null
        )}
      </ScrollView>
    </View>
  );
};

export default HomeListSection;
