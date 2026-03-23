import { View, Linking, Keyboard } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { T_PAYMENT_INFO } from "./types";
import { styles } from "./styles";
import { AppButton, AppText } from "@/components";
import { useUser } from "@clerk/clerk-expo";
import { showSnackbar } from "@/utils/essentials";
import { useStripe } from "@stripe/stripe-react-native";
import { useUnistyles } from "react-native-unistyles";
import { useCreateStripeCustomerAPI, useCreateStripeIntentAPI } from "@/apis";
import { STRIPE_RETURN_URL } from "@/config/constants";
import StepLayout from "../stepLayout";

const PaymentInfo: React.FC<T_PAYMENT_INFO> = ({ onNext }) => {
  const { theme } = useUnistyles();
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);

  const { initPaymentSheet, presentPaymentSheet, handleURLCallback } = useStripe();
  const { mutateAsync: createStripeCustomerAPI } = useCreateStripeCustomerAPI();
  const { mutateAsync: createStripeIntentAPI } = useCreateStripeIntentAPI();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) await handleURLCallback(url);
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };
    getUrlAsync();
    const listener = Linking.addEventListener("url", (event: { url: string }) =>
      handleDeepLink(event.url)
    );
    return () => listener.remove();
  }, [handleDeepLink]);

  const initStripePayment = async () => {
    try {
      if (
        !isLoaded ||
        !user ||
        !user.primaryEmailAddress?.emailAddress
      )
        return;

      setLoading(true);

      const response = await createStripeCustomerAPI({
        email: user.primaryEmailAddress.emailAddress,
        user_id: user.id,
      });

      const intentData = await createStripeIntentAPI({
        stripe_customer_id: response.stripe_customer_id,
        user_id: response.clerk_user_id,
      });

      if (!response.stripe_customer_id || !intentData?.setupIntent) {
        setLoading(false);
        return;
      }

      const { error } = await initPaymentSheet({
        merchantDisplayName: "All Spaces",
        returnURL: STRIPE_RETURN_URL,
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
        setLoading(false);
        showSnackbar(
          `Something went wrong while setting up payment intent`,
          "error"
        );
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        setLoading(false);
        showSnackbar(`Something went wrong while presenting intent`, "error");
        return;
      }

      setLoading(false);
      Keyboard.dismiss();
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          hasPaymentMethod: true,
        },
      });
      showSnackbar(`Your payment method is setup correctly.`);
      onNext();
    } catch (error) {
      setLoading(false);
      showSnackbar(
        `Something went wrong while initiating Stripe intent`,
        "error"
      );
    }
  };

  return (
    <StepLayout>
      <View style={styles.bodyContainer}>
        <View style={{ rowGap: theme.units[1] }}>
          <AppText font="heading2">{`Payment Details`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Setup your payment method`}</AppText>
        </View>
        <View style={styles.middleContainer} />
        <AppButton
          title="Add Payment Method"
          onPress={initStripePayment}
          isLoading={loading}
          disabled={loading}
        />
      </View>
    </StepLayout>
  );
};

export default PaymentInfo;
