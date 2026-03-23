import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState } from "react";

import {
  AppButton,
  AppCheckbox,
  AppLoader,
  Header2,
  ScreenWrapper,
} from "@/components";
import { styles } from "./styles";
import { T_PAYMENT_SCREEN } from "./types";
import moment from "moment";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useUser } from "@clerk/clerk-expo";
import { useSubmitPaymentAPI } from "@/apis";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { STRIPE_RETURN_URL } from "@/config/constants";

const PaymentScreen: React.FC<T_PAYMENT_SCREEN> = ({ navigation, route }) => {
  const { profileId, noOfPersons, totalAmount, date, time, source } =
    route.params;
  const { mutateAsync: submitPayment } = useSubmitPaymentAPI();
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, user } = useUser();
  const formattedDateTime =
    moment(date).format("DD/MM/YYYY") +
    " " +
    moment(time, "ddd MMM DD YYYY HH:mm:ss GMT+ZZZZ").format("HH:mm");

  const completePayment = async () => {
    try {
      if (!isLoaded || !user) return;
      setIsLoading(true);
      const isoTime = moment(
        time,
        "ddd MMM DD YYYY HH:mm:ss GMT+ZZZZ"
      ).toISOString();

      const response = await submitPayment({
        profile_id: profileId,
        check_in: date,
        time: isoTime,
        no_of_guests: parseInt(noOfPersons),
        source: source,
      });

      const paymentData = response;

      if (!paymentData) {
        showSnackbar(
          `Something went wrong while updating payment method`,
          "error"
        );
        setIsLoading(false);
        return;
      }

      const { error, paymentOption } = await initPaymentSheet({
        merchantDisplayName: "All Spaces",
        returnURL: STRIPE_RETURN_URL,
        customerId: paymentData.user.stripe_customer_id,
        customerEphemeralKeySecret: paymentData.ephemeralKey,
        paymentIntentClientSecret: paymentData.paymentIntent.client_secret,
      });

      if (error) {
        showSnackbar(
          `Something went wrong while setting up payment intent`,
          "error"
        );
        setIsLoading(false);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        showSnackbar(`Something went wrong while presenting intent`, "error");
        setIsLoading(false);
        return;
      } else {
        showSnackbar(`Payment successful`);
        setIsLoading(false);
      }
      navigation.navigate("PaymentSuccessfullyScreen");
    } catch (error) {
      showClerkError(error);
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header2 title="Payment Method" />
      <View style={styles.mainContainer}>
        <ScrollView>
          <Text style={styles.header}>Summary</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hotel Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>No. of Persons</Text>
              <Text style={styles.value}>{noOfPersons}</Text>
            </View>
            {/* <View style={styles.row}>
              <Text style={styles.label}>No. of Hours</Text>
              <Text style={styles.value}>{noOfHours}</Text>
            </View> */}
            <View style={styles.row}>
              <Text style={styles.label}>Check In</Text>
              <Text style={styles.value}>{formattedDateTime}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Rent</Text>
              <Text style={styles.value}>{totalAmount}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Gym Details Section */}
          {/* <View style={styles.card}>
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
          </View> */}

          {/* <View style={styles.divider} /> */}

          {/* Total Section */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{totalAmount}</Text>
          </View>

          {/* <Text style={styles.title}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentCard}>
            <View style={styles.leftSection}>
              <Image
                source={require("../../../assets/images/prefsImg/visa.png")}
                style={styles.logo}
              />
              <View style={styles.cardDetails}>
                <Text style={styles.paymentCardTitle}>Visa Card</Text>
                <Text style={styles.cardNumber}>*****234</Text>
              </View>
            </View>
            <AppCheckbox control={control} name="rememberMe" message="" />

            <Ionicons name="checkmark-circle" size={24} color="green" style={styles.icon} />
          </TouchableOpacity> */}

          {/* <View style={styles.rowTerm}>
            <AppCheckbox
              control={control}
              name="rememberMe"
              message="Agree Terms & Conditions"
            />
          </View> */}

          <AppButton onPress={completePayment} title="Pay Now" />
        </ScrollView>
        <AppLoader visible={isLoading} />
      </View>
    </ScreenWrapper>
  );
};

export default PaymentScreen;
