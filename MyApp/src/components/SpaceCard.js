import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function SpaceCard({ space, onPress, fullWidth }) {
  const minSpend =
    space.services?.[0]?.minSpend != null
      ? `$ ${Number(space.services[0].minSpend).toFixed(2)} min.spend`
      : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, fullWidth && styles.fullWidth]}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, fullWidth && styles.imageFullWidth]}>
        <Image
          // source={{ uri: space.coverMedia || "https://hips.hearstapps.com/hmg-prod/images/copy-of-del-social-index-image-69-66996ead71585.png?crop=0.8888888888888888xw:1xh;0,0" }}
          source={{ uri: "https://hips.hearstapps.com/hmg-prod/images/copy-of-del-social-index-image-69-66996ead71585.png?crop=0.8888888888888888xw:1xh;0,0" }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {space.name}
          </Text>
          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.rating}>
              {space.averageRating != null
                ? Number(space.averageRating).toFixed(1)
                : "-"}
            </Text>
            <Text style={styles.reviewCount}>
              ({space.totalReviews != null ? space.totalReviews : 0})
            </Text>
          </View>
        </View>
        <View style={styles.addressRow}>
          <Text style={styles.address} numberOfLines={1}>
            📍 {space.address || space.location || "Address not available"}
          </Text>
        </View>
        {minSpend ? (
          <Text style={styles.minSpend}>{minSpend}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  fullWidth: {
    width: "100%",
  },
  imageContainer: {
    height: 200,
    width: "100%",
    backgroundColor: "#eee",
  },
  imageFullWidth: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  star: {
    fontSize: 14,
    color: "#f5a623",
  },
  rating: {
    fontSize: 14,
    color: "#333",
  },
  reviewCount: {
    fontSize: 12,
    color: "#666",
  },
  addressRow: {
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: "#666",
  },
  minSpend: {
    fontSize: 14,
    color: "#1a1a2e",
    fontWeight: "500",
  },
});
