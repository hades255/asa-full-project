import { View, Text } from "react-native";
import React, { useEffect } from "react";
import {
  S_EDIT_PROFILE_FIELDS,
  T_EDIT_PROFILE_FIELDS,
  T_EDIT_PROFILE_SCREEN,
} from "./types";
import {
  AppButton,
  AppDatePicker,
  AppInput,
  AppText,
  Avatar,
  Header2,
  ScreenWrapper,
} from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { styles } from "./styles";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "@clerk/clerk-expo";
import { actionSetAppLoading } from "@/redux/app.slice";
import { showClerkError, showSnackbar } from "@/utils/essentials";
import { useUnistyles } from "react-native-unistyles";
import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
  LinkedInIcon,
} from "assets/icons";
import useSocialAuth from "@/hooks/useSocialAuth";
import { OAuthStrategy } from "@clerk/types";

const EditProfile: React.FC<T_EDIT_PROFILE_SCREEN> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useUnistyles();
  const { isLoaded, user } = useUser();
  const { connectSocialAccount, removeSocialAccount } = useSocialAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(S_EDIT_PROFILE_FIELDS),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        // @ts-ignore
        dateOfBirth: user.unsafeMetadata.dob
          ? // @ts-ignore
            new Date(user.unsafeMetadata.dob)
          : new Date(),
      });
    }
  }, [user]);

  const onSaveClick = async (formData: T_EDIT_PROFILE_FIELDS) => {
    try {
      if (!isLoaded || !user) return;

      dispatch(actionSetAppLoading(true));

      await user.update({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        unsafeMetadata: {
          ...user.unsafeMetadata,
          dob: formData.dateOfBirth,
        },
      });

      // Updating Local user
      await user.reload();

      showSnackbar(`Profile is updated successfully.`, "success");
      dispatch(actionSetAppLoading(false));
    } catch (error) {
      dispatch(actionSetAppLoading(false));
      showClerkError(error);
    }
  };

  const onSocialButtonPress = async (socialMedia: OAuthStrategy) => {
    if (!isLoaded || !user) return;

    let acc = user.verifiedExternalAccounts.find(
      (item) => item.verification?.strategy === socialMedia
    );

    if (acc) {
      await removeSocialAccount({ type: socialMedia });
    } else if (socialMedia === "oauth_google") {
      await connectSocialAccount({ type: socialMedia });
    }
    await user.reload();
  };

  return (
    <ScreenWrapper>
      <Header2 title="Edit Profile" />
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.avatarContainer}>
            <Avatar size={100} editable type="edit" />
          </View>
          <View style={{ rowGap: theme.units[4] }}>
            <View style={styles.formRow}>
              <AppInput
                width={"48%"}
                control={control}
                name="firstName"
                label="First Name"
                placeholder="e.g John"
                error={errors.firstName?.message}
              />
              <AppInput
                width={"48%"}
                control={control}
                name="lastName"
                label="Last Name"
                placeholder="e.g Doe"
                error={errors.lastName?.message}
              />
            </View>
            <AppDatePicker
              control={control}
              name="dateOfBirth"
              label="Date of Birth"
              placeholder="MM/DD/YYYY"
              error={errors.dateOfBirth?.message}
            />
          </View>
          <AppButton title="Save Changes" onPress={handleSubmit(onSaveClick)} />
          <View style={{ rowGap: theme.units[4] }}>
            <AppText font="button1">{`Linked Accounts`}</AppText>
            <View style={{ rowGap: theme.units[3] }}>
              <View style={styles.itemContainer}>
                <View style={styles.itemLeft}>
                  <GoogleIcon width={24} height={24} />
                  <AppText font="button1">{`Google`}</AppText>
                </View>
                <AppButton
                  onPress={() => onSocialButtonPress("oauth_google")}
                  width={112}
                  size="small"
                  title={
                    user?.verifiedExternalAccounts.find(
                      (item) => item.verification?.strategy === "oauth_google"
                    )
                      ? `Disconnect`
                      : "Connect"
                  }
                />
              </View>

              <View style={styles.itemContainer}>
                <View style={styles.itemLeft}>
                  <FacebookIcon width={24} height={24} />
                  <AppText font="button1">{`Facebook`}</AppText>
                </View>
                <AppButton
                  onPress={() => onSocialButtonPress("oauth_facebook")}
                  width={112}
                  size="small"
                  title={
                    user?.verifiedExternalAccounts.find(
                      (item) => item.verification?.strategy === "oauth_facebook"
                    )
                      ? `Disconnect`
                      : "Connect"
                  }
                />
              </View>

              <View style={styles.itemContainer}>
                <View style={styles.itemLeft}>
                  <AppleIcon width={24} height={24} />
                  <AppText font="button1">{`Instagram`}</AppText>
                </View>
                <AppButton
                  onPress={() => onSocialButtonPress("oauth_instagram")}
                  width={112}
                  size="small"
                  title={
                    user?.verifiedExternalAccounts.find(
                      (item) =>
                        item.verification?.strategy === "oauth_instagram"
                    )
                      ? `Disconnect`
                      : "Connect"
                  }
                />
              </View>

              <View style={styles.itemContainer}>
                <View style={styles.itemLeft}>
                  <LinkedInIcon width={24} height={24} />
                  <AppText font="button1">{`LinkedIn`}</AppText>
                </View>
                <AppButton
                  onPress={() => onSocialButtonPress("oauth_linkedin")}
                  width={112}
                  size="small"
                  title={
                    user?.verifiedExternalAccounts.find(
                      (item) => item.verification?.strategy === "oauth_linkedin"
                    )
                      ? `Disconnect`
                      : "Connect"
                  }
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;
