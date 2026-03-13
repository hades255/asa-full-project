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
import { Ionicons } from "@expo/vector-icons";

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
import VoiceLoader from "../components/VoiceLoader";
import Header2 from "../components/Header2";
import AppButton from "../components/AppButton";
import DateTimePicker from "../components/DateTimePicker";
import DropdownPicker from "../components/DropdownPicker";
import LocationInput from "../components/LocationInput";
import AppFilters from "../components/AppFilters";
import SpaceCard from "../components/SpaceCard";
import { actionSetIntentSearchResult } from "../redux/appSlice";
import { searchByPrompt } from "../apis/useSearchByPrompt";
import { searchWithFilters } from "../apis/useSearchWithFilters";

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

function VoiceRecordingOverlay({ visible, isRecording, onRelease }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRelease}
    >
      <View style={modalStyles.overlay} pointerEvents="none">
        <View style={modalStyles.center} pointerEvents="none">
          <VoiceLoader color="#1a1a2e" size={1.5} />
          <Text style={modalStyles.title}>
            {isRecording ? "Listening…" : "Starting…"}
          </Text>
          <Text style={modalStyles.hint}>Release finger to stop</Text>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1a1a2e",
    marginTop: 20,
  },
  hint: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
});

export default function SearchScreen({ navigation }) {
  const dispatch = useDispatch();
  const googlePlaceData = useSelector(
    (state) => state.appSlice.googlePlaceData
  );
  const [prompt, setPrompt] = useState("");
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
  const latestInterimTranscriptRef = useRef("");
  const speechSessionActiveRef = useRef(false);
  const submitPromptWithTextRef = useRef(null);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setTimezone(tz);
    } catch (e) {
      console.warn("Timezone error:", e.message);
    }

    const FALLBACK_LOCATION = {
      lat: 51.5074,
      lng: -0.1278,
      address: "14 Grange Road, London, N6 4DG, United Kingdom",
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
              ? `${rev.street}, ${rev.city}${
                  rev.country ? `, ${rev.country}` : ""
                }`
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

  const extractTranscriptFromResultEvent = (event) => {
    const results = Array.isArray(event?.results) ? event.results : [];
    const finalSegments = [];

    for (const item of results) {
      if (!item) continue;
      const transcript =
        typeof item.transcript === "string" ? item.transcript.trim() : "";
      if (!transcript) continue;

      if (item.isFinal) {
        finalSegments.push(transcript);
      } else {
        latestInterimTranscriptRef.current = transcript;
      }
    }

    if (finalSegments.length) {
      transcriptRef.current.push(finalSegments.join(" "));
      latestInterimTranscriptRef.current = "";
      return;
    }

    const legacyTranscript =
      typeof results?.[0]?.transcript === "string"
        ? results[0].transcript.trim()
        : "";
    if (event?.isFinal && legacyTranscript) {
      transcriptRef.current.push(legacyTranscript);
      latestInterimTranscriptRef.current = "";
    } else if (legacyTranscript) {
      latestInterimTranscriptRef.current = legacyTranscript;
    }
  };

  useSpeechRecognitionEvent("result", (event) => {
    extractTranscriptFromResultEvent(event);
  });

  useSpeechRecognitionEvent("end", () => {
    const finalTranscript = transcriptRef.current.join(" ").trim();
    const fallbackInterim = latestInterimTranscriptRef.current.trim();
    const full = finalTranscript || fallbackInterim;

    transcriptRef.current = [];
    latestInterimTranscriptRef.current = "";
    speechSessionActiveRef.current = false;
    setIsRecording(false);
    setVoiceModalVisible(false);

    if (full) {
      setPrompt(full);
      submitPromptWithTextRef.current?.(full);
    } else {
      setIsProcessingVoice(false);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    transcriptRef.current = [];
    latestInterimTranscriptRef.current = "";
    speechSessionActiveRef.current = false;
    setIsRecording(false);
    setVoiceModalVisible(false);
    setIsProcessingVoice(false);
    if (event.error !== "aborted" && event.error !== "no-speech") {
      Alert.alert("Voice error", event.message || "Speech recognition failed.");
    }
  });

  const startVoiceRecording = async () => {
    if (!ExpoSpeechRecognitionModule || speechSessionActiveRef.current) return;

    try {
      transcriptRef.current = [];
      latestInterimTranscriptRef.current = "";
      speechSessionActiveRef.current = true;
      setIsProcessingVoice(false);
      setIsRecording(true);

      const shouldUseOnDeviceRecognition =
        Platform.OS === "ios"
          ? ExpoSpeechRecognitionModule.supportsOnDeviceRecognition?.() ?? false
          : false;

      await ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        continuous: Platform.OS === "ios",
        requiresOnDeviceRecognition: shouldUseOnDeviceRecognition,
        ...(Platform.OS === "android"
          ? {
              androidIntentOptions: {
                EXTRA_LANGUAGE_MODEL: "free_form",
                EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 1200,
                EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 1200,
              },
            }
          : {}),
      });
    } catch (e) {
      speechSessionActiveRef.current = false;
      setIsRecording(false);
      setVoiceModalVisible(false);
      Alert.alert("Voice error", e.message || "Could not start recording.");
    }
  };

  const ensureVoicePermissions = async () => {
    if (!ExpoSpeechRecognitionModule) {
      Alert.alert(
        "Voice input",
        "Voice input requires a development build. Run: npx expo run:android (or run:ios)"
      );
      return false;
    }
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert(
          "Microphone access",
          "Please allow microphone access to use voice input."
        );
        return false;
      }
      const available =
        await ExpoSpeechRecognitionModule.isRecognitionAvailable?.();
      if (available === false) {
        Alert.alert(
          "Voice not available",
          "Speech recognition is not available on this device."
        );
        return false;
      }
      if (Platform.OS === "android") {
        const services =
          (await ExpoSpeechRecognitionModule.getSpeechRecognitionServices?.()) ||
          [];
        const defaultService =
          (await ExpoSpeechRecognitionModule.getDefaultRecognitionService?.())
            ?.packageName || "";

        if (!services.length || !defaultService) {
          Alert.alert(
            "Voice service missing",
            "No Android speech recognition service is available. Install/enable Google app voice typing, then try again."
          );
          return false;
        }
      }
      return true;
    } catch (e) {
      Alert.alert("Voice error", e.message || "Could not start voice input.");
      return false;
    }
  };

  const onVoicePressStart = async () => {
    if (voiceModalVisible || isRecording || isProcessingVoice) return;
    const ok = await ensureVoicePermissions();
    if (!ok) return;
    transcriptRef.current = [];
    latestInterimTranscriptRef.current = "";
    setVoiceModalVisible(true);
    await startVoiceRecording();
  };

  const onVoiceButtonPressIn = () => {
    if (prompt.trim().length > 0) return;
    onVoicePressStart();
  };

  const onVoiceButtonPressOut = () => {
    if (voiceModalVisible && (isRecording || speechSessionActiveRef.current)) {
      (async () => {
        setVoiceModalVisible(false);
        if (!ExpoSpeechRecognitionModule) return;
        try {
          setIsRecording(false);
          setIsProcessingVoice(true);
          await ExpoSpeechRecognitionModule.stop();
        } catch (e) {
          speechSessionActiveRef.current = false;
          setIsProcessingVoice(false);
          Alert.alert("Voice error", e.message || "Could not stop recording.");
        }
      })();
    }
  };

  const onVoiceOverlayRelease = () => {
    onVoiceButtonPressOut();
  };

  useEffect(() => {
    return () => {
      if (!ExpoSpeechRecognitionModule) return;
      try {
        ExpoSpeechRecognitionModule.abort?.();
      } catch (_) {}
    };
  }, []);

  const onPromptSubmit = async (overridePrompt) => {
    const trimmed = (overridePrompt ?? prompt)?.trim();
    if (!trimmed) return;
    if (overridePrompt) setPrompt(overridePrompt);

    setParsing(true);
    setLastResponse(null);
    try {
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

      const result = await searchByPrompt({ prompt: trimmed, context });
      setLastResponse(result);
      dispatch(actionSetIntentSearchResult(result));
      setPrompt("");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.details ||
        err.message ||
        "Search failed";
      const url = err.apiUrl || "";
      setLastResponse({ error: msg });
      Alert.alert("Search failed", url ? `${msg}\n\nURL: ${url}` : msg);
    }
    setParsing(false);
    setIsProcessingVoice(false);
  };

  useEffect(() => {
    submitPromptWithTextRef.current = (text) => onPromptSubmit(text);
  });

  const MOCK_LOCATION = {
    formatted_address: "London, UK",
    geometry: { location: { lat: 51.5074, lng: -0.1278 } },
  };
  const mockLocationData = {
    address: "London, UK",
    lat: 51.5074,
    lng: -0.1278,
  };

  const onFilterSubmit = async (formData) => {
    const placeData = googlePlaceData?.geometry?.location
      ? googlePlaceData
      : __DEV__
      ? MOCK_LOCATION
      : null;
    // if (!placeData?.geometry?.location) {
    //   Alert.alert(
    //     "Location needed",
    //     "Please select a location using the Where field or Use my location."
    //   );
    //   return;
    // }
    setParsing(true);
    setLastResponse(null);
    try {
      const when = formData.when ? new Date(formData.when) : new Date();
      const loc = {
        address: placeData.formatted_address || "Unknown",
        lat: placeData.geometry.location.lat,
        lng: placeData.geometry.location.lng,
      };
      const lastLoc =
        lastLocation ||
        (placeData?.geometry?.location
          ? {
              address: placeData.formatted_address,
              lat: placeData.geometry.location.lat,
              lng: placeData.geometry.location.lng,
            }
          : mockLocationData);

      const result = await searchWithFilters({
        filters: {
          date: when.toISOString(),
          duration: Number(formData.duration) || 1,
          noOfGuests: Number(formData.guests) || 1,
          location: loc,
          categoryIds: selectedCategories?.length
            ? selectedCategories
            : undefined,
        },
        lastLocation: lastLoc,
      });

      setLastResponse(result);
      dispatch(actionSetIntentSearchResult(result));
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.details ||
        err.message ||
        "Search failed";
      setLastResponse({ error: msg });
      Alert.alert("Search failed", msg);
    }
    setParsing(false);
  };

  const canSubmitPrompt =
    prompt?.trim().length > 0 && !parsing && !isProcessingVoice;
  const isSubmitting = parsing || isProcessingVoice;

  const hasPrompt = prompt.trim().length > 0;
  const showVoiceButton = !hasPrompt;

  return (
    <ScreenWrapper withoutBottomPadding>
      <Header2 title="ASA Intent Preview" showBack={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tell me what you need…"
            placeholderTextColor="#999"
            value={prompt}
            onChangeText={setPrompt}
            maxLength={2000}
            returnKeyType="search"
            onSubmitEditing={() => onPromptSubmit()}
          />
          {showVoiceButton ? (
            <Pressable
              onPressIn={onVoiceButtonPressIn}
              onPressOut={onVoiceButtonPressOut}
              style={[
                styles.actionButton,
                styles.voiceActionButton,
                (voiceModalVisible || isRecording || isProcessingVoice) &&
                  styles.actionButtonDisabled,
              ]}
              disabled={voiceModalVisible || isRecording || isProcessingVoice}
              accessibilityLabel="Long press for voice input"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#1a1a2e" />
              ) : (
                <Ionicons name="mic-outline" size={18} color="#1a1a2e" />
              )}
            </Pressable>
          ) : (
            <TouchableOpacity
              onPress={() => onPromptSubmit()}
              disabled={!canSubmitPrompt}
              style={[
                styles.actionButton,
                styles.submitActionButton,
                !canSubmitPrompt && styles.submitDisabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#1a1a2e" />
              ) : (
                <Ionicons name="arrow-up-outline" size={18} color="#1a1a2e" />
              )}
            </TouchableOpacity>
          )}
        </View>
        {(isRecording || isProcessingVoice) && (
          <View style={styles.voiceStatusRow}>
            <Ionicons
              name={isRecording ? "mic" : "sync-outline"}
              size={14}
              color={isRecording ? "#0a7f3f" : "#1a1a2e"}
            />
            <Text
              style={[
                styles.voiceStatusText,
                isRecording && styles.voiceStatusTextActive,
              ]}
            >
              {isRecording ? "Listening..." : "Processing voice..."}
            </Text>
          </View>
        )}

        {/* Filters - directly below search input, above response */}
        <View style={styles.filterToggle}>
          <TouchableOpacity
            onPress={() => setShowFilters((v) => !v)}
            style={styles.filterToggleButton}
          >
            <Text style={styles.filterToggleText}>
              {showFilters ? "Hide filters" : "Show filters"}
            </Text>
          </TouchableOpacity>
        </View>
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
                title="Search"
                onPress={handleSubmit(onFilterSubmit)}
                disabled={!isValid || parsing}
              />
            </View>
          </ScrollView>
        )}

        {/* Search results - below filters */}
        {!showFilters && lastResponse?.error && (
          <View style={styles.resultBox}>
            <Text style={styles.errorText}>{lastResponse.error}</Text>
          </View>
        )}
        {!showFilters && lastResponse && !lastResponse.error && (
          <ScrollView
            style={styles.resultBox}
            contentContainerStyle={styles.resultScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {lastResponse.summary ? (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{lastResponse.summary}</Text>
              </View>
            ) : null}
            {lastResponse.noMatchMessage &&
            (!lastResponse.recommendations ||
              lastResponse.recommendations.length === 0) ? (
              <Text style={styles.noMatchText}>
                {lastResponse.noMatchMessage}
              </Text>
            ) : lastResponse.recommendations?.length > 0 ? (
              lastResponse.recommendations.map((item) => (
                <View
                  key={item?.profileId || item?.profile?.id}
                  style={styles.cardWrap}
                >
                  {item.score != null && (
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchText}>
                        Match {(item.score * 100).toFixed(0)}%
                      </Text>
                    </View>
                  )}
                  <SpaceCard
                    space={item.profile}
                    fullWidth
                    onPress={() =>
                      navigation.navigate("SpaceDetail", {
                        profile: item.profile,
                      })
                    }
                  />
                </View>
              ))
            ) : null}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
      <VoiceRecordingOverlay
        visible={voiceModalVisible}
        isRecording={isRecording}
        onRelease={onVoiceOverlayRelease}
      />
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
    borderColor: "#e8e8e8",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1a1a2e",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    margin: 4,
  },
  voiceActionButton: {
    backgroundColor: "transparent",
  },
  submitActionButton: {
    borderRadius: 18,
    backgroundColor: "#e8e8e8",
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  submitDisabled: {
    backgroundColor: "#e8e8e8",
    opacity: 0.4,
  },
  filterToggle: {
    marginTop: 16,
    alignItems: "center",
  },
  filterToggleButton: {
    paddingVertical: 10,
    alignSelf: "center",
  },
  voiceStatusRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  voiceStatusText: {
    fontSize: 13,
    color: "#1a1a2e",
    fontWeight: "500",
  },
  voiceStatusTextActive: {
    color: "#0a7f3f",
  },
  filterToggleText: {
    fontSize: 14,
    color: "#1a1a2e",
    fontWeight: "600",
  },
  resultBox: {
    marginTop: 20,
    flex: 1,
  },
  resultScrollContent: {
    paddingBottom: 24,
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
  noMatchText: {
    fontSize: 15,
    color: "#666",
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 15,
    color: "#c00",
    paddingVertical: 16,
  },
  cardWrap: {
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
  filtersScroll: {
    flex: 1,
    marginTop: 8,
  },
  filtersContent: {
    flexGrow: 1,
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
