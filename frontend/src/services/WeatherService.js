// src/services/WeatherService.js
import { apiClient } from "../api/client";

/**
 * Lekéri a bejelentkezett felhasználó kedvenc városainak aktuális időjárását.
 */
export const getFavoriteCitiesWeather = async () => {
  console.log("WeatherService: Kedvenc városok lekérése...");
  try {
    // A apiClient automatikusan hozzáadja a Bearer tokent a header-höz!
    // A végpontnak tartalmaznia kell az '/api' előtagot.
    const response = await apiClient.get("/api/cities/favorites");
    return response.data; // A backend pont a megfelelő formátumot adja vissza.
  } catch (error) {
    console.error("Hiba történt a kedvenc városok lekérésekor:", error);
    // Dobjuk tovább a hibát, hogy a hívó komponens kezelni tudja.
    throw error;
  }
};

/**
 * Hozzáad egy új várost a bejelentkezett felhasználó kedvenceihez.
 * @param {string} cityName A hozzáadni kívánt város neve.
 */
export const addCity = async (cityName) => {
  console.log(`WeatherService: "${cityName}" hozzáadása a szerveren...`);
  try {
    const response = await apiClient.post("/api/cities/favorites", {
      cityName: cityName, // A backend ezt a formátumot várja.
    });
    return response.data; // Visszaadjuk a backend válaszát (pl. { id, cityName, message })
  } catch (error) {
    console.error(`Hiba történt "${cityName}" hozzáadásakor:`, error);
    throw error;
  }
};

/**
 * Töröl egy várost a bejelentkezett felhasználó kedvencei közül.
 * @param {string|number} cityId A törlendő város ID-ja.
 */
export const deleteCity = async (cityId) => {
  console.log(`WeatherService: Város törlése a szerverről (ID: ${cityId})...`);
  try {
    const response = await apiClient.delete(`/api/cities/favorites/${cityId}`);
    return response.data; // Visszaadjuk a sikeres üzenetet.
  } catch (error) {
    console.error(`Hiba történt a(z) ${cityId} ID-jű város törlésekor:`, error);
    throw error;
  }
};

/**
 * Lekéri az 5 vendég város időjárási adatát.
 */
export const getGuestCitiesWeather = async () => {
  console.log("WeatherService: Vendég városok lekérése az API-ról...");
  try {
    const response = await apiClient.get("/api/guest/weather");
    return response.data;
  } catch (error) {
    console.error("Hiba történt a vendég adatok lekérésekor:", error);
    throw error;
  }
};

/**
 * Lekéri egy adott város archív időjárási adatait.
 * @param {object} filters A szűrőket tartalmazó objektum, pl. { cityId: 1 }
 */
export const getWeatherArchive = async (filters) => {
  console.log("WeatherService: Archív adatok lekérése a szerverről:", filters);

  const cityId = filters?.cityId;
  if (!cityId) {
    console.warn(
      "WeatherService: Nincs cityId megadva az archívum lekéréséhez."
    );
    return []; // Üres listát adunk vissza, ha nincs ID.
  }

  try {
    const response = await apiClient.get(`/api/weather/archive/${cityId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Hiba az archív adatok lekérésekor (City ID: ${cityId}):`,
      error
    );
    throw error;
  }
};
