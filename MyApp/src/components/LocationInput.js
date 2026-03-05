import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { actionSetGooglePlaceData } from "../redux/appSlice";
import * as Location from "expo-location";

export default function LocationInput({ label, placeholder }) {
  const dispatch = useDispatch();
  const googlePlaceData = useSelector((state) => state.appSlice.googlePlaceData);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (googlePlaceData?.formatted_address) {
      setAddress(googlePlaceData.formatted_address);
    }
  }, [googlePlaceData]);

  const handleUseLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const [rev] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const addr =
        rev?.street && rev?.city
          ? `${rev.street}, ${rev.city}`
          : rev?.city || "Current location";
      const data = {
        formatted_address: addr,
        geometry: {
          location: { lat: latitude, lng: longitude },
        },
      };
      dispatch(actionSetGooglePlaceData(data));
      setAddress(addr);
    } catch (e) {
      setError(e.message || "Could not get location");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <Ionicons name="location-outline" size={18} color="#999" style={styles.placeholderIcon} />
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder={placeholder || "Address or Postcode"}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={handleUseLocation}
          disabled={loading}
          style={styles.useLocationBtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#1a1a2e" />
          ) : (
            <Text style={styles.useLocationText}>Use my location</Text>
          )}
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  useLocationBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  useLocationText: {
    fontSize: 12,
    color: "#1a1a2e",
    fontWeight: "600",
  },
  error: {
    fontSize: 12,
    color: "#c00",
    marginTop: 4,
  },
});
