import { View, Linking } from "react-native";
import React, { useCallback, useEffect } from "react";
import { T_PAYMENT_INFO } from "./types";
import { styles } from "./styles";
import { AppButton, AppText } from "@/components";
import {  useUser } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { actionSetAppLoading } from "@/redux/app.slice";
import { showSnackbar } from "@/utils/essentials";
import { useStripe } from "@stripe/stripe-react-native";
import { useUnistyles } from "react-native-unistyles";
import { useCreateStripeCustomerAPI, useCreateStripeIntentAPI } from "@/apis";

const PaymentInfo: React.FC<T_PAYMENT_INFO> = ({
  flatlistIndex,
  flatlistRef,
}) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { isLoaded, user } = useUser();

  // Stripe
  const { initPaymentSheet, presentPaymentSheet, handleURLCallback } =
    useStripe();

  // APIs
  const { mutateAsync: createStripeCustomerAPI } = useCreateStripeCustomerAPI();
  const { mutateAsync: createStripeIntentAPI } = useCreateStripeIntentAPI();

  // FOR DEEP LINK
  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
          // This was NOT a Stripe URL – handle as you normally would
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener(
      "url",
      (event: { url: string }) => {
        handleDeepLink(event.url);
      }
    );

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  const initStripePayment = async () => {
    try {
      if (
        !isLoaded ||
        !user ||
        !user.primaryEmailAddress ||
        !user.primaryEmailAddress.emailAddress
      )
        return;

      dispatch(actionSetAppLoading(true));

      // Creating Customer
      const response = await createStripeCustomerAPI({
        email: user.primaryEmailAddress.emailAddress,
        user_id: user.id,
      });

      console.log('res', response);
      

      // Creating Intent
      const intentData = await createStripeIntentAPI({
        stripe_customer_id: response.stripe_customer_id,
        user_id: response.clerk_user_id,
      });

      if (!response.stripe_customer_id || !intentData?.setupIntent) {
        dispatch(actionSetAppLoading(false));
        return;
      }

      const { error, paymentOption } = await initPaymentSheet({
        merchantDisplayName: "All Spaces",
        customerId: response.stripe_customer_id,
        customerEphemeralKeySecret: intentData?.ephemeralKey,
        setupIntentClientSecret: intentData?.setupIntent.client_secret,
        defaultBillingDetails: {
          email: user.primaryEmailAddress.emailAddress,
          phone: user.primaryPhoneNumber?.phoneNumber,
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
        dispatch(actionSetAppLoading(false));

        flatlistRef.current?.scrollToIndex({
          index: flatlistIndex.value + 1,
          animated: true,
        });

        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            hasPaymentMethod: true,
          },
        });
        showSnackbar(`Your payment method is setup correctly.`);
      }
    } catch (error) {
      dispatch(actionSetAppLoading(false));
      showSnackbar(
        `Something went wrong while initiating Stripe intent`,
        "error"
      );
    }
  };

  return (
    <View style={styles.bodyContainer}>
      <View style={{ rowGap: theme.units[1] }}>
        <AppText font="heading2">{`Payment Details`}</AppText>
        <AppText
          font="body1"
          color={theme.colors.semantic.content.contentInverseTertionary}
        >{`Setup your payment method`}</AppText>
      </View>
      <View style={styles.middleContainer} />
      <AppButton title="Add Payment Method" onPress={initStripePayment} />
    </View>
  );
};

export default PaymentInfo;
