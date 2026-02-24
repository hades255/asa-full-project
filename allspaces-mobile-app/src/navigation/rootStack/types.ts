import { AuthStackParamList } from "../authStack/types";
import { ConciergeStackParamList } from "../conciergeStack/types";
import { ProfileSetupStackParamList } from "../profileSetupStack/types";
import { UserStackParamList } from "../userStack/types";

export type RootStackParamList = {
  AuthStack: AuthStackParamList;
  ProfileSetupStack: ProfileSetupStackParamList;
  UserStack: UserStackParamList;
  ConciergeStack: ConciergeStackParamList;
};
