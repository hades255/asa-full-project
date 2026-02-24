import { View, Text } from "react-native";
import React from "react";
import {
  S_CREATE_ACCOUNT_FIELDS,
  T_CREATE_ACCOUNT_FIELDS,
  T_CREATE_ACCOUNT_SCREEN,
} from "./types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AppButton,
  AppCheckbox,
  AppInput,
  AppText,
  BackButton,
  ButtonWrapper,
  ScreenWrapper,
} from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { styles } from "./styles";
import { Lock1, Sms } from "iconsax-react-native";
import {
  gotoLoginFromCreateAccount,
  gotoVerifyFromCreateAccount,
} from "@/navigation/service";
import { useSignUp } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { actionSetAppLoading } from "@/redux/app.slice";
import { showClerkError } from "@/utils/essentials";
import { useUnistyles } from "react-native-unistyles";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";

const CreateAccount: React.FC<T_CREATE_ACCOUNT_SCREEN> = ({ navigation }) => {
  const { theme } = useUnistyles();
  const dispatch = useDispatch();
  const { isLoaded, signUp } = useSignUp();
  const { setCredentials } = useLocalCredentials();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_CREATE_ACCOUNT_FIELDS),
    defaultValues: {
      email: __DEV__ ? "u001+clerk_test@allspaces.com" : "",
      password: __DEV__ ? "JustDoIt@321" : "",
      confirmPassword: __DEV__ ? "JustDoIt@321" : "",
    },
  });

  const onCreateAccountClick = async (formData: T_CREATE_ACCOUNT_FIELDS) => {
    try {
      if (!isLoaded) return;

      dispatch(actionSetAppLoading(true));

      await signUp.create({
        emailAddress: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      gotoVerifyFromCreateAccount(navigation, {
        type: "email",
        credential: formData.email.trim().toLowerCase(),
      });

      // For biometric login
      await setCredentials({
        identifier: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      dispatch(actionSetAppLoading(false));
    } catch (error) {
      dispatch(actionSetAppLoading(false));
      showClerkError(error);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
      >
        <BackButton />
        <View style={{ rowGap: theme.units[1] }}>
          <AppText font="heading2">{`Create Account`}</AppText>
          <AppText
            font="body1"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Join the All Spaces Community`}</AppText>
        </View>

        <View style={{ rowGap: theme.units[4] }}>
          <AppInput
            name="email"
            control={control}
            error={errors.email?.message}
            label={`Email`}
            placeholder={`Johndoe@gmail.com`}
            icon={
              <Sms
                variant="Linear"
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
          />
          <AppInput
            name="password"
            control={control}
            error={errors.password?.message}
            label={`Password`}
            placeholder={`*********`}
            isPassword
            icon={
              <Lock1
                variant="Linear"
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
          />
          <AppInput
            name="confirmPassword"
            control={control}
            error={errors.confirmPassword?.message}
            label={`Confirm Password`}
            placeholder={`*********`}
            isPassword
            icon={
              <Lock1
                variant="Linear"
                size={24}
                color={theme.colors.semantic.content.contentPrimary}
              />
            }
          />
          <AppCheckbox
            control={control}
            name="privacyTermsCheck"
            textComponent={
              <AppText
                font="body1"
                color={theme.colors.semantic.content.contentInverseTertionary}
              >
                {`By continuing, you are agree to our\n`}
                <AppText
                  font="button1"
                  color={theme.colors.semanticExtensions.content.contentAccent}
                  style={{ textDecorationLine: "underline" }}
                >{` Privacy Policy `}</AppText>
                <AppText
                  font="body1"
                  color={theme.colors.semantic.content.contentInverseTertionary}
                >{`and`}</AppText>
                <AppText
                  font="button1"
                  color={theme.colors.semanticExtensions.content.contentAccent}
                  style={{ textDecorationLine: "underline" }}
                >{` Terms & Conditions `}</AppText>
              </AppText>
            }
          />
        </View>

        <AppButton
          disabled={!isValid}
          title="Continue"
          onPress={handleSubmit(onCreateAccountClick)}
        />
        <ButtonWrapper
          onPress={() => {
            gotoLoginFromCreateAccount(navigation);
          }}
        >
          <AppText
            font="body1"
            textAlign="center"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >
            {`Already have an account? `}
            <AppText
              font="button1"
              color={theme.colors.semantic.content.contentPrimary}
            >{`Log In`}</AppText>
          </AppText>
        </ButtonWrapper>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

export default CreateAccount;
