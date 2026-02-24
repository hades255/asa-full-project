import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { buildIntentPayload, SearchIntent } from "../services/intent";

export const IntentSearchScreen: React.FC = () => {
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("2");
  const [guests, setGuests] = useState("2");
  const [address, setAddress] = useState("");
  const [categoryIds, setCategoryIds] = useState("");
  const [prompt, setPrompt] = useState("");
  const [lastResponse, setLastResponse] = useState<SearchIntent | null>(null);

  const onSubmit = async () => {
    try {
      const intent = buildIntentPayload({
        date,
        duration,
        guests,
        address,
        categoryIds,
        rawQuery: prompt || undefined
      });

      // For now, just show it locally; in a real setup this would POST to /api/intent/parse.
      setLastResponse(intent);
      Alert.alert("Intent built", "See JSON below.");
    } catch (e: any) {
      Alert.alert("Validation error", e.message || "Invalid input");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Intent Search (MVP 1.5)</Text>
      <Text style={styles.subtitle}>
        Collect the core search intent fields (aligned with intent-schema.json)
        without touching the legacy app.
      </Text>

      <Text style={styles.label}>When (ISO date-time)</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="2026-02-20T10:00:00.000Z"
        style={styles.input}
      />

      <Text style={styles.label}>Duration (hours)</Text>
      <TextInput
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="2"
        style={styles.input}
      />

      <Text style={styles.label}>Number of guests</Text>
      <TextInput
        value={guests}
        onChangeText={setGuests}
        keyboardType="numeric"
        placeholder="2"
        style={styles.input}
      />

      <Text style={styles.label}>Location (address or postcode)</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="123 Example Street, London"
        style={styles.input}
      />

      <Text style={styles.label}>Category IDs (comma-separated)</Text>
      <TextInput
        value={categoryIds}
        onChangeText={setCategoryIds}
        placeholder="cat-dining-001,cat-meeting-002"
        style={styles.input}
      />

      <Text style={styles.label}>Optional prompt (raw query)</Text>
      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Breakfast for 2 in London next Tuesday 10am for 2 hours"
        style={[styles.input, styles.textarea]}
        multiline
      />

      <View style={styles.buttonContainer}>
        <Button title="Build intent JSON" onPress={onSubmit} />
      </View>

      {lastResponse && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Latest intent payload</Text>
          <Text style={styles.resultJson}>
            {JSON.stringify(lastResponse, null, 2)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top"
  },
  buttonContainer: {
    marginTop: 20
  },
  resultContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 6
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8
  },
  resultJson: {
    fontFamily: "monospace",
    fontSize: 12
  }
});

