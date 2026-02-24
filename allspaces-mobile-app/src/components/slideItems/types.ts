import { ImageSourcePropType, type ViewProps } from "react-native";
import type { AnimatedProps } from "react-native-reanimated";

export type Props = AnimatedProps<ViewProps> & {
  style?: any;
  index?: number;
  rounded?: boolean;
  source?: ImageSourcePropType;
  totalItems?: number;
};
