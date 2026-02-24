import { View } from "react-native";
import React, { useEffect } from "react";
import { T_PAYMENT_METHOD_SCREEN } from "./types";
import { Header2, ScreenWrapper } from "@/components";
import { useUser } from "@clerk/clerk-expo";
import { useUpdatePaymentMethodMutation } from "@/apis/apiSlice";
import { actionSetAppLoading } from "@/redux/app.slice";
import { useDispatch } from "react-redux";
import { isCompletedProfile, showSnackbar } from "@/utils/essentials";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./styles";

const PaymentMethod: React.FC<T_PAYMENT_METHOD_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const [updatePaymentMethod] = useUpdatePaymentMethodMutation();
  const { user, isLoaded } = useUser();

  const UpdatePaymentMethod = async () => {
    try {
      if (!isLoaded || !user) return;

      if (!isCompletedProfile(user)) {
        showSnackbar(
          "You have to complete your profile to book this service",
          "error"
        );
        return;
      }

      dispatch(actionSetAppLoading(true));
      // Updating Payment Method
      const intentData = await updatePaymentMethod({
        user_id: user.id,
      });
      if (!intentData.data?.setupIntent) {
        dispatch(actionSetAppLoading(false));
        showSnackbar(
          `Something went wrong while updating payment method`,
          "error"
        );
        return;
      }
      const { error, paymentOption } = await initPaymentSheet({
        merchantDisplayName: "All Spaces",
        customerId: intentData.data.user.stripe_customer_id,
        customerEphemeralKeySecret: intentData.data?.ephemeralKey,
        setupIntentClientSecret: intentData.data?.setupIntent.client_secret,
        defaultBillingDetails: {
          email: user.emailAddresses[0].emailAddress,
          phone: user.phoneNumbers[0].phoneNumber,
          name: `${user.firstName} ${user.lastName}`,
        },
      });

      if (error) {
        dispatch(actionSetAppLoading(false));
        showSnackbar(
          `Something went wrong while setting up payment intent`,
          "error"
        );
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        dispatch(actionSetAppLoading(false));
        showSnackbar(`Something went wrong while presenting intent`, "error");
        return;
      } else {
        dispatch(actionSetAppLoading(false));
        showSnackbar(`Your payment method is setup correctly.`);
      }

      navigation.goBack();
    } catch (error) {
      dispatch(actionSetAppLoading(false));
      showSnackbar(
        `Something went wrong while updating payment method`,
        "error"
      );
    }
  };

  useEffect(() => {
    UpdatePaymentMethod();
  }, []);

  return (
    <ScreenWrapper>
      <Header2 title="Payment Methods" />
      <View style={styles.mainContainer}></View>
    </ScreenWrapper>
  );
};

export default PaymentMethod;
