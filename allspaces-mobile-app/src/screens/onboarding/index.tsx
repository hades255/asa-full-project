import { FlatList, Pressable, Text, View, ViewToken } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { T_ONBOARDING_SCREEN } from "./types";
import {
  AppText,
  ButtonWrapper,
  OnboardingCard,
  ScreenWrapper,
} from "@/components";
import { appColors, globalStyles, moderateScale } from "@/theme";
import { styles } from "./styles";
import { T_ONBOARDING_ITEM } from "@/components/cards/onboardingCard/types";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  interpolate,
  interpolateColor,
  LinearTransition,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ArrowRight2 } from "iconsax-react-native";
import { gotoWelcomeFromOnboard } from "@/navigation/service";
import { SecureStoreService } from "@/config/secureStore";
import { LOTTIE } from "assets/lottie";
import { useUnistyles } from "react-native-unistyles";

const DOT_HEIGHT = moderateScale(10);
const DOT_WIDTH = moderateScale(10);
const CURRENT_DOT_WIDTH = moderateScale(36);
const ANIM_BTN_WIDTH = moderateScale(55);
const ANIM_BTN_HEIGHT = moderateScale(55);
const OPENED_BTN_WIDTH = moderateScale(180);

const Onboarding: React.FC<T_ONBOARDING_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();
  // Onboard Data
  const ONBOARD_DATA: T_ONBOARDING_ITEM[] = [
    {
      key: "1",
      title: `Welcome to\nAll Spaces`,
      info: `Find a space or service near you —\nwork, relax, or train`,
      lottieAnimation: LOTTIE.FIND_SPACE,
    },
    {
      key: "2",
      title: "Plan your day\naround you",
      info: `Select your location, date, duration, and service`,
      lottieAnimation: LOTTIE.BOOK_SPACE,
    },
    {
      key: "3",
      title: `You’re an\neco-warrior`,
      info: `Book local, earn rewards &\nexclusive discounts`,
      lottieAnimation: LOTTIE.USE_SPACE,
    },
  ];

  // For Scrolling Animation
  const scrollX = useSharedValue(0);
  const [fIndex, setFIndex] = useState<number>(0);
  const flatlistIndex = useSharedValue<number>(0);
  const flatlistRef = useAnimatedRef<FlatList<T_ONBOARDING_ITEM[]>>();
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
    flatlistIndex.value = Math.round(event.contentOffset.x / theme.mobileWidth); // Adjust based on item size
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
        setFIndex(viewableItems[0].index);
        flatlistIndex.value = viewableItems[0].index;
      }
    },
    []
  );

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {ONBOARD_DATA.map((_, index) => {
          const inputRange = [
            (index - 1) * theme.mobileWidth,
            index * theme.mobileWidth,
            (index + 1) * theme.mobileWidth,
          ];

          const animatedDotStyle = useAnimatedStyle(() => {
            return {
              width: interpolate(
                scrollX.value,
                inputRange,
                [DOT_WIDTH, CURRENT_DOT_WIDTH, DOT_WIDTH],
                "clamp"
              ),
              backgroundColor: theme.colors.semanticExtensions.content.contentAccent,
              opacity: interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], 'clamp')
            };
          });
          return (
            <Animated.View
              key={_.key}
              style={[
                animatedDotStyle,
                { height: DOT_HEIGHT, borderRadius: moderateScale(DOT_HEIGHT) },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const moveToNextScreen = async () => {
    gotoWelcomeFromOnboard(navigation);
    await SecureStoreService.saveValue("FIRST_LAUNCH", "false");
  };

  const AnimatedButton = () => {
    const btnWidthAnimation = interpolate(
      flatlistIndex.value,
      [0, 1, 2],
      [ANIM_BTN_WIDTH, ANIM_BTN_WIDTH, OPENED_BTN_WIDTH]
    );
    const btnAnimation = useAnimatedStyle(() => {
      return {
        width: withTiming(btnWidthAnimation, { duration: 500 }),
      };
    });

    return (
      <ButtonWrapper
        onPress={async () => {
          if (fIndex == 2) moveToNextScreen();
          else {
            flatlistRef.current?.scrollToIndex({
              index: fIndex + 1,
              animated: true,
            });
          }
        }}
      >
        <Animated.View
          style={[
            styles.btnStyle,
            btnAnimation,
            {
              height: ANIM_BTN_HEIGHT,
              borderRadius: ANIM_BTN_WIDTH,
            },
          ]}
        >
          {fIndex !== 2 ? (
            <Animated.View exiting={FadeOutRight} layout={LinearTransition}>
              <ArrowRight2
                color={appColors.semantic.content.contentInversePrimary}
                size={moderateScale(24)}
                variant="Linear"
              />
            </Animated.View>
          ) : (
            <Animated.Text
              entering={FadeInLeft}
              exiting={FadeOutRight}
              layout={LinearTransition}
              style={styles.btnText}
            >{`Let’s Get Started`}</Animated.Text>
          )}
        </Animated.View>
      </ButtonWrapper>
    );
  };

  return (
    <ScreenWrapper>
      <View style={[globalStyles.mainContainer, globalStyles.v24Padding]}>
        <View style={[styles.topContainer, globalStyles.h16Padding]}>
          {fIndex != 2 && (
            <Pressable onPress={moveToNextScreen}>
              <AppText
                font="button1"
                color={theme.colors.semantic.content.contentInverseTertionary}
              >{`Skip`}</AppText>
            </Pressable>
          )}
        </View>
        <View style={styles.middleContainer}>
          <Animated.FlatList
            ref={flatlistRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={ONBOARD_DATA}
            onScroll={onScroll}
            pagingEnabled
            scrollEventThrottle={16}
            decelerationRate={"fast"}
            snapToInterval={theme.mobileWidth}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <OnboardingCard onboardingItem={item} />
            )}
            onViewableItemsChanged={onViewCallBack}
            viewabilityConfig={viewConfigRef.current}
          />
        </View>
        <View style={[styles.bottomContainer, globalStyles.h16Padding]}>
          <Pagination />
          <AnimatedButton />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Onboarding;
