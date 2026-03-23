import { View } from "react-native";
import React, { useEffect } from "react";
import { T_PAYMENT_METHOD_SCREEN } from "./types";
import { Header2, ScreenWrapper } from "@/components";
import { useUser } from "@clerk/clerk-expo";
import { useUpdatePaymentMethodAPI } from "@/apis";
import { actionSetAppLoading } from "@/redux/app.slice";
import { useDispatch } from "@/redux/hooks";
import { showSnackbar } from "@/utils/essentials";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useUnistyles } from "react-native-unistyles";
import { styles } from "./styles";
import { useProfileProvider } from "@/hooks/useProfileProvider";
import { STRIPE_RETURN_URL } from "@/config/constants";

const PaymentMethod: React.FC<T_PAYMENT_METHOD_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { mutateAsync: updatePaymentMethod } = useUpdatePaymentMethodAPI();
  const { isProfileCompleted } = useProfileProvider();

  const { user, isLoaded } = useUser();

  const UpdatePaymentMethod = async () => {
    try {
      if (!isLoaded || !user) return;

      if (!isProfileCompleted) {
        showSnackbar(
          "You have to complete your profile to update your payment method",
          "error"
        );
        return;
      }

      dispatch(actionSetAppLoading(true));
      // Updating Payment Method
      const intentData = await updatePaymentMethod({
        user_id: user.id,
      });
      if (!intentData?.setupIntent) {
        dispatch(actionSetAppLoading(false));
        showSnackbar(
          `Something went wrong while updating payment method`,
          "error"
        );
        return;
      }
      const { error, paymentOption } = await initPaymentSheet({
        merchantDisplayName: "All Spaces",
        returnURL: STRIPE_RETURN_URL,
        customerId: intentData.user.stripe_customer_id,
        customerEphemeralKeySecret: intentData.ephemeralKey,
        setupIntentClientSecret: intentData.setupIntent.client_secret,
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
