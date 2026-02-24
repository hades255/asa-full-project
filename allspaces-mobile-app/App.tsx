import "./src/theme/unistyles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootStack from "@/navigation/rootStack";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ClerkProvider } from "@clerk/clerk-expo";
import { envConfig } from "@/utils/envConfig";
import { tokenCache } from "@/utils/cache";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppLoader, StatusModal } from "@/components";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <GestureHandlerRootView>
      <ClerkProvider
        publishableKey={envConfig.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <StripeProvider
              publishableKey={envConfig.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
              merchantIdentifier="AllSpaces"
            >
              <AppLoader />
              <StatusModal />
              <KeyboardProvider>
                <RootStack />
              </KeyboardProvider>
            </StripeProvider>
          </QueryClientProvider>
        </Provider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
