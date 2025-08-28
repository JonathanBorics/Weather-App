import axios from "axios";
import * as SecureStore from "expo-secure-store";

// A JSONPlaceholder API alap URL-je.
// Amikor a saját backended elkészül, csak ezt az egy sort kell átírnod!
const BASE_URL = "https://jsonplaceholder.typicode.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ez egy "interceptor", ami minden egyes kérés elküldése előtt lefut.
// A feladata, hogy a SecureStore-ból kiolvassa a mentett JWT tokent,
// és ha van, azt hozzáadja a kérés "Authorization" fejlécéhez.
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
