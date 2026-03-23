import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useMemo } from "react";

import { T_OFFER_SCREEN } from "./types";
import {
  AppButton,
  AppCheckbox,
  AppDatePicker,
  ButtonWrapper,
  Header2,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppDropdownPicker from "@/components/appDropDownPicker";
import { globalStyles, verticalScale } from "@/theme";
import { S_LOGIN_FIELDS } from "../login/types";

const Offer: React.FC<T_OFFER_SCREEN> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_LOGIN_FIELDS),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const availabilityData = useMemo(
    () => [
      {
        id: "1",
        time: "26/12/2024 23:00",
        duration: "02 Hour",
        selected: false,
      },
      {
        id: "2",
        time: "26/12/2024 23:00",
        duration: "02 Hour",
        selected: false,
      },
    ],
    []
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderAvailabilityItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={[styles.availabilityItem, item.selected && styles.selectedItem]}
      >
        <Image
          source={require("../../../assets/images/avatar.png")}
          style={styles.avatar}
        />
        <View style={styles.availabilityTextContainer}>
          <Text style={styles.availabilityTime}>{item.time}</Text>
          <Text style={styles.availabilityDuration}>{item.duration}</Text>
        </View>
        <AppCheckbox control={control} name="rememberMe" message="" />
      </TouchableOpacity>
    ),
    [control]
  );

  const renderMain = useCallback(
    () => (
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/prefsImg/hotelImg.jpeg")}
            style={styles.bookingDetailsImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.bookingDetailsTitle}>Lorem Ipsum</Text>
          <Text style={styles.bookingDetailsPrice}>
            £ 94.99<Text style={styles.night}>/Total</Text>
          </Text>
        </View>

        <Text style={styles.bookingDetailsLocation}>
          Lorem ipsum dolor sit amet, consectetur
        </Text>

        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>Note</Text>
          <Text style={styles.noteText}>
            We are not available at the gym time you selected. Please choose an
            available time from the options below.
          </Text>
        </View>

        <Text style={styles.noteTitle}>Availability Time</Text>
        <FlatList
          data={availabilityData}
          renderItem={renderAvailabilityItem}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
        />

        <Text style={styles.header}>Other Booking Details</Text>
        <View style={styles.divider} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hotel Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>No. of Persons</Text>
            <Text style={styles.value}>02</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>No. of Hours</Text>
            <Text style={styles.value}>02</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check In</Text>
            <Text style={styles.value}>26/12/2024 23:00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rent</Text>
            <Text style={styles.value}>£94/night</Text>
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gym Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>No. of Persons</Text>
            <Text style={styles.value}>01</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>No. of Hours</Text>
            <Text style={styles.value}>02</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check In</Text>
            <Text style={styles.value}>26/12/2024 23:00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rent</Text>
            <Text style={styles.value}>£94/hr</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>£188</Text>
        </View>

        <AppButton title="Confirm" />
        <View style={styles.cancelButton}>
          <AppButton title="Cancel" />
        </View>
      </View>
    ),
    [availabilityData, keyExtractor, renderAvailabilityItem]
  );

  return (
    <ScreenWrapper>
      <Header2 title="Offer" />

      <FlatList
        data={[1]}
        renderItem={renderMain}
      />
    </ScreenWrapper>
  );
};

export default Offer;
