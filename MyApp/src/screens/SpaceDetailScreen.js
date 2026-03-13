import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

  const heroImage =
    "https://hips.hearstapps.com/hmg-prod/images/copy-of-del-social-index-image-69-66996ead71585.png?crop=0.8888888888888888xw:1xh;0,0";
  const rating =
    typeof profile.averageRating === "number"
      ? profile.averageRating.toFixed(1)
      : "-";
  const totalReviews = profile.totalReviews ?? 0;
  const minSpend =
    profile?.services?.[0]?.minSpend != null
      ? `$ ${Number(profile.services[0].minSpend).toFixed(2)}`
      : null;
  const amenities = Array.isArray(profile?.facilities)
    ? profile.facilities
    : [];
  const services = Array.isArray(profile?.services) ? profile.services : [];

  return (
    <ScreenWrapper>
      <Header2 title={profile.name || "Space"} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: heroImage }} style={styles.heroImage} />

        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{profile.name || "Unnamed space"}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#f5a623" />
              <Text style={styles.ratingText}>{rating}</Text>
              <Text style={styles.reviewText}>({totalReviews})</Text>
            </View>
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.address}>
              {profile.address || "No address"}
            </Text>
          </View>
          {minSpend ? (
            <Text style={styles.minSpend}>{`~ ${minSpend} min.spend`}</Text>
          ) : null}
        </View>

        <View style={styles.separator} />

        {profile.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{profile.description}</Text>
          </View>
        ) : null}

        {profile.description ? <View style={styles.separator} /> : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.chipWrap}>
            {amenities.length ? (
              amenities.map((item, index) => (
                <View
                  key={`${item?.id || item?.name || index}`}
                  style={styles.chip}
                >
                  <Text style={styles.chipText}>{item?.name || "Amenity"}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No amenities listed.</Text>
            )}
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          {services.length ? (
            services.map((item, index) => (
              <View
                key={`${item?.id || item?.name || index}`}
                style={styles.serviceCard}
              >
                <Text style={styles.serviceName}>
                  {item?.name || "Service"}
                </Text>
                {item?.minSpend != null ? (
                  <Text style={styles.servicePrice}>
                    {`$ ${Number(item.minSpend).toFixed(2)} min spend`}
                  </Text>
                ) : null}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No services listed.</Text>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: 260,
    backgroundColor: "#eee",
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 16,
    rowGap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
  },
  name: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  reviewText: {
    fontSize: 13,
    color: "#666",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  address: {
    flex: 1,
    fontSize: 15,
    color: "#666",
  },
  minSpend: {
    fontSize: 14,
    color: "#1a1a2e",
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#f3f4f7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    color: "#444",
  },
  serviceCard: {
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  servicePrice: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },
});
