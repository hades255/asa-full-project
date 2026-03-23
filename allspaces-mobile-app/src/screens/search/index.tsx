import { View } from "react-native";
import React, { useState } from "react";

import { S_SEARCH_FIELDS, T_SEARCH_FIELDS, T_SEARCH_SCREEN } from "./types";
import {
  AppButton,
  AppDatePicker,
  AppFilters,
  GooglePlacesInput,
  Header2,
  ScreenWrapper,
  AppText,
} from "@/components";
import { styles } from "./styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "@clerk/clerk-expo";
import { useDispatch, useSelector } from "@/redux/hooks";
import {
  actionSetAppLoading,
  actionSetSearchData,
  actionSetIntentSearchResult,
} from "@/redux/app.slice";
import { showClerkError } from "@/utils/essentials";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import AppDropdownPicker from "@/components/appDropDownPicker";
import { Clock, Profile2User } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import { selectGooglePlaceData } from "@/redux/selectors";

const GUEST_OPTIONS = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

const DURATION_OPTIONS = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

const SearchScreen: React.FC<T_SEARCH_SCREEN> = ({ navigation }) => {
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const googlePlaceData = useSelector(selectGooglePlaceData);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_SEARCH_FIELDS),
    defaultValues: {
      when: "",
      duration: "1",
      guests: "0",
    },
  });

  const onContinueClick = async (formData: T_SEARCH_FIELDS) => {
    try {
      if (!isLoaded || !user || !googlePlaceData) return;

      dispatch(actionSetIntentSearchResult(null));
      dispatch(
        actionSetSearchData({
          date: new Date(formData.when).toISOString(),
          noOfGuests: Number(formData.guests),
          duration: Number(formData.duration),
          filters: selectedCategories,
          location: googlePlaceData.formatted_address,
        })
      );
      navigation.navigate("SearchResultScreen");
    } catch (error) {
      showClerkError(error);
      dispatch(actionSetAppLoading(false));
    }
  };

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Search" />
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainScrollContainer}
          nestedScrollEnabled
          keyboardShouldPersistTaps={"handled"}
        >
          <View style={{ rowGap: theme.units[3] }}>
            <AppDatePicker
              control={control}
              name="when"
              mode="datetime"
              error={errors.when?.message}
              label="When"
              placeholder="DD/MM/YYYY HH:MM"
            />
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: theme.colors.core.accent,
                opacity: 0.3,
                marginVertical: theme.units[2],
              }}
            />
            <AppDropdownPicker
              name={"duration"}
              control={control}
              icon={
                <Clock
                  size={24}
                  color={theme.colors.semantic.content.contentPrimary}
                />
              }
              label="For how long? (hours)"
              options={DURATION_OPTIONS}
              selectedValue=""
              onValueChange={() => {}}
            />
            {errors.duration && (
              <View style={{ paddingLeft: theme.units[4] }}>
                <AppText
                  font="caption1"
                  color={
                    theme.colors.semanticExtensions.content.contentNegative
                  }
                >
                  {errors.duration.message}
                </AppText>
              </View>
            )}
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: theme.colors.core.accent,
                opacity: 0.3,
                marginVertical: theme.units[2],
              }}
            />
            <AppDropdownPicker
              name={"guests"}
              control={control}
              icon={
                <Profile2User
                  size={24}
                  color={theme.colors.semantic.content.contentPrimary}
                />
              }
              label="How many guests?"
              options={GUEST_OPTIONS}
              selectedValue=""
              onValueChange={() => {}}
            />
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: theme.colors.core.accent,
                opacity: 0.3,
                marginVertical: theme.units[2],
              }}
            />
            <GooglePlacesInput
              label="Where"
              placeholder="Address or Postcode"
            />
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: theme.colors.core.accent,
                opacity: 0.3,
                marginVertical: theme.units[2],
              }}
            />
            <AppFilters
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </View>
          <View style={{ flex: 1 }} />
        </KeyboardAwareScrollView>
        <AppButton
          disabled={!isValid || !googlePlaceData}
          onPress={handleSubmit(onContinueClick)}
          title="Continue"
        />
      </View>
    </ScreenWrapper>
  );
};

export default SearchScreen;
