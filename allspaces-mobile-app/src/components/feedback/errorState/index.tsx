import React from "react";
import { View } from "react-native";
import AppText from "@/components/appText";
import AppButton from "@/components/appButton";
import { globalStyles } from "@/theme";

type T_ERROR_STATE = {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

const ErrorState: React.FC<T_ERROR_STATE> = ({
  title = "Something went wrong",
  description,
  actionLabel = "Try again",
  onAction,
}) => {
  return (
    <View style={[globalStyles.flex1, globalStyles.rowGap16]}>
      <AppText font="heading4" textAlign="center">
        {title}
      </AppText>
      <AppText font="body2" textAlign="center">
        {description}
      </AppText>
      {onAction ? <AppButton title={actionLabel} onPress={onAction} /> : null}
    </View>
  );
};

export default ErrorState;
