import { T_ENABLE_LOCATION_SCREEN_ROUTE_PARAMS } from "@/screens/enableLocation/types";
import { DrawerStackParamList } from "../drawerStack/types";
import { T_CHOOSE_LOCATION_SCREEN_ROUTE_PARAMS } from "@/screens/chooseLocation/types";
import { T_DENIED_LOCATION_SCREEN_ROUTE_PARAMS } from "@/screens/deniedLocation/types";

export type UserStackParamList = {
  DrawerStack: DrawerStackParamList;
  EnableLocationScreen: T_ENABLE_LOCATION_SCREEN_ROUTE_PARAMS;
  DeniedLocationScreen: T_DENIED_LOCATION_SCREEN_ROUTE_PARAMS;
  ChooseLocationScreen: T_CHOOSE_LOCATION_SCREEN_ROUTE_PARAMS;
};
