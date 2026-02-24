import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";

export default function DropdownPicker({
  control,
  name,
  label,
  options,
  error,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            style={styles.input}
          >
            <Text style={[styles.inputText, !value && styles.placeholder]}>
              {options.find((o) => o.value === value)?.label || value || "Select"}
            </Text>
            <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          {open && (
            <View style={styles.options}>
              <ScrollView nestedScrollEnabled style={styles.optionsScroll}>
                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    style={[
                      styles.option,
                      opt.value === value && styles.optionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        opt.value === value && styles.optionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
  arrow: {
    fontSize: 12,
    color: "#666",
  },
  options: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    maxHeight: 150,
  },
  optionsScroll: {},
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionSelected: {
    backgroundColor: "#f0f0ff",
  },
  optionText: {
    fontSize: 15,
    color: "#333",
  },
  optionTextSelected: {
    fontWeight: "600",
    color: "#1a1a2e",
  },
  error: {
    fontSize: 12,
    color: "#c00",
    marginTop: 4,
  },
});
