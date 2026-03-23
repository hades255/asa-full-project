import { Dimensions, View, ViewToken } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { T_IMAGE_SLIDER } from "./types";
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { Image } from "expo-image";
import { styles } from "./styles";
import AppText from "../appText";
import { LinearGradient } from "expo-linear-gradient";

const SliderDot = ({
  index,
  sliderScrollX,
  screenWidth,
}: {
  index: number;
  sliderScrollX: SharedValue<number>;
  screenWidth: number;
}) => {
  const animatedDot = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];
    return {
      opacity: interpolate(sliderScrollX.value, inputRange, [0.5, 1, 0.5], "clamp"),
      width: interpolate(sliderScrollX.value, inputRange, [8, 24, 8], "clamp"),
    };
  }, [index, screenWidth]);

  return <Animated.View style={[styles.sliderDot, animatedDot]} />;
};

const ImageSlider: React.FC<T_IMAGE_SLIDER> = ({
  images,
  width = Dimensions.get("window").width,
  height = 300,
}) => {
  const sliderScrollX = useSharedValue(0);
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const { theme } = useUnistyles();
  const screenWidth = theme.mobileWidth;
  const onSliderScroll = useAnimatedScrollHandler((event) => {
    sliderScrollX.value = event.contentOffset.x;
  });

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

  const keyExtractor = useCallback((_item: string, index: number) => index.toString(), []);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
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
    ),
    [height, width]
  );

  return (
    <>
      <Animated.FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        data={images}
        keyExtractor={keyExtractor}
        onScroll={onSliderScroll}
        bounces={false}
        pagingEnabled
        snapToInterval={screenWidth}
        decelerationRate={"fast"}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewCallBack}
        viewabilityConfig={viewConfigRef.current}
        renderItem={renderItem}
      />
      <View style={styles.paginationContainer}>
        <AppText
          font="caption1"
          color={theme.colors.semantic.content.contentInversePrimary}
        >{`${sliderIndex + 1}/${images.length}`}</AppText>
        <View style={styles.paginationRow}>
          {images.map((_, index) => (
            <SliderDot
              key={index.toString()}
              index={index}
              sliderScrollX={sliderScrollX}
              screenWidth={screenWidth}
            />
          ))}
        </View>
      </View>
    </>
  );
};

export default ImageSlider;
