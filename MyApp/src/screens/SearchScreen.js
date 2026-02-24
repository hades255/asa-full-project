import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";

// expo-speech-recognition requires a dev build; not available in Expo Go
const isExpoGo = Constants.appOwnership === "expo";
let ExpoSpeechRecognitionModule = null;
let useSpeechRecognitionEvent = () => {};
if (!isExpoGo) {
  try {
    const sr = require("expo-speech-recognition");
    ExpoSpeechRecognitionModule = sr.ExpoSpeechRecognitionModule;
    useSpeechRecognitionEvent = sr.useSpeechRecognitionEvent;
  } catch (e) {
    console.warn("expo-speech-recognition not available:", e?.message);
  }
}
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  actionSetSearchData,
  actionSetGooglePlaceData,
} from "../redux/appSlice";
import ScreenWrapper from "../components/ScreenWrapper";
import Header2 from "../components/Header2";
import AppButton from "../components/AppButton";
import DateTimePicker from "../components/DateTimePicker";
import DropdownPicker from "../components/DropdownPicker";
import LocationInput from "../components/LocationInput";
import AppFilters from "../components/AppFilters";
import { envConfig } from "../config/env";
import axios from "axios";

const schema = yup.object({
  when: yup.mixed().required("When is required"),
  duration: yup
    .string()
    .required()
    .test("gt0", "Duration must be greater than 0 hours", (v) => v !== "0"),
  guests: yup.string().required(),
});

const durationOptions = [
  { label: "1 hour", value: "1" },
  { label: "2 hours", value: "2" },
  { label: "3 hours", value: "3" },
  { label: "4 hours", value: "4" },
  { label: "5+ hours", value: "5" },
];

const guestOptions = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

function VoiceRecordingModal({ visible, isRecording, onPressIn, onPressOut }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onPressOut}
    >
      <Pressable
        style={modalStyles.overlay}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={modalStyles.center}>
          <Text style={modalStyles.icon}>🎤</Text>
          <Text style={modalStyles.title}>
            {isRecording ? "Recording…" : "Hold to record"}
          </Text>
          <Text style={modalStyles.hint}>
            Release to stop and transcribe
          </Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  hint: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
  },
});

