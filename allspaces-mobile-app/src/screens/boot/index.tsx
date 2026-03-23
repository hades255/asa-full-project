import { View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { T_BOOT_SCREEN } from './types'
import { ScreenWrapper } from '@/components'
import { styles } from './styles'
import { useUnistyles } from 'react-native-unistyles'
import * as ExpoSplashScreen from 'expo-splash-screen';
import * as Font from "expo-font";
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useDispatch } from '@/redux/hooks'
import { actionSetBootStack } from '@/redux/app.slice'
import { USER_TYPES } from '@/config/constants'
import { getLocationPermissionStatus } from '@/utils/location'

ExpoSplashScreen.preventAutoHideAsync();

const BootScreen: React.FC<T_BOOT_SCREEN> = ({ navigation }) => {

    const { theme } = useUnistyles();
    const dispatch = useDispatch();
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const [areAssetsReady, setAssetsReady] = useState(false);

    const loadAppFonts = async () => {
        await Font.loadAsync({
            "Poppins-Regular": require("../../../assets/fonts/Poppins-Regular.ttf"),
            "Poppins-Medium": require("../../../assets/fonts/Poppins-Medium.ttf"),
            "Poppins-SemiBold": require("../../../assets/fonts/Poppins-SemiBold.ttf"),
            "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
        });
    }

    useEffect(() => {
        const preparingAssets = async () => {
            try {
                await loadAppFonts();
            } catch (e) {
                console.error(`Encountering error while preparing app assets ${e}`);
            } finally {
                setAssetsReady(true);
                ExpoSplashScreen.hideAsync();
            }
        }
        preparingAssets();
    }, []);

    useEffect(() => {
        const onAuthStateChanged = async () => {
            try {
                if (isSignedIn) {
                    const permissionStatus = await getLocationPermissionStatus();
                    if (permissionStatus.granted) {
                        if (user && user?.unsafeMetadata.type === USER_TYPES.CONCIERGE)
                            dispatch(actionSetBootStack("concierge"));
                        else dispatch(actionSetBootStack("user"));
                    }
                    else {
                        dispatch(actionSetBootStack('location'));
                    }
                }
                else {

                }
            } catch (error) {
                console.error(`Error while checking auth state ${error}`);
            }
        }
    }, [])
    return (
        <ScreenWrapper>
            <View style={styles.mainContainer}>
                <ActivityIndicator size={'small'} color={theme.colors.core.primaryA} />
            </View>
        </ScreenWrapper>
    )
}

export default BootScreen