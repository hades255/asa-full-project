import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import ScreenWrapper from "../components/ScreenWrapper";
import Header2 from "../components/Header2";
import SpaceCard from "../components/SpaceCard";

function recommendationToProfile(rec) {
  const p = rec?.profile;
  if (!p) return null;
  return {
    ...p,
    source: "SPACE",
  };
}

export default function SearchResultScreen({ navigation }) {
  const intentSearchResult = useSelector(
    (state) => state.appSlice.intentSearchResult
  );

  const recommendations = intentSearchResult?.recommendations ?? [];
  const summary = intentSearchResult?.summary ?? "";
  const noMatchMessage = intentSearchResult?.noMatchMessage;

  const profiles = recommendations.map(recommendationToProfile).filter(Boolean);

  const renderItem = ({ item, index }) => {
    const rec = recommendations[index];
    if (!rec?.profile) return null;
    return (
      <View style={styles.cardWrapper}>
        {rec.score != null && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>
              Match {(rec.score * 100).toFixed(0)}%
            </Text>
          </View>
        )}
        <SpaceCard
          space={rec.profile}
          fullWidth
          onPress={() => {
            navigation.navigate("SpaceDetail", { profile: rec.profile });
          }}
        />
        {rec.reasons?.length > 0 ? (
          <View style={styles.reasonsBox}>
            <Text style={styles.reasonsLabel}>Why we picked this:</Text>
            {rec.reasons.slice(0, 2).map((r, i) => (
              <Text key={i} style={styles.reasonItem}>
                • {r}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  if (!intentSearchResult) {
    return (
      <ScreenWrapper>
        <Header2 title="Search Results" showBack />
        <View style={styles.center}>
          <Text style={styles.message}>Run a search first to see results.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Search</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const hasResults = profiles.length > 0;

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="Search Results" showBack />
      <View style={styles.container}>
        {summary ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {!hasResults && noMatchMessage ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{noMatchMessage}</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Try another search</Text>
            </TouchableOpacity>
          </View>
        ) : hasResults ? (
          <FlatList
            data={profiles}
            keyExtractor={(item, i) => item?.id || i.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No spaces found</Text>
              </View>
            }
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No spaces found</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Try another search</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryBox: {
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1a1a2e",
  },
  summaryText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 24,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  matchBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  matchText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  reasonsBox: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginLeft: 4,
  },
  reasonsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },
  reasonItem: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  empty: {
    flex: 1,
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
