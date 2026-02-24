import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useGetProfileFiltersAPI } from "../apis/useGetProfileFilters";

export default function AppFilters({
  selectedCategories,
  setSelectedCategories,
}) {
  const { data, isLoading } = useGetProfileFiltersAPI();

  const onSubCategoryPress = (subCat) => {
    const found = selectedCategories.find((id) => id === subCat.id);
    if (found) {
      setSelectedCategories((prev) => prev.filter((id) => id !== subCat.id));
    } else {
      setSelectedCategories((prev) => [...prev, subCat.id]);
    }
  };

  if (isLoading || !data?.filters?.categories) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Categories</Text>
        <Text style={styles.loading}>Loading filters...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categories</Text>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        {data.filters.categories.map((cat) => (
          <View key={cat.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            <View style={styles.chipsRow}>
              {cat.subcategories?.map((sub) => {
                const isSelected = selectedCategories.includes(sub.id);
                return (
                  <TouchableOpacity
                    key={sub.id}
                    onPress={() => onSubCategoryPress(sub)}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {sub.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  loading: {
    fontSize: 14,
    color: "#666",
  },
  scroll: {
    maxHeight: 200,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  chipSelected: {
    backgroundColor: "#1a1a2e",
  },
  chipText: {
    fontSize: 13,
    color: "#333",
  },
  chipTextSelected: {
    color: "#fff",
  },
});
