import { HomeStackParamList } from "@/navigation/homeStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as yup from "yup";

export type T_SEARCH_SCREEN = NativeStackScreenProps<
  HomeStackParamList,
  "SearchScreen"
>;
export type T_SEARCH_SCREEN_ROUTE_PARAMS = undefined;

export type T_SEARCH_FORM = {
  when: string;
  duration: string;
  guests: string;
};

export const S_SEARCH_FIELDS = yup.object({
  when: yup.string().required(),
  duration: yup.string().required().test('greater-than-zero', 'Duration must be greater than 0 hours', (value) => {
    return value !== "0";
  }),
  guests: yup.string().required(),
});

export type T_SEARCH_FIELDS = yup.InferType<typeof S_SEARCH_FIELDS>;
