import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";

import { T_BOOKING_ORDER_OWN_DETAILS_SCREEN } from "./types";
import {
  AppButton,
  AppDatePicker,
  AppInput,
  ButtonWrapper,
  Header2,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { globalStyles, horizontalScale, verticalScale } from "@/theme";

const BookingOrderOwnDetails: React.FC<T_BOOKING_ORDER_OWN_DETAILS_SCREEN> = ({
  navigation,
}) => {
  const [selectedHour, setSelectedHour] = useState("01 hour");

  const hourOptions = [
    { label: "01 hour", value: "01 hour" },
    { label: "02 hours", value: "02 hours" },
    { label: "03 hours", value: "03 hours" },
  ];
  const details = [
    { label: "Gym", amount: 24.0 },
    { label: "Hotel", amount: 29.0 },
    { label: "Restaurant", amount: 65.5 },
  ];
  const total = details.reduce((sum, item) => sum + item.amount, 0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    // resolver: yupResolver(BOOKING_INFO_FIELDS),
    defaultValues: {
      dateOfBirth: "",
      noOfHour: "",
      noOfPersons: "",
      checkIn: "",
      checkOut: "",
      time: "",
    },
  });
  return (
    <ScreenWrapper>
      <Header2 title="Select Time" />
      <ScrollView style={{ flex: 1, marginHorizontal: horizontalScale(16) }}>
        <Text style={styles.titleText}>{"Booking Details"}</Text>
        <View style={styles.divider} />
        <View style={{ gap: verticalScale(16) }}>
          <AppDatePicker
            control={control}
            name="checkIn"
            error={errors.checkIn?.message}
            label="Check-in"
          />
          <AppDatePicker
            control={control}
            name="time"
            error={errors.time?.message}
            label="Time"
          />
          <AppInput
            label="No. of Hour"
            control={control}
            name="noOfHour"
            placeholder="1 Hour"
          />
          <AppInput
            label="No of Persons/Guest"
            control={control}
            name="noOfPersons"
            placeholder="1"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.container}>
          <View style={[styles.row, { marginBottom: verticalScale(32) }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>£{total.toFixed(2)}</Text>
          </View>
        </View>

        <AppButton
          onPress={() => navigation.navigate("PaymentScreen", {
            profileId: "",
            noOfPersons: "",
            totalAmount: "",
            date: "",
            time: "",
            source: ""
          })}
          title="Confirm"
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default BookingOrderOwnDetails;