export default function SearchScreen({ navigation }) {
  const dispatch = useDispatch();
  const googlePlaceData = useSelector(
    (state) => state.appSlice.googlePlaceData
  );
  const [prompt, setPrompt] = useState(
    "Breakfast for 3 in London near London eye next Tuesday 11am for 4 hours"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [lastLocation, setLastLocation] = useState(null);
  const [timezone, setTimezone] = useState("Europe/London");
  const [lastResponse, setLastResponse] = useState(null);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const transcriptRef = useRef([]);

  useEffect(() => {
    // Device timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setTimezone(tz);
    } catch (e) {
      console.warn("Timezone error:", e.message);
    }

    // Device location (fallback for emulators where GPS is unavailable)
    const FALLBACK_LOCATION = {
      lat: 51.5074,
      lng: -0.1278,
      address: "London, UK (emulator fallback)",
    };

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (__DEV__) setLastLocation(FALLBACK_LOCATION);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
          maximumAge: 60000,
          timeout: 10000,
        });
        const { latitude, longitude } = loc.coords;
        let address = "Current location";
        try {
          const [rev] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          address =
            rev?.street && rev?.city
              ? `${rev.street}, ${rev.city}${rev.country ? `, ${rev.country}` : ""}`
              : rev?.city || rev?.region || address;
        } catch (_) {}
        setLastLocation({ lat: latitude, lng: longitude, address });
      } catch (e) {
        console.warn("Location error:", e.message);
        if (__DEV__) {
          setLastLocation(FALLBACK_LOCATION);
        }
      }
    })();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      when: new Date(),
      duration: "1",
      guests: "0",
    },
  });

  // STT events - accumulate transcripts and handle completion
  useSpeechRecognitionEvent("result", (event) => {
    const t = event.results?.[0]?.transcript;
    if (event.isFinal && t?.trim()) {
      transcriptRef.current.push(t.trim());
    }
  });

  useSpeechRecognitionEvent("end", () => {
    const full = transcriptRef.current.join(" ");
    transcriptRef.current = [];
    if (full) {
      setPrompt(full);
      submitPromptWithTextRef.current?.(full);
    } else {
      setIsProcessingVoice(false);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    transcriptRef.current = [];
    setIsProcessingVoice(false);
    if (event.error !== "aborted" && event.error !== "no-speech") {
      Alert.alert("Voice error", event.message || "Speech recognition failed.");
    }
  });

  const submitPromptWithTextRef = useRef(null);

  const onVoicePress = async () => {
    if (!ExpoSpeechRecognitionModule) {
      Alert.alert(
        "Voice input",
        "Voice input requires a development build. Run: npx expo run:android (or run:ios)"
      );
      return;
    }
    try {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert(
          "Microphone access",
          "Please allow microphone access to use voice input."
        );
        return;
      }
      const available = ExpoSpeechRecognitionModule.isRecognitionAvailable?.();
      if (available === false) {
        Alert.alert("Voice not available", "Speech recognition is not available on this device.");
        return;
      }
      transcriptRef.current = [];
      setVoiceModalVisible(true);
    } catch (e) {
      Alert.alert("Voice error", e.message || "Could not start voice input.");
    }
  };

  const onVoiceModalPressIn = () => {
    if (!ExpoSpeechRecognitionModule) return;
    setIsRecording(true);
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: true,
      requiresOnDeviceRecognition: ExpoSpeechRecognitionModule.supportsOnDeviceRecognition?.() ?? false,
    });
  };

  const onVoiceModalPressOut = () => {
    if (!isRecording || !ExpoSpeechRecognitionModule) return;
    setIsRecording(false);
    setVoiceModalVisible(false);
    setIsProcessingVoice(true);
    ExpoSpeechRecognitionModule.stop();
  };

  const onPromptSubmit = async (overridePrompt) => {
    const trimmed = (overridePrompt ?? prompt)?.trim();
    if (!trimmed) return;
    if (overridePrompt) setPrompt(overridePrompt);

    setParsing(true);
    setLastResponse(null);
    console.log("lastLocation", lastLocation);
    console.log("googlePlaceData", googlePlaceData);
    try {
      const baseUrl = envConfig.EXPO_PUBLIC_INTENT_API_BASE_URL;
      const context = {
        timezone,
        lastLocation:
          lastLocation ||
          (googlePlaceData?.geometry?.location
            ? {
                lat: googlePlaceData.geometry.location.lat,
                lng: googlePlaceData.geometry.location.lng,
                address: googlePlaceData.formatted_address,
              }
            : undefined),
      };

      console.log("context", context);

      const res = await axios.post(`${baseUrl}/intent/parse`, {
        prompt: trimmed,
        context,
      });

      setLastResponse(res.data);

      const { intent, repair } = res.data;

      // Don't use location when it was enriched from user's current location (vague prompt)
      const wasEnriched =
        repair?.changes?.some?.((c) =>
          typeof c === "string" && c.toLowerCase().includes("location enriched from user location")
        );

      if (!intent?.location || wasEnriched) {
        if (wasEnriched) {
          Alert.alert(
            "Location needed",
            "Please specify a location in your search (e.g. 'London', 'Manhattan') or use filters below."
          );
        } else {
          Alert.alert(
            "Error",
            "Could not extract location from your prompt. Try using filters instead."
          );
        }
        setParsing(false);
        setIsProcessingVoice(false);
        return;
      }

      const loc = intent.location;

      dispatch(
        actionSetGooglePlaceData({
          formatted_address: context.lastLocation?.address || "Unknown",
          geometry: { location: { lat: context.lastLocation?.lat ?? 0, lng: context.lastLocation?.lng ?? 0 } },
        })
      );
      dispatch(
        actionSetSearchData({
          date: intent.date || new Date().toISOString(),
          noOfGuests: intent.noOfGuests ?? 1,
          duration: intent.duration ?? 1,
          filters: intent.categoryIds || [],
          location: loc.address || "Unknown",
        })
      );
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Intent parse failed";
      setLastResponse({ error: msg });
      Alert.alert("Search failed", msg);
    }
    setParsing(false);
    setIsProcessingVoice(false);
  };

  submitPromptWithTextRef.current = onPromptSubmit;

  const onViewResults = () => {
    navigation.navigate("SearchResult");
  };

  const onContinue = (formData) => {
    if (!googlePlaceData?.geometry?.location) return;
    dispatch(
      actionSetSearchData({
        date: new Date(formData.when).toISOString(),
        noOfGuests: Number(formData.guests),
        duration: Number(formData.duration),
        filters: selectedCategories,
        location: googlePlaceData.formatted_address,
      })
    );
    navigation.navigate("SearchResult");
  };

  const canSubmitPrompt = prompt?.trim().length > 0 && !parsing && !isProcessingVoice;
  const isSubmitting = parsing || isProcessingVoice;

  return (
    <ScreenWrapper withoutBottomPadding>
      <VoiceRecordingModal
        visible={voiceModalVisible}
        isRecording={isRecording}
        onPressIn={onVoiceModalPressIn}
        onPressOut={onVoiceModalPressOut}
      />
      <Header2 title="Search" showBack={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Search bar: Voice | Input | Submit */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            onPress={onVoicePress}
            style={[
              styles.voiceButton,
              (voiceModalVisible || isRecording || isProcessingVoice) && styles.voiceDisabled,
            ]}
            disabled={voiceModalVisible || isRecording || isProcessingVoice}
            accessibilityLabel="Voice input"
          >
            <Text style={styles.voiceIcon}>🎤</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search ..."
            placeholderTextColor="#999"
            value={prompt}
            onChangeText={setPrompt}
            multiline={false}
            returnKeyType="search"
            onSubmitEditing={onPromptSubmit}
          />
          <TouchableOpacity
            onPress={() => onPromptSubmit()}
            disabled={!canSubmitPrompt}
            style={[
              styles.submitButton,
              !canSubmitPrompt && styles.submitDisabled,
            ]}
          >
            {isSubmitting ? (
              <View style={styles.submitContent}>
                <ActivityIndicator size="small" color="#fff" style={styles.submitSpinner} />
                <Text style={styles.submitText}>Submitting</Text>
              </View>
            ) : (
              <View style={styles.submitContent}>
                <Text style={styles.submitIcon}>🔎</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Show / Hide filters toggle */}
        <TouchableOpacity
          onPress={() => setShowFilters((v) => !v)}
          style={styles.filterToggle}
        >
          <Text style={styles.filterToggleText}>
            {showFilters ? "Hide filters" : "Show filters"}
          </Text>
        </TouchableOpacity>

        {/* JSON viewer - raw intent parse result */}
        {lastResponse && (
          <View style={styles.jsonViewer}>
            <Text style={styles.jsonViewerTitle}>Intent Parse Result</Text>
            <ScrollView
              showsVerticalScrollIndicator={true}
              style={styles.jsonScroll}
              contentContainerStyle={styles.jsonScrollContent}
            >
              <Text style={styles.jsonText} selectable>
                {typeof lastResponse === "object"
                  ? JSON.stringify(lastResponse, null, 2)
                  : String(lastResponse)}
              </Text>
            </ScrollView>
            {lastResponse?.intent?.location && (
              <TouchableOpacity
                onPress={onViewResults}
                style={styles.viewResultsButton}
              >
                <Text style={styles.viewResultsText}>View search results</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Original filters (collapsible) */}
        {showFilters && (
          <ScrollView
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <DateTimePicker
              control={control}
              name="when"
              label="When"
              placeholder="DD/MM/YYYY HH:MM"
            />
            <View style={styles.divider} />
            <DropdownPicker
              control={control}
              name="duration"
              label="For how long? (hours)"
              options={durationOptions}
              error={errors.duration?.message}
            />
            <View style={styles.divider} />
            <DropdownPicker
              control={control}
              name="guests"
              label="How many guests?"
              options={guestOptions}
            />
            <View style={styles.divider} />
            <LocationInput label="Where" placeholder="Address or Postcode" />
            <View style={styles.divider} />
            <AppFilters
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <View style={styles.footer}>
              <AppButton
                title="Continue"
                onPress={handleSubmit(onContinue)}
                disabled={!isValid || !googlePlaceData}
              />
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  voiceButton: {
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceDisabled: {
    opacity: 0.5,
  },
  voiceIcon: {
    fontSize: 22,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a2e",
    margin: 6,
  },
  submitDisabled: {
    backgroundColor: "#bbb",
    shadowOpacity: 0,
  },
  submitContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitIcon: {
    fontSize: 18,
  },
  submitSpinner: {
    marginRight: 6,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  filterToggle: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  filterToggleText: {
    fontSize: 14,
    color: "#1a1a2e",
    fontWeight: "600",
  },
  jsonViewer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#1e1e2e",
    borderRadius: 8,
  },
  jsonViewerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  jsonScroll: {
    maxHeight: 280,
  },
  jsonScrollContent: {
    paddingRight: 16,
  },
  jsonText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: "#a6e3a1",
  },
  viewResultsButton: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "#313244",
    borderRadius: 8,
    alignItems: "center",
  },
  viewResultsText: {
    color: "#89b4fa",
    fontSize: 14,
    fontWeight: "600",
  },
  filtersScroll: {
    flex: 1,
    marginTop: 8,
  },
  filtersContent: {
    paddingBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 8,
  },
  footer: {
    paddingTop: 16,
  },
});
