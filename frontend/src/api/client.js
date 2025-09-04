// src/api/client.js

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from "expo-constants"; // Expo Constants importálása

// --- Platform-specifikus tárhelykezelő ---
// Ez a rész biztosítja, hogy a token tárolása működjön weben (localStorage)
// és natív appban (SecureStore) is.
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
  // Erre itt nincs szükség, mert az interceptor csak olvas
};

// --- DINAMIKUS API ALAP URL ---
// Ez a függvény automatikusan meghatározza a backend szerver helyes címét.
const getBaseUrl = () => {
  // Lekérdezzük a host URI-t az Expo manifestből (pl. "192.168.1.10:8081")
  const debuggerHost = Constants.expoConfig?.hostUri;

  // Levágjuk a portot, hogy csak a tiszta IP címet kapjuk meg (pl. "192.168.1.10")
  const ipAddress = debuggerHost?.split(":")[0];

  // Ha webes platformon fut az app, a localhost a helyes cím
  if (Platform.OS === "web") {
    return "http://localhost/Weather-App/backend";
  }

  // Ha sikerült kinyerni az IP címet, azt használjuk a backend URL-hez
  // Ez működni fog bármilyen Wi-Fi hálózaton, ahol a gép és a telefon együtt van
  if (ipAddress) {
    return `http://${ipAddress}/Weather-App/backend`;
  }

  // Végső "mentsvár" a hivatalos Android Studió emulátorhoz,
  // ami a 10.0.2.2 címen éri el a host gépet
  if (Platform.OS === "android") {
    return "http://10.0.2.2/Weather-App/backend";
  }

  // Ha egyik módszer sem működött, hibát dobunk
  throw new Error("Could not determine API base URL.");
};

// --- AXIOS KLIENS LÉTREHOZÁSA ---
// A dinamikusan meghatározott BASE_URL-lel inicializáljuk az Axios klienst.
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// --- AXIOS INTERCEPTOR ---
// Ez a kódrészlet minden egyes API kérés elküldése ELŐTT lefut.
// A feladata, hogy a tárolt tokent hozzáadja a kérés fejlécéhez.
apiClient.interceptors.request.use(
  async (config) => {
    // A platform-független 'storage' objektumunkat használjuk a token lekérésére
    const token = await storage.getItem("userToken");
    if (token) {
      // Ha van token, beállítjuk az Authorization fejlécet
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Visszaadjuk a (potenciálisan módosított) kérés konfigurációt
    return config;
  },
  (error) => {
    // Ha hiba történik a kérés előkészítése közben, elutasítjuk a Promise-t
    return Promise.reject(error);
  }
);

// Nevesített export, hogy máshol importálni tudjuk
export { apiClient };
