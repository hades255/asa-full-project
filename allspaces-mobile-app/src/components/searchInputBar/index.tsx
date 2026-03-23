import {
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";

import { AppText, VoiceLoader } from "@/components";
import { Microphone2 } from "iconsax-react-native";
import { useUnistyles } from "react-native-unistyles";

const isExpoGo = Constants.appOwnership === "expo";
let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: (
  event: string,
  cb: (e: any) => void
) => void = () => {};
if (!isExpoGo) {
  try {
    const sr = require("expo-speech-recognition");
    ExpoSpeechRecognitionModule = sr.ExpoSpeechRecognitionModule;
    useSpeechRecognitionEvent = sr.useSpeechRecognitionEvent;
  } catch {
    // expo-speech-recognition not available
  }
}

function VoiceRecordingOverlay({
  visible,
  isRecording,
  onRelease,
  theme,
}: {
  visible: boolean;
  isRecording: boolean;
  onRelease: () => void;
  theme: any;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRelease}
    >
      <View
        style={[
          modalStyles.overlay,
          {
            backgroundColor:
              theme.colors.semantic.background.backgroundPrimary + "E6",
          },
        ]}
        pointerEvents="none"
      >
        <View style={modalStyles.center} pointerEvents="none">
          <VoiceLoader color={theme.colors.core.accent} size={1.5} />
          <AppText font="body1" style={{ marginTop: 20 }}>
            {isRecording ? "Listening…" : "Starting…"}
          </AppText>
          <AppText
            font="caption1"
            color={theme.colors.semantic.content.contentInverseTertionary}
            style={{ marginTop: 8 }}
          >
            Release finger to stop
          </AppText>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    padding: 32,
  },
});

