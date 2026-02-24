import { BookingsStackParamList } from "../bookingsStack/types";
import { FavouritesStackParamList } from "../favouritesStack/types";
import { HomeStackParamList } from "../homeStack/types";
import { NotificationsStackParamList } from "../notificationsStack/types";
import { SettingsStackParamList } from "../settingsStack/types";

export type BottomTabsParamList = {
  HomeStack: HomeStackParamList;
  BookingsStack: BookingsStackParamList;
  FavouritesStack: FavouritesStackParamList;
  NotificationStack: NotificationsStackParamList;
  SettingsStack: SettingsStackParamList;
};
