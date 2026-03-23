import { FlatList, Platform, View } from "react-native";
import React, { memo, useCallback, useMemo } from "react";
import { T_HOME_LIST_SECTION } from "./types";
import { styles } from "./styles";
import AppText from "../appText";
import { useUnistyles } from "react-native-unistyles";
import SpaceCard from "../spaceCard";
import { useSearchProfilesAPI } from "@/apis";
import { useNavigation } from "@react-navigation/native";
import { T_PROFILE_ITEM } from "@/components/cards/bookingCardWithReviews/types";

const MemoSpaceCard = memo(SpaceCard);
const SPACE_CARD_WIDTH = 340;
const SPACE_CARD_GAP = 16;
const SPACE_CARD_FULL_WIDTH = SPACE_CARD_WIDTH + SPACE_CARD_GAP;

const HomeListSection: React.FC<T_HOME_LIST_SECTION> = ({ title }) => {
  const { theme } = useUnistyles();
  const { data } = useSearchProfilesAPI(10);
  const profiles = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  const spaces = useMemo(
    () => profiles.filter((item) => item.source === "SPACE") as T_PROFILE_ITEM[],
    [profiles]
  );
  const navigation = useNavigation<any>();

  const handleSpacePress = useCallback(() => {
    navigation.navigate("SearchScreen");
  }, [navigation]);

  const handleSeeAllPress = useCallback(() => {
    // @ts-ignore
    navigation.navigate("SearchScreen");
  }, [navigation]);

  const keyExtractor = useCallback((item: T_PROFILE_ITEM) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: T_PROFILE_ITEM }) => (
      // <View style={{ width: 340, flexShrink: 0 }}>
      <MemoSpaceCard space={item} onPress={handleSpacePress} />
      // </View>
    ),
    [handleSpacePress]
  );

  const renderSeparator = useCallback(() => <View style={{ width: theme.units[4] }} />, [theme.units]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <AppText font="heading3">{title}</AppText>
        <AppText
          font="button2"
          color={theme.colors.semanticExtensions.content.contentAccent}
          style={{ textDecorationLine: "underline" }}
          textProps={{
            onPress: handleSeeAllPress,
          }}
        >
          {`see all`}
        </AppText>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          data={spaces}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={3}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={Platform.OS === "android"}
          getItemLayout={(_, index) => ({
            length: SPACE_CARD_FULL_WIDTH,
            offset: SPACE_CARD_FULL_WIDTH * index,
            index,
          })}
        />
      </View>
    </View>
  );
};

export default HomeListSection;
