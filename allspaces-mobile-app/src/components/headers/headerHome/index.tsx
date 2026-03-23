import React, { useCallback, useEffect, useState } from "react";
import { T_HEADER_HOME } from "./types";
import { styles } from "./styles";
import { ActivityIndicator, Pressable, View } from "react-native";
import IconButton from "@/components/iconButton";
import { Gps, HambergerMenu } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";
import AppText from "@/components/appText";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "@/redux/hooks";
import Avatar from "@/components/avatar";
import { selectUserLocation } from "@/redux/selectors";
import {
  geoCodeAPI,
  getLocationPermissionStatus,
  getUserCoordinates,
  requestLocationPermission,
} from "@/utils/location";
import { actionSetUserLocation } from "@/redux/app.slice";
import { moderateScale } from "@/theme";

const HeaderHome: React.FC<T_HEADER_HOME> = ({}) => {
  const { theme } = useUnistyles();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const userLocation = useSelector(selectUserLocation);
  const [msg, setMsg] = useState<string | undefined>("");

  const getGeoLocation = async () => {
    try {
      const locObj = await getUserCoordinates();
      if (!locObj) {
        setLoading(false);
        setMsg(`Unable to fetch location`);
        return;
      }

      const geoResponse = await geoCodeAPI(
        `${locObj.coords.latitude},${locObj.coords.longitude}`,
        true,
      );
      if (geoResponse) {
        dispatch(actionSetUserLocation(geoResponse));
      } else {
        setMsg(`Unable to fetch location.`);
      }
    } catch (error) {
      throw error;
    }
  };

  const getUserLocation = useCallback(async () => {
    try {
      if (userLocation) {
        setLoading(false);
        return;
      }
      const permStatus = await getLocationPermissionStatus();
      if (!permStatus.granted) {
        if (!permStatus.canAskAgain) {
          setMsg(`Unable to fetch location. Need location permission`);
          setLoading(false);
          return;
        } else {
          const response = await requestLocationPermission();
          if (!response.granted) {
            setMsg(`Unable to fetch location. Need location permission`);
            setLoading(false);
            return;
          } else {
            await getGeoLocation();
          }
        }
      } else if (permStatus.granted) {
        await getGeoLocation();
      } else {
        setMsg(`Unable to fetch location.`);
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (error) {
      setMsg(`Unable to fetch location.`);
      setLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <IconButton
        onPress={() => {
          // @ts-ignore
          navigation.toggleDrawer();
        }}
        icon={
          <HambergerMenu
            size={24}
            color={theme.colors.semantic.content.contentPrimary}
          />
        }
      />
      <View style={styles.locationContainer}>
        <View style={styles.row}>
          <Gps
            size={16}
            color={theme.colors.semantic.content.contentInverseTertionary}
          />
          <AppText
            font="body2"
            color={theme.colors.semantic.content.contentInverseTertionary}
          >{`Current Location`}</AppText>
        </View>
        {loading ? (
          <ActivityIndicator
            size={moderateScale(14)}
            color={theme.colors.semantic.content.contentPrimary}
            style={{ alignSelf: "flex-start" }}
          />
        ) : msg ? (
          <AppText font={"button1"}>{msg}</AppText>
        ) : (
          <AppText
            font={"button1"}
          >{`${userLocation?.results[0].formatted_address}`}</AppText>
        )}
      </View>
      <Pressable
        onPress={() => {
          // @ts-ignore
          navigation.navigate("SettingsStack");
        }}
      >
        <Avatar size={42} editable={false} />
      </Pressable>
    </View>
  );
};

export default HeaderHome;
