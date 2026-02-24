import * as SecureStore from "expo-secure-store";

type T_SECURE_STORE = {
  FIRST_LAUNCH: string;
  USER_EMAIL: string;
  USER_PASSWORD: string;
  SESSION_ID: string;
  BIOMETRIC_ENABLED: string;
  BIOMETRIC_ASKED: string;
  SYNCED_EVENTS: string;
};

const SecureStoreTokens: T_SECURE_STORE = {
  FIRST_LAUNCH: "all_spaces_first_launch",
  USER_EMAIL: "all_spaces_user_email",
  USER_PASSWORD: "all_spaces_user_password",
  SESSION_ID: "all_spaces_user_session_id",
  BIOMETRIC_ENABLED: "all_spaces_biometric_enabled",
  BIOMETRIC_ASKED: "all_spaces_biometric_ask",
  SYNCED_EVENTS: "all_spaces_synced_events",
};

const saveValue = async (key: keyof T_SECURE_STORE, value: string) => {
  await SecureStore.setItemAsync(SecureStoreTokens[key], value);
};

const getValue = async (key: keyof T_SECURE_STORE) => {
  return await SecureStore.getItemAsync(SecureStoreTokens[key]);
};

const deleteValue = async (key: keyof T_SECURE_STORE) => {
  await SecureStore.deleteItemAsync(SecureStoreTokens[key]);
};

const clearStore = async () => {
  await deleteValue("BIOMETRIC_ASKED");
  await deleteValue("BIOMETRIC_ENABLED");
};

export const SecureStoreService = {
  saveValue,
  getValue,
  deleteValue,
  clearStore,
};
