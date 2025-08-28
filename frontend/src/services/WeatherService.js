import apiClient from "../api/client";

// Egy változó, ami a memóriában tárolja az állapotot, amíg az app fut.
// Ez szimulálja az adatbázist a frontend oldalon.
let inMemoryCities = [];

// A jövőben az útvonal '/api/users/me/favorites' lesz.
export const getFavoriteCitiesWeather = async () => {
  console.log("WeatherService: Városok lekérése...");
  try {
    // Csak akkor hívjuk az API-t, ha a memóriában lévő lista még üres.
    // Így elkerüljük a felesleges hívásokat, amikor a képernyők között navigálunk.
    if (inMemoryCities.length === 0) {
      const response = await apiClient.get("/users");
      const transformedData = response.data.map((user) => ({
        id: user.id.toString(),
        cityName: user.name,
        temperature: Math.round(user.address.geo.lat),
        condition: user.company.catchPhrase.split(" ")[0],
        icon: user.id % 2 === 0 ? "sun" : "cloud",
      }));
      inMemoryCities = transformedData;
      console.log(
        "WeatherService: Adatok letöltve az API-ról és tárolva a memóriában."
      );
    } else {
      console.log("WeatherService: Adatok a memóriából szolgáltatva.");
    }
    return [...inMemoryCities]; // Mindig a tömb másolatát adjuk vissza!
  } catch (error) {
    console.error("Hiba történt a városok lekérésekor:", error);
    throw error;
  }
};

// Város hozzáadása (szimulált)
export const addCity = async (cityName) => {
  console.log(`WeatherService: "${cityName}" hozzáadása...`);
  // A jövőben itt egy POST kérés lesz: await apiClient.post('/api/users/me/favorites', { cityName });
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCity = {
        id: Math.random().toString(), // Ideiglenes, egyedi ID
        cityName: cityName,
        temperature: Math.floor(Math.random() * 30),
        condition: "Ismeretlen",
        icon: "cloud",
      };
      inMemoryCities.push(newCity);
      console.log("WeatherService: Város hozzáadva a memóriához.");
      resolve(newCity);
    }, 500); // 0.5s késleltetés
  });
};

// Város törlése (szimulált)
export const deleteCity = async (cityId) => {
  console.log(`WeatherService: Város törlése (ID: ${cityId})...`);
  // A jövőben itt egy DELETE kérés lesz: await apiClient.delete(`/api/users/me/favorites/${cityId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      inMemoryCities = inMemoryCities.filter((city) => city.id !== cityId);
      console.log("WeatherService: Város törölve a memóriából.");
      resolve({ success: true });
    }, 500);
  });
};

export const getGuestCitiesWeather = async () => {
  console.log("WeatherService: Vendég városok lekérése az API-ról...");
  try {
    // A JSONPlaceholder API-t használjuk, és a _limit=5 paraméterrel csak 5 elemet kérünk le.
    const response = await apiClient.get("/users?_limit=5");

    // Ugyanazt az adatátalakító logikát használjuk, mint korábban
    const transformedData = response.data.map((user) => ({
      id: user.id.toString(),
      cityName: user.address.city, // Most használjuk a valódi városnevet
      temperature: Math.round(user.address.geo.lat),
      condition: "Előrejelzés",
      icon: user.id % 2 === 0 ? "sun" : "cloud",
    }));

    console.log("WeatherService: Vendég adatok sikeresen megérkeztek.");
    return transformedData;
  } catch (error) {
    console.error("Hiba történt a vendég adatok lekérésekor:", error);
    throw error;
  }
};
