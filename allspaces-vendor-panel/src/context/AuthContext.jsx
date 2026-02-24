import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFromSecureLS,
  removeFromSecureLS,
  saveInSecureLS,
  SECURE_LS_TOKENS,
} from "../utils/secureLs";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = getFromSecureLS(SECURE_LS_TOKENS.ACCESS_TOKEN);
    if (token) {
      setUser({ ...user, token });
    }
    setLoading(false);
  }, []);

  const login = (userObject) => {
    saveInSecureLS(SECURE_LS_TOKENS.ACCESS_TOKEN, userObject.accessToken);
    saveInSecureLS(SECURE_LS_TOKENS.REFRESH_TOKEN, userObject.refreshToken);
    setUser({ ...userObject });
  };

  const logout = () => {
    removeFromSecureLS(SECURE_LS_TOKENS.ACCESS_TOKEN);
    removeFromSecureLS(SECURE_LS_TOKENS.REFRESH_TOKEN);
    setUser(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, setProfile, profile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
