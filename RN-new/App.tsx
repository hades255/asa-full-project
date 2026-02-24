import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { IntentSearchScreen } from "./src/screens/IntentSearchScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <IntentSearchScreen />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24
  }
});

