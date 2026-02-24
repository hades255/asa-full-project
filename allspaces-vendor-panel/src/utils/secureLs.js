import SecureLS from "secure-ls";

const ls = new SecureLS({ encodingType: "aes" }); // AES encryption

export const SECURE_LS_TOKENS = {
  ACCESS_TOKEN: "allspaces_access_token",
  REFRESH_TOKEN: "allspaces_refresh_token",
  USER_EMAIL: "allspaces_user_email",
  USER_PASSWORD: "allspaces_user_password",
  SIGNUP_PASSWORD: "allspaces_signup_password",
  PROFILE_STEP: "allspaces_profile_step",
};

export const saveInSecureLS = (key, value) => {
  ls.set(key, value);
};

export const getFromSecureLS = (key) => {
  return ls.get(key);
};

export const removeFromSecureLS = (key) => {
  ls.remove(key);
};

export const setAccessToken = (token) => {
  ls.set("access_token", token);
};

export const getAccessToken = () => {
  return ls.get("access_token");
};

export const removeAccessToken = () => {
  ls.remove("access_token");
};

export const setRefreshToken = (token) => {
  ls.set("refresh_token", token);
};

export const getRefreshToken = () => {
  return ls.get("refresh_token");
};

export const removeRefreshToken = () => {
  ls.remove("refresh_token");
};
