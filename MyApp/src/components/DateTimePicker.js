import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import { Controller } from "react-hook-form";

export default function DateTimePicker({
  control,
  name,
  label,
  placeholder = "DD/MM/YYYY HH:MM",
}) {
  const [open, setOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}
          <DatePicker
            modal
            open={open}
            date={value ? new Date(value) : new Date()}
            mode="datetime"
            onConfirm={(d) => {
              setOpen(false);
              onChange(d);
            }}
            onCancel={() => setOpen(false)}
          />
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.input}
          >
            <Text style={[styles.inputText, !value && styles.placeholder]}>
              {value ? formatDate(value) : placeholder}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
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
  calendarIcon: {
    fontSize: 20,
  },
});
