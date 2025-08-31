// src/contexts/CityContext.js

import React, { createContext, useState, useContext, useCallback } from "react";
import {
  getFavoriteCitiesWeather,
  addCity,
  deleteCity,
} from "../services/WeatherService";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext"; // Beimportáljuk az AuthContext-et is!

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Nincs szükség az 'initialLoadDone'-ra, a token változása fogja vezérelni a betöltést.
  // const [initialLoadDone, setInitialLoadDone] = useState(false);

  // A JAVÍTÁS LÉNYEGE: Létrehozunk egy 'refreshCities' funkciót, amit több helyről is meg tudunk hívni.
  const refreshCities = useCallback(async () => {
    console.log("--- CITY CONTEXT: Városok frissítése a szerverről... ---");
    setIsLoading(true);
    try {
      const data = await getFavoriteCitiesWeather();
      setCities(data);
    } catch (error) {
      console.error("Hiba a városok frissítésekor a kontextusban:", error);
      // Itt nem dobunk Alert-et, mert ez a háttérben futhat. A képernyő majd kezeli.
    } finally {
      setIsLoading(false);
    }
  }, []);

  // JAVÍTÁS: Létrehozunk egy funkciót, ami törli a városokat (pl. kijelentkezéskor)
  const clearCities = useCallback(() => {
    console.log("--- CITY CONTEXT: Városok törlése az állapotból. ---");
    setCities([]);
  }, []);

  const handleAddCity = useCallback(
    async (cityName) => {
      try {
        // Itt nem kell setIsLoading(true), mert a lista frissítése a lényeg,
        // a felhasználó látja, hogy valami történik.
        await addCity(cityName);
        // JAVÍTÁS: Hozzáadás után nem egy hiányos objektumot teszünk be,
        // hanem újra lekérjük a teljes, friss listát a szerverről.
        // Ez biztosítja, hogy az új város is teljes időjárási adatokkal jelenjen meg.
        await refreshCities();
        return true;
      } catch (error) {
        // Az AuthService már dob egy Error objektumot a backend üzenetével
        Alert.alert(
          "Hiba",
          error.message || "Nem sikerült hozzáadni a várost."
        );
        return false;
      }
    },
    [refreshCities]
  ); // Függőség hozzáadása

  const handleDeleteCity = useCallback(
    async (cityId) => {
      try {
        // Optimistic UI: Először kitöröljük a listából, hogy a UI gyorsan reagáljon.
        setCities((prevCities) =>
          prevCities.filter((city) => city.id !== cityId)
        );
        // Majd elküldjük a kérést a szervernek.
        await deleteCity(cityId);
        // Ha hiba történne, a `catch` blokkban visszatölthetnénk a listát,
        // de a legtöbb esetben a törlés sikeres lesz.
      } catch (error) {
        Alert.alert("Hiba", "Nem sikerült törölni a várost.");
        // Hiba esetén töltsük újra a listát, hogy a törölt elem "visszaugorjon".
        await refreshCities();
      }
    },
    [refreshCities]
  ); // Függőség hozzáadása

  const value = {
    cities,
    isLoading,
    refreshCities, // A 'loadCities' helyett ezt exportáljuk
    handleAddCity,
    handleDeleteCity,
    clearCities, // Ezt is exportáljuk
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCities = () => {
  return useContext(CityContext);
};
