// src/api/client.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// --- Platform-specifikus tárhelykezelő (ugyanaz, mint az AuthContext-ben) ---
const storage = {
  getItem: async (key) => {
    if (Platform.OS !== "web") {
      return SecureStore.getItemAsync(key);
    }
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error("LocalStorage not available", e);
      return null;
    }
  },
  // Nincs szükség a setItem/deleteItem-re itt
};

// --- Platform-specifikus API URL ---
let BASE_URL;
if (Platform.OS === "android") {
  BASE_URL = "http://10.0.2.2/Weather-App/backend";
} else if (Platform.OS === "ios") {
  // CSERÉLD LE EZT A SAJÁT HELYI IP CÍMEDRE!
  BASE_URL = "http://192.168.8.117/Weather-App/backend";
} else {
  // Web
  BASE_URL = "http://localhost/Weather-App/backend";
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- JAVÍTOTT INTERCEPTOR ---
// Ez az interceptor most már a mi platform-specifikus 'storage' objektumunkat használja.
apiClient.interceptors.request.use(
  async (config) => {
    // A SecureStore helyett a 'storage' objektum 'getItem' metódusát hívjuk.
    const token = await storage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { apiClient }; // Marad a nevesített export
