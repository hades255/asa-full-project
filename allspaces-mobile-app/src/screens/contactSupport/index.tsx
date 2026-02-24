import { View } from "react-native";
import React from "react";
import {
  S_CONTACT_SUPPORT_FIELDS,
  T_CONTACT_SUPPORT_FIELDS,
  T_CONTACT_SUPPORT_SCREEN,
} from "./types";
import { AppButton, AppInput, Header2, ScreenWrapper } from "@/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { styles } from "./styles";
import { actionSetAppLoading } from "@/redux/app.slice";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useDispatch } from "react-redux";
import { useContactSupportMutation } from "@/apis/apiSlice";
import { useUnistyles } from "react-native-unistyles";

const ContactSupport: React.FC<T_CONTACT_SUPPORT_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const [contactSupport] = useContactSupportMutation();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_CONTACT_SUPPORT_FIELDS),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const sendMessage = async (formData: T_CONTACT_SUPPORT_FIELDS) => {
    try {
      dispatch(actionSetAppLoading(true));
      const result = await contactSupport(formData);
      dispatch(actionSetAppLoading(false));
      showSnackbar("Message is successfully sent!");
      navigation.goBack();
    } catch (error) {
      showClerkError(error);
      dispatch(actionSetAppLoading(false));
    }
  };

  return (
    <ScreenWrapper>
      <Header2 title="Contact Support" />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
      >
        <View style={{ rowGap: theme.units[4] }}>
          <AppInput
            name="subject"
            control={control}
            error={errors.subject?.message}
            label={`Subject`}
            placeholder={`e.g Booking Query`}
          />
          <AppInput
            name="message"
            control={control}
            error={errors.message?.message}
            label={`Message`}
            placeholder={`Start typing here...`}
            isTextbox={true}
          />
        </View>
        <AppButton onPress={handleSubmit(sendMessage)} title="Send Message" />
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default ContactSupport;
