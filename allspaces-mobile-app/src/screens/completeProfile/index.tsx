import { View } from "react-native";
import React, { useCallback, useState } from "react";
import { T_COMPLETE_PROFILE, STEP_COUNT } from "./types";
import { AppText, ButtonWrapper, ScreenWrapper } from "@/components";
import PersonalInfo from "./subcomponents/personalInfo";
import SocialAccountsInfo from "./subcomponents/socialAccountsInfo";
import PaymentInfo from "./subcomponents/paymentInfo";
import PreferencesInfo from "./subcomponents/preferencesInfo";
import { styles } from "./styles";
import AddPhoneNumber from "./subcomponents/addPhoneNumber";
import VerifyPhoneNumber from "./subcomponents/verifyPhoneNumber";
import { PhoneNumberResource } from "@clerk/types";
import { useDispatch } from "@/redux/hooks";
import { actionSetCompleteProfile } from "@/redux/app.slice";
const CompleteProfile: React.FC<T_COMPLETE_PROFILE> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [phoneObj, setPhoneObj] = useState<PhoneNumberResource | undefined>(undefined);

  const onNext = useCallback(() => setStep((s) => s + 1), []);
  const onPrev = useCallback(() => setStep((s) => s - 1), []);
  const onGoToStep = useCallback((targetStep: number) => setStep(targetStep), []);

  const handleSkip = useCallback(() => {
    dispatch(actionSetCompleteProfile(false));
  }, [dispatch]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfo onNext={onNext} />;
      case 2:
        return (
          <AddPhoneNumber
            setPhoneObj={setPhoneObj}
            onNext={onNext}
            onGoToStep={onGoToStep}
          />
        );
      case 3:
        return (
          <VerifyPhoneNumber
            phoneObj={phoneObj}
            onNext={onNext}
            onPrev={onPrev}
          />
        );
      case 4:
        return <SocialAccountsInfo onNext={onNext} />;
      case 5:
        return <PaymentInfo onNext={onNext} />;
      case 6:
        return <PreferencesInfo navigation={navigation} />;
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <AppText font="caption1" textAlign="center">
            {`Steps ${step}/${STEP_COUNT}`}
          </AppText>
          <ButtonWrapper onPress={handleSkip}>
            <AppText
              font="button1"
              textAlign="center"
              style={{ textDecorationLine: "underline" }}
            >
              {`Skip`}
            </AppText>
          </ButtonWrapper>
        </View>
        <View style={styles.stepContainer}>{renderStep()}</View>
      </View>
    </ScreenWrapper>
  );
};

export default CompleteProfile;
