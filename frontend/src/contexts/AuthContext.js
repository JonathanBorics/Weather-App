import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native"; // Beimportáljuk a Platform modult

// --- ÚJ RÉSZ: Platform-specifikus tárhelykezelő ---
const storage = {
  // Mobilon (iOS, Android) az Expo SecureStore-t használjuk
  getItem: async (key) => {
    if (Platform.OS !== "web") {
      return SecureStore.getItemAsync(key);
    }
    // Weben a böngésző localStorage-át használjuk
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error("LocalStorage not available", e);
      return null;
    }
  },
  setItem: async (key, value) => {
    if (Platform.OS !== "web") {
      return SecureStore.setItemAsync(key, value);
    }
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error("LocalStorage not available", e);
    }
  },
  deleteItem: async (key) => {
    if (Platform.OS !== "web") {
      return SecureStore.deleteItemAsync(key);
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("LocalStorage not available", e);
    }
  },
};
// --------------------------------------------------

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ez a logolás rendben van
  }, [userToken, userRole]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token, role;
      try {
        // A SecureStore helyett a mi 'storage' objektumunkat használjuk
        token = await storage.getItem("userToken");
        role = await storage.getItem("userRole");
      } catch (e) {
        console.error("Hiba a perzisztens adatok lekérésekor", e);
      }
      setUserToken(token);
      setUserRole(role);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  const signIn = useCallback(async (data) => {
    try {
      const { token, role } = data;
      setUserToken(token);
      setUserRole(role);
      // A SecureStore helyett a mi 'storage' objektumunkat használjuk
      await storage.setItem("userToken", token);
      await storage.setItem("userRole", role);
    } catch (error) {
      console.error("--- AUTH CONTEXT HIBA: Hiba a signIn során ---", error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setUserToken(null);
      setUserRole(null);
      // A SecureStore helyett a mi 'storage' objektumunkat használjuk
      await storage.deleteItem("userToken");
      await storage.deleteItem("userRole");
    } catch (error) {
      console.error("--- AUTH CONTEXT HIBA: Hiba a signOut során ---", error);
    }
  }, []);

  const value = { signIn, signOut, userToken, userRole };

  return (
    <AuthContext.Provider value={{ ...value, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
