import { View, FlatList, ViewToken, useWindowDimensions } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { T_COMPLETE_PROFILE, T_COMPLETE_PROFILE_ITEM } from "./types";
import { AppText, ButtonWrapper, ScreenWrapper } from "@/components";
import PersonalInfo from "./subcomponents/personalInfo";
import SocialAccountsInfo from "./subcomponents/socialAccountsInfo";
import PaymentInfo from "./subcomponents/paymentInfo";
import PreferencesInfo from "./subcomponents/preferencesInfo";
import { styles } from "./styles";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import AddPhoneNumber from "./subcomponents/addPhoneNumber";
import VerifyPhoneNumber from "./subcomponents/verifyPhoneNumber";
import { PhoneNumberResource } from "@clerk/types";
import { useDispatch } from "react-redux";
import { actionSetCompleteProfile } from "@/redux/app.slice";

const CompleteProfile: React.FC<T_COMPLETE_PROFILE> = ({ navigation }) => {
  const dispatch = useDispatch();

  // For Scrolling Animation
  const { width: screenWidth } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const [fIndex, setFIndex] = useState<number>(0);
  const flatlistIndex = useSharedValue<number>(0);
  const flatlistRef = useAnimatedRef<FlatList<T_COMPLETE_PROFILE_ITEM[]>>();
  const [phoneObj, setPhoneObj] = useState<PhoneNumberResource | undefined>(
    undefined
  );
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
    flatlistIndex.value = Math.round(event.contentOffset.x / screenWidth); // Adjust based on item size
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
      }
    },
    []
  );

  const PROFILE_STEPS: T_COMPLETE_PROFILE_ITEM[] = [
    {
      key: "1",
      component: (
        <PersonalInfo flatlistRef={flatlistRef} flatlistIndex={flatlistIndex} />
      ),
    },
    {
      key: "2",
      component: (
        <AddPhoneNumber
          flatlistRef={flatlistRef}
          flatlistIndex={flatlistIndex}
          setPhoneObj={setPhoneObj}
        />
      ),
    },
    {
      key: "3",
      component: (
        <VerifyPhoneNumber
          flatlistRef={flatlistRef}
          flatlistIndex={flatlistIndex}
          phoneObj={phoneObj}
        />
      ),
    },
    {
      key: "4",
      component: (
        <SocialAccountsInfo
          flatlistRef={flatlistRef}
          flatlistIndex={flatlistIndex}
        />
      ),
    },
    {
      key: "5",
      component: (
        <PaymentInfo flatlistRef={flatlistRef} flatlistIndex={flatlistIndex} />
      ),
    },
    {
      key: "6",
      component: (
        <PreferencesInfo
          flatlistRef={flatlistRef}
          flatlistIndex={flatlistIndex}
          navigation={navigation}
        />
      ),
    },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <AppText font="caption1" textAlign="center">{`Steps ${fIndex + 1}/${
            PROFILE_STEPS.length
          }`}</AppText>

          <ButtonWrapper
            onPress={() => {
              dispatch(actionSetCompleteProfile(false));
            }}
          >
            <AppText
              font="button1"
              textAlign="center"
              style={{ textDecorationLine: "underline" }}
            >{`Skip`}</AppText>
          </ButtonWrapper>
        </View>
        <Animated.FlatList
          ref={flatlistRef}
          horizontal
          onScroll={onScroll}
          showsHorizontalScrollIndicator={false}
          data={PROFILE_STEPS}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item) => item.key}
          pagingEnabled
          scrollEventThrottle={16}
          decelerationRate={"fast"}
          snapToInterval={screenWidth}
          // scrollEnabled={false}
          onViewableItemsChanged={onViewCallBack}
          viewabilityConfig={viewConfigRef.current}
          renderItem={({ item }) => (
            <View style={styles.stepMainContainer}>{item.component}</View>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default CompleteProfile;
