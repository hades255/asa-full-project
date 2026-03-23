import "./src/theme/unistyles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootStack from "@/navigation/rootStack";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ClerkProvider } from "@clerk/clerk-expo";
import { envConfig } from "@/utils/envConfig";
import { tokenCache } from "@/utils/cache";
import { AppLoader, StatusModal } from "@/components";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppStateProvider } from "@/redux/provider";

if (!(globalThis as any).__ALLSPACES_BOOT_TS__) {
  (globalThis as any).__ALLSPACES_BOOT_TS__ = Date.now();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

function ConfigErrorScreen({ message }: { message: string }) {
  return (
    <View style={configErrorStyles.container}>
      <Text style={configErrorStyles.title}>Configuration required</Text>
      <Text style={configErrorStyles.message}>{message}</Text>
      <Text style={configErrorStyles.hint}>
        Copy .env.example to .env and add the required keys, then restart the app.
      </Text>
    </View>
  );
}

const configErrorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f8fafc",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 16,
  },
  hint: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
});

export default function App() {
  if (!envConfig.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <ConfigErrorScreen message="EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Please check your .env file." />
    );
  }

  if (!envConfig.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <ConfigErrorScreen message="EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY is required for payments. Please check your .env file." />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        publishableKey={envConfig.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <AppStateProvider>
          <QueryClientProvider client={queryClient}>
            <StripeProvider publishableKey={envConfig.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}>
              <AppLoader />
              <StatusModal />
              <KeyboardProvider preload={false}>
                <RootStack />
              </KeyboardProvider>
            </StripeProvider>
          </QueryClientProvider>
        </AppStateProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