export type SearchInputBarProps = {
  onSubmit: (prompt: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: object;
  showVoiceStatus?: boolean;
};

const SearchInputBar: React.FC<SearchInputBarProps> = ({
  onSubmit,
  placeholder = "Tell me what you need…",
  disabled = false,
  containerStyle,
  showVoiceStatus = true,
}) => {
  const { theme } = useUnistyles();
  const [prompt, setPrompt] = useState("");
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isAwaitingSubmit, setIsAwaitingSubmit] = useState(false);
  const transcriptRef = useRef<string[]>([]);
  const latestInterimTranscriptRef = useRef("");
  const speechSessionActiveRef = useRef(false);
  const submitPromptWithTextRef = useRef<((text: string) => void) | null>(null);

  const extractTranscriptFromResultEvent = (event: any) => {
    const results = Array.isArray(event?.results) ? event.results : [];
    const finalSegments: string[] = [];

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

  useSpeechRecognitionEvent("result", extractTranscriptFromResultEvent);

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

  useSpeechRecognitionEvent("error", (event: any) => {
    transcriptRef.current = [];
    latestInterimTranscriptRef.current = "";
    speechSessionActiveRef.current = false;
    setIsRecording(false);
    setVoiceModalVisible(false);
    setIsProcessingVoice(false);
    if (event?.error !== "aborted" && event?.error !== "no-speech") {
      Alert.alert(
        "Voice error",
        event?.message || "Speech recognition failed."
      );
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
    } catch (e: any) {
      speechSessionActiveRef.current = false;
      setIsRecording(false);
      setVoiceModalVisible(false);
      Alert.alert("Voice error", e?.message || "Could not start recording.");
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
            "No Android speech recognition service is available."
          );
          return false;
        }
      }
      return true;
    } catch (e: any) {
      Alert.alert("Voice error", e?.message || "Could not start voice input.");
      return false;
    }
  };

  const onVoicePressStart = async () => {
    if (voiceModalVisible || isRecording || isProcessingVoice || disabled) return;
    const ok = await ensureVoicePermissions();
    if (!ok) return;
    transcriptRef.current = [];
    latestInterimTranscriptRef.current = "";
    setVoiceModalVisible(true);
    await startVoiceRecording();
  };

  const onVoiceButtonPressIn = () => {
    if (prompt.trim().length > 0 || disabled) return;
    onVoicePressStart();
  };

  const onVoiceButtonPressOut = () => {
    if (voiceModalVisible && (isRecording || speechSessionActiveRef.current)) {
      setVoiceModalVisible(false);
      if (ExpoSpeechRecognitionModule) {
        setIsRecording(false);
        setIsProcessingVoice(true);
        ExpoSpeechRecognitionModule.stop().catch(() => {
          speechSessionActiveRef.current = false;
          setIsProcessingVoice(false);
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (ExpoSpeechRecognitionModule) {
        try {
          ExpoSpeechRecognitionModule.abort?.();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  // Mobile: keyboard return key adds newline; submit via → button (iMessage-style).
  // Desktop: Enter=submit, Shift+Enter/Ctrl+Enter=newline (via onKeyPress).
  const handleKeyPress = (e: any) => {
    if (isMobile) return;
    const key = e?.nativeEvent?.key;
    if (key !== "Enter") return;
    const shiftKey = e?.nativeEvent?.shiftKey ?? false;
    const ctrlKey = e?.nativeEvent?.ctrlKey ?? false;
    if (shiftKey || ctrlKey) return;
    e.preventDefault?.();
    onPromptSubmit();
  };

  const handleSubmitEditing = () => {
    onPromptSubmit();
  };

  const onPromptSubmit = async (overridePrompt?: string) => {
    const trimmed = (overridePrompt ?? prompt)?.trim();
    if (!trimmed || disabled) return;
    if (overridePrompt) setPrompt(overridePrompt);

    setIsAwaitingSubmit(true);
    try {
      await onSubmit(trimmed);
      setPrompt("");
    } finally {
      setIsProcessingVoice(false);
      setIsAwaitingSubmit(false);
    }
  };

  useEffect(() => {
    submitPromptWithTextRef.current = (text: string) => onPromptSubmit(text);
  });

  const canSubmitPrompt =
    prompt?.trim().length > 0 &&
    !isProcessingVoice &&
    !isAwaitingSubmit &&
    !disabled;
  const isSubmitting = isProcessingVoice || isAwaitingSubmit;
  const hasPrompt = prompt.trim().length > 0;
  const showVoiceButton = !hasPrompt && !disabled;

  const barDisabled =
    voiceModalVisible || isRecording || isProcessingVoice || disabled;

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.semantic.background.backgroundSecondary,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.semantic.content.contentPrimary,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={
            theme.colors.semantic.content.contentInverseTertionary
          }
          value={prompt}
          onChangeText={setPrompt}
          maxLength={2000}
          multiline
          submitBehavior="newline"
          returnKeyType="default"
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleSubmitEditing}
          scrollEnabled
          textAlignVertical="top"
          editable={!disabled}
        />
        {showVoiceButton ? (
          <Pressable
            onPressIn={onVoiceButtonPressIn}
            onPressOut={onVoiceButtonPressOut}
            style={[styles.actionButton, barDisabled && styles.actionDisabled]}
            disabled={barDisabled}
            accessibilityLabel="Long press for voice input"
          >
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.core.accent}
              />
            ) : (
              <Microphone2
                size={20}
                color={theme.colors.semantic.content.contentPrimary}
                variant="Linear"
              />
            )}
          </Pressable>
        ) : (
          <TouchableOpacity
            onPress={() => onPromptSubmit()}
            disabled={!canSubmitPrompt}
            style={[
              styles.actionButton,
              styles.submitButton,
              !canSubmitPrompt && styles.submitDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.core.accent}
              />
            ) : (
              <AppText font="button1">→</AppText>
            )}
          </TouchableOpacity>
        )}
      </View>

      {showVoiceStatus && (isRecording || isProcessingVoice) && (
        <View style={styles.voiceStatusRow}>
          <Microphone2
            size={14}
            color={
              isRecording
                ? theme.colors.semanticExtensions.content.contentPositive
                : theme.colors.semantic.content.contentPrimary
            }
            variant={isRecording ? "Bold" : "Linear"}
          />
          <AppText
            font="caption1"
            style={{
              color: isRecording
                ? theme.colors.semanticExtensions.content.contentPositive
                : theme.colors.semantic.content.contentPrimary,
            }}
          >
            {isRecording ? "Listening..." : "Processing voice..."}
          </AppText>
        </View>
      )}

      <VoiceRecordingOverlay
        visible={voiceModalVisible}
        isRecording={isRecording}
        onRelease={onVoiceButtonPressOut}
        theme={theme}
      />
    </View>
  );
};

const INPUT_LINE_HEIGHT = 24;
const INPUT_MIN_HEIGHT = 44;
const INPUT_MAX_LINES = 4;
const INPUT_MAX_HEIGHT = INPUT_LINE_HEIGHT * INPUT_MAX_LINES;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 28,
    minHeight: 55,
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingRight: 4,
    columnGap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: INPUT_LINE_HEIGHT,
    paddingVertical: 10,
    paddingHorizontal: 0,
    minHeight: INPUT_MIN_HEIGHT,
    maxHeight: INPUT_MAX_HEIGHT,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  actionDisabled: {
    opacity: 0.5,
  },
  submitButton: {
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  submitDisabled: {
    opacity: 0.4,
  },
  voiceStatusRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
});

export default SearchInputBar;
