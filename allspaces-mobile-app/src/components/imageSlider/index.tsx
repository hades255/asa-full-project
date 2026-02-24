import { Dimensions, View, ViewToken } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { T_IMAGE_SLIDER } from "./types";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { Image } from "expo-image";
import { faker } from "@faker-js/faker";
import { styles } from "./styles";
import AppText from "../appText";
import { LinearGradient } from "expo-linear-gradient";

const ImageSlider: React.FC<T_IMAGE_SLIDER> = ({
  images,
  width = Dimensions.get("window").width,
  height = 300,
}) => {
  const sliderScrollX = useSharedValue(0);
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const onSliderScroll = useAnimatedScrollHandler((event) => {
    sliderScrollX.value = event.contentOffset.x;
  });
  const { theme } = useUnistyles();

  // Configuration for flatlist view able items
  const viewConfigRef = useRef({
    minimumViewTime: 300,
    viewAreaCoveragePercentThreshold: 10,
  });

  const onViewCallBack = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (
        viewableItems &&
        viewableItems.length &&
        viewableItems[0].index !== null
      ) {
        setSliderIndex(viewableItems[0].index);
      }
    },
    []
  );

  return (
    <>
      <Animated.FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        data={images}
        keyExtractor={(item, index) => index.toString()}
        onScroll={onSliderScroll}
        bounces={false}
        pagingEnabled
        snapToInterval={theme.mobileWidth}
        decelerationRate={"fast"}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewCallBack}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Image
              source={{
                uri: item,
              }}
              contentFit="cover"
              style={{ width, height }}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
              style={{ width, height, position: "absolute" }}
            />
          </View>
        )}
      />
      <View style={styles.paginationContainer}>
        <AppText
          font="caption1"
          color={theme.colors.semantic.content.contentInversePrimary}
        >{`${sliderIndex + 1}/${images.length}`}</AppText>
        <View style={styles.paginationRow}>
          {images.map((_, index) => {
            let inputRange = [
              (index - 1) * theme.mobileWidth,
              index * theme.mobileWidth,
              (index + 1) * theme.mobileWidth,
            ];

            let animatedDot = useAnimatedStyle(() => {
              return {
                opacity: interpolate(
                  sliderScrollX.value,
                  inputRange,
                  [0.5, 1, 0.5],
                  "clamp"
                ),
                width: interpolate(
                  sliderScrollX.value,
                  inputRange,
                  [8, 24, 8],
                  "clamp"
                ),
              };
            });

            return (
              <Animated.View
                key={index.toString()}
                style={[styles.sliderDot, animatedDot]}
              />
            );
          })}
        </View>
      </View>
    </>
  );
};

export default ImageSlider;
