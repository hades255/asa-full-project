import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import Header2 from "../components/Header2";

export default function SpaceDetailScreen({ route }) {
  const { profile } = route.params || {};

  if (!profile) {
    return (
      <ScreenWrapper>
        <Header2 title="Space" />
        <View style={styles.center}>
          <Text>No space selected</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header2 title={profile.name || "Space"} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.address}>📍 {profile.address || "No address"}</Text>
        <Text style={styles.rating}>
          ★ {profile.averageRating?.toFixed(1) || "-"} ({profile.totalReviews || 0} reviews)
        </Text>
        {profile.description ? (
          <Text style={styles.description}>{profile.description}</Text>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  address: {
    fontSize: 15,
    color: "#666",
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
});
